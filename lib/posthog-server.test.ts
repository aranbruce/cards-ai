import { afterEach, describe, expect, it, vi } from "vitest"

const { mockCapture, mockFlush } = vi.hoisted(() => ({
  mockCapture: vi.fn(),
  mockFlush: vi.fn().mockResolvedValue(undefined),
}))

vi.mock("posthog-node", () => ({
  PostHog: vi.fn().mockImplementation(() => ({
    capture: mockCapture,
    flush: mockFlush,
  })),
}))

import { captureServerEvent, normalizePostHogDistinctId } from "./posthog-server"

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
    vi.restoreAllMocks()
  })

  it("does not throw when flush fails", async () => {
    mockFlush.mockRejectedValue(new Error("network error"))
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})

    await expect(
      captureServerEvent("user-1", "card_created", { card_id: "abc" }),
    ).resolves.toBeUndefined()

    expect(mockCapture).toHaveBeenCalledWith({
      distinctId: "user-1",
      event: "card_created",
      properties: { card_id: "abc" },
    })
    expect(consoleSpy).toHaveBeenCalledWith(
      "[posthog] Failed to capture server event:",
      "card_created",
      expect.any(Error),
    )
  })
})
