// @vitest-environment happy-dom
import { beforeEach, describe, expect, it, vi } from "vitest"

import {
  clearPendingCard,
  hasPendingCard,
  loadPendingCard,
  savePendingCard,
  type PendingCard,
} from "./pending-card-storage"

const validCard: PendingCard = {
  cardType: "birthday",
  recipientName: "Alice",
  senderName: "Bob",
  copyHeadline: "Happy Birthday!",
  copyMessage: "Wishing you all the best.",
  imageUrl: "https://example.com/image.png",
  extraPages: 0,
}

beforeEach(() => {
  localStorage.clear()
})

describe("savePendingCard / loadPendingCard", () => {
  it("round-trips a valid card", () => {
    savePendingCard(validCard)
    expect(loadPendingCard()).toEqual(validCard)
  })

  it("returns null when nothing is stored", () => {
    expect(loadPendingCard()).toBeNull()
  })

  it("returns null and clears storage for invalid JSON", () => {
    localStorage.setItem("pendingCard", "not-json{{{")
    expect(loadPendingCard()).toBeNull()
    expect(localStorage.getItem("pendingCard")).toBeNull()
  })

  it("accepts stored cards without copyMessage", () => {
    const withoutMessage = { ...validCard }
    delete (withoutMessage as { copyMessage?: string }).copyMessage
    localStorage.setItem("pendingCard", JSON.stringify(withoutMessage))
    expect(loadPendingCard()).toEqual({ ...withoutMessage, copyMessage: "" })
  })

  it("returns null and clears storage when schema validation fails", () => {
    localStorage.setItem(
      "pendingCard",
      JSON.stringify({ ...validCard, extraPages: "not-a-number" }),
    )
    expect(loadPendingCard()).toBeNull()
    expect(localStorage.getItem("pendingCard")).toBeNull()
  })
})

describe("hasPendingCard", () => {
  it("returns false when nothing is stored", () => {
    expect(hasPendingCard()).toBe(false)
  })

  it("returns true after saving a card", () => {
    savePendingCard(validCard)
    expect(hasPendingCard()).toBe(true)
  })
})

describe("clearPendingCard", () => {
  it("removes the stored card so load returns null and has returns false", () => {
    savePendingCard(validCard)
    clearPendingCard()
    expect(hasPendingCard()).toBe(false)
    expect(loadPendingCard()).toBeNull()
  })

  it("does not throw when localStorage.removeItem fails", () => {
    savePendingCard(validCard)
    const removeItemSpy = vi
      .spyOn(Storage.prototype, "removeItem")
      .mockImplementation(() => {
        throw new Error("Storage disabled")
      })
    try {
      expect(() => clearPendingCard()).not.toThrow()
    } finally {
      removeItemSpy.mockRestore()
    }
  })
})

describe("storage access failures", () => {
  it("hasPendingCard and loadPendingCard return false/null when getItem throws", () => {
    const getItemSpy = vi
      .spyOn(Storage.prototype, "getItem")
      .mockImplementation(() => {
        throw new Error("Storage disabled")
      })
    try {
      expect(hasPendingCard()).toBe(false)
      expect(loadPendingCard()).toBeNull()
    } finally {
      getItemSpy.mockRestore()
    }
  })
})
