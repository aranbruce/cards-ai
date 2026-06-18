import { afterEach, describe, expect, it, vi } from "vitest"
import { getAppUrl } from "./app-url"

afterEach(() => {
  vi.unstubAllEnvs()
})

describe("getAppUrl", () => {
  it("uses NEXT_PUBLIC_APP_URL first and strips trailing slash", () => {
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://www.cardshare.ai/")
    vi.stubEnv("VERCEL_ENV", "preview")
    vi.stubEnv("VERCEL_URL", "card-share-preview.vercel.app")
    vi.stubEnv("VERCEL_PROJECT_PRODUCTION_URL", "t.cardshare.ai")

    expect(getAppUrl()).toBe("https://www.cardshare.ai")
  })

  it("uses VERCEL_URL before production URL in preview", () => {
    vi.stubEnv("VERCEL_ENV", "preview")
    vi.stubEnv("VERCEL_URL", "card-share-preview.vercel.app")
    vi.stubEnv("VERCEL_PROJECT_PRODUCTION_URL", "t.cardshare.ai")

    expect(getAppUrl()).toBe("https://card-share-preview.vercel.app")
  })

  it("uses VERCEL_URL before production URL in development", () => {
    vi.stubEnv("VERCEL_ENV", "development")
    vi.stubEnv("VERCEL_URL", "card-share-dev.vercel.app")
    vi.stubEnv("VERCEL_PROJECT_PRODUCTION_URL", "www.cardshare.ai")

    expect(getAppUrl()).toBe("https://card-share-dev.vercel.app")
  })

  it("uses VERCEL_PROJECT_PRODUCTION_URL in production", () => {
    vi.stubEnv("VERCEL_ENV", "production")
    vi.stubEnv("VERCEL_URL", "card-share-preview.vercel.app")
    vi.stubEnv("VERCEL_PROJECT_PRODUCTION_URL", "www.cardshare.ai")

    expect(getAppUrl()).toBe("https://www.cardshare.ai")
  })
})
