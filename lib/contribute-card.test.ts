import { describe, expect, it } from "vitest"
import { getContributeCardByLinkId } from "./contribute-card"

describe("getContributeCardByLinkId", () => {
  it("returns null for non-UUID link ids without querying", async () => {
    await expect(getContributeCardByLinkId("bad-id")).resolves.toBeNull()
  })
})
