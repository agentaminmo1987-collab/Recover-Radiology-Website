import { clinic, REPORT_TURNAROUND } from "@/lib/clinic";
import { ButtonLink } from "@/components/ui";
import { ScrollLogo } from "@/components/scroll-logo";
import { HeroVideo } from "@/components/hero-video";

/**
 * Hero.
 *
 * A rendered loop of the scan forming sits behind everything, with the poster
 * image carrying first paint so the video is never in the way.
 *
 * The copy sits in a capped column over a scrim, deliberately narrower than the
 * viewport. Text over moving imagery has to hold at its WORST pixel, not its
 * average, and the only reliable way to guarantee that is to keep the copy off
 * the bright part of the frame entirely rather than trusting a wash to save it.
 */
export function Hero() {
  return (
    <section className="relative flex min-h-[min(100svh,54rem)] items-center overflow-hidden">
      <HeroVideo
        src="/video/ct-forming.mp4"
        poster="/img/ref/wave-ref-1-1600.webp"
        className="-z-10"
      />

      {/* Scrim across the copy column, releasing before the centre so the
          animation is never veiled where it actually reads. */}
      <div
        aria-hidden
        className="absolute inset-0 z-0"
        style={{
          background:
            "linear-gradient(to right, var(--surface) 0%, var(--surface) 40%, color-mix(in srgb, var(--surface) 90%, transparent) 52%, color-mix(in srgb, var(--surface) 40%, transparent) 66%, transparent 82%)",
        }}
      />
      {/* Soft lift at the base so the section hands over to the trust band
          rather than ending on a hard edge. */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 z-0 h-32"
        style={{
          background:
            "linear-gradient(to bottom, transparent, color-mix(in srgb, var(--surface) 92%, transparent))",
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-[1180px] px-6 py-[var(--rr-space-2xl)] md:px-10">
        <div className="max-w-[36rem]">
          <ScrollLogo />

          <p className="mt-9 text-[0.95rem] font-medium tracking-[0.01em] text-accent">
            {clinic.address.suburb} {clinic.address.state} &middot; Bulk billed
          </p>

          <h1 className="mt-5 text-balance text-[clamp(2.5rem,6.2vw,4.6rem)] font-semibold leading-[1.02] tracking-[-0.03em]">
            {clinic.tagline}
          </h1>

          <p className="mt-7 text-pretty text-[1.15rem] leading-[1.55] text-fg-muted md:text-[1.3rem]">
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
      </div>
    </section>
  );
}
