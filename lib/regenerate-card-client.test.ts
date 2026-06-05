import { beforeEach, describe, expect, it, vi } from "vitest"
import {
  regenerateCardHeadline,
  regenerateCardImage,
} from "./regenerate-card-client"

vi.mock("@/lib/api-client", () => ({
  apiPost: vi.fn(),
}))

vi.mock("posthog-js", () => ({
  default: { capture: vi.fn() },
}))

describe("regenerateCardHeadline", () => {
  it("returns trimmed headline and captures analytics", async () => {
    const { apiPost } = await import("@/lib/api-client")
    const posthog = (await import("posthog-js")).default

    vi.mocked(apiPost).mockResolvedValue({ text: '  "Hello"  ' })

    const headline = await regenerateCardHeadline({
      page: "dashboard",
      cardType: "birthday",
      recipientName: "Sam",
      cardTitle: "Old",
      coverImageUrl: "https://example.com/cover.png",
      userPrompt: "funnier",
      cardId: "card-1",
    })

    expect(headline).toBe('"Hello"')
    expect(posthog.capture).toHaveBeenCalledWith("card_headline_regenerated", {
      card_type: "birthday",
      page: "dashboard",
      card_id: "card-1",
    })
  })
})

describe("regenerateCardImage", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("reports has_prompt false for whitespace-only prompts (not sent to API)", async () => {
    const { apiPost } = await import("@/lib/api-client")
    const posthog = (await import("posthog-js")).default

    vi.mocked(apiPost).mockResolvedValue({
      imageUrl: "https://cdn.example/a.png",
    })

    await regenerateCardImage({
      page: "create",
      cardType: "birthday",
      recipientName: "Sam",
      coverHeadline: "Hi",
      coverImageUrl: "https://example.com/cover.png",
      userPrompt: "   ",
    })

    const requestBody = vi.mocked(apiPost).mock.calls[0]?.[1] as {
      userPrompt?: string
    }
    expect(requestBody.userPrompt).toBeUndefined()

    expect(posthog.capture).toHaveBeenCalledWith("card_image_regenerated", {
      card_type: "birthday",
      page: "create",
      has_prompt: false,
      has_attached_image: false,
      image_updated: true,
    })
  })

  it("reports has_prompt true when trimmed prompt is sent to API", async () => {
    const { apiPost } = await import("@/lib/api-client")
    const posthog = (await import("posthog-js")).default

    vi.mocked(apiPost).mockResolvedValue({
      imageUrl: "https://cdn.example/a.png",
    })

    await regenerateCardImage({
      page: "create",
      cardType: "birthday",
      recipientName: "Sam",
      coverHeadline: "Hi",
      coverImageUrl: "https://example.com/cover.png",
      userPrompt: "  brighter  ",
    })

    const requestBody = vi.mocked(apiPost).mock.calls[0]?.[1] as {
      userPrompt?: string
    }
    expect(requestBody.userPrompt).toBe("brighter")

    expect(posthog.capture).toHaveBeenCalledWith("card_image_regenerated", {
      card_type: "birthday",
      page: "create",
      has_prompt: true,
      has_attached_image: false,
      image_updated: true,
    })
  })

  it("reports has_prompt false when prompt is empty", async () => {
    const { apiPost } = await import("@/lib/api-client")
    const posthog = (await import("posthog-js")).default

    vi.mocked(apiPost).mockResolvedValue({})

    await regenerateCardImage({
      page: "dashboard",
      cardType: "custom",
      recipientName: "Sam",
      coverHeadline: "Hi",
      coverImageUrl: "",
      userPrompt: "",
      cardId: "card-2",
    })

    expect(posthog.capture).toHaveBeenCalledWith("card_image_regenerated", {
      card_type: "custom",
      page: "dashboard",
      has_prompt: false,
      has_attached_image: false,
      image_updated: false,
      card_id: "card-2",
    })
  })
})
