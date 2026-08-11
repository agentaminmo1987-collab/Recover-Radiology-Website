import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost, publishedPosts } from "@/lib/insights";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { BookingBar } from "@/components/booking-bar";
import { Section } from "@/components/ui";

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
    robots: post.placeholder ? { index: false, follow: false } : undefined,
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
        <Section className="pt-[--rr-space-xl]">
          <nav aria-label="Breadcrumb" className="mb-8">
            <Link
              href="/insights"
              className="inline-flex min-h-[44px] items-center gap-2 text-[0.95rem] text-fg-subtle hover:text-fg"
            >
              <span aria-hidden>&larr;</span> All insights
            </Link>
          </nav>

          {post.placeholder ? (
            <p className="mb-6 inline-flex rounded-[var(--radius-pill)] border border-[var(--border-strong)] px-4 py-1.5 text-[0.8rem] uppercase tracking-[0.13em] text-accent">
              Placeholder, not published
            </p>
          ) : null}

          <article>
            <h1 className="max-w-[20ch] text-balance text-[clamp(2.2rem,5.4vw,3.5rem)] font-semibold leading-[1.08] tracking-[-0.03em]">
              {post.title}
            </h1>
            <p className="tabular mt-6 text-[0.9rem] text-fg-subtle">
              {post.readingMinutes} min read
            </p>

            {/* Reading column capped at 68ch per the spacing rules. */}
            <div className="mt-12 max-w-[68ch] space-y-6">
              {post.body.map((para, i) => (
                <p key={i} className="text-pretty text-[1.12rem] leading-[1.7] text-fg-muted">
                  {para}
                </p>
              ))}
            </div>
          </article>
        </Section>
      </main>
      <SiteFooter />
      <BookingBar />
    </>
  );
}
