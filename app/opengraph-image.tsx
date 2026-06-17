import { ImageResponse } from "next/og"
import {
  loadInterTight,
  OG_INTER_TIGHT_FAMILY,
} from "@/lib/og-inter-tight-font"
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site-metadata"

export const runtime = "nodejs"

export const size = { width: 1200, height: 630 }
export const contentType = "image/png"
export const alt = SITE_NAME

function LogoMark({ size = 48 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M77.0833 0H22.9167C10.2601 0 0 10.2601 0 22.9167V77.0833C0 89.7399 10.2601 100 22.9167 100H77.0833C89.7399 100 100 89.7399 100 77.0833V22.9167C100 10.2601 89.7399 0 77.0833 0Z"
        fill="#ff5a4a"
      />
      <path
        d="M50 14C53 35 65.0001 47 86 50C65.0001 53 53 65.0001 50 86C47 65.0001 35 53 14 50C35 47 47 35 50 14Z"
        fill="white"
      />
    </svg>
  )
}

export default async function OpenGraphImage() {
  const [regular, semiBold, bold] = await Promise.all([
    loadInterTight(400),
    loadInterTight(600),
    loadInterTight(700),
  ])

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background:
          "linear-gradient(135deg, #faf8f5 0%, #f5d4c8 55%, #e8a89a 100%)",
        fontFamily: OG_INTER_TIGHT_FAMILY,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 20,
          fontSize: 36,
          fontWeight: 700,
          color: "#2a2420",
        }}
      >
        <LogoMark size={56} />
        {SITE_NAME}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div
          style={{
            fontSize: 80,
            fontWeight: 600,
            letterSpacing: "-0.04em",
            lineHeight: 1.05,
            color: "#1a1512",
            maxWidth: 1000,
          }}
        >
          Greeting cards, generated in seconds
        </div>
        <div
          style={{
            fontSize: 40,
            fontWeight: 400,
            lineHeight: 1.35,
            color: "#4a4038",
            maxWidth: 900,
          }}
        >
          {SITE_TAGLINE}
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        {
          name: OG_INTER_TIGHT_FAMILY,
          data: regular,
          weight: 400,
          style: "normal",
        },
        {
          name: OG_INTER_TIGHT_FAMILY,
          data: semiBold,
          weight: 600,
          style: "normal",
        },
        {
          name: OG_INTER_TIGHT_FAMILY,
          data: bold,
          weight: 700,
          style: "normal",
        },
      ],
    },
  )
}
