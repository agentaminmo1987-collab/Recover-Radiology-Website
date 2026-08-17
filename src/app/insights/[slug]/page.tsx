import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { clinic } from "@/lib/clinic";
import { getPost, publishedPosts } from "@/lib/insights";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { BookingBar } from "@/components/booking-bar";
import { Section, ButtonLink, CallButton } from "@/components/ui";

export function generateStaticParams() {
  return publishedPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/insights/${post.slug}` },
    robots:
      post.placeholder || post.signedOff === false
        ? { index: false, follow: true }
        : undefined,
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <>
      <SiteHeader />
      <main id="main" className="pb-[88px] sm:pb-0">
        <Section className="pt-[var(--rr-space-xl)]">
          <Breadcrumbs
            trail={[{ label: "Insights", href: "/insights" }, { label: post.title }]}
          />

          {post.placeholder ? (
            <p className="mb-6 inline-flex rounded-[var(--radius-pill)] border border-[var(--border-strong)] px-4 py-1.5 text-[0.8rem] tracking-[0.01em] text-accent">
              Placeholder, not published
            </p>
          ) : null}

          {post.audience === "referrers" ? (
            <p className="mb-8 max-w-[68ch] rounded-[var(--radius-md)] border-l-4 border-accent bg-surface-sunken p-5 text-pretty text-[0.97rem] leading-[1.6] text-fg">
              <span className="font-semibold">Written for referring doctors.</span>{" "}
              This page discusses clinical evidence and is not patient
              information. If you are a patient, your own doctor is the right
              person to talk this through with.
            </p>
          ) : null}

          <article>
            <h1 className="max-w-[20ch] text-balance text-[clamp(2.2rem,5.4vw,3.5rem)] font-semibold leading-[1.08] tracking-[-0.03em]">
              {post.title}
            </h1>
            <p className="tabular mt-6 text-[0.9rem] text-fg-subtle">
              {post.readingMinutes} min read
            </p>

            {/* Reading column capped at 68ch per the spacing rules.
                Blocks rather than bare paragraphs, so an article can carry
                sub-headings, lists and a callout. A four minute explainer with
                no structure is a wall of text nobody finishes, and headings are
                also what lets a search engine or an assistant lift the one
                section that answers a question. */}
            <div className="mt-12 max-w-[68ch]">
              {post.body.map((block, i) => {
                if ("h" in block) {
                  return (
                    <h2
                      key={i}
                      className="mt-12 text-[clamp(1.35rem,2.8vw,1.7rem)] font-semibold tracking-[-0.02em] first:mt-0"
                    >
                      {block.h}
                    </h2>
                  );
                }
                if ("ul" in block) {
                  return (
                    <ul key={i} className="mt-6 space-y-3">
                      {block.ul.map((item) => (
                        <li key={item} className="flex gap-4">
                          <span
                            aria-hidden
                            className="mt-[0.7em] h-[6px] w-[6px] shrink-0 rounded-full bg-accent"
                          />
                          <span className="text-pretty text-[1.08rem] leading-[1.65] text-fg-muted">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  );
                }
                if ("note" in block) {
                  return (
                    <p
                      key={i}
                      className="mt-8 rounded-[var(--radius-md)] border-l-4 border-accent bg-surface-sunken p-6 text-pretty text-[1.05rem] leading-[1.6] text-fg"
                    >
                      {block.note}
                    </p>
                  );
                }
                return (
                  <p
                    key={i}
                    className="mt-6 text-pretty text-[1.12rem] leading-[1.7] text-fg-muted"
                  >
                    {block.p}
                  </p>
                );
              })}
            </div>

            {/* Full citations, so a doctor can check the source rather than
                take a figure on trust. Studies are named with their design, and
                the correction to the first is listed because omitting it would
                be selective. */}
            {post.references?.length ? (
              <div className="mt-14 border-t border-[var(--card-border)] pt-8">
                <h2 className="text-[0.8rem] font-semibold tracking-[0.01em] text-fg-subtle">
                  References
                </h2>
                <ol className="mt-5 space-y-4">
                  {post.references.map((r, i) => (
                    <li key={r} className="flex gap-4">
                      <span
                        aria-hidden
                        className="tabular mt-[0.15em] w-5 shrink-0 text-[0.9rem] text-accent"
                      >
                        {i + 1}
                      </span>
                      <span className="text-pretty text-[0.92rem] leading-[1.6] text-fg-muted">
                        {r}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            ) : null}

            {/* Every article ends somewhere useful rather than stopping. */}
            <div className="mt-16 border-t border-[var(--card-border)] pt-10">
              <p className="text-pretty text-[1.05rem] leading-[1.6] text-fg-muted">
                Questions about your own scan are best answered by the people who
                will do it. Call {clinic.phone.display}, {clinic.hours.display.toLowerCase()}.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="/contact" size="lg" echo>
                  Book a scan
                </ButtonLink>
                <CallButton variant="ghost" />
              </div>
            </div>
          </article>
        </Section>
      </main>
      <SiteFooter />
      <BookingBar />
    </>
  );
}
