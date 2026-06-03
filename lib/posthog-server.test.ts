import { afterEach, describe, expect, it, vi } from "vitest"

const { mockCapture, mockFlush } = vi.hoisted(() => ({
  mockCapture: vi.fn(),
  mockFlush: vi.fn().mockResolvedValue(undefined),
}))

vi.mock("next/server", () => ({
  after: (fn: () => void | Promise<void>) => fn(),
}))

vi.mock("posthog-node", () => ({
  PostHog: vi.fn(
    class MockPostHog {
      capture = mockCapture
      flush = mockFlush
    },
  ),
}))

import {
  captureServerEvent,
  normalizePostHogDistinctId,
  resetPostHogClientForTests,
} from "./posthog-server"

describe("normalizePostHogDistinctId", () => {
  it("accepts non-empty strings", () => {
    expect(
      normalizePostHogDistinctId("019e7f6d-0c6d-785d-b752-08bcb0fb9ed7"),
    ).toBe("019e7f6d-0c6d-785d-b752-08bcb0fb9ed7")
  })

  it("rejects empty and invalid values", () => {
    expect(normalizePostHogDistinctId("")).toBeNull()
    expect(normalizePostHogDistinctId("   ")).toBeNull()
    expect(normalizePostHogDistinctId(null)).toBeNull()
    expect(normalizePostHogDistinctId("a".repeat(201))).toBeNull()
  })
})

describe("captureServerEvent", () => {
  afterEach(() => {
    mockCapture.mockClear()
    mockFlush.mockReset()
    mockFlush.mockResolvedValue(undefined)
    resetPostHogClientForTests()
    vi.unstubAllEnvs()
  })

  it("no-ops when project token is missing", () => {
    vi.stubEnv("NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN", "")

    captureServerEvent("user-1", "card_created", { card_id: "abc" })

    expect(mockCapture).not.toHaveBeenCalled()
    expect(mockFlush).not.toHaveBeenCalled()
  })

  it("does not throw when flush fails", async () => {
    vi.stubEnv("NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN", "phc_test")
    mockFlush.mockRejectedValue(new Error("network error"))
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})

    captureServerEvent("user-1", "card_created", { card_id: "abc" })
    await Promise.resolve()

    expect(mockCapture).toHaveBeenCalledWith({
      distinctId: "user-1",
      event: "card_created",
      properties: { card_id: "abc" },
    })
    expect(consoleSpy).toHaveBeenCalledWith(
      "[posthog] Failed to flush server event:",
      "card_created",
      expect.any(Error),
    )
    consoleSpy.mockRestore()
  })
})
