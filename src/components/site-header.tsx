import Link from "next/link";
import { clinic } from "@/lib/clinic";
import { ButtonLink } from "@/components/ui";
import { MenuAutoClose } from "@/components/menu-auto-close";

/**
 * Server component. No client JS.
 *
 * GROUPED, NOT FLAT. The bar carried nine top-level links and was heading for
 * eleven. Past about seven, a nav stops being scannable and becomes a list you
 * have to read, which is the opposite of what a nav is for. Four groups of
 * three or four is one glance.
 *
 * The grouping is by WHO IS ASKING, not by how the site is filed:
 *   Services  - someone who knows which scan they need
 *   Patients  - someone who has an appointment and a practical question
 *   About     - someone deciding whether to come here at all
 *   Referrers - a GP, who wants none of the above
 *
 * Desktop menus open on hover AND on focus-within, so they are reachable by
 * keyboard without a line of JavaScript. Mobile uses nested <details>, which is
 * a native disclosure widget: keyboard accessible, screen-reader announced, and
 * working with JS disabled, which §4.4 requires.
 */

interface NavGroup {
  label: string;
  /** Landing page for the group, so the trigger is a destination too. */
  href: string;
  items: { href: string; label: string; hint?: string }[];
}

const groups: NavGroup[] = [
  {
    label: "Services",
    href: "/ultrasound",
    items: [
      { href: "/ultrasound", label: "Ultrasound", hint: "No radiation, live imaging" },
      { href: "/ct", label: "CT", hint: "Cross sections, rebuilt in detail" },
      { href: "/x-ray", label: "X-ray", hint: "Usually same day" },
      {
        href: "/interventional",
        label: "Interventional procedures",
        hint: "Image guided injections and blocks",
      },
      // Sits with the services because that is where someone looks for it,
      // even though it is a reason to come rather than a machine.
      {
        href: "/injury-and-pain",
        label: "Injury and pain",
        hint: "Work, sport and everyday injuries",
      },
    ],
  },
  {
    label: "Patients",
    href: "/patient-information",
    items: [
      {
        href: "/patient-information",
        label: "Preparing for your scan",
        hint: "What to do before you come in",
      },
      { href: "/billing", label: "Billing", hint: "What is bulk billed, and what is not" },
      { href: "/contact", label: "Contact and location", hint: "Find us, or send an enquiry" },
    ],
  },
  {
    label: "About",
    href: "/our-clinic",
    items: [
      { href: "/our-clinic", label: "Our clinic", hint: "Have a look before you arrive" },
      { href: "/our-team", label: "Our team", hint: "The people who will scan you" },
      { href: "/about", label: "About us", hint: "How the practice works" },
    ],
  },
];

/** Stays top level. A referring GP should never have to open a menu. */
const referrers = { href: "/referrers", label: "For referrers" };

/** Flattened, for the mobile sheet's fallback and for the skip-nav. */
const allLinks = [...groups.flatMap((g) => g.items), referrers];

