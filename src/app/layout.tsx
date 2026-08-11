import type { Metadata, Viewport } from "next";
import { Figtree, IBM_Plex_Mono } from "next/font/google";
import { clinic } from "@/lib/clinic";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import "./globals.css";

/**
 * Figtree carries everything. IBM Plex Mono is the instrumentation layer and is
 * used only for measured values: durations, turnaround, phone, hours, address.
 * Restricting it to real numbers is what keeps that meaning honest.
 */
const figtree = Figtree({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-figtree",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-plex-mono",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://recoverradiology.com.au";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${clinic.name}, bulk billed imaging in Morphett Vale`,
    template: `%s | ${clinic.name}`,
  },
  description:
    "Bulk billed ultrasound, CT, X-ray and interventional procedures in Morphett Vale, serving Adelaide's southern suburbs. Walk in X-ray during business hours. Reports to your doctor within 24 to 48 hours.",
  applicationName: clinic.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_AU",
    siteName: clinic.name,
    title: `${clinic.name}, bulk billed imaging in Morphett Vale`,
    description:
      "Bulk billed ultrasound, CT, X-ray and interventional procedures. Walk in X-ray during business hours.",
    url: "/",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Never disable zoom. §4.4, and a High severity rule in ui-ux-pro-max.
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAF7F2" },
    { media: "(prefers-color-scheme: dark)", color: "#12100D" },
  ],
};

/**
 * RadiologyImagingCenter JSON-LD. Every value comes from lib/clinic.ts, which
 * is the verified fact set. No claim here is unsubstantiated.
 */
function StructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    additionalType: "https://schema.org/Radiology",
    name: clinic.name,
    slogan: clinic.tagline,
    url: SITE_URL,
    telephone: clinic.phone.display,
    faxNumber: clinic.fax.display,
    address: {
      "@type": "PostalAddress",
      streetAddress: clinic.address.line1,
      addressLocality: clinic.address.suburb,
      addressRegion: clinic.address.state,
      postalCode: clinic.address.postcode,
      addressCountry: clinic.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: clinic.geo.lat,
      longitude: clinic.geo.lng,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: clinic.hours.days.map((d) => `https://schema.org/${d}`),
        opens: clinic.hours.opens,
        closes: clinic.hours.closes,
      },
    ],
    areaServed: { "@type": "AdministrativeArea", name: clinic.serviceArea },
    availableService: [
      { "@type": "MedicalTest", name: "Ultrasound" },
      { "@type": "MedicalTest", name: "CT" },
      { "@type": "MedicalTest", name: "X-ray" },
      { "@type": "MedicalProcedure", name: "Interventional procedures" },
    ],
    sameAs: [clinic.instagram],
  };
  return (
    <script
      type="application/ld+json"
      // Static object, no user input, so this is safe.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-AU" className={`${figtree.variable} ${plexMono.variable}`}>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-contrast"
        >
          Skip to content
        </a>
        {children}
        <SmoothScroll />
        <StructuredData />
      </body>
    </html>
  );
}
