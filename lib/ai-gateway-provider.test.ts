import { afterEach, describe, expect, it, vi } from "vitest"
import {
  AI_GATEWAY_APP_TITLE,
  getAiGatewayAttributionHeaders,
  registerAiGatewayProvider,
} from "./ai-gateway-provider"

describe("getAiGatewayAttributionHeaders", () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it("uses NEXT_PUBLIC_APP_URL as http-referer and CardShareAI as x-title", () => {
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://cardshare.ai")

    expect(getAiGatewayAttributionHeaders()).toEqual({
      "http-referer": "https://cardshare.ai",
      "x-title": AI_GATEWAY_APP_TITLE,
    })
  })

  it("strips trailing slash from app URL", () => {
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://cardshare.ai/")

    expect(getAiGatewayAttributionHeaders()["http-referer"]).toBe(
      "https://cardshare.ai",
    )
  })
})

describe("registerAiGatewayProvider", () => {
  it("sets the AI SDK default gateway provider once", () => {
    const original = globalThis.AI_SDK_DEFAULT_PROVIDER
    try {
      registerAiGatewayProvider()
      const first = globalThis.AI_SDK_DEFAULT_PROVIDER
      expect(first).toBeDefined()

      registerAiGatewayProvider()
      expect(globalThis.AI_SDK_DEFAULT_PROVIDER).toBe(first)
    } finally {
      globalThis.AI_SDK_DEFAULT_PROVIDER = original
    }
  })
})
