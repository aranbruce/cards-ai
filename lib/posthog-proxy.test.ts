import { describe, expect, it } from "vitest"
import { NextRequest } from "next/server"
import { tryPostHogProxy } from "./posthog-proxy"

describe("tryPostHogProxy", () => {
  it("rewrites /t/static paths to eu-assets", () => {
    const request = new NextRequest(
      "http://localhost:3000/t/static/web-vitals.js?v=1",
    )
    const response = tryPostHogProxy(request)
    expect(response).not.toBeNull()
    expect(response?.headers.get("x-middleware-rewrite")).toContain(
      "eu-assets.i.posthog.com/static/web-vitals.js",
    )
  })

  it("rewrites /t/e to eu api host", () => {
    const request = new NextRequest("http://localhost:3000/t/e/")
    const response = tryPostHogProxy(request)
    expect(response?.headers.get("x-middleware-rewrite")).toContain(
      "eu.i.posthog.com/e/",
    )
  })

  it("ignores unrelated app routes", () => {
    const request = new NextRequest("http://localhost:3000/dashboard")
    expect(tryPostHogProxy(request)).toBeNull()
  })
})
