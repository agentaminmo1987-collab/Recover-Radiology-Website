import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { clinic, modalities, type ModalitySlug } from "@/lib/clinic";
import { procedures } from "@/lib/procedures";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { BookingBar } from "@/components/booking-bar";
import { Section, SectionLabel, ButtonLink, Card, CallButton } from "@/components/ui";
import { HeroVideo } from "@/components/hero-video";

/**
 * One template for all four modalities (§6: consistent structure, consistent
 * component). Every service page answers the same six questions in the same
 * order, because a patient comparing two of them should not have to re-learn
 * the layout.
 *
 * Everything rendered here comes from lib/clinic.ts. There is no prose in this
 * file that makes a clinical claim.
 */

const PLATE: Record<ModalitySlug, string> = {
  ultrasound: "/img/sections/ultrasound-waves-16x9",
  ct: "/img/sections/ct-slices-16x9",
  "x-ray": "/img/sections/xray-transmission-16x9",
  interventional: "/img/sections/interventional-guide-16x9",
};

/**
 * Modalities with a hero video loop. Anything not listed keeps its still plate.
 * Same rules as the landing page: the poster carries first paint, and the video
 * never loads under reduced-motion, Data Saver or 2g.
 */
const HERO_VIDEO: Partial<Record<ModalitySlug, { src: string; poster: string }>> = {
  "x-ray": {
    src: "/video/ct-forming.mp4",
    poster: "/img/poster/ct-forming-1600.avif",
  },
  ct: {
    src: "/video/ct-scan.mp4",
    poster: "/img/poster/ct-scan-1600.avif",
  },
  ultrasound: {
    src: "/video/ultrasound.mp4",
    poster: "/img/poster/ultrasound-1600.avif",
  },
  interventional: {
    src: "/video/interventional.mp4",
    poster: "/img/poster/interventional-1600.avif",
  },
};

/** Abstract brand art, not a depiction of the premises. Safe under AHPRA. */
const PLATE_ALT: Record<ModalitySlug, string> = {
  ultrasound:
    "Abstract illustration of sound wavefronts interfering to form an image",
  ct: "Abstract illustration of parallel slice planes assembling into a volume",
  "x-ray": "Abstract illustration of a high contrast transmission plate",
  interventional:
    "Abstract illustration of a guide line converging on a target point",
};

/**
 * Looks up the procedure page for a `types[]` entry, matched on name.
 *
 * Matching on the visible name rather than storing a slug in clinic.ts keeps
 * the closed fact set free of routing concerns. If a procedure is renamed in
 * one file and not the other the link simply does not render, which is the
 * right failure: a missing link, never a link to the wrong procedure.
 */
function procedureFor(slug: ModalitySlug, typeName: string) {
  if (slug !== "interventional") return undefined;
  return procedures.find((p) => p.name === typeName);
}

export function getModality(slug: ModalitySlug) {
  const m = modalities.find((x) => x.slug === slug);
  if (!m) throw new Error(`Unknown modality: ${slug}`);
  return m;
}

export function serviceMetadata(slug: ModalitySlug): Metadata {
  const m = getModality(slug);
  const title = `${m.name} in ${clinic.address.suburb}`;
  return {
    title,
    description: m.summary,
    alternates: { canonical: `/${slug}` },
    openGraph: { title, description: m.summary, url: `/${slug}` },
  };
}

function BillingLine({ slug }: { slug: ModalitySlug }) {
  const m = getModality(slug);
  if (m.bulkBilled === "yes") return <>Bulk billed.</>;
  if (m.bulkBilled === "mostly") return <>Usually bulk billed.</>;
  return (
    <>
      Bulk billed, with exceptions. {m.bulkBilledNote}
    </>
  );
}

