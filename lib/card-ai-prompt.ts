import type { ModelMessage } from "ai"

export type CardAiPromptFields = {
  tone?: string
  cardType: string
  addressedTo: string
  userContext?: string
  userPrompt?: string
  cardTitle?: string
  previousUserMessage?: string
}

export type ImagePromptFlags = {
  hasPreviousImage?: boolean
  hasAttachedImage?: boolean
}

export type MultimodalImageOptions = {
  previous?: Uint8Array
  attached?: Uint8Array
  /** Task instruction prepended before image parts (assembled by API routes). */
  leadingText?: string
}

export function resolvePromptFields(params: {
  cardType: string
  recipientName: string
  tone?: string
  userContext?: string
  userPrompt?: string
  cardTitle?: string
  previousUserMessage?: string
}): CardAiPromptFields {
  return {
    tone: params.tone?.trim() || undefined,
    cardType: params.cardType.trim(),
    addressedTo: params.recipientName.trim(),
    userContext: params.userContext?.trim() || undefined,
    userPrompt: params.userPrompt?.trim() || undefined,
    cardTitle: params.cardTitle?.trim() || undefined,
    previousUserMessage: params.previousUserMessage?.trim() || undefined,
  }
}

type LabeledField = {
  label: string
  value?: string
}

function formatLabeledLine(label: string, value: string): string {
  return `${label}: ${value}`
}

function formatLabeledPrompt(fields: LabeledField[]): string {
  return fields
    .filter(({ value }) => Boolean(value?.trim()))
    .map(({ label, value }) => formatLabeledLine(label, value!.trim()))
    .join("\n")
}

function coreContextFields(fields: CardAiPromptFields): LabeledField[] {
  return [
    { label: "Tone", value: fields.tone },
    { label: "Card type", value: fields.cardType },
    { label: "Addressed to", value: fields.addressedTo },
    { label: "User context", value: fields.userContext },
    { label: "User prompt", value: fields.userPrompt },
    { label: "Card title", value: fields.cardTitle },
    { label: "Previous user message", value: fields.previousUserMessage },
  ]
}

/** Labeled context block only — no task instructions (those live in API route prompt modules). */
export function formatContextBlock(
  fields: CardAiPromptFields,
  flags: ImagePromptFlags = {},
): string {
  const lines = formatLabeledPrompt(coreContextFields(fields))
  const imageLines: string[] = []
  if (flags.hasPreviousImage) {
    imageLines.push("Previous image: (see image below)")
  }
  if (flags.hasAttachedImage) {
    imageLines.push("Attached image: (see image below)")
  }
  return [lines, ...imageLines].filter(Boolean).join("\n")
}

type ImagePart = { type: "image"; image: string | Uint8Array }
type TextPart = { type: "text"; text: string }

export function buildMultimodalUserMessage(
  text: string,
  options: MultimodalImageOptions = {},
): ModelMessage[] {
  const { previous, attached, leadingText } = options
  const parts: Array<TextPart | ImagePart> = []

  if (previous && attached) {
    if (leadingText) {
      parts.push({ type: "text", text: leadingText })
    }
    parts.push({ type: "text", text: "Previous image:" })
    parts.push({ type: "image", image: previous })
    parts.push({ type: "text", text: "Attached image:" })
    parts.push({ type: "image", image: attached })
    parts.push({ type: "text", text })
  } else if (previous) {
    if (leadingText) {
      parts.push({ type: "text", text: leadingText })
    }
    parts.push({ type: "text", text: "Previous image:" })
    parts.push({ type: "image", image: previous })
    parts.push({ type: "text", text })
  } else if (attached) {
    if (leadingText) {
      parts.push({ type: "text", text: leadingText })
    }
    parts.push({ type: "text", text: "Attached image:" })
    parts.push({ type: "image", image: attached })
    parts.push({ type: "text", text })
  } else {
    return [{ role: "user", content: text }]
  }

  return [{ role: "user", content: parts }]
}
