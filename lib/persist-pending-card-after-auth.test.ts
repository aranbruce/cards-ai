// @vitest-environment happy-dom
import { beforeEach, describe, expect, it, vi } from "vitest"

import { apiPost } from "@/lib/api-client"
import { savePendingCard, type PendingCard } from "@/lib/pending-card-storage"

import {
  persistPendingCardAfterAuth,
  pendingCardToCreatePayload,
  waitForSession,
} from "./persist-pending-card-after-auth"

vi.mock("@/lib/api-client", () => ({
  ApiError: class ApiError extends Error {
    constructor(
      public readonly status: number,
      message: string,
    ) {
      super(message)
      this.name = "ApiError"
    }
  },
  apiPost: vi.fn(),
}))

const validCard: PendingCard = {
  cardType: "birthday",
  recipientName: "Alice",
  senderName: "Bob",
  copyHeadline: "Happy Birthday!",
  copyMessage: "",
  imageUrl: "https://example.com/image.png",
  extraPages: 0,
}

const mockSupabase = (sessions: Array<{ user: { id: string } } | null>) => {
  let call = 0
  return {
    auth: {
      getSession: vi.fn(async () => {
        const session = sessions[Math.min(call, sessions.length - 1)] ?? null
        call++
        return { data: { session }, error: null }
      }),
    },
  }
}

beforeEach(() => {
  localStorage.clear()
  vi.clearAllMocks()
})

describe("pendingCardToCreatePayload", () => {
  it("maps pending card fields to API body", () => {
    expect(pendingCardToCreatePayload(validCard)).toEqual({
      cardType: "birthday",
      recipientName: "Alice",
      recipientEmail: "",
      senderName: "Bob",
      copyHeadline: "Happy Birthday!",
      imageUrl: "https://example.com/image.png",
      extraPages: 0,
    })
  })
})

describe("waitForSession", () => {
  it("returns true when session is available on first attempt", async () => {
    const supabase = mockSupabase([{ user: { id: "u1" } }])
    await expect(
      waitForSession(supabase as never, { maxAttempts: 3, delayMs: 1 }),
    ).resolves.toBe(true)
  })

  it("returns false when session never appears", async () => {
    const supabase = mockSupabase([null, null, null])
    await expect(
      waitForSession(supabase as never, { maxAttempts: 3, delayMs: 1 }),
    ).resolves.toBe(false)
  })
})

describe("persistPendingCardAfterAuth", () => {
  it("returns none when no pending card", async () => {
    const supabase = mockSupabase([{ user: { id: "u1" } }])
    const result = await persistPendingCardAfterAuth(supabase as never)
    expect(result).toEqual({ ok: false, reason: "none" })
  })

  it("persists card and clears storage on success", async () => {
    savePendingCard(validCard)
    vi.mocked(apiPost).mockResolvedValue({ card: { id: "card-1" } })

    const supabase = mockSupabase([{ user: { id: "u1" } }])
    const result = await persistPendingCardAfterAuth(supabase as never)

    expect(result).toEqual({ ok: true, cardId: "card-1" })
    expect(apiPost).toHaveBeenCalledWith(
      "/api/cards",
      pendingCardToCreatePayload(validCard),
    )
    expect(localStorage.getItem("pendingCard")).toBeNull()
  })

  it("returns error without clearing storage when API fails", async () => {
    savePendingCard(validCard)
    vi.mocked(apiPost).mockRejectedValue(new Error("Unauthorized"))

    const supabase = mockSupabase([{ user: { id: "u1" } }])
    const result = await persistPendingCardAfterAuth(supabase as never)

    expect(result).toEqual({
      ok: false,
      reason: "error",
      error: "Unauthorized",
    })
    expect(localStorage.getItem("pendingCard")).not.toBeNull()
  })

  it("returns session_timeout when session is not ready", async () => {
    savePendingCard(validCard)
    const supabase = mockSupabase([null, null, null])
    const result = await persistPendingCardAfterAuth(supabase as never)

    expect(result).toEqual({ ok: false, reason: "session_timeout" })
    expect(apiPost).not.toHaveBeenCalled()
  })
})
