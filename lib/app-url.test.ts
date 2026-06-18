import { afterAll, afterEach, describe, expect, it, vi } from "vitest"
import { getAppUrl } from "./app-url"

const originalNextPublicAppUrl = process.env.NEXT_PUBLIC_APP_URL
const originalVercelProjectProductionUrl =
  process.env.VERCEL_PROJECT_PRODUCTION_URL
const originalVercelUrl = process.env.VERCEL_URL
const originalVercelEnv = process.env.VERCEL_ENV

const consoleInfoSpy = vi.spyOn(console, "info").mockImplementation(() => {})

afterEach(() => {
  delete process.env.NEXT_PUBLIC_APP_URL
  delete process.env.VERCEL_PROJECT_PRODUCTION_URL
  delete process.env.VERCEL_URL
  delete process.env.VERCEL_ENV
})

afterAll(() => {
  if (originalNextPublicAppUrl === undefined) {
    delete process.env.NEXT_PUBLIC_APP_URL
  } else {
    process.env.NEXT_PUBLIC_APP_URL = originalNextPublicAppUrl
  }

  if (originalVercelProjectProductionUrl === undefined) {
    delete process.env.VERCEL_PROJECT_PRODUCTION_URL
  } else {
    process.env.VERCEL_PROJECT_PRODUCTION_URL = originalVercelProjectProductionUrl
  }

  if (originalVercelUrl === undefined) {
    delete process.env.VERCEL_URL
  } else {
    process.env.VERCEL_URL = originalVercelUrl
  }

  if (originalVercelEnv === undefined) {
    delete process.env.VERCEL_ENV
  } else {
    process.env.VERCEL_ENV = originalVercelEnv
  }

  consoleInfoSpy.mockRestore()
})

describe("getAppUrl", () => {
  it("uses NEXT_PUBLIC_APP_URL first and strips trailing slash", () => {
    process.env.NEXT_PUBLIC_APP_URL = "https://www.cardshare.ai/"
    process.env.VERCEL_ENV = "preview"
    process.env.VERCEL_URL = "card-share-preview.vercel.app"
    process.env.VERCEL_PROJECT_PRODUCTION_URL = "t.cardshare.ai"

    expect(getAppUrl()).toBe("https://www.cardshare.ai")
  })

  it("uses VERCEL_URL before production URL in preview", () => {
    process.env.VERCEL_ENV = "preview"
    process.env.VERCEL_URL = "card-share-preview.vercel.app"
    process.env.VERCEL_PROJECT_PRODUCTION_URL = "t.cardshare.ai"

    expect(getAppUrl()).toBe("https://card-share-preview.vercel.app")
  })

  it("uses VERCEL_URL before production URL in development", () => {
    process.env.VERCEL_ENV = "development"
    process.env.VERCEL_URL = "card-share-dev.vercel.app"
    process.env.VERCEL_PROJECT_PRODUCTION_URL = "www.cardshare.ai"

    expect(getAppUrl()).toBe("https://card-share-dev.vercel.app")
  })

  it("uses VERCEL_PROJECT_PRODUCTION_URL in production", () => {
    process.env.VERCEL_ENV = "production"
    process.env.VERCEL_URL = "card-share-preview.vercel.app"
    process.env.VERCEL_PROJECT_PRODUCTION_URL = "www.cardshare.ai"

    expect(getAppUrl()).toBe("https://www.cardshare.ai")
  })
})