export function ServicePage({ slug }: { slug: ModalitySlug }) {
  const m = getModality(slug);
  const others = modalities.filter((x) => x.slug !== slug);

  /** MedicalProcedure / MedicalTest schema, §8. */
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": slug === "interventional" ? "MedicalProcedure" : "MedicalTest",
    name: m.name,
    description: m.summary,
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
      <SiteHeader />
      <main id="main" className="pb-[88px] sm:pb-0">
        {/* Hero. X-ray runs the same loop the landing page uses; the others keep
            their still plate. Same rules apply: the poster carries first paint
            and the video never loads under reduced-motion or Data Saver. */}
        <section className="relative overflow-hidden">
          {HERO_VIDEO[slug] ? (
            <>
              <HeroVideo
                src={HERO_VIDEO[slug]!.src}
                poster={HERO_VIDEO[slug]!.poster}
                className="-z-10"
              />
              <div
                aria-hidden
                className="absolute inset-0 z-0"
                style={{
                  background:
                    "linear-gradient(to right, color-mix(in srgb, var(--surface) 88%, transparent) 0%, color-mix(in srgb, var(--surface) 88%, transparent) 46%, color-mix(in srgb, var(--surface) 55%, transparent) 64%, transparent 84%)",
                }}
              />
            </>
          ) : null}
          <div className="relative z-10">
        <Section className="pt-[--rr-space-xl]">
          <nav aria-label="Breadcrumb" className="mb-8">
            <Link
              href="/"
              className="inline-flex min-h-[44px] items-center gap-2 text-[0.95rem] text-fg-subtle hover:text-fg"
            >
              <span aria-hidden>&larr;</span> All services
            </Link>
          </nav>

          <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-16">
            <div>
              <SectionLabel>{clinic.address.suburb}</SectionLabel>
              <h1 className="mt-4 text-balance text-[clamp(2.4rem,6vw,4rem)] font-semibold leading-[1.05] tracking-[-0.03em]">
                {m.name}
              </h1>
              <p className="mt-6 max-w-[52ch] text-pretty text-[1.15rem] leading-[1.5] text-fg-muted md:text-[1.25rem]">
                {m.summary}
              </p>

              <dl className="mt-10 grid gap-6 border-t border-[var(--card-border)] pt-8 sm:grid-cols-2">
                <div>
                  <dt className="text-[0.78rem] tracking-[0.01em] text-fg-subtle">
                    How long
                  </dt>
                  <dd className="tabular mt-2 text-[1.05rem] text-fg">
                    {m.duration}
                  </dd>
                </div>
                <div>
                  <dt className="text-[0.78rem] tracking-[0.01em] text-fg-subtle">
                    Cost
                  </dt>
                  <dd className="mt-2 text-[1.05rem] text-fg">
                    <BillingLine slug={slug} />
                  </dd>
                </div>
              </dl>

              {/* The primary CTA names the scan, so a visitor who arrived on
                  this page from a search never has to translate "book a scan"
                  into the thing they came for. The phone button stays secondary
                  and always carries the number. */}
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="/contact" size="lg" echo>
                  {m.bookLabel}
                </ButtonLink>
                <CallButton variant="ghost" />
              </div>
            </div>

            {HERO_VIDEO[slug] ? null : (
              <div className="relative aspect-[16/9] overflow-hidden rounded-[var(--radius-lg)] border border-[var(--card-border)]">
                <Image
                  src={`${PLATE[slug]}-1600.avif`}
                  alt={PLATE_ALT[slug]}
                  fill
                  sizes="(max-width: 1024px) 100vw, 46vw"
                  className="object-cover"
                  priority
                />
              </div>
            )}
          </div>
        </Section>
          </div>
        </section>

        {/* What we scan */}
        <Section tone="raised" className="border-y border-[var(--card-border)]">
          <SectionLabel>What we scan</SectionLabel>
          <h2 className="mt-4 text-[clamp(1.7rem,3.6vw,2.4rem)] font-semibold tracking-[-0.02em]">
            {m.name} covers
          </h2>
          {/* Interventional entries link to their own page. The other three
              modalities describe categories of scan, which need a sentence; a
              procedure is a thing that will be done to you, which needs a page.
              `procedureFor` returns undefined for everything else, so those
              lists render exactly as before. */}
          <ul className="mt-10 grid gap-px overflow-hidden rounded-[var(--radius-lg)] border border-[var(--card-border)] bg-[var(--card-border)] sm:grid-cols-2">
            {m.types.map((t) => {
              const proc = procedureFor(slug, t.name);
              const body = (
                <>
                  <h3 className="text-[1.1rem] font-semibold">
                    {t.name}
                    {proc ? (
                      <span
                        aria-hidden
                        className="ml-2 inline-block text-accent transition-transform group-hover:translate-x-1"
                      >
                        &rarr;
                      </span>
                    ) : null}
                  </h3>
                  {proc ? (
                    <p className="mt-2 text-pretty text-[0.97rem] leading-[1.55] text-fg-muted">
                      {proc.summary}
                    </p>
                  ) : t.detail ? (
                    <p className="mt-2 text-pretty text-[0.97rem] leading-[1.55] text-fg-muted">
                      {t.detail}
                    </p>
                  ) : null}
                </>
              );

              return (
                <li key={t.name} className="bg-[var(--card-bg)]">
                  {proc ? (
                    <Link
                      href={`/interventional/${proc.slug}`}
                      className="group block h-full p-6 transition-colors hover:bg-surface-sunken md:p-8"
                    >
                      {body}
                    </Link>
                  ) : (
                    <div className="p-6 md:p-8">{body}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </Section>

        {/* Preparation. The most used content on any radiology site. */}
        <Section id="preparation">
          <SectionLabel>Before you come in</SectionLabel>
          <h2 className="mt-4 text-[clamp(1.7rem,3.6vw,2.4rem)] font-semibold tracking-[-0.02em]">
            How to prepare
          </h2>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {m.preparation.map((p) => (
              <Card key={p.label}>
                <h3 className="text-[0.78rem] tracking-[0.01em] text-accent">
                  {p.label}
                </h3>
                <p className="mt-3 text-pretty text-[1.05rem] leading-[1.55] text-fg">
                  {p.instruction}
                </p>
              </Card>
            ))}
          </div>

          {m.mustKnow ? (
            <p
              className="mt-8 rounded-[var(--radius-md)] border-l-4 border-accent bg-surface-sunken p-6 text-pretty text-[1.05rem] leading-[1.55] text-fg"
              role="note"
            >
              {m.mustKnow}
            </p>
          ) : null}

          <p className="mt-8 text-[0.97rem] text-fg-subtle">
            Bring your referral and your Medicare card.{" "}
            <Link href="/patient-information" className="text-accent hover:underline">
              All patient information
            </Link>
          </p>
        </Section>

        {/* Other services */}
        <Section tone="sunken">
          <h2 className="text-[0.8rem] font-semibold tracking-[0.01em] text-fg-subtle">
            Other services
          </h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-3">
            {others.map((o) => (
              <li key={o.slug}>
                <Link
                  href={`/${o.slug}`}
                  className="group flex min-h-[64px] items-center justify-between gap-4 rounded-[var(--radius-md)] border border-[var(--card-border)] px-6 py-4 transition-colors hover:border-accent"
                >
                  <span className="font-semibold">{o.name}</span>
                  <span
                    aria-hidden
                    className="text-accent transition-transform group-hover:translate-x-1"
                  >
                    &rarr;
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      </main>
      <SiteFooter />
      <BookingBar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
