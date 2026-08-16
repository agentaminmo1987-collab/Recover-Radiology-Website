import type { Metadata } from "next";
import Link from "next/link";
import { posts, publishedPosts } from "@/lib/insights";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { BookingBar } from "@/components/booking-bar";
import { Section, SectionLabel } from "@/components/ui";

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Plain answers about medical imaging: who scans you, who reports it, how bulk billing works, and what to bring. From Recover Radiology, Morphett Vale.",
  alternates: { canonical: "/insights" },
  // Previously noindex because the section was empty. It has articles now, and
  // they are the cheapest remaining ranking gain on the site.
};

export default function InsightsPage() {
  const live = publishedPosts();

  return (
    <>
      <SiteHeader />
      <main id="main" className="pb-[88px] sm:pb-0">
        <Section className="pt-[--rr-space-xl]">
          <SectionLabel>Insights</SectionLabel>
          <h1 className="mt-4 max-w-[16ch] text-balance text-[clamp(2.4rem,6vw,4rem)] font-semibold leading-[1.05] tracking-[-0.03em]">
            Insights
          </h1>

          {live.length === 0 ? (
            <div className="mt-10 max-w-[62ch] rounded-[var(--radius-lg)] border border-dashed border-[var(--border-strong)] p-8">
              <p className="text-[0.78rem] tracking-[0.01em] text-accent">
                Not yet published
              </p>
              <p className="mt-4 text-pretty text-[1.08rem] leading-[1.6] text-fg">
                There are no articles yet. This section is built and ready, and
                stays unlinked from the main navigation until the practice has
                content to put here.
              </p>
              <p className="mt-4 text-pretty leading-[1.6] text-fg-muted">
                Articles must come from the practice. Nothing on a clinic&rsquo;s
                own site can be drafted from general knowledge, because it reads
                as that clinic&rsquo;s clinical advice.
              </p>
            </div>
          ) : (
            <ul className="mt-12 divide-y divide-[var(--card-border)] border-y border-[var(--card-border)]">
              {live.map((p) => (
                <li key={p.slug}>
                  <Link href={`/insights/${p.slug}`} className="group block py-8">
                    <h2 className="text-[1.4rem] font-semibold tracking-[-0.01em] group-hover:text-accent">
                      {p.title}
                    </h2>
                    <p className="mt-3 max-w-[62ch] text-pretty leading-[1.6] text-fg-muted">
                      {p.excerpt}
                    </p>
                    <p className="tabular mt-4 text-[0.88rem] text-fg-subtle">
                      {p.readingMinutes} min read
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {posts.some((p) => p.placeholder) ? (
            <p className="mt-10 text-[0.88rem] text-fg-subtle">
              {posts.filter((p) => p.placeholder).length} placeholder entry exists
              for template review and is not rendered here.
            </p>
          ) : null}
        </Section>
      </main>
      <SiteFooter />
      <BookingBar />
    </>
  );
}
