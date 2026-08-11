import Link from "next/link";
import { clinic } from "@/lib/clinic";
import { ButtonLink } from "@/components/ui";

/**
 * Server component. No client JS: the mobile menu is a native <details>, so
 * navigation works with JavaScript disabled, which §4.4 requires.
 */

const nav = [
  { href: "/ultrasound", label: "Ultrasound" },
  { href: "/ct", label: "CT" },
  { href: "/x-ray", label: "X-ray" },
  { href: "/interventional", label: "Procedures" },
  { href: "/patient-information", label: "Patient info" },
  { href: "/billing", label: "Billing" },
  { href: "/referrers", label: "For referrers" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--nav-border)] bg-[var(--nav-bg)] backdrop-blur-md">
      <div className="mx-auto flex h-[72px] w-full max-w-[1180px] items-center gap-6 px-6 md:px-10">
        <Link
          href="/"
          className="brand-lockup flex h-[44px] w-[172px] shrink-0"
          aria-label={`${clinic.name}, home`}
        />

        <nav aria-label="Main" className="ml-auto hidden lg:block">
          <ul className="flex items-center gap-1">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-flex min-h-[44px] items-center rounded-[var(--radius-sm)] px-3 text-[0.94rem] text-fg-muted transition-colors duration-[var(--rr-dur-micro)] hover:text-fg"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-3 lg:ml-0">
          <a
            href={clinic.phone.href}
            className="tabular hidden min-h-[44px] items-center text-[0.95rem] font-medium text-fg transition-colors hover:text-accent sm:inline-flex"
          >
            {clinic.phone.display}
          </a>
          <ButtonLink href="/contact" className="hidden sm:inline-flex">
            Book
          </ButtonLink>

          {/* Mobile menu, no JS */}
          <details className="group relative lg:hidden">
            <summary
              className="flex h-[44px] w-[44px] list-none items-center justify-center rounded-[var(--radius-sm)] border border-[var(--btn-ghost-border)] [&::-webkit-details-marker]:hidden"
              aria-label="Open menu"
            >
              <span aria-hidden className="relative block h-[2px] w-5 bg-current before:absolute before:-top-1.5 before:block before:h-[2px] before:w-5 before:bg-current before:content-[''] after:absolute after:top-1.5 after:block after:h-[2px] after:w-5 after:bg-current after:content-['']" />
            </summary>
            <nav
              aria-label="Mobile"
              className="absolute right-0 top-[calc(100%+0.5rem)] w-[min(84vw,20rem)] rounded-[var(--radius-lg)] border border-[var(--card-border)] bg-[var(--card-bg)] p-2 shadow-2xl"
            >
              <ul>
                {nav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="flex min-h-[48px] items-center rounded-[var(--radius-sm)] px-4 text-[1rem] text-fg-muted hover:bg-surface-sunken hover:text-fg"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
                <li className="mt-2 border-t border-[var(--card-border)] pt-2">
                  <a
                    href={clinic.phone.href}
                    className="tabular flex min-h-[48px] items-center rounded-[var(--radius-sm)] px-4 font-medium text-accent"
                  >
                    {clinic.phone.display}
                  </a>
                </li>
              </ul>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
