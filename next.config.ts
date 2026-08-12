import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Build output directory, overridable by env.
   *
   * This project lives inside a OneDrive folder, and OneDrive syncs `.next`.
   * It periodically holds a handle on `.next/turbopack`, which makes the build
   * fail with EBUSY on the unlink it does before writing. Nothing in the repo
   * causes it and no Node process is involved, so there is nothing to fix in
   * code; this just gives a way past it without touching the user's sync
   * client. Defaults to `.next`, so normal builds are unaffected.
   *
   * The durable fix is to exclude `.next` from OneDrive sync.
   */
  distDir: process.env.NEXT_DIST_DIR ?? ".next",

  experimental: {
    serverActions: {
      /**
       * Referral uploads. The default is 1MB, which rejects almost every photo
       * taken on a phone, so the enquiry form would have failed for the single
       * most likely attachment on the site.
       *
       * Sized to MAX_UPLOAD_BYTES * MAX_FILES (10MB * 3) plus headroom for the
       * rest of the form and the multipart framing. The real cap is enforced
       * per file in src/lib/upload.ts; this only stops Next rejecting the
       * request before our own validation gets to run and return a message the
       * visitor can act on.
       */
      bodySizeLimit: "32mb",
    },
  },
};

export default nextConfig;
