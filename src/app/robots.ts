import type { MetadataRoute } from "next";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://recoverradiology.com.au";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/insights"] }],
    sitemap: `${SITE}/sitemap.xml`,
    host: SITE,
  };
}
