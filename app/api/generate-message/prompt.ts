import {
  formatContextBlock,
  type CardAiPromptFields,
} from "@/lib/card-ai-prompt"

export const MESSAGE_SYSTEM_PROMPT = `You help write short personal notes for someone signing a group greeting card. Output only the note: plain text, no markdown, no labels, no leading or trailing quotation marks. Keep it warm, personal, and concise.`

const REGEN_SUFFIX = `Rewrite the note based on the user's request.`

export function assembleMessageUserPrompt(fields: CardAiPromptFields): string {
  const context = formatContextBlock(fields)
  return `${context}\n\n${REGEN_SUFFIX}`
}
