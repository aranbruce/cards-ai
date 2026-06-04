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

function readPendingCardRaw(): string | null {
  if (typeof window === "undefined") return null
  try {
    return localStorage.getItem(KEY)
  } catch {
    return null
  }
}

/** Returns the stored card if present and valid, otherwise null. */
export function loadPendingCard(): PendingCard | null {
  const raw = readPendingCardRaw()
  if (!raw) return null
  try {
    return pendingCardSchema.parse(JSON.parse(raw))
  } catch {
    clearPendingCard()
    return null
  }
}

export function hasPendingCard(): boolean {
  return readPendingCardRaw() !== null
}

export function clearPendingCard(): void {
  if (typeof window === "undefined") return
  try {
    localStorage.removeItem(KEY)
  } catch {
    // Storage restricted — card was persisted; stale draft may remain locally
  }
}
