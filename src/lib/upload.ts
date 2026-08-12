import "server-only";
import { randomUUID } from "node:crypto";

/**
 * Referral upload handling.
 *
 * This is the highest risk surface on the site by a distance. Two reasons:
 *
 * 1. A referral is HEALTH INFORMATION. Until now the form collected a name and
 *    a phone number and told people not to send anything clinical. Accepting
 *    referrals inverts that, so the storage, the retention and the privacy
 *    notice all have to change with it.
 *
 * 2. Accepting a file from an anonymous visitor is the classic path to storing
 *    something executable, or to letting a filename escape its directory.
 *
 * So: an allowlist checked against the file's actual bytes, a hard size cap, a
 * random path, and a filename that is rebuilt rather than sanitised.
 */

/** 10MB. A phone photo of a referral is 2-5MB; a scanned PDF is under 1MB. */
export { MAX_UPLOAD_BYTES, MAX_FILES, ACCEPT_ATTR } from "./upload-constants";
import { MAX_UPLOAD_BYTES } from "./upload-constants";

/**
 * Magic bytes, because Content-Type is supplied by the client and means
 * nothing. Deliberately narrow: documents and photographs only. No SVG (it is
 * script), no HTML, no archives, no Office formats.
 */
const SIGNATURES: { ext: string; mime: string; test: (b: Uint8Array) => boolean }[] = [
  {
    ext: "pdf",
    mime: "application/pdf",
    test: (b) => b[0] === 0x25 && b[1] === 0x50 && b[2] === 0x44 && b[3] === 0x46,
  },
  {
    ext: "jpg",
    mime: "image/jpeg",
    test: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff,
  },
  {
    ext: "png",
    mime: "image/png",
    test: (b) =>
      b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47 &&
      b[4] === 0x0d && b[5] === 0x0a && b[6] === 0x1a && b[7] === 0x0a,
  },
  {
    ext: "webp",
    mime: "image/webp",
    test: (b) =>
      b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 &&
      b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50,
  },
  {
    // iPhones photograph referrals as HEIC by default, so refusing it would
    // reject the single most likely upload on the site.
    ext: "heic",
    mime: "image/heic",
    test: (b) =>
      b[4] === 0x66 && b[5] === 0x74 && b[6] === 0x79 && b[7] === 0x70 &&
      [b[8], b[9], b[10], b[11]].map((c) => String.fromCharCode(c)).join("")
        .match(/^(heic|heix|hevc|mif1|heim)$/i) !== null,
  },
];

export interface StoredFile {
  /** Opaque storage key. Never derived from the submitted filename. */
  key: string;
  mime: string;
  bytes: number;
  /** Kept only so staff can recognise the file. Rebuilt, never echoed raw. */
  label: string;
}

export type UploadResult =
  | { ok: true; file: StoredFile }
  | { ok: false; reason: string };

/**
 * Rebuilds a display label rather than sanitising the submitted one.
 *
 * Sanitising is a denylist, and denylists on filenames lose: `..`, NUL bytes,
 * right-to-left overrides, Windows reserved names, unicode homoglyphs. Building
 * a new string from an allowlist of characters cannot lose.
 */
function safeLabel(name: string, ext: string): string {
  const base = name.replace(/\.[^.]*$/, "");
  const cleaned = [...base]
    .filter((c) => /[A-Za-z0-9 _-]/.test(c))
    .join("")
    .trim()
    .slice(0, 60);
  return `${cleaned || "referral"}.${ext}`;
}

export async function validateUpload(file: File): Promise<UploadResult> {
  if (file.size === 0) return { ok: false, reason: "That file is empty." };
  if (file.size > MAX_UPLOAD_BYTES) {
    return {
      ok: false,
      reason: `Files need to be under ${MAX_UPLOAD_BYTES / 1024 / 1024}MB. Try a photo instead of a scan, or send it by email.`,
    };
  }

  const head = new Uint8Array(await file.slice(0, 16).arrayBuffer());
  const match = SIGNATURES.find((s) => s.test(head));
  if (!match) {
    return {
      ok: false,
      reason:
        "That file type is not accepted. Please attach a PDF or a photo (JPG, PNG, HEIC).",
    };
  }

  return {
    ok: true,
    file: {
      // Random key, so nothing about the stored path is guessable or derived
      // from anything the visitor controls.
      key: `${randomUUID()}.${match.ext}`,
      mime: match.mime,
      bytes: file.size,
      label: safeLabel(file.name, match.ext),
    },
  };
}
