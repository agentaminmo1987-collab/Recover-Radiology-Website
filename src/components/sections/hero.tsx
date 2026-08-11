import Image from "next/image";
import { clinic, REPORT_TURNAROUND } from "@/lib/clinic";
import { ButtonLink } from "@/components/ui";
import { ScrollLogo } from "@/components/scroll-logo";

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
      {/* The hero image. These renders are the approved direction: warm gold
          particles resolving into an anatomical form, in the practice's own
          material world of pale timber, cove light and polished concrete.
          Decorative, so it carries an empty alt and the copy never depends on
          it. Priority because it IS the LCP element. */}
      <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
        <Image
          src="/img/ref/wave-ref-1-2560.avif"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-right"
        />
      </div>

      {/* Scrim. The last line of defence for legibility: a wash of the page
          surface from the left, sitting above the fixed canvas and below the
          copy. The canvas mask already keeps the cloud out of this column, but
          points drift and the camera traverses, so the text gets a floor it
          does not have to share. Fades out by 62% so the resolved form on the
          right is untouched. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "linear-gradient(to right, var(--surface) 0%, var(--surface) 46%, color-mix(in srgb, var(--surface) 92%, transparent) 56%, color-mix(in srgb, var(--surface) 55%, transparent) 68%, transparent 84%)",
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-[1180px] px-6 py-[var(--rr-space-2xl)] md:px-10">
        <div className="max-w-[34rem] lg:max-w-[38rem]">
        {/* Travels up into the header as the page scrolls. See ScrollLogo. */}
        <ScrollLogo />

        <p className="mt-8 text-[0.9rem] font-medium tracking-[0.01em] text-accent">
          {clinic.address.suburb} {clinic.address.state} &middot; Bulk billed
        </p>

        <h1 className="mt-6 text-balance text-[clamp(2.6rem,7vw,5.25rem)] font-semibold leading-[1.02] tracking-[-0.03em]">
          Forming your road to recovery
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
