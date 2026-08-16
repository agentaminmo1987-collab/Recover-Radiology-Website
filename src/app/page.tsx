import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { BookingBar } from "@/components/booking-bar";
import { Hero } from "@/components/sections/hero";
import { TrustBand } from "@/components/sections/trust-band";
import { Services } from "@/components/sections/services";
import { Recovery } from "@/components/sections/recovery";
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
      <SiteHeader />
      <main id="main" className="pb-[88px] sm:pb-0">
        <Hero />
        <TrustBand />
        <Services />
        {/* Directly after the services grid, which is the right moment: the
            reader has just seen what equipment exists, and this answers "so
            which of those is for me". */}
        <Recovery />
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
