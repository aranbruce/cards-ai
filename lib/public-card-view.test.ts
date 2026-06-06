import { beforeEach, describe, expect, it, vi } from "vitest"

const LINK_ID = "550e8400-e29b-41d4-a716-446655440000"

const CARD = {
  id: "card-1",
  sent_at: null,
  recipient_name: "Sam",
  sender_name: "Team",
  copy_headline: "Happy birthday",
  copy_message: "Wishing you the best",
  image_url: "https://example.com/cover.jpg",
  extra_pages: 0,
}

vi.mock("@/lib/supabase/admin", () => ({
  requireServiceRoleClient: vi.fn(),
}))

import { requireServiceRoleClient } from "@/lib/supabase/admin"
import { getPublicCardByLinkId } from "./public-card-view"

function mockSupabase(handlers: {
  cardSelect?: () => unknown
  contributionsSelect?: () => unknown
}) {
  const from = vi.fn((table: string) => {
    if (table === "cards") {
      const chain = {
        select: vi.fn(() => chain),
        eq: vi.fn(() => chain),
        maybeSingle: vi.fn(() => handlers.cardSelect?.()),
      }
      return chain
    }
    if (table === "card_contributions") {
      const chain = {
        select: vi.fn(() => chain),
        eq: vi.fn(() => chain),
        order: vi.fn(() => handlers.contributionsSelect?.()),
      }
      return chain
    }
    throw new Error(`unexpected table ${table}`)
  })
  return { from }
}

describe("getPublicCardByLinkId", () => {
  beforeEach(() => {
    vi.mocked(requireServiceRoleClient).mockReset()
  })

  it("returns null for non-UUID link ids", async () => {
    await expect(getPublicCardByLinkId("not-a-uuid")).resolves.toBeNull()
    expect(requireServiceRoleClient).not.toHaveBeenCalled()
  })

  it("returns null when the card is missing", async () => {
    vi.mocked(requireServiceRoleClient).mockReturnValue(
      mockSupabase({
        cardSelect: () => ({ data: null, error: null }),
      }) as never,
    )

    await expect(getPublicCardByLinkId(LINK_ID)).resolves.toBeNull()
  })

  it("throws when the card query fails", async () => {
    vi.mocked(requireServiceRoleClient).mockReturnValue(
      mockSupabase({
        cardSelect: () => ({
          data: null,
          error: { message: "db down" },
        }),
      }) as never,
    )

    await expect(getPublicCardByLinkId(LINK_ID)).rejects.toThrow(
      "Failed to fetch card",
    )
  })

  it("returns empty contributions when the contributions query fails", async () => {
    vi.mocked(requireServiceRoleClient).mockReturnValue(
      mockSupabase({
        cardSelect: () => ({ data: CARD, error: null }),
        contributionsSelect: () => ({
          data: null,
          error: { message: "contrib error" },
        }),
      }) as never,
    )

    await expect(getPublicCardByLinkId(LINK_ID)).resolves.toEqual({
      card: CARD,
      contributions: [],
    })
  })

  it("returns the card and contributions on success", async () => {
    const contributions = [
      {
        id: "c1",
        card_id: CARD.id,
        contributor_name: "Alex",
        message: "Congrats!",
      },
    ]

    vi.mocked(requireServiceRoleClient).mockReturnValue(
      mockSupabase({
        cardSelect: () => ({ data: CARD, error: null }),
        contributionsSelect: () => ({ data: contributions, error: null }),
      }) as never,
    )

    await expect(getPublicCardByLinkId(LINK_ID)).resolves.toEqual({
      card: CARD,
      contributions,
    })
  })
})
