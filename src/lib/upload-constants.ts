/**
 * The parts of the upload contract the browser is allowed to know.
 *
 * Split out because `upload.ts` is `server-only` and the form is a client
 * component. Everything here is a hint for the file picker: convenient, and
 * trivially bypassed. The enforcing copy lives in `upload.ts` and runs on the
 * server against the file's actual bytes.
 */

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
export const MAX_FILES = 3;
export const ACCEPT_ATTR = ".pdf,.jpg,.jpeg,.png,.webp,.heic,.heif";
