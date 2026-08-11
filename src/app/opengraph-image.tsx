import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { clinic, REPORT_TURNAROUND } from "@/lib/clinic";

/**
 * The site had no og:image at all, so every share, every Slack paste and every
 * search preview rendered as a bare link. This closes that.
 *
 * Generated rather than exported from a design tool so it can never drift from
 * the facts: the phone number, the turnaround and the address all come from
 * lib/clinic.ts, the same source the page uses.
 */

export const alt = `${clinic.name}, bulk billed imaging in ${clinic.address.suburb}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const logo = await readFile(
    join(process.cwd(), "public/brand/logo-h-colour.png"),
  );
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#FBF9F4",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Dust and Rain washes, the same calm bands the site uses. */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            background:
              "radial-gradient(900px 520px at 78% 18%, #EAE7C9 0%, rgba(250,247,242,0) 70%), radial-gradient(700px 460px at 96% 88%, #E3F1F1 0%, rgba(250,247,242,0) 68%)",
          }}
        />

        <img src={logoSrc} width={392} height={86} alt="" style={{ zIndex: 1 }} />

        <div style={{ display: "flex", flexDirection: "column", zIndex: 1 }}>
          <div
            style={{
              display: "flex",
              fontSize: 68,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              color: "#1B1915",
              fontWeight: 700,
              maxWidth: 900,
            }}
          >
            Bulk billed imaging in {clinic.address.suburb}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 26,
              fontSize: 30,
              lineHeight: 1.35,
              color: "#4A5E26",
              maxWidth: 860,
            }}
          >
            Ultrasound, CT, X-ray and image guided procedures. Reports to your
            doctor within {REPORT_TURNAROUND}.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 28,
            zIndex: 1,
            fontSize: 26,
            color: "#4E5A43",
          }}
        >
          <span>{clinic.phone.display}</span>
          <span style={{ color: "#B6BFA8" }}>|</span>
          <span>{clinic.address.full}</span>
        </div>
      </div>
    ),
    size,
  );
}
