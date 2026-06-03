import {
  formatContextBlock,
  type CardAiPromptFields,
  type ImagePromptFlags,
} from "./card-ai-prompt"

export const HEADLINE_SYSTEM_PROMPT = `You are a creative greeting card writer. Generate a single punchy headline for the greeting card described in the user's message.

Use the labeled context fields (tone, card type, addressed to, optional user prompt, card title, previous user message, and any images) to guide the headline.

Output only the headline — plain text, no surrounding quotation marks, no labels like "Headline:".`

const HEADLINE_CREATE_SUFFIX = "Write a headline for this card."
const HEADLINE_REGEN_SUFFIX =
  "Based on the user's request, write a new headline."

export function assembleHeadlineUserPrompt(
  fields: CardAiPromptFields,
  flags: ImagePromptFlags = {},
): string {
  const context = formatContextBlock(fields, flags)
  const suffix =
    fields.userPrompt?.trim() || fields.cardTitle?.trim()
      ? HEADLINE_REGEN_SUFFIX
      : HEADLINE_CREATE_SUFFIX
  return `${context}\n\n${suffix}`
}
