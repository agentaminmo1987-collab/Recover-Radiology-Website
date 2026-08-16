import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { clinic, modalities, REPORT_TURNAROUND, SAME_DAY, type ModalitySlug } from "@/lib/clinic";
import { procedures } from "@/lib/procedures";
import { ultrasoundTypes } from "@/lib/ultrasound-types";
import { Breadcrumbs } from "@/components/breadcrumbs";
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

/**
 * The same lookup for ultrasound, which now has a page per kind.
 *
 * Ultrasound is the practice's specialty and it was one page with four bullet
 * points, competing for a single ranking against clinics with a page per study.
 * Matched on the visible name for the same reason as procedures: a rename in
 * one file and not the other produces a missing link, never a wrong one.
 */
function ultrasoundTypeFor(slug: ModalitySlug, typeName: string) {
  if (slug !== "ultrasound") return undefined;
  return ultrasoundTypes.find((t) => t.name === typeName);
}

/**
 * Common questions, per modality.
 *
 * COMPOSED, NOT WRITTEN. Every answer is assembled from `clinic.ts`: the
 * duration, the billing rule, the preparation entries, the safety line. Nothing
 * here states a fact that is not already in the verified set, which is what
 * makes it safe to publish on a regulated health service and what stops these
 * drifting out of step with the rest of the page.
 *
 * They are SPECIFIC TO THE SERVICE. A generic "do I need a referral" block
 * repeated four times would be filler, and Google treats near-duplicate FAQ
 * blocks across a site as exactly that. The questions differ per modality
 * because the answers do: the X-ray question people actually ask is about
 * walking in, the CT one is about contrast, the interventional one is about
 * getting home afterwards.
 */
function serviceFaqs(slug: ModalitySlug): { q: string; a: string }[] {
  const m = getModality(slug);
  const faqs: { q: string; a: string }[] = [];

  const billingAnswer =
    m.bulkBilled === "yes"
      ? `Yes. ${m.name} is bulk billed at ${clinic.name}, so Medicare is billed directly and there is nothing for you to pay. You will need a valid referral and your Medicare card.`
      : m.bulkBilled === "mostly"
        ? `Usually. Most ${m.name} scans here are bulk billed, which means Medicare is billed directly and there is no gap fee. Eligibility depends on the type of scan and the details on your referral, and our clerical team will confirm before you book.`
        : `Mostly, with exceptions. ${m.bulkBilledNote} Our clerical team will tell you the fee when you book, before you commit to anything.`;

  faqs.push({ q: `Is ${m.name.toLowerCase()} bulk billed?`, a: billingAnswer });
  faqs.push({
    q: `How long does ${m.name.toLowerCase()} take?`,
    a: `${m.duration}. It is worth allowing a little longer than the examination itself for checking in at reception.`,
  });

  // Preparation, verbatim from the fact set. This is the most-read content on
  // any radiology site, and getting it wrong costs the patient a second trip.
  for (const p of m.preparation) {
    faqs.push({ q: `${p.label}: what do I need to do?`, a: p.instruction });
  }

  if (m.mustKnow) {
    faqs.push({
      q: `Is there anything I must tell you before my ${m.name.toLowerCase()}?`,
      a: m.mustKnow,
    });
  }

  if (slug === "ultrasound") {
    faqs.push({
      q: "When will my doctor get the report?",
      a: `Ultrasound reports reach your referring doctor within ${REPORT_TURNAROUND}. Results go to the doctor who referred you rather than to you directly, so the conversation about what they mean happens with someone who knows your history.`,
    });
  }

  if (slug === "x-ray") {
    faqs.push({
      q: "Can I walk in for an X-ray, or do I need an appointment?",
      a: `Both work. Booking ahead gives you the shortest wait, and we also accept walk-ins during business hours, usually same day. We are open ${clinic.hours.display.toLowerCase()}.`,
    });
  }

  // High intent: someone searching "<scan> today" or "same day radiology" is
  // ready to book now. Answered on every service page, and pointed at the phone
  // rather than the form, because the form is not monitored in real time.
  faqs.push({
    q: `Can I get a ${m.name.toLowerCase()} appointment today?`,
    a: `${SAME_DAY.long} Call ${clinic.phone.display} and ask, ${clinic.hours.display.toLowerCase()}.`,
  });

  faqs.push({
    q: "What should I bring?",
    a: "Your referral and your Medicare card. If you have a concession or DVA card, bring that too, because it can change what is covered.",
  });

  return faqs;
}

export function getModality(slug: ModalitySlug) {
  const m = modalities.find((x) => x.slug === slug);
  if (!m) throw new Error(`Unknown modality: ${slug}`);
  return m;
}

/**
 * Search phrasing, per modality.
 *
 * Titles previously read "CT in Morphett Vale". Nobody searches "CT". They
 * search "CT scan", and overwhelmingly they qualify it with "bulk billed" or
 * "bulk billing", which is the single highest-intent modifier in Australian
 * diagnostic imaging search.
 *
 * "Bulk billed" is only put in a TITLE where it is unconditionally true, which
 * is X-ray alone. Ultrasound has an obstetric exception and interventional has
 * its own, and a title has no room for the exception beside the claim. Putting
 * an unqualified billing claim in the title of those two would be misleading
 * advertising by a regulated health service, which is the thing the site's
 * compliance test exists to prevent. Those two carry the qualified statement in
 * the description instead, where there is room to state it properly.
 */
