import "server-only";
import { z } from "zod";

/**
 * Enquiry handling.
 *
 * Health-adjacent contact data, so this follows the secure-data-access rules:
 * server-side validation only, no client trust, insert-only with no read path,
 * rate limited, honeypot, and nothing personal in logs.
 *
 * Storage sits behind a driver so the Supabase adapter can drop in without
 * touching the form or the action. Supabase is not authenticated yet
 * (QUESTIONS.md item 8), so the local driver is active.
 */

/**
 * Preferred date, as `YYYY-MM-DD` from a native date input.
 *
 * Bounded rather than merely well-formed. A date in the past is a mistake, and
 * one a year out is either a mistake or an attempt to wedge junk into a field
 * staff will read. Six months is generous for imaging.
 */
const preferredDate = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Use the date picker, or leave it blank.")
  .refine((v) => {
    const day = new Date(`${v}T00:00:00`);
    if (Number.isNaN(day.getTime())) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const limit = new Date(today);
    limit.setMonth(limit.getMonth() + 6);
    return day >= today && day <= limit;
  }, "Pick a date within the next six months.")
  .or(z.literal(""));

export const enquirySchema = z.object({
  name: z.string().trim().min(2, "Tell us your name.").max(120),
  phone: z
    .string()
    .trim()
    .min(6, "A contact number lets us call you back.")
    .max(40),
  email: z.email("Check the email address.").max(200).or(z.literal("")),
  service: z
    .enum(["ultrasound", "ct", "x-ray", "interventional", "not-sure"])
    .default("not-sure"),
  preferredDate: preferredDate.default(""),
  /**
   * A part of the day rather than a clock time. The clinic books by phone
   * against real availability, so a free-text "10:15am" would read as a
   * confirmed slot when it is only a wish. An enum cannot overpromise.
   */
  preferredTime: z
    .enum(["", "morning", "midday", "afternoon", "any"])
    .default(""),
  message: z.string().trim().max(2000).default(""),
  /** Honeypot. Real people never fill this; it is hidden and unlabelled. */
  website: z.string().max(0).optional().default(""),
  /** Milliseconds since the form mounted. Bots submit near-instantly. */
  startedAt: z.coerce.number().int().nonnegative().default(0),
});

export type EnquiryInput = z.infer<typeof enquirySchema>;

/** A genuine person does not complete this form in under three seconds. */
export const MIN_SUBMIT_MS = 3000;

export interface StoredEnquiry {
  name: string;
  phone: string;
  email: string | null;
  service: string;
  preferredDate: string | null;
  preferredTime: string | null;
  message: string | null;
  /** Storage keys of any attached referrals. Opaque, never client-supplied. */
  attachments: { key: string; label: string; mime: string; bytes: number }[];
  receivedAt: string;
}

interface EnquiryDriver {
  readonly name: string;
  save(e: StoredEnquiry): Promise<void>;
  /**
   * Stores an attachment under an already-validated key.
   *
   * Separate from `save` so a rejected or oversized file never reaches storage,
   * and so the enquiry row is written last: an orphaned file is recoverable, an
   * enquiry pointing at a file that failed to upload is not.
   */
  saveFile(key: string, bytes: Uint8Array, mime: string): Promise<void>;
}

/**
 * Local driver. Writes outside the repo so no personal data is ever committed,
 * and so this mirrors how the Supabase driver behaves: write only, never read
 * back into the app.
 */
const localDriver: EnquiryDriver = {
  name: "local",
  async save(e) {
    const { appendFile, mkdir } = await import("node:fs/promises");
    const { join } = await import("node:path");
    await mkdir(localDir(), { recursive: true });
    await appendFile(join(localDir(), "enquiries.jsonl"), JSON.stringify(e) + "\n", "utf8");
  },
  async saveFile(key, bytes) {
    const { writeFile, mkdir } = await import("node:fs/promises");
    const { join } = await import("node:path");
    const dir = join(localDir(), "referrals");
    await mkdir(dir, { recursive: true });
    // `wx` fails if the key already exists. A UUID collision is not a real
    // risk, but silently overwriting someone else's referral is not a failure
    // mode worth leaving open. This is the local equivalent of upsert: false.
    await writeFile(join(dir, key), bytes, { flag: "wx" });
  },
};

function localDir(): string {
  const { LOCALAPPDATA, ENQUIRY_DIR } = process.env;
  return ENQUIRY_DIR ?? `${LOCALAPPDATA ?? "/tmp"}/recover-radiology-web`;
}

/**
 * Supabase driver. Inserts with the service role because RLS denies anonymous
 * writes by default; validation has already happened above, and there is no
 * read path, so the key never reaches a client bundle.
 */
const supabaseDriver: EnquiryDriver = {
  name: "supabase",
  async save(e) {
    const { url, key } = supabaseConfig();
    const res = await fetch(`${url}/rest/v1/enquiries`, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(e),
    });
    if (!res.ok) {
      // Status only. The body can echo submitted values.
      throw new Error(`Enquiry insert failed with ${res.status}`);
    }
  },
  async saveFile(objectKey, bytes, mime) {
    const { url, key } = supabaseConfig();
    // The bucket must be private. Staff reach these through a signed URL from
    // the practice's own tooling, never from this site, which has no read path.
    const res = await fetch(
      `${url}/storage/v1/object/referrals/${encodeURIComponent(objectKey)}`,
      {
        method: "POST",
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
          // The sniffed type, not the browser's claim.
          "Content-Type": mime,
          // Never replace an existing object.
          "x-upsert": "false",
        },
        body: bytes as unknown as BodyInit,
      },
    );
    if (!res.ok) throw new Error(`Referral upload failed with ${res.status}`);
  },
};

function supabaseConfig(): { url: string; key: string } {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase driver selected but not configured");
  return { url, key };
}

export function enquiryDriver(): EnquiryDriver {
  return process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
    ? supabaseDriver
    : localDriver;
}

/**
 * Fixed-window rate limit, per IP, in memory.
 *
 * Adequate for a single-region deployment of a clinic site. It resets on cold
 * start and does not span instances, which is an accepted limit for this scale
 * rather than an oversight.
 */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, { count: number; resetAt: number }>();

export function rateLimited(ip: string): boolean {
  const now = Date.now();
  const rec = hits.get(ip);
  if (!rec || now > rec.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  rec.count += 1;
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (now > v.resetAt) hits.delete(k);
  }
  return rec.count > MAX_PER_WINDOW;
}
