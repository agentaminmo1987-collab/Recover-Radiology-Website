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
  message: string | null;
  receivedAt: string;
}

interface EnquiryDriver {
  readonly name: string;
  save(e: StoredEnquiry): Promise<void>;
}

/**
 * Local driver. Writes to a file outside the repo so no personal data is ever
 * committed, and so this mirrors how the Supabase driver will behave: write
 * only, never read back into the app.
 */
const localDriver: EnquiryDriver = {
  name: "local",
  async save(e) {
    const { appendFile, mkdir } = await import("node:fs/promises");
    const { join } = await import("node:path");
    const dir =
      process.env.ENQUIRY_DIR ??
      join(process.env.LOCALAPPDATA ?? "/tmp", "recover-radiology-web");
    await mkdir(dir, { recursive: true });
    await appendFile(join(dir, "enquiries.jsonl"), JSON.stringify(e) + "\n", "utf8");
  },
};

/**
 * Supabase driver. Inserts with the service role because RLS denies anonymous
 * writes by default; validation has already happened above, and there is no
 * read path, so the key never reaches a client bundle.
 */
const supabaseDriver: EnquiryDriver = {
  name: "supabase",
  async save(e) {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) throw new Error("Supabase driver selected but not configured");
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
};

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
