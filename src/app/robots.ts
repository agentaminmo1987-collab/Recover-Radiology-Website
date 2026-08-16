import type { MetadataRoute } from "next";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://recoverradiology.com.au";

/**
 * AI crawlers are named explicitly, and explicitly allowed.
 *
 * `User-agent: *` already permits them, so this changes no behaviour. It is
 * here because the default is ambiguous to a human reading the file, and the
 * decision is worth being deliberate about: a clinic whose patients increasingly
 * ask an assistant "where can I get a bulk billed ultrasound near me" wants to
 * be in the answer. Blocking these agents removes the practice from that
 * surface entirely.
 *
 * Named agents also make the opposite decision easy later. If the practice ever
 * wants out, it is one line per agent rather than a policy argument.
 *
 * Google-Extended is separate from Googlebot and controls Gemini grounding
 * only; blocking it does not affect ordinary Search ranking.
 */
const AI_AGENTS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "meta-externalagent",
  "Bytespider",
  "CCBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      // Same permissions as everyone else, stated by name.
      ...AI_AGENTS.map((userAgent) => ({
        userAgent,
        allow: "/",
      })),
    ],
    sitemap: `${SITE}/sitemap.xml`,
    host: SITE,
  };
}
