import { z } from "zod"

const pendingCardSchema = z.object({
  cardType: z.string(),
  recipientName: z.string(),
  senderName: z.string(),
  copyHeadline: z.string(),
  copyMessage: z.string().default(""),
  imageUrl: z.string(),
  extraPages: z.number(),
})

export type PendingCard = z.infer<typeof pendingCardSchema>

const KEY = "pendingCard"

export function savePendingCard(card: PendingCard): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(KEY, JSON.stringify(card))
  } catch {
    // QuotaExceededError or private mode — guest draft cannot be restored after auth
  }
}

/** Returns the stored card if present and valid, otherwise null. */
export function loadPendingCard(): PendingCard | null {
  if (typeof window === "undefined") return null
  const raw = localStorage.getItem(KEY)
  if (!raw) return null
  try {
    return pendingCardSchema.parse(JSON.parse(raw))
  } catch {
    localStorage.removeItem(KEY)
    return null
  }
}

export function hasPendingCard(): boolean {
  if (typeof window === "undefined") return false
  return localStorage.getItem(KEY) !== null
}

export function clearPendingCard(): void {
  if (typeof window === "undefined") return
  try {
    localStorage.removeItem(KEY)
  } catch {
    // Storage restricted — card was persisted; stale draft may remain locally
  }
}
