import { CanvasStage } from "@/components/canvas/stage";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { BookingBar } from "@/components/booking-bar";
import { Hero } from "@/components/sections/hero";
import { TrustBand } from "@/components/sections/trust-band";
import { Services } from "@/components/sections/services";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Billing } from "@/components/sections/billing";
import { Credibility } from "@/components/sections/credibility";
import { LocationBook } from "@/components/sections/location-book";

/**
 * The landing page, §6 items 1 to 9 in order.
 *
 * Entirely server rendered. The 3D canvas mounts behind this in Phase D as a
 * single persistent fixed layer driven by one scroll progress value; it is
 * decorative, aria-hidden, and never the sole carrier of information. Remove it
 * and this page still reads correctly, which is the test.
 */
export default function Home() {
  return (
    <>
      <CanvasStage />
      <SiteHeader />
      <main id="main" className="pb-[88px] sm:pb-0">
        <Hero />
        <TrustBand />
        <Services />
        <HowItWorks />
        <Billing />
        <Credibility />
        <LocationBook />
      </main>
      <SiteFooter />
      <BookingBar />
    </>
  );
}
