import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

// Image metadata
export const alt = "KalaDori Textile — handwoven sarees, kurtis and pants";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/*
 * The logo is a static local asset that never depends on the request, so it is
 * read once at module scope (the documented pattern for Cache Components —
 * an `await readFile()` inside the handler would count as uncached data).
 * The SVG is embedded untouched; it is never redrawn.
 */
const logoData = await readFile(join(process.cwd(), "public/brand/kaladori-logo.svg"), "base64");
const logoSrc = `data:image/svg+xml;base64,${logoData}`;

/** Logo viewBox is 1349 × 479. */
const LOGO_WIDTH = 600;
const LOGO_HEIGHT = Math.round((LOGO_WIDTH * 479) / 1349);

const INK = "#1A1A1A";
const MAROON = "#A2284E";
const IVORY = "#F6F1EA";
const STONE = "#6B625B";

const domain = site.url.replace(/^https?:\/\//, "").replace(/\/+$/, "");

// Image generation — system/default font only, no font fetching.
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          background: IVORY,
          color: INK,
        }}
      >
        {/* Top labels */}
        <div
          style={{
            position: "absolute",
            top: 56,
            left: 72,
            right: 72,
            display: "flex",
            justifyContent: "space-between",
            fontSize: 15,
            letterSpacing: 5,
            textTransform: "uppercase",
            color: STONE,
          }}
        >
          <div style={{ display: "flex" }}>Sarees · Kurtis · Pants</div>
          <div style={{ display: "flex" }}>{domain}</div>
        </div>

        {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse renders plain <img> */}
        <img src={logoSrc} alt="KalaDori Textile" width={LOGO_WIDTH} height={LOGO_HEIGHT} />

        {/* Thin maroon rule */}
        <div style={{ display: "flex", width: 96, height: 2, marginTop: 40, background: MAROON }} />

        <div
          style={{
            display: "flex",
            marginTop: 32,
            fontSize: 32,
            letterSpacing: -0.5,
            color: INK,
          }}
        >
          {site.tagline}
        </div>

        {/* The signature thread, entering from the left edge */}
        <svg
          width="1200"
          height="120"
          viewBox="0 0 1200 120"
          style={{ position: "absolute", left: 0, bottom: 0 }}
        >
          <path
            d="M-10 92 C 180 50, 360 46, 540 78 S 900 116, 1210 58"
            fill="none"
            stroke={MAROON}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
    ),
    { ...size },
  );
}
