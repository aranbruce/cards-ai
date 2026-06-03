import {
  formatContextBlock,
  type CardAiPromptFields,
} from "./card-ai-prompt"

export const MESSAGE_SYSTEM_PROMPT = `You help write short personal notes for someone signing a group greeting card. Output only the note: plain text, no markdown, no labels, no leading or trailing quotation marks. Keep it warm, personal, and concise.`

const MESSAGE_CREATE_SUFFIX = "Write a short personal note for this card."
const MESSAGE_REGEN_SUFFIX = `Rewrite the note based on the user's request.`

export function assembleMessageUserPrompt(fields: CardAiPromptFields): string {
  const context = formatContextBlock(fields)
  const suffix =
    fields.userPrompt?.trim() || fields.previousUserMessage?.trim()
      ? MESSAGE_REGEN_SUFFIX
      : MESSAGE_CREATE_SUFFIX
  return `${context}\n\n${suffix}`
}
