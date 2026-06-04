import { resolveImageForModel } from "@/lib/resolve-image-for-model"

export async function resolveCardAiImages(params: {
  attachedImageUrl?: string
  existingCardCoverImageUrl?: string
}): Promise<{
  attached?: Uint8Array
  previous?: Uint8Array
}> {
  const attachedUrl =
    typeof params.attachedImageUrl === "string"
      ? params.attachedImageUrl.trim()
      : ""
  const coverUrl =
    typeof params.existingCardCoverImageUrl === "string"
      ? params.existingCardCoverImageUrl.trim()
      : ""

  const [attached, previous] = await Promise.all([
    attachedUrl ? resolveImageForModel(attachedUrl) : null,
    coverUrl ? resolveImageForModel(coverUrl) : null,
  ])

  return {
    ...(attached ? { attached } : {}),
    ...(previous ? { previous } : {}),
  }
}