const SEARCH_TITLE: Record<ModalitySlug, string> = {
  ultrasound: "Ultrasound",
  ct: "CT scan",
  "x-ray": "Bulk billed X-ray",
  // Nobody searches "interventional radiology". They search for the procedure
  // they have been referred for, and cortisone is by far the most common of
  // them, so the title leads with the words a patient would actually type.
  interventional: "Cortisone injections",
};

/**
 * Billing, stated with its exception intact, for the meta description.
 *
 * Written per case rather than composed from bulkBilledNote. Splicing the note
 * in produced "Bulk billed, except obstetric scans are not bulk billed", which
 * is a double negative, and on interventional it pushed the description to 230
 * characters so Google cut it before the phone number.
 */
function billingPhrase(slug: ModalitySlug): string {
  switch (slug) {
    case "x-ray":
      return "Bulk billed X-ray";
    case "ct":
      return "Usually bulk billed CT";
    case "ultrasound":
      return "Bulk billed ultrasound, except obstetric";
    case "interventional":
      return "Image guided procedures, most bulk billed";
  }
}

export function serviceMetadata(slug: ModalitySlug): Metadata {
  const m = getModality(slug);
  const title = `${SEARCH_TITLE[slug]} in ${clinic.address.suburb}`;

  // Leads with billing, because that is what the query was qualified by, then
  // location, then the one practical detail that earns the click.
  //
  // The duration clause is DROPPED rather than truncated when it would push the
  // description past what Google shows. Interventional's duration is a sentence
  // and a half long, so composing blindly produced 174 characters and lost the
  // phone number, which is the only part that converts.
  const head = `${billingPhrase(slug)} in ${clinic.address.suburb}, ${clinic.serviceArea}.`;
  const tail = `Call ${clinic.phone.display}.`;
  const withDuration = `${head} ${m.duration}. ${tail}`;
  const description = withDuration.length <= 155 ? withDuration : `${head} ${tail}`;

  return {
    title,
    description,
    alternates: { canonical: `/${slug}` },
    openGraph: { title, description, url: `/${slug}` },
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
  const faqs = serviceFaqs(slug);

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
          <Breadcrumbs trail={[{ label: m.name }]} />

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
              // Interventional and ultrasound both have a page per entry now.
              // Anything without one still renders as plain text, so adding a
              // sub-page later is additive rather than a rewrite.
              const proc = procedureFor(slug, t.name);
              const us = ultrasoundTypeFor(slug, t.name);
              const detail = proc ?? us;
              const href = proc
                ? `/interventional/${proc.slug}`
                : us
                  ? `/ultrasound/${us.slug}`
                  : undefined;

              const body = (
                <>
                  <h3 className="text-[1.1rem] font-semibold">
                    {t.name}
                    {href ? (
                      <span
                        aria-hidden
                        className="ml-2 inline-block text-accent transition-transform group-hover:translate-x-1"
                      >
                        &rarr;
                      </span>
                    ) : null}
                  </h3>
                  {detail ? (
                    <p className="mt-2 text-pretty text-[0.97rem] leading-[1.55] text-fg-muted">
                      {detail.summary}
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
                  {href ? (
                    <Link
                      href={href}
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

        {/* Common questions. Native <details>, so it works with no JavaScript,
            is keyboard accessible and screen-reader announced for free, and the
            answers are in the DOM as real text for a crawler or a retriever
            regardless of whether the disclosure is open. */}
        <Section tone="raised" className="border-t border-[var(--card-border)]">
          <SectionLabel>Common questions</SectionLabel>
          <h2 className="mt-4 max-w-[22ch] text-[clamp(1.7rem,3.6vw,2.4rem)] font-semibold tracking-[-0.02em]">
            {m.name} questions we are asked
          </h2>

          <div className="mt-10 max-w-[74ch] divide-y divide-[var(--card-border)] border-y border-[var(--card-border)]">
            {faqs.map((f) => (
              <details key={f.q} className="group/faq">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 [&::-webkit-details-marker]:hidden">
                  <h3 className="text-pretty text-[1.05rem] font-semibold leading-[1.45] text-fg">
                    {f.q}
                  </h3>
                  <span
                    aria-hidden
                    className="mt-1 shrink-0 text-[0.8rem] text-accent transition-transform duration-[var(--rr-dur-base)] group-open/faq:rotate-180"
                  >
                    &#9660;
                  </span>
                </summary>
                <p className="max-w-[66ch] pb-6 text-pretty leading-[1.65] text-fg-muted">
                  {f.a}
                </p>
              </details>
            ))}
          </div>

          <p className="mt-8 text-[0.97rem] text-fg-subtle">
            Not answered here? Call{" "}
            <a
              href={clinic.phone.href}
              className="tabular font-medium text-accent hover:underline"
            >
              {clinic.phone.display}
            </a>{" "}
            and our clerical team will help.
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
      {/* FAQPage, so these can surface as People Also Ask and be retrieved as
          discrete question/answer pairs by an assistant. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        }}
      />
    </>
  );
}
