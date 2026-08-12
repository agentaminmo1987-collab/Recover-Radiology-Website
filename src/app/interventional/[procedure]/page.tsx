import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { clinic, getModalityMustKnow } from "@/lib/clinic";
import { procedures, getProcedure } from "@/lib/procedures";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { BookingBar } from "@/components/booking-bar";
import { Section, SectionLabel, Card, ButtonLink, CallButton } from "@/components/ui";

/**
 * One page per interventional procedure.
 *
 * Content and its constraints are documented in lib/procedures.ts. The rule
 * that governs this file: a page whose `signedOff` is false still renders and is
 * still linked, so it can be reviewed in place, but is excluded from search.
 * Unreviewed clinical content should not be accumulating impressions.
 */

export function generateStaticParams() {
  return procedures.map((p) => ({ procedure: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ procedure: string }>;
}): Promise<Metadata> {
  const { procedure } = await params;
  const p = getProcedure(procedure);
  if (!p) return {};

  return {
    title: `${p.name} in ${clinic.address.suburb}`,
    description: p.summary,
    alternates: { canonical: `/interventional/${p.slug}` },
    // The gate. Flipping `signedOff` to true in lib/procedures.ts is the only
    // change needed to let this page into search.
    robots: p.signedOff ? undefined : { index: false, follow: true },
    openGraph: {
      title: `${p.name} | ${clinic.name}`,
      description: p.summary,
      url: `/interventional/${p.slug}`,
    },
  };
}

function List({
  heading,
  items,
  tone = "plain",
}: {
  heading: string;
  items: readonly string[];
  tone?: "plain" | "numbered";
}) {
  const Tag = tone === "numbered" ? "ol" : "ul";
  return (
    <div>
      <h2 className="text-[clamp(1.4rem,3vw,1.9rem)] font-semibold tracking-[-0.02em]">
        {heading}
      </h2>
      <Tag className="mt-6 space-y-4">
        {items.map((item, i) => (
          <li key={item} className="flex gap-4">
            <span
              aria-hidden
              className={
                tone === "numbered"
                  ? "tabular mt-[0.15em] w-6 shrink-0 text-[0.95rem] font-medium text-accent"
                  : "mt-[0.6em] h-[6px] w-[6px] shrink-0 rounded-full bg-accent"
              }
            >
              {tone === "numbered" ? i + 1 : null}
            </span>
            <span className="max-w-[62ch] text-pretty leading-[1.65] text-fg-muted">
              {item}
            </span>
          </li>
        ))}
      </Tag>
    </div>
  );
}

export default async function ProcedurePage({
  params,
}: {
  params: Promise<{ procedure: string }>;
}) {
  const { procedure } = await params;
  const p = getProcedure(procedure);
  if (!p) notFound();

  const others = procedures.filter((x) => x.slug !== p.slug);
  const bloodThinners = getModalityMustKnow("interventional");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    name: p.name,
    alternateName: p.alsoCalled,
    description: p.summary,
    howPerformed: p.howItIsPerformed.join(" "),
    followup: p.aftercare.join(" "),
    provider: {
      "@type": "MedicalBusiness",
      name: clinic.name,
      telephone: clinic.phone.display,
      address: {
        "@type": "PostalAddress",
        streetAddress: clinic.address.line1,
        addressLocality: clinic.address.suburb,
        addressRegion: clinic.address.state,
        postalCode: clinic.address.postcode,
        addressCountry: clinic.address.country,
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader />
      <main id="main" className="pb-[88px] sm:pb-0">
        <Section className="pt-[--rr-space-xl]">
          <nav aria-label="Breadcrumb" className="mb-8">
            <Link
              href="/interventional"
              className="inline-flex min-h-[44px] items-center gap-2 text-[0.95rem] text-fg-subtle hover:text-fg"
            >
              <span aria-hidden>&larr;</span> All procedures
            </Link>
          </nav>

          <SectionLabel>Interventional</SectionLabel>
          <h1 className="mt-4 max-w-[20ch] text-balance text-[clamp(2.2rem,5.4vw,3.6rem)] font-semibold leading-[1.05] tracking-[-0.03em]">
            {p.name}
          </h1>
          {p.alsoCalled ? (
            <p className="mt-4 text-[1rem] text-fg-subtle">
              Also called {p.alsoCalled.toLowerCase()}
            </p>
          ) : null}
          <p className="mt-6 max-w-[56ch] text-pretty text-[1.15rem] leading-[1.5] text-fg-muted md:text-[1.25rem]">
            {p.summary}
          </p>

          <dl className="mt-10 grid gap-6 border-t border-[var(--card-border)] pt-8 sm:grid-cols-2">
            <div>
              <dt className="text-[0.78rem] tracking-[0.01em] text-fg-subtle">
                How long
              </dt>
              <dd className="mt-2 text-[1.05rem] text-fg">{p.duration}</dd>
            </div>
            <div>
              <dt className="text-[0.78rem] tracking-[0.01em] text-fg-subtle">
                Cost
              </dt>
              <dd className="mt-2 text-[1.05rem] text-fg">
                Some interventional procedures are not bulk billed. Our clerical
                team will tell you the fee when you book.
              </dd>
            </div>
          </dl>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/contact" size="lg" echo>
              Book a procedure
            </ButtonLink>
            <CallButton variant="ghost" />
          </div>
        </Section>

        {/* The blood thinner warning, repeated on every procedure page rather
            than left on the parent. It is the single most consequential thing a
            patient can fail to mention, and someone who arrived here from a
            search may never see /interventional at all. */}
        {bloodThinners ? (
          <Section className="pt-0">
            <p
              role="note"
              className="rounded-[var(--radius-md)] border-l-4 border-accent bg-surface-sunken p-6 text-pretty text-[1.05rem] leading-[1.55] text-fg"
            >
              {bloodThinners}
            </p>
          </Section>
        ) : null}

        <Section tone="raised" className="border-y border-[var(--card-border)]">
          <div className="max-w-[68ch]">
            <h2 className="text-[clamp(1.4rem,3vw,1.9rem)] font-semibold tracking-[-0.02em]">
              What it is
            </h2>
            <p className="mt-6 text-pretty leading-[1.7] text-fg-muted">
              {p.whatItIs}
            </p>
          </div>

          <div className="mt-14">
            <List heading="What it is used for" items={p.whatItTreats} />
          </div>
        </Section>

        <Section>
          <List
            heading="How it is performed"
            items={p.howItIsPerformed}
            tone="numbered"
          />
        </Section>

        <Section tone="sunken" className="border-y border-[var(--card-border)]">
          <div className="grid gap-14 lg:grid-cols-2 lg:gap-16">
            <List heading="Benefits" items={p.benefits} />
            <List heading="Risks" items={p.risks} />
          </div>

          {/* Consent is taken by the radiologist on the day, and this page is
              not a substitute for that conversation. Saying so is not a
              disclaimer bolted on; it is the accurate description of how the
              decision actually gets made. */}
          <p className="mt-12 max-w-[62ch] text-pretty leading-[1.65] text-fg-subtle">
            This page describes the procedure in general terms. Which risks
            apply to you depends on your health, your medication and what is
            being treated. The radiologist will go through it with you before
            anything starts, and you can ask questions or change your mind at
            that point.
          </p>
        </Section>

        <Section>
          <List heading="Afterwards" items={p.aftercare} />
        </Section>

        <Section tone="raised" className="border-t border-[var(--card-border)]">
          <h2 className="text-[0.8rem] font-semibold tracking-[0.01em] text-fg-subtle">
            Other procedures
          </h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((o) => (
              <li key={o.slug}>
                <Link href={`/interventional/${o.slug}`} className="group block h-full">
                  <Card className="h-full transition-colors group-hover:border-accent">
                    <p className="text-[1.05rem] font-semibold">
                      {o.name}
                      <span
                        aria-hidden
                        className="ml-2 inline-block text-accent transition-transform group-hover:translate-x-1"
                      >
                        &rarr;
                      </span>
                    </p>
                  </Card>
                </Link>
              </li>
            ))}
          </ul>

          <p className="mt-10 text-[0.97rem] text-fg-subtle">
            Bring your referral and your Medicare card.{" "}
            <Link href="/patient-information" className="text-accent hover:underline">
              All patient information
            </Link>
          </p>
        </Section>
      </main>
      <SiteFooter />
      <BookingBar />
    </>
  );
}
