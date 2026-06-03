import { generateCardCoverArt } from "@/lib/generate-card-cover-art"

export async function generateCardCoverImage(
  params: {
    cardType?: string
    coverHeadline?: string
    customMessage?: string
  },
  options?: { distinctId?: string | null },
): Promise<string> {
  const { cardType = "", coverHeadline = "", customMessage = "" } = params

  const imageUrl = await generateCardCoverArt(
    {
      imagePrompt: "",
      cardType,
      customMessage,
      coverHeadline: coverHeadline || "",
    },
    { persist: true, distinctId: options?.distinctId },
  )

  if (!imageUrl.startsWith("http")) {
    throw new Error("Image generated but could not be persisted")
  }

  return imageUrl
}
