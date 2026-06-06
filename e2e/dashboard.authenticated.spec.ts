import { expect, test } from "@playwright/test"

const NON_EXISTENT_CARD_ID = "00000000-0000-0000-0000-000000000000"

test.describe("authenticated dashboard", () => {
  test("shows dashboard heading when logged in", async ({ page }) => {
    await page.goto("/dashboard")
    await expect(page).toHaveURL(/\/dashboard$/)
    await expect(page.getByRole("heading", { name: "All cards" })).toBeVisible()
  })

  test("shows branded not found for missing card", async ({ page }) => {
    const response = await page.goto(`/dashboard/cards/${NON_EXISTENT_CARD_ID}`)
    expect(response?.status()).toBe(404)
    await expect(
      page.getByRole("heading", { name: "Card not found" }),
    ).toBeVisible()
    await expect(
      page.getByRole("link", { name: "Back to dashboard" }),
    ).toBeVisible()
  })
})
