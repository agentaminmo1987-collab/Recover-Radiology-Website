import Link from "next/link";

/**
 * Breadcrumbs, visible and structured, on every page below the root.
 *
 * WHY THIS EARNS ITS PLACE. The site had no BreadcrumbList anywhere, which
 * cost two different things:
 *
 * - Google shows a breadcrumb trail instead of a raw URL in the result when it
 *   can find one, and it uses the trail to understand hierarchy. A page that
 *   only says "I am /interventional/nerve-root-block" is a leaf with no stated
 *   parent.
 * - An assistant retrieving one of these pages gets no context about where it
 *   sits. "Nerve Root Block" reads very differently when the retriever can see
 *   it is Recover Radiology > Interventional procedures > Nerve Root Block.
 *
 * Rendered as real links, not just JSON-LD. Markup that exists only for
 * crawlers is a liability: it drifts from the page and nobody notices, because
 * nobody sees it. This is the same trail a person can click.
 */

export interface Crumb {
  label: string;
  /** Omitted on the current page, which is not a link. */
  href?: string;
}

const SITE =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://recoverradiology.com.au";

export function Breadcrumbs({ trail }: { trail: Crumb[] }) {
  const items = [{ label: "Home", href: "/" }, ...trail];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      // The last item is the current page and carries no item URL, per
      // Google's breadcrumb guidance.
      ...(c.href ? { item: `${SITE}${c.href}` } : {}),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Breadcrumb" className="mb-8">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.9rem] text-fg-subtle">
          {items.map((c, i) => (
            <li key={c.label} className="flex items-center gap-2">
              {i > 0 ? (
                <span aria-hidden className="opacity-50">
                  /
                </span>
              ) : null}
              {c.href ? (
                <Link
                  href={c.href}
                  className="inline-flex min-h-[32px] items-center rounded-[var(--radius-sm)] transition-colors hover:text-accent"
                >
                  {c.label}
                </Link>
              ) : (
                <span aria-current="page" className="text-fg">
                  {c.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
