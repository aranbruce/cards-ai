import {
  assembleImageLeadingText,
  assembleImageUserPrompt,
} from "@/app/api/generate-image/prompt"
import { resolvePromptFields } from "@/lib/card-ai-prompt"
import { generateCardCoverArt } from "@/lib/generate-card-cover-art"

export type BuildCardCoverArtContextParams = {
  cardType: string
  recipientName?: string
  tone?: string
  userContext?: string
  userPrompt?: string
  coverHeadline?: string
  source?: Uint8Array
  previous?: Uint8Array
}

export function buildCardCoverArtContext(
  params: BuildCardCoverArtContextParams,
) {
  const fields = resolvePromptFields({
    cardType: params.cardType,
    recipientName: params.recipientName?.trim() || "the recipient",
    tone: params.tone,
    userContext: params.userContext,
    userPrompt: params.userPrompt,
    cardTitle: params.coverHeadline,
  })

  const hasPrevious = Boolean(params.previous)
  const hasAttached = Boolean(params.source)

  return {
    userScene: assembleImageUserPrompt(fields, {
      hasPreviousImage: hasPrevious,
      hasAttachedImage: hasAttached,
    }),
    leadingText: assembleImageLeadingText(hasPrevious, hasAttached),
    source: params.source,
    previous: params.previous,
  }
}

export async function generateCardCoverImage(
  params: Omit<
    BuildCardCoverArtContextParams,
    "source" | "previous" | "userPrompt"
  >,
  options?: { distinctId?: string | null },
): Promise<string> {
  const ctx = buildCardCoverArtContext(params)

  const imageUrl = await generateCardCoverArt(ctx, {
    persist: true,
    distinctId: options?.distinctId,
  })

  if (!imageUrl.startsWith("http")) {
    throw new Error("Image generated but could not be persisted")
  }

  return imageUrl
}
