const INTER_TIGHT_FAMILY = "Inter Tight"

/**
 * Loads a single Inter Tight weight for Satori / ImageResponse.
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image
 */
export async function loadInterTight(weight: number): Promise<ArrayBuffer> {
  const css = await fetch(
    `https://fonts.googleapis.com/css2?family=${INTER_TIGHT_FAMILY.replace(/ /g, "+")}:wght@${weight}`,
    { next: { revalidate: 60 * 60 * 24 * 7 } },
  ).then((res) => res.text())

  const match = css.match(/src: url\((.+)\) format\('(?:opentype|truetype)'\)/)

  if (!match?.[1]) {
    throw new Error(
      `Failed to resolve Inter Tight font URL for weight ${weight}`,
    )
  }

  const fontRes = await fetch(match[1])
  if (!fontRes.ok) {
    throw new Error(`Failed to fetch Inter Tight weight ${weight}`)
  }

  return fontRes.arrayBuffer()
}

export const OG_INTER_TIGHT_FAMILY = INTER_TIGHT_FAMILY
