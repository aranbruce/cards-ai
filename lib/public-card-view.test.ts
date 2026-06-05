import { describe, expect, it } from "vitest"
import { getPublicCardByLinkId } from "./public-card-view"

describe("getPublicCardByLinkId", () => {
  it("returns null for non-UUID link ids", async () => {
    await expect(getPublicCardByLinkId("not-a-uuid")).resolves.toBeNull()
  })
})
