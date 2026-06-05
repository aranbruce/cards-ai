import type { Metadata } from "next"
import { buildOpenGraph, DEFAULT_DESCRIPTION } from "@/lib/site-metadata"
import {
  getContributeCardByLinkId,
  type ContributeCardRecord,
} from "@/lib/contribute-card"
import {
  getPublicCardByLinkId,
  type PublicCardViewRecord,
} from "@/lib/public-card-view"

function shareCardTitle(
  card: PublicCardViewRecord | ContributeCardRecord,
  fallback: string,
): string {
  const headline = card.copy_headline?.trim()
  if (headline) return headline
  const recipient = card.recipient_name?.trim()
  if (recipient) return fallback.replace("{name}", recipient)
  return "Your greeting card"
}

function shareCardDescription(
  card: PublicCardViewRecord | ContributeCardRecord,
  intro: string,
): string {
  const recipient = card.recipient_name?.trim()
  const sender = card.sender_name?.trim()
  if (recipient) {
    return `${intro.replace("{name}", recipient)}${sender ? ` from ${sender}` : ""}.`
  }
  return DEFAULT_DESCRIPTION
}

function cardLinkMetadata(
  card: PublicCardViewRecord | ContributeCardRecord,
  title: string,
  description: string,
): Metadata {
  return {
    title,
    description,
    robots: { index: false, follow: false },
    openGraph: buildOpenGraph(title, description, card.image_url),
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: card.image_url ? [card.image_url] : undefined,
    },
  }
}

export async function buildContributeCardMetadata(
  linkId: string,
): Promise<Metadata> {
  try {
    const result = await getContributeCardByLinkId(linkId)
    if (!result) {
      return {
        title: "Card not found",
        robots: { index: false, follow: false },
      }
    }

    const { card } = result
    return cardLinkMetadata(
      card,
      shareCardTitle(card, "Sign {name}'s card"),
      shareCardDescription(
        card,
        "Add your message to the group card for {name}",
      ),
    )
  } catch {
    return {
      title: "Card unavailable",
      robots: { index: false, follow: false },
    }
  }
}

export async function buildViewCardMetadata(linkId: string): Promise<Metadata> {
  try {
    const result = await getPublicCardByLinkId(linkId)
    if (!result) {
      return {
        title: "Card not found",
        robots: { index: false, follow: false },
      }
    }

    const { card } = result
    return cardLinkMetadata(
      card,
      shareCardTitle(card, "A card for {name}"),
      shareCardDescription(
        card,
        "Open a personalised greeting card for {name}",
      ),
    )
  } catch {
    return {
      title: "Card unavailable",
      robots: { index: false, follow: false },
    }
  }
}
