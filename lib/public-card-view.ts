import { validate as isValidUuid } from "uuid"
import type { Contribution } from "@/lib/card-body"
import { CONTRIBUTION_PUBLIC_COLUMNS } from "@/lib/contribution-public-columns"
import { requireServiceRoleClient } from "@/lib/supabase/admin"

export const PUBLIC_CARD_VIEW_SELECT =
  "id, sent_at, recipient_name, sender_name, copy_headline, copy_message, image_url, extra_pages"

export type PublicCardViewRecord = {
  id: string
  sent_at: string | null
  recipient_name: string
  sender_name: string
  copy_headline: string
  copy_message: string
  image_url: string
  extra_pages: number | null
}

export type PublicCardViewResult = {
  card: PublicCardViewRecord
  contributions: Contribution[]
}

export async function getPublicCardByLinkId(
  linkId: string,
): Promise<PublicCardViewResult | null> {
  if (!isValidUuid(linkId)) return null

  const supabase = requireServiceRoleClient()

  const { data: cardData, error: cardError } = await supabase
    .from("cards")
    .select(PUBLIC_CARD_VIEW_SELECT)
    .eq("contributor_link_id", linkId)
    .maybeSingle()

  if (cardError) {
    console.error("[getPublicCardByLinkId] card by link:", cardError)
    throw new Error("Failed to fetch card")
  }

  if (!cardData) return null

  const { data: contributions, error: contribError } = await supabase
    .from("card_contributions")
    .select(CONTRIBUTION_PUBLIC_COLUMNS)
    .eq("card_id", cardData.id)
    .order("created_at", { ascending: true })

  if (contribError) {
    console.error("[getPublicCardByLinkId] contributions:", contribError)
    return { card: cardData, contributions: [] }
  }

  return {
    card: cardData,
    contributions: (contributions ?? []) as Contribution[],
  }
}
