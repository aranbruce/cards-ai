import type { Metadata } from "next"
import { getAppUrl } from "@/lib/app-url"

export const SITE_NAME = "CardShareAI"
export const SITE_TAGLINE = "AI group greeting cards, signed in one link"
export const DEFAULT_DESCRIPTION =
  "Create AI greeting cards in seconds. Share one link so your team adds notes, GIFs, and signatures — or send from Slack."

/** Default social preview (`app/opengraph-image.tsx`). */
export const DEFAULT_OG_IMAGE_PATH = "/opengraph-image"

export function getMetadataBase(): URL {
  return new URL(`${getAppUrl()}/`)
}

const noIndexRobots: Metadata["robots"] = {
  index: false,
  follow: false,
}

export function privatePageMetadata(title: string): Metadata {
  return {
    title,
    robots: noIndexRobots,
  }
}

export function buildOpenGraph(
  title: string,
  description: string,
  imageUrl?: string | null,
): NonNullable<Metadata["openGraph"]> {
  const images = imageUrl
    ? [{ url: imageUrl, alt: title }]
    : [{ url: DEFAULT_OG_IMAGE_PATH, alt: SITE_NAME }]

  return {
    type: "website",
    siteName: SITE_NAME,
    title,
    description,
    images,
  }
}

export function buildPageMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  path,
  imageUrl,
  robots,
}: {
  title: string
  description?: string
  path?: string
  imageUrl?: string | null
  robots?: Metadata["robots"]
}): Metadata {
  const canonical = path ? `${getAppUrl()}${path}` : undefined

  return {
    title,
    description,
    alternates: canonical ? { canonical } : undefined,
    openGraph: buildOpenGraph(title, description, imageUrl),
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: imageUrl ? [imageUrl] : [DEFAULT_OG_IMAGE_PATH],
    },
    robots,
  }
}
