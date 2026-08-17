import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { clinic, modalities, MSK, SAME_DAY, REPORT_TURNAROUND } from "@/lib/clinic";
import { ultrasoundTypes, getUltrasoundType } from "@/lib/ultrasound-types";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { BookingBar } from "@/components/booking-bar";
import { Section, SectionLabel, Card, ButtonLink, CallButton } from "@/components/ui";

/**
 * One page per kind of ultrasound.
 *
 * Content rules are documented in lib/ultrasound-types.ts. The important one:
 * preparation, duration and billing are read from clinic.ts rather than
 * restated here, so a change to the fact set reaches these pages and cannot
 * drift out of step with the parent ultrasound page.
 */

export function generateStaticParams() {
  return ultrasoundTypes.map((t) => ({ type: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ type: string }>;
}): Promise<Metadata> {
  const { type } = await params;
  const t = getUltrasoundType(type);
  if (!t) return {};

  const title = `${t.name} ultrasound in ${clinic.address.suburb}`;
  // Obstetric is the one that is not bulk billed, and saying so in the search
  // result is fairer than letting someone click through expecting free.
  const billing = t.billingNote ? "Not bulk billed." : "Bulk billed.";
  const description = `${billing} ${t.summary} ${clinic.address.suburb}, ${clinic.serviceArea}. Call ${clinic.phone.display}.`;

  return {
    title,
    description: description.slice(0, 155),
    alternates: { canonical: `/ultrasound/${t.slug}` },
    openGraph: { title, description: t.summary, url: `/ultrasound/${t.slug}` },
  };
}

export default async function UltrasoundTypePage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;
  const t = getUltrasoundType(type);
  if (!t) notFound();

  const ultrasound = modalities.find((m) => m.slug === "ultrasound")!;
  const prep = ultrasound.preparation.find((p) => p.label === t.preparationLabel);
  const others = ultrasoundTypes.filter((x) => x.slug !== t.slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalTest",
    name: `${t.name} ultrasound`,
    alternateName: t.alsoCalled,
    description: t.summary,
    usesDevice: { "@type": "MedicalDevice", name: "Diagnostic ultrasound" },
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
        <Section className="pt-[var(--rr-space-xl)]">
          <Breadcrumbs
            trail={[
              { label: "Ultrasound", href: "/ultrasound" },
              { label: t.name },
            ]}
          />

          <SectionLabel>Ultrasound</SectionLabel>
          <h1 className="mt-4 max-w-[20ch] text-balance text-[clamp(2.2rem,5.4vw,3.6rem)] font-semibold leading-[1.05] tracking-[-0.03em]">
            {t.name} ultrasound
          </h1>
          {t.alsoCalled ? (
            <p className="mt-4 text-[1rem] text-fg-subtle">
              Also called {t.alsoCalled}
            </p>
          ) : null}
          <p className="mt-6 max-w-[56ch] text-pretty text-[1.15rem] leading-[1.5] text-fg-muted md:text-[1.25rem]">
            {t.summary}
          </p>

          <dl className="mt-10 grid gap-6 border-t border-[var(--card-border)] pt-8 sm:grid-cols-3">
            <div>
              <dt className="text-[0.78rem] tracking-[0.01em] text-fg-subtle">
                How long
              </dt>
              <dd className="tabular mt-2 text-[1.05rem] text-fg">
                {ultrasound.duration}
              </dd>
            </div>
            <div>
              <dt className="text-[0.78rem] tracking-[0.01em] text-fg-subtle">
                Radiation
              </dt>
              <dd className="mt-2 text-[1.05rem] text-fg">None</dd>
            </div>
            <div>
              <dt className="text-[0.78rem] tracking-[0.01em] text-fg-subtle">
                Cost
              </dt>
              <dd className="mt-2 text-[1.05rem] text-fg">
                {t.billingNote ? "Not bulk billed" : "Bulk billed"}
              </dd>
            </div>
          </dl>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/contact" size="lg" echo>
              Book an ultrasound
            </ButtonLink>
            <CallButton variant="ghost" />
          </div>
          <p className="mt-5 text-[0.95rem] text-fg-subtle">{SAME_DAY.short}</p>
        </Section>

        {/* Billing exception, stated before anything else if it applies. */}
        {t.billingNote ? (
          <Section className="pt-0">
            <p
              role="note"
              className="max-w-[70ch] rounded-[var(--radius-md)] border-l-4 border-accent bg-surface-sunken p-6 text-pretty text-[1.05rem] leading-[1.55] text-fg"
            >
              {t.billingNote}
            </p>
          </Section>
        ) : null}

        <Section tone="raised" className="border-y border-[var(--card-border)]">
          <div className="max-w-[68ch]">
            <h2 className="text-[clamp(1.4rem,3vw,1.9rem)] font-semibold tracking-[-0.02em]">
              What it is
            </h2>
            <p className="mt-6 text-pretty leading-[1.7] text-fg-muted">
              {t.whatItIs}
            </p>
          </div>

          {/* The specialisation, on the page where it counts most. */}
          {t.slug === "musculoskeletal" ? (
            <div className="mt-10 max-w-[70ch] rounded-[var(--radius-lg)] border border-[var(--card-border)] bg-[var(--card-bg)] p-6 md:p-8">
              <p className="text-pretty leading-[1.65] text-fg-muted">
                {MSK.short} Musculoskeletal ultrasound is operator dependent in a
                way most imaging is not, because the image is made live and
                finding a small tear depends on knowing what to move and where
                to look while moving it.
              </p>
              <p className="mt-5">
                <Link
                  href="/injury-and-pain"
                  className="font-semibold text-accent hover:underline"
                >
                  Injury and pain imaging &rarr;
                </Link>
              </p>
            </div>
          ) : null}

          <div className="mt-14">
            <h2 className="text-[clamp(1.4rem,3vw,1.9rem)] font-semibold tracking-[-0.02em]">
              What it is used for
            </h2>
            <ul className="mt-6 space-y-4">
              {t.usedFor.map((u) => (
                <li key={u} className="flex gap-4">
                  <span
                    aria-hidden
                    className="mt-[0.6em] h-[6px] w-[6px] shrink-0 rounded-full bg-accent"
                  />
                  <span className="max-w-[62ch] text-pretty leading-[1.65] text-fg-muted">
                    {u}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-8 max-w-[62ch] text-[0.97rem] leading-[1.6] text-fg-subtle">
              These are common reasons for referral, not a diagnosis. Your
              referring doctor decides which study answers their question.
            </p>
          </div>
        </Section>

        <Section>
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
            <div>
              <h2 className="text-[clamp(1.4rem,3vw,1.9rem)] font-semibold tracking-[-0.02em]">
                What to expect
              </h2>
              <ol className="mt-6 space-y-4">
                {t.whatToExpect.map((w, i) => (
                  <li key={w} className="flex gap-4">
                    <span
                      aria-hidden
                      className="tabular mt-[0.15em] w-6 shrink-0 text-[0.95rem] font-medium text-accent"
                    >
                      {i + 1}
                    </span>
                    <span className="max-w-[58ch] text-pretty leading-[1.65] text-fg-muted">
                      {w}
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Preparation, read from clinic.ts so it cannot drift from the
                parent page. This is the most-read content on any radiology
                site: getting it wrong costs the patient a second trip. */}
            <Card>
              <h2 className="text-[0.8rem] font-semibold tracking-[0.01em] text-fg-subtle">
                How to prepare
              </h2>
              {prep ? (
                <>
                  <h3 className="mt-5 text-[1.05rem] font-semibold text-accent">
                    {prep.label}
                  </h3>
                  <p className="mt-3 text-pretty leading-[1.6] text-fg">
                    {prep.instruction}
                  </p>
                </>
              ) : null}
              <p className="mt-6 border-t border-[var(--card-border)] pt-5 text-[0.95rem] leading-[1.6] text-fg-muted">
                Bring your referral and your Medicare card. If you are unsure
                which preparation applies to your scan, call us and we will
                check the referral for you.
              </p>
              <p className="mt-5">
                <Link
                  href="/patient-information"
                  className="font-semibold text-accent hover:underline"
                >
                  All patient information &rarr;
                </Link>
              </p>
            </Card>
          </div>

          <p className="mt-12 max-w-[62ch] text-pretty leading-[1.65] text-fg-muted">
            Your report reaches your referring doctor within {REPORT_TURNAROUND}.
            Results go to the doctor who referred you rather than to you
            directly, so the conversation about what they mean happens with
            someone who knows your history.
          </p>
        </Section>

        <Section tone="raised" className="border-t border-[var(--card-border)]">
          <h2 className="text-[0.8rem] font-semibold tracking-[0.01em] text-fg-subtle">
            Other ultrasound we perform
          </h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-3">
            {others.map((o) => (
              <li key={o.slug}>
                <Link href={`/ultrasound/${o.slug}`} className="group block h-full">
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
                    <p className="mt-2 text-pretty text-[0.9rem] leading-[1.5] text-fg-muted">
                      {o.summary}
                    </p>
                  </Card>
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      </main>
      <SiteFooter />
      <BookingBar />
    </>
  );
}
