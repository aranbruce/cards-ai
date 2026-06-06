import { describe, expect, it } from "vitest"
import {
  authPageSearchParamsFromRecord,
  buildAuthPageUrlWithoutOAuth,
} from "@/lib/auth/oauth-return-url"

describe("buildAuthPageUrlWithoutOAuth", () => {
  it("returns a bare auth path when no other params are present", () => {
    const params = new URLSearchParams("oauth=google")
    expect(buildAuthPageUrlWithoutOAuth("/login", params)).toBe("/login")
  })

  it("preserves safe redirect and action params", () => {
    const params = new URLSearchParams(
      "oauth=google&redirect=%2Fdashboard&action=save",
    )
    expect(buildAuthPageUrlWithoutOAuth("/login", params)).toBe(
      "/login?redirect=%2Fdashboard&action=save",
    )
  })

  it("sanitizes unsafe redirect values", () => {
    const params = new URLSearchParams(
      "oauth=github&redirect=https%3A%2F%2Fevil.com",
    )
    expect(buildAuthPageUrlWithoutOAuth("/sign-up", params)).toBe(
      "/sign-up?redirect=%2Fdashboard",
    )
  })

  it("reads server-style search param records", () => {
    const params = authPageSearchParamsFromRecord({
      oauth: "google",
      redirect: "/create",
      action: ["save", "ignored"],
    })
    expect(buildAuthPageUrlWithoutOAuth("/login", params)).toBe(
      "/login?redirect=%2Fcreate&action=save",
    )
  })
})
