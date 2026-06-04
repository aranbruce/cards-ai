import {
  isAuthSessionMissingError,
  type SupabaseClient,
  type User,
} from "@supabase/supabase-js"

import { ApiError, apiPost } from "@/lib/api-client"
import {
  clearPendingCard,
  loadPendingCard,
  type PendingCard,
} from "@/lib/pending-card-storage"

export type PersistPendingCardResult =
  | { ok: true; cardId: string }
  | { ok: false; reason: "none" }
  | { ok: false; reason: "session_timeout" }
  | { ok: false; reason: "error"; error: string }

export function pendingCardToCreatePayload(card: PendingCard) {
  return {
    cardType: card.cardType,
    recipientName: card.recipientName,
    recipientEmail: "",
    senderName: card.senderName,
    copyHeadline: card.copyHeadline,
    imageUrl: card.imageUrl,
    extraPages: card.extraPages,
  }
}

export const AUTH_SESSION_NOT_READY_MESSAGE =
  "We couldn't finish signing you in yet. Please refresh the page or try again."

/** Poll until OAuth callback cookies are visible to the browser client. */
export async function waitForSession(
  supabase: SupabaseClient,
  options?: { maxAttempts?: number; delayMs?: number },
): Promise<boolean> {
  const maxAttempts = options?.maxAttempts ?? 8
  const delayMs = options?.delayMs ?? 150

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (session?.user) return true
    if (attempt < maxAttempts - 1) {
      await new Promise((resolve) => setTimeout(resolve, delayMs))
    }
  }
  return false
}

export type WaitForAuthUserResult =
  | { ok: true; user: User }
  | { ok: false; reason: "session_missing" }
  | { ok: false; reason: "error"; error: string }

/** Poll until `getUser()` succeeds after an OAuth redirect. */
export async function waitForAuthUser(
  supabase: SupabaseClient,
  options?: { maxAttempts?: number; delayMs?: number },
): Promise<WaitForAuthUserResult> {
  const maxAttempts = options?.maxAttempts ?? 8
  const delayMs = options?.delayMs ?? 150

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()
    if (user) return { ok: true, user }
    if (error && !isAuthSessionMissingError(error)) {
      return {
        ok: false,
        reason: "error",
        error: error.message || "Could not complete sign-in.",
      }
    }
    if (attempt < maxAttempts - 1) {
      await new Promise((resolve) => setTimeout(resolve, delayMs))
    }
  }
  return { ok: false, reason: "session_missing" }
}

export function persistPendingCardErrorMessage(
  result: Extract<PersistPendingCardResult, { ok: false }>,
): string {
  if (result.reason === "session_timeout") {
    return "You're signed in, but we couldn't save your card yet. Please try again."
  }
  if (result.reason === "error") {
    return result.error
  }
  return "Failed to save your card."
}

export async function persistPendingCardAfterAuth(
  supabase: SupabaseClient,
): Promise<PersistPendingCardResult> {
  const cardData = loadPendingCard()
  if (!cardData) return { ok: false, reason: "none" }

  const hasSession = await waitForSession(supabase)
  if (!hasSession) {
    return { ok: false, reason: "session_timeout" }
  }

  try {
    const { card } = await apiPost<{ card: { id: string } }>(
      "/api/cards",
      pendingCardToCreatePayload(cardData),
    )
    clearPendingCard()
    return { ok: true, cardId: card.id }
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) {
      return { ok: false, reason: "session_timeout" }
    }
    const message =
      err instanceof ApiError
        ? err.message
        : err instanceof Error
          ? err.message
          : "Failed to save card"
    return { ok: false, reason: "error", error: message }
  }
}
