import type { MetadataRoute } from "next";
import { modalities } from "@/lib/clinic";
import { publishedPosts } from "@/lib/insights";
import { indexableProcedures } from "@/lib/procedures";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://recoverradiology.com.au";

/**
 * Real sitemap on the primary domain. The existing site's sitemap 302s to an S3
 * bucket, which is worth nothing for indexing.
 *
 * /insights is excluded while it has no published content, and placeholder
 * posts never appear.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes = [
    { path: "/", priority: 1 },
    { path: "/injury-and-pain", priority: 0.95 },
    { path: "/patient-information", priority: 0.9 },
    { path: "/billing", priority: 0.9 },
    { path: "/contact", priority: 0.9 },
    { path: "/our-clinic", priority: 0.8 },
    { path: "/our-team", priority: 0.7 },
    { path: "/referrers", priority: 0.7 },
    { path: "/about", priority: 0.6 },
    { path: "/legal/privacy", priority: 0.3 },
  ];

  return [
    ...staticRoutes.map((r) => ({
      url: `${SITE}${r.path}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: r.priority,
    })),
    ...modalities.map((m) => ({
      url: `${SITE}/${m.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    // Only procedures a radiologist has signed off. The rest render and are
    // linked so they can be reviewed, but stay out of search until then.
    ...indexableProcedures().map((p) => ({
      url: `${SITE}/interventional/${p.slug}`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
    ...publishedPosts().map((p) => ({
      url: `${SITE}/insights/${p.slug}`,
      lastModified: p.publishedAt ? new Date(p.publishedAt) : now,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
  ];
}
