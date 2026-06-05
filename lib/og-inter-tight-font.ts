const INTER_TIGHT_FAMILY = "Inter Tight"

/** Non-Chrome UA so css2 returns truetype (modern Chrome UAs get woff2 only). */
const LEGACY_FONT_CSS_USER_AGENT =
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36"

function extractInterTightFontUrl(css: string): string | null {
  const match = css.match(
    /src: url\(([^)]+)\) format\('(?:opentype|truetype)'\)/,
  )
  return match?.[1] ?? null
}

/**
 * Loads a single Inter Tight weight for Satori / ImageResponse.
 * Satori only accepts TTF/OTF — not woff2 — so we fetch the CSS with a
 * non-Chrome User-Agent (Google Fonts css2 then returns a truetype URL).
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image
 */
export async function loadInterTight(weight: number): Promise<ArrayBuffer> {
  const cssRes = await fetch(
    `https://fonts.googleapis.com/css2?family=${INTER_TIGHT_FAMILY.replace(/ /g, "+")}:wght@${weight}`,
    {
      headers: { "User-Agent": LEGACY_FONT_CSS_USER_AGENT },
      next: { revalidate: 60 * 60 * 24 * 7 },
    },
  )

  if (!cssRes.ok) {
    throw new Error(
      `Failed to fetch Inter Tight CSS for weight ${weight}: ${cssRes.status}`,
    )
  }

  const css = await cssRes.text()

  const fontUrl = extractInterTightFontUrl(css)

  if (!fontUrl) {
    throw new Error(
      `Failed to resolve Inter Tight font URL for weight ${weight}`,
    )
  }

  const fontRes = await fetch(fontUrl)
  if (!fontRes.ok) {
    throw new Error(`Failed to fetch Inter Tight weight ${weight}`)
  }

  return fontRes.arrayBuffer()
}

export const OG_INTER_TIGHT_FAMILY = INTER_TIGHT_FAMILY
