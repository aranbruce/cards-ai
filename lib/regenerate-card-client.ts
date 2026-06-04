import { apiPost } from "@/lib/api-client"
import { sourceImageUrlForRefineRequest } from "@/lib/source-image-limits"
import posthog from "posthog-js"

export type CardRegeneratePage = "create" | "dashboard"

type RegenerateHeadlineInput = {
  page: CardRegeneratePage
  cardType: string
  recipientName: string
  cardTitle: string
  coverImageUrl: string
  userPrompt: string
  cardId?: string
  tone?: string
  userContext?: string
}

type RegenerateImageInput = {
  page: CardRegeneratePage
  cardType: string
  recipientName: string
  coverHeadline: string
  coverImageUrl: string
  userPrompt: string
  attachedImageUrl?: string
  cardId?: string
  tone?: string
  userContext?: string
}

/** Matches generate-image body: only non-empty prompts after trim are sent. */
function trimmedImageUserPrompt(userPrompt: string): string {
  return userPrompt.trim()
}

function buildGenerateImageBody(input: RegenerateImageInput) {
  const existingCover = sourceImageUrlForRefineRequest(input.coverImageUrl)
  const trimmedPrompt = trimmedImageUserPrompt(input.userPrompt)

  return {
    cardType: input.cardType,
    recipientName: input.recipientName,
    coverHeadline: input.coverHeadline,
    ...(trimmedPrompt ? { userPrompt: trimmedPrompt } : {}),
    ...(input.tone ? { tone: input.tone } : {}),
    ...(input.userContext ? { userContext: input.userContext } : {}),
    ...(existingCover &&
    (!input.attachedImageUrl || !existingCover.startsWith("data:"))
      ? { existingCardCoverImageUrl: existingCover }
      : {}),
    ...(input.attachedImageUrl
      ? { attachedImageUrl: input.attachedImageUrl }
      : {}),
  }
}

/** Calls generate-headline and captures `card_headline_regenerated`. */
export async function regenerateCardHeadline(
  input: RegenerateHeadlineInput,
): Promise<string> {
  const { text } = await apiPost<{ text?: string }>("/api/generate-headline", {
    cardType: input.cardType,
    recipientName: input.recipientName,
    cardTitle: input.cardTitle,
    userPrompt: input.userPrompt,
    ...(input.tone ? { tone: input.tone } : {}),
    ...(input.userContext ? { userContext: input.userContext } : {}),
    existingCardCoverImageUrl: sourceImageUrlForRefineRequest(
      input.coverImageUrl,
    ),
  })

  const headline = String(text ?? "").trim()

  posthog.capture("card_headline_regenerated", {
    card_type: input.cardType,
    page: input.page,
    ...(input.cardId ? { card_id: input.cardId } : {}),
  })

  return headline
}

/** Calls generate-image and captures `card_image_regenerated`. */
export async function regenerateCardImage(
  input: RegenerateImageInput,
): Promise<string | undefined> {
  const { imageUrl } = await apiPost<{ imageUrl?: string }>(
    "/api/generate-image",
    buildGenerateImageBody(input),
  )

  const trimmedPrompt = trimmedImageUserPrompt(input.userPrompt)

  posthog.capture("card_image_regenerated", {
    card_type: input.cardType,
    page: input.page,
    has_prompt: Boolean(trimmedPrompt),
    has_attached_image: Boolean(input.attachedImageUrl),
    image_updated: Boolean(imageUrl),
    ...(input.cardId ? { card_id: input.cardId } : {}),
  })

  return imageUrl
}
