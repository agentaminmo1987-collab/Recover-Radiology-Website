import Link from "next/link";
import { clinic } from "@/lib/clinic";

/**
 * Booking is the spine of the site (§6), so the affordance is reachable from
 * anywhere. On mobile that is a fixed bottom bar; on desktop the header CTA
 * already persists, so this hides.
 *
 * Server component, no JS. Sits above the safe-area inset so it clears the
 * iOS home indicator.
 */
export function BookingBar() {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--nav-border)] bg-[var(--nav-bg)] backdrop-blur-md sm:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="flex items-stretch gap-2 p-3">
        <a
          href={clinic.phone.href}
          className="tabular flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-[var(--radius-md)] border border-[var(--btn-ghost-border)] font-medium text-fg"
        >
          {clinic.phone.display}
        </a>
        <Link
          href="/contact"
          className="flex min-h-[48px] flex-1 items-center justify-center rounded-[var(--radius-md)] bg-[var(--btn-primary-bg)] font-semibold text-[var(--btn-primary-text)]"
        >
          Book a scan
        </Link>
      </div>
    </div>
  );
}