const triggerClass =
  "inline-flex min-h-[44px] items-center gap-1.5 rounded-[var(--radius-sm)] px-3 " +
  "text-[0.94rem] text-fg-muted transition-colors duration-[var(--rr-dur-micro)] " +
  "hover:text-fg group-hover:text-fg group-focus-within:text-fg";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--nav-border)] bg-[var(--nav-bg)] backdrop-blur-md">
      <div className="mx-auto flex h-[76px] w-full max-w-[1180px] items-center gap-6 px-6 md:h-[84px] md:px-10">
        <Link
          href="/"
          // Box matches the trimmed artwork's 2.074 aspect, so `contain`
          // fills it exactly rather than letterboxing inside a wider box.
          className="brand-lockup flex h-[46px] w-[95px] shrink-0 md:h-[54px] md:w-[112px]"
          aria-label={`${clinic.name}, home`}
        />

        <nav aria-label="Main" className="ml-auto hidden lg:block">
          <ul className="flex items-center gap-1">
            {groups.map((g) => (
              // `relative` on the li anchors the panel; `group` lets hover and
              // focus anywhere inside keep it open, including on the links.
              <li key={g.label} className="group relative">
                <Link href={g.href} className={triggerClass}>
                  {g.label}
                  <span
                    aria-hidden
                    className="text-[0.7em] opacity-60 transition-transform duration-[var(--rr-dur-micro)] group-hover:translate-y-[1px] group-focus-within:translate-y-[1px]"
                  >
                    &#9660;
                  </span>
                </Link>

                {/* The panel is always in the DOM and always focusable order
                    correct; only its visibility changes. `invisible` rather than
                    `hidden` so the transition has something to animate, and so
                    focus can reach it. */}
                <div
                  className={
                    "invisible absolute left-0 top-[calc(100%+0.25rem)] w-[19rem] " +
                    "translate-y-1 rounded-[var(--radius-lg)] border border-[var(--card-border)] " +
                    "bg-[var(--card-bg)] p-2 opacity-0 shadow-2xl " +
                    "transition-[opacity,transform,visibility] duration-[var(--rr-dur-micro)] " +
                    "ease-[cubic-bezier(0.23,1,0.32,1)] " +
                    "group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 " +
                    "group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100"
                  }
                >
                  <ul>
                    {g.items.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className="block rounded-[var(--radius-sm)] px-4 py-3 transition-colors hover:bg-surface-sunken"
                        >
                          <span className="block text-[0.97rem] font-medium text-fg">
                            {item.label}
                          </span>
                          {item.hint ? (
                            <span className="mt-0.5 block text-[0.85rem] leading-[1.4] text-fg-subtle">
                              {item.hint}
                            </span>
                          ) : null}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}

            <li>
              <Link href={referrers.href} className={triggerClass}>
                {referrers.label}
              </Link>
            </li>
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-3 lg:ml-0">
          <a
            href={clinic.phone.href}
            className="tabular hidden min-h-[44px] items-center text-[0.95rem] font-medium text-fg transition-colors hover:text-accent sm:inline-flex"
          >
            {clinic.phone.display}
          </a>
          <ButtonLink href="/contact" echo className="hidden sm:inline-flex">
            Book
          </ButtonLink>

          {/* Mobile menu, no JS. Groups become nested disclosures so the sheet
              opens to four rows rather than eleven. */}
          <details id="mobile-menu" className="group relative lg:hidden">
            <summary
              className="flex h-[44px] w-[44px] list-none items-center justify-center rounded-[var(--radius-sm)] border border-[var(--btn-ghost-border)] [&::-webkit-details-marker]:hidden"
              aria-label="Open menu"
            >
              <span aria-hidden className="relative block h-[2px] w-5 bg-current before:absolute before:-top-1.5 before:block before:h-[2px] before:w-5 before:bg-current before:content-[''] after:absolute after:top-1.5 after:block after:h-[2px] after:w-5 after:bg-current after:content-['']" />
            </summary>
            <nav
              aria-label="Mobile"
              className="absolute right-0 top-[calc(100%+0.5rem)] max-h-[min(78vh,40rem)] w-[min(88vw,22rem)] overflow-y-auto rounded-[var(--radius-lg)] border border-[var(--card-border)] bg-[var(--card-bg)] p-2 shadow-2xl"
            >
              <ul>
                {groups.map((g) => (
                  <li key={g.label}>
                    <details className="group/sub">
                      <summary className="flex min-h-[48px] list-none items-center justify-between rounded-[var(--radius-sm)] px-4 text-[1rem] font-medium text-fg hover:bg-surface-sunken [&::-webkit-details-marker]:hidden">
                        {g.label}
                        <span
                          aria-hidden
                          className="text-[0.75em] text-accent transition-transform duration-[var(--rr-dur-micro)] group-open/sub:rotate-180"
                        >
                          &#9660;
                        </span>
                      </summary>
                      <ul className="mb-1 ml-2 border-l border-[var(--card-border)] pl-2">
                        {g.items.map((item) => (
                          <li key={item.href}>
                            <Link
                              href={item.href}
                              className="flex min-h-[48px] items-center rounded-[var(--radius-sm)] px-4 text-[0.97rem] text-fg-muted hover:bg-surface-sunken hover:text-fg"
                            >
                              {item.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </details>
                  </li>
                ))}

                <li>
                  <Link
                    href={referrers.href}
                    className="flex min-h-[48px] items-center rounded-[var(--radius-sm)] px-4 text-[1rem] font-medium text-fg hover:bg-surface-sunken"
                  >
                    {referrers.label}
                  </Link>
                </li>

                <li className="mt-2 border-t border-[var(--card-border)] pt-2">
                  <a
                    href={clinic.phone.href}
                    className="tabular flex min-h-[48px] items-center rounded-[var(--radius-sm)] px-4 font-medium text-accent"
                  >
                    Call {clinic.phone.display}
                  </a>
                </li>
              </ul>
            </nav>
          </details>
          {/* Closes the menu after five seconds of no interaction, plus on
              outside tap and Escape. The menu itself needs no JavaScript. */}
          <MenuAutoClose targetId="mobile-menu" />
        </div>
      </div>
    </header>
  );
}

export { allLinks as navLinks };
