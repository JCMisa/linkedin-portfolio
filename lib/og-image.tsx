import "server-only";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/seo";

export const ogImageSize = { width: 1200, height: 630 };
export const ogImageAlt = `${siteConfig.name}, ${siteConfig.jobTitle}`;

// Satori renders outside the DOM, so CSS variables are unavailable here;
// these mirror the light tokens in app/globals.css.
const palette = {
  page: siteConfig.colors.background,
  card: siteConfig.colors.light,
  border: "#e0dfdc",
  text: "#191919",
  muted: "#666666",
  brand: siteConfig.colors.brand,
};

/** 1200x630 PNG social card: logo, name, role and site URL. */
export async function renderOgImage() {
  const logo = await readFile(join(process.cwd(), "public/jcm-logo.svg"));
  const logoSrc = `data:image/svg+xml;base64,${logo.toString("base64")}`;
  const host = new URL(siteConfig.url).host;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        padding: 48,
        background: palette.page,
      }}
    >
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: palette.card,
          border: `2px solid ${palette.border}`,
          borderRadius: 16,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            gap: 56,
            padding: "0 72px",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- Satori needs <img> */}
          <img src={logoSrc} width={330} height={211} alt="" />
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div
              style={{
                fontSize: 64,
                fontWeight: 700,
                color: palette.text,
                lineHeight: 1.1,
              }}
            >
              {siteConfig.name}
            </div>
            <div style={{ fontSize: 34, color: palette.muted }}>
              {siteConfig.jobTitle}
            </div>
            <div style={{ fontSize: 26, color: palette.muted, marginTop: 12 }}>
              {host}
            </div>
          </div>
        </div>
        <div style={{ height: 14, background: palette.brand }} />
      </div>
    </div>,
    ogImageSize,
  );
}
