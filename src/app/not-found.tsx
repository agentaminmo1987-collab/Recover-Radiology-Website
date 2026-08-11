import Link from "next/link";
import { clinic } from "@/lib/clinic";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Section, ButtonLink } from "@/components/ui";

/**
 * 404. Someone who mistypes a URL is usually mid-task, so this offers the three
 * things they were most likely after rather than an apology.
 */
const routes: [string, string][] = [
  ["Preparing for your scan", "/patient-information"],
  ["What it will cost", "/billing"],
  ["Book or contact us", "/contact"],
];

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <Section className="pt-[--rr-space-xl]">
          <p className="text-[0.95rem] font-medium text-accent">404</p>
          <h1 className="mt-4 max-w-[18ch] text-balance text-[clamp(2.2rem,5.4vw,3.4rem)] font-semibold leading-[1.06] tracking-[-0.03em]">
            That page does not exist
          </h1>
          <p className="mt-6 max-w-[52ch] text-pretty text-[1.1rem] leading-[1.55] text-fg-muted">
            It may have moved, or the address may have a typo in it. These are
            the pages people usually want.
          </p>

          <ul className="mt-10 grid max-w-[46rem] gap-3 sm:grid-cols-3">
            {routes.map(([label, href]) => (
              <li key={href}>
                <Link
                  href={href}
                  className="group flex min-h-[64px] items-center justify-between gap-3 rounded-[var(--radius-md)] border border-[var(--card-border)] px-5 transition-colors hover:border-accent"
                >
                  <span className="font-medium">{label}</span>
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

          <p className="tabular mt-10 text-[0.97rem] text-fg-subtle">
            Or call{" "}
            <a
              href={clinic.phone.href}
              className="font-medium text-accent hover:underline"
            >
              {clinic.phone.display}
            </a>
            , {clinic.hours.display.toLowerCase()}
          </p>

          <div className="mt-8">
            <ButtonLink href="/">Back to the homepage</ButtonLink>
          </div>
        </Section>
      </main>
      <SiteFooter />
    </>
  );
}
