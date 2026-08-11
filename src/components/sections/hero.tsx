import { clinic, REPORT_TURNAROUND } from "@/lib/clinic";
import { ButtonLink } from "@/components/ui";

/**
 * Hero. The 3D reconstruction canvas mounts behind this in Phase D as a fixed
 * layer, so nothing here reserves space for it and there is no shift when it
 * arrives. The copy is fully server rendered and readable with no JS at all.
 *
 * Only one animated thing exists on this page, and it is the canvas. Nothing
 * in this component moves on its own.
 */
export function Hero() {
  return (
    <section className="relative flex min-h-[min(100svh,54rem)] items-center overflow-hidden">
      {/* Fallback field. Replaced by the canvas in Phase D, and this is also
          exactly what reduced-motion and low-power devices keep. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(120% 90% at 68% 22%, color-mix(in srgb, var(--accent) 16%, transparent) 0%, transparent 62%), " +
            "radial-gradient(90% 70% at 22% 78%, color-mix(in srgb, var(--accent-quiet) 12%, transparent) 0%, transparent 58%)",
        }}
      />

      <div className="mx-auto w-full max-w-[1180px] px-6 py-[var(--rr-space-2xl)] md:px-10">
        <p className="tabular text-[0.75rem] uppercase tracking-[0.2em] text-accent">
          {clinic.address.suburb} {clinic.address.state} &middot; Bulk billed
        </p>

        <h1 className="mt-6 max-w-[19ch] text-balance text-[clamp(2.6rem,7vw,5.25rem)] font-semibold leading-[1.02] tracking-[-0.03em]">
          Forming your road to recovery
        </h1>

        <p className="mt-7 max-w-[54ch] text-pretty text-[1.15rem] leading-[1.55] text-fg-muted md:text-[1.3rem]">
          Ultrasound, CT, X-ray and image guided procedures in{" "}
          {clinic.address.suburb}. Most services are bulk billed, and your
          report reaches your doctor within {REPORT_TURNAROUND}.
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
          <ButtonLink href="/contact" size="lg">
            Book a scan
          </ButtonLink>
          <ButtonLink href="/x-ray" size="lg" variant="ghost">
            Walk in for an X-ray today
          </ButtonLink>
        </div>

        <p className="tabular mt-6 text-[0.95rem] text-fg-subtle">
          Or call{" "}
          <a
            href={clinic.phone.href}
            className="font-medium text-accent hover:underline"
          >
            {clinic.phone.display}
          </a>
          , {clinic.hours.display.toLowerCase()}
        </p>
      </div>
    </section>
  );
}
