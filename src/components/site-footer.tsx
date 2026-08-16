import Link from "next/link";
import { clinic } from "@/lib/clinic";

/**
 * NAP (name, address, phone) is crawlable text on every page, not an image.
 * The entire commercial value of this site is local search for "radiology
 * Morphett Vale", so this block is load-bearing for SEO as well as for users.
 */

const columns = [
  {
    heading: "Services",
    links: [
      { href: "/ultrasound", label: "Ultrasound" },
      { href: "/ct", label: "CT" },
      { href: "/x-ray", label: "X-ray" },
      { href: "/interventional", label: "Interventional procedures" },
      { href: "/injury-and-pain", label: "Injury and pain" },
    ],
  },
  {
    heading: "Patients",
    links: [
      { href: "/patient-information", label: "Preparing for your scan" },
      { href: "/billing", label: "Billing and bulk billing" },
      { href: "/our-clinic", label: "Our clinic" },
      { href: "/our-team", label: "Our team" },
      { href: "/contact", label: "Contact and location" },
      { href: "/about", label: "About us" },
    ],
  },
  {
    heading: "Referrers",
    links: [
      { href: "/referrers", label: "For referrers" },
      { href: clinic.referrerPortal, label: "Image request portal", external: true },
      { href: "/insights", label: "Insights" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--card-border)] bg-surface-sunken">
      <div className="mx-auto w-full max-w-[1180px] px-6 py-[var(--rr-space-xl)] md:px-10">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <Link
              href="/"
              className="brand-lockup flex h-[52px] w-[108px]"
              aria-label={`${clinic.name}, home`}
            />
            <p className="mt-4 max-w-[30ch] text-[0.95rem] text-fg-muted">
              {clinic.tagline}
            </p>

            <address className="mt-6 not-italic">
              <p className="tabular text-[0.95rem] leading-relaxed text-fg">
                {clinic.address.line1}
                <br />
                {clinic.address.suburb} {clinic.address.state}{" "}
                {clinic.address.postcode}
              </p>
              <p className="mt-3">
                <a
                  href={clinic.phone.href}
                  className="tabular inline-flex min-h-[44px] items-center font-medium text-accent hover:underline"
                >
                  {clinic.phone.display}
                </a>
              </p>
              <p className="tabular text-[0.9rem] text-fg-subtle">
                Fax {clinic.fax.display}
              </p>
            </address>

            <p className="tabular mt-4 text-[0.95rem] text-fg-muted">
              {clinic.hours.display}
            </p>
          </div>

          {columns.map((col) => (
            <nav key={col.heading} aria-label={col.heading}>
              <h2 className="text-[0.8rem] font-semibold tracking-[0.01em] text-fg-subtle">
                {col.heading}
              </h2>
              <ul className="mt-4 space-y-1">
                {col.links.map((link) => (
                  <li key={link.href}>
                    {"external" in link && link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-[44px] items-center text-[0.95rem] text-fg-muted hover:text-fg"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="inline-flex min-h-[44px] items-center text-[0.95rem] text-fg-muted hover:text-fg"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-[var(--card-border)] pt-6 text-[0.85rem] text-fg-subtle md:flex-row md:items-center md:justify-between">
          <p>
            <Link href="/legal/privacy" className="hover:text-fg">
              Privacy
            </Link>
            <span aria-hidden className="px-2">&middot;</span>
            &copy; {new Date().getFullYear()} {clinic.name}. Serving{" "}
            {clinic.serviceArea}.
          </p>
          <p className="max-w-[62ch]">
            Information on this site is general and does not replace advice from
            your doctor. Always discuss your results with your referring
            practitioner.
          </p>
        </div>
      </div>
    </footer>
  );
}
