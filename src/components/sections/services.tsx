import Link from "next/link";
import { modalities } from "@/lib/clinic";
import { Section, SectionLabel, H2, Lead } from "@/components/ui";

/**
 * The four modalities.
 *
 * Fully server rendered, no client JavaScript. These previously carried
 * `data-slice` hooks so a background canvas could sync a per-modality treatment
 * to them; that canvas is gone and the hooks went with it.
 */
export function Services() {
  return (
    <Section id="services">
      <SectionLabel>What we do</SectionLabel>
      <H2 className="mt-4">Four ways to see inside</H2>
      <Lead>
        <span className="mt-4 block">
          Every scan here answers a specific clinical question your doctor has
          asked. Choose a service to see what it covers, how to prepare, and how
          long it takes.
        </span>
      </Lead>

      <ul className="mt-14 grid gap-px overflow-hidden rounded-[var(--radius-lg)] border border-[var(--card-border)] bg-[var(--card-border)] md:grid-cols-2">
        {modalities.map((m, i) => (
          <li key={m.slug} className="bg-[var(--card-bg)]">
            <Link
              href={`/${m.slug}`}
              className="group flex h-full flex-col p-8 transition-colors duration-[var(--rr-dur-base)] ease-[var(--rr-ease)] hover:bg-surface-sunken md:p-10"
            >
              <div className="flex items-baseline gap-4">
                <span className="tabular text-[0.8rem] text-fg-subtle">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-[1.5rem] font-semibold tracking-[-0.01em] md:text-[1.75rem]">
                  {m.name}
                </h3>
              </div>

              <p className="mt-4 max-w-[46ch] text-pretty leading-[1.55] text-fg-muted">
                {m.summary}
              </p>

              <dl className="mt-8 flex flex-wrap gap-x-8 gap-y-3 border-t border-[var(--card-border)] pt-6">
                <div>
                  <dt className="text-[0.78rem] tracking-[0.01em] text-fg-subtle">
                    Time
                  </dt>
                  <dd className="tabular mt-1 text-[0.95rem] text-fg">
                    {m.duration}
                  </dd>
                </div>
                <div>
                  <dt className="text-[0.78rem] tracking-[0.01em] text-fg-subtle">
                    Billing
                  </dt>
                  <dd className="mt-1 text-[0.95rem] text-fg">
                    {m.bulkBilled === "yes" && "Bulk billed"}
                    {m.bulkBilled === "mostly" && "Usually bulk billed"}
                    {m.bulkBilled === "exceptions" && "Bulk billed, with exceptions"}
                  </dd>
                </div>
              </dl>

              <span className="mt-6 inline-flex items-center gap-2 text-[0.95rem] font-semibold text-accent">
                {m.name} details
                <span
                  aria-hidden
                  className="transition-transform duration-[var(--rr-dur-base)] ease-[var(--rr-ease)] group-hover:translate-x-1"
                >
                  &rarr;
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}
