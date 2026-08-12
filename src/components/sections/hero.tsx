import { clinic, REPORT_TURNAROUND } from "@/lib/clinic";
import { ButtonLink , CallButton} from "@/components/ui";
import { HeroLogo } from "@/components/hero-logo";
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
    // min-height subtracts the fixed booking bar on mobile. Without that the
    // hero claims the full viewport, the bar then covers its last 73px, and the
    // primary CTA is pushed past the fold on a phone.
    <section className="relative flex min-h-[calc(min(100svh,54rem)-73px)] items-center overflow-hidden sm:min-h-[min(100svh,54rem)]">
      <HeroVideo
        src="/video/ct-forming.mp4"
        poster="/img/poster/ct-forming-1600.avif"
        className="-z-10"
      />

      {/* Two scrims, because the copy column changes shape at the breakpoint.
          Text contrast over it is measured, not assumed: see PERF.md. */}

      {/* NARROW, below 1280. The copy column is capped at 36rem but the viewport
          is narrower than that plus the release, so the text runs to the edge of
          the measure. The old gradient had dropped to 32% by two thirds across,
          which put the last third of every line over bare video: measured 1.17
          against a 4.5 requirement at 390px. It held on desktop only because
          there the column ends long before the release begins.

          This one stays up across the whole measure and lets go at the very
          edge, where there is no text.

          The boundary is 1280, not 1024. At exactly 1024 the column still runs
          to 59% of the viewport, which is past where the wide scrim starts
          releasing: measured 3.82 there. */}
      <div
        aria-hidden
        className="absolute inset-0 z-0 xl:hidden"
        style={{
          background:
            "linear-gradient(to right, color-mix(in srgb, var(--surface) 93%, transparent) 0%, color-mix(in srgb, var(--surface) 92%, transparent) 70%, color-mix(in srgb, var(--surface) 84%, transparent) 88%, color-mix(in srgb, var(--surface) 58%, transparent) 100%)",
        }}
      />

      {/* WIDE, 1280 and up. Releases before the centre so the animation is never
          veiled where it actually reads, which is the whole point of the video.
          The column stops at 36rem here, so the release happens in empty space. */}
      <div
        aria-hidden
        className="absolute inset-0 z-0 hidden xl:block"
        style={{
          background:
            "linear-gradient(to right, color-mix(in srgb, var(--surface) 84%, transparent) 0%, color-mix(in srgb, var(--surface) 82%, transparent) 42%, color-mix(in srgb, var(--surface) 72%, transparent) 54%, color-mix(in srgb, var(--surface) 32%, transparent) 66%, transparent 82%)",
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

      <div className="relative z-10 mx-auto w-full max-w-[1180px] px-6 py-7 [@media(max-height:620px)]:py-4 sm:py-10 md:px-10 md:py-[var(--rr-space-2xl)]">
        <div className="max-w-[36rem]">
          <HeroLogo />

          <p className="mt-6 text-[0.95rem] font-medium tracking-[0.01em] text-accent [@media(max-height:620px)]:mt-4 md:mt-9">
            {clinic.address.suburb} {clinic.address.state} &middot; Bulk billed
          </p>

          <h1 className="mt-4 text-balance md:mt-5 text-[clamp(2rem,7.4vw,4.6rem)] font-semibold leading-[1.02] tracking-[-0.03em]">
            {clinic.tagline}
          </h1>

          <p className="mt-5 text-pretty text-[1.02rem] leading-[1.45] text-fg-muted sm:text-[1.08rem] sm:leading-[1.5] md:mt-7 md:text-[1.3rem]">
            Ultrasound, CT, X-ray and image guided procedures in{" "}
            {clinic.address.suburb}. Most services are bulk billed, and your
            report reaches your doctor within {REPORT_TURNAROUND}.
          </p>

          <div className="mt-7 flex flex-col gap-3 [@media(max-height:620px)]:mt-5 sm:flex-row sm:items-center md:mt-10">
            <ButtonLink href="/contact" size="lg" echo>
              Book a scan
            </ButtonLink>
            <CallButton variant="ghost" />
          </div>

          {/* fg-muted, not fg-subtle. This line sits over the video like the
              rest, and the subtle token is the lightest on the ramp: it was
              measuring 4.13 against a 4.5 requirement even at 1440, where
              everything else passed comfortably. */}
          <p className="tabular mt-5 text-[0.95rem] text-fg-muted md:mt-6">
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
