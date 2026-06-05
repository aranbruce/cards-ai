const INTER_TIGHT_FAMILY = "Inter Tight"

/** Modern browser UA so Google Fonts returns woff2 rather than a single ttf. */
const GOOGLE_FONTS_USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"

function extractInterTightFontUrl(css: string): string | null {
  const latinBlock = css.split("/* latin */")[1]
  const block = latinBlock ?? css

  const woff2Match = block.match(/src: url\(([^)]+)\) format\('woff2'\)/)
  if (woff2Match?.[1]) return woff2Match[1]

  const legacyMatch = block.match(
    /src: url\(([^)]+)\) format\('(?:opentype|truetype)'\)/,
  )
  return legacyMatch?.[1] ?? null
}

/**
 * Loads a single Inter Tight weight for Satori / ImageResponse.
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image
 */
export async function loadInterTight(weight: number): Promise<ArrayBuffer> {
  const css = await fetch(
    `https://fonts.googleapis.com/css2?family=${INTER_TIGHT_FAMILY.replace(/ /g, "+")}:wght@${weight}`,
    {
      next: { revalidate: 60 * 60 * 24 * 7 },
      headers: { "User-Agent": GOOGLE_FONTS_USER_AGENT },
    },
  ).then((res) => res.text())

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
