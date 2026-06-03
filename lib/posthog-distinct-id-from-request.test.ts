import { describe, expect, it } from "vitest"
import { NextRequest } from "next/server"
import { getDistinctIdFromRequest } from "./posthog-distinct-id-from-request"

describe("getDistinctIdFromRequest", () => {
  it("prefers X-POSTHOG-DISTINCT-ID header over body", () => {
    const request = new NextRequest("http://localhost/api/generate-message", {
      headers: { "X-POSTHOG-DISTINCT-ID": "from-header" },
    })

    expect(
      getDistinctIdFromRequest(request, {
        posthogDistinctId: "from-body",
      }),
    ).toBe("from-header")
  })

  it("falls back to posthogDistinctId in body", () => {
    const request = new NextRequest("http://localhost/api/generate-message")

    expect(
      getDistinctIdFromRequest(request, {
        posthogDistinctId: "from-body",
      }),
    ).toBe("from-body")
  })

  it("returns null when neither header nor body is valid", () => {
    const request = new NextRequest("http://localhost/api/generate-message")

    expect(getDistinctIdFromRequest(request)).toBeNull()
    expect(
      getDistinctIdFromRequest(request, { posthogDistinctId: "" }),
    ).toBeNull()
  })
})
