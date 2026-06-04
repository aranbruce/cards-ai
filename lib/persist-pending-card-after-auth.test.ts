// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { AuthSessionMissingError } from "@supabase/supabase-js"

import { ApiError, apiPost } from "@/lib/api-client"
import { savePendingCard, type PendingCard } from "@/lib/pending-card-storage"

import {
  persistPendingCardAfterAuth,
  persistPendingCardErrorMessage,
  pendingCardToCreatePayload,
  waitForAuthUser,
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

const mockSupabase = (
  outcomes: Array<{ user: { id: string } } | null | { error: Error }>,
) => {
  let call = 0
  return {
    auth: {
      getSession: vi.fn(async () => {
        const outcome = outcomes[Math.min(call, outcomes.length - 1)] ?? null
        call++
        if (outcome && "error" in outcome) {
          return { data: { session: null }, error: outcome.error }
        }
        const session = outcome ? { user: outcome.user } : null
        return { data: { session }, error: null }
      }),
    },
  }
}

const mockSupabaseGetUser = (
  outcomes: Array<
    | { user: { id: string; email?: string } | null; error?: Error | null }
    | "missing"
  >,
) => {
  let call = 0
  return {
    auth: {
      getUser: vi.fn(async () => {
        const outcome = outcomes[Math.min(call, outcomes.length - 1)] ?? {
          user: null,
        }
        call++
        if (outcome === "missing") {
          return {
            data: { user: null },
            error: new AuthSessionMissingError(),
          }
        }
        return {
          data: { user: outcome.user },
          error: outcome.error ?? null,
        }
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
  it("returns ok when session is available on first attempt", async () => {
    const supabase = mockSupabase([{ user: { id: "u1" } }])
    await expect(
      waitForSession(supabase as never, { maxAttempts: 3, delayMs: 1 }),
    ).resolves.toEqual({ ok: true })
  })

  it("returns session_missing when session never appears", async () => {
    const supabase = mockSupabase([null, null, null])
    await expect(
      waitForSession(supabase as never, { maxAttempts: 3, delayMs: 1 }),
    ).resolves.toEqual({ ok: false, reason: "session_missing" })
  })

  it("returns error immediately on non-retryable session errors", async () => {
    const supabase = mockSupabase([{ error: new Error("Invalid refresh token") }])
    await expect(
      waitForSession(supabase as never, { maxAttempts: 3, delayMs: 1 }),
    ).resolves.toEqual({
      ok: false,
      reason: "error",
      error: "Invalid refresh token",
    })
    expect(supabase.auth.getSession).toHaveBeenCalledTimes(1)
  })
})

describe("waitForAuthUser", () => {
  it("returns user when available on first attempt", async () => {
    const supabase = mockSupabaseGetUser([{ user: { id: "u1" } }])
    await expect(
      waitForAuthUser(supabase as never, { maxAttempts: 3, delayMs: 1 }),
    ).resolves.toEqual({ ok: true, user: { id: "u1" } })
  })

  it("retries after AuthSessionMissingError then returns user", async () => {
    const supabase = mockSupabaseGetUser([
      "missing",
      "missing",
      { user: { id: "u1" } },
    ])
    await expect(
      waitForAuthUser(supabase as never, { maxAttempts: 4, delayMs: 1 }),
    ).resolves.toEqual({ ok: true, user: { id: "u1" } })
    expect(supabase.auth.getUser).toHaveBeenCalledTimes(3)
  })

  it("returns session_missing when session never appears", async () => {
    const supabase = mockSupabaseGetUser(["missing", "missing", "missing"])
    await expect(
      waitForAuthUser(supabase as never, { maxAttempts: 3, delayMs: 1 }),
    ).resolves.toEqual({ ok: false, reason: "session_missing" })
  })

  it("returns error immediately on non-retryable auth errors", async () => {
    const supabase = mockSupabaseGetUser([
      { user: null, error: new Error("Invalid JWT") },
    ])
    await expect(
      waitForAuthUser(supabase as never, { maxAttempts: 3, delayMs: 1 }),
    ).resolves.toEqual({
      ok: false,
      reason: "error",
      error: "Invalid JWT",
    })
    expect(supabase.auth.getUser).toHaveBeenCalledTimes(1)
  })
})

describe("persistPendingCardErrorMessage", () => {
  it("returns friendly copy for session_timeout", () => {
    expect(
      persistPendingCardErrorMessage({ ok: false, reason: "session_timeout" }),
    ).toBe(
      "You're signed in, but we couldn't save your card yet. Please try again.",
    )
  })

  it("returns API error text for error reason", () => {
    expect(
      persistPendingCardErrorMessage({
        ok: false,
        reason: "error",
        error: "Bad request",
      }),
    ).toBe("Bad request")
  })

  it("returns generic fallback for none", () => {
    expect(persistPendingCardErrorMessage({ ok: false, reason: "none" })).toBe(
      "Failed to save your card.",
    )
  })
})

describe("persistPendingCardAfterAuth", () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

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

  it("returns success when localStorage cleanup fails after API success", async () => {
    savePendingCard(validCard)
    vi.mocked(apiPost).mockResolvedValue({ card: { id: "card-1" } })
    const removeItemSpy = vi
      .spyOn(Storage.prototype, "removeItem")
      .mockImplementation(() => {
        throw new Error("Storage disabled")
      })

    try {
      const supabase = mockSupabase([{ user: { id: "u1" } }])
      const result = await persistPendingCardAfterAuth(supabase as never)
      expect(result).toEqual({ ok: true, cardId: "card-1" })
    } finally {
      removeItemSpy.mockRestore()
    }
  })

  it("returns session_timeout when API responds with 401", async () => {
    savePendingCard(validCard)
    vi.mocked(apiPost).mockRejectedValue(new ApiError(401, "Unauthorized"))

    const supabase = mockSupabase([{ user: { id: "u1" } }])
    const result = await persistPendingCardAfterAuth(supabase as never)

    expect(result).toEqual({ ok: false, reason: "session_timeout" })
    expect(localStorage.getItem("pendingCard")).not.toBeNull()
  })

  it("returns error without clearing storage when API fails with other status", async () => {
    savePendingCard(validCard)
    vi.mocked(apiPost).mockRejectedValue(new ApiError(500, "Server error"))

    const supabase = mockSupabase([{ user: { id: "u1" } }])
    const result = await persistPendingCardAfterAuth(supabase as never)

    expect(result).toEqual({
      ok: false,
      reason: "error",
      error: "Server error",
    })
    expect(localStorage.getItem("pendingCard")).not.toBeNull()
  })

  it("returns session_timeout when session is not ready", async () => {
    savePendingCard(validCard)
    const supabase = mockSupabase([null, null, null])
    const resultPromise = persistPendingCardAfterAuth(supabase as never)
    await vi.runAllTimersAsync()
    const result = await resultPromise

    expect(result).toEqual({ ok: false, reason: "session_timeout" })
    expect(apiPost).not.toHaveBeenCalled()
  })

  it("returns error when getSession fails with a non-retryable error", async () => {
    savePendingCard(validCard)
    const supabase = mockSupabase([{ error: new Error("Invalid refresh token") }])
    const result = await persistPendingCardAfterAuth(supabase as never)

    expect(result).toEqual({
      ok: false,
      reason: "error",
      error: "Invalid refresh token",
    })
    expect(apiPost).not.toHaveBeenCalled()
  })
})
