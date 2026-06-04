export function normalizePostHogDistinctId(value: unknown): string | null {
  if (typeof value !== "string") return null
  const trimmed = value.trim()
  if (trimmed.length === 0 || trimmed.length > 200) return null
  return trimmed
}
