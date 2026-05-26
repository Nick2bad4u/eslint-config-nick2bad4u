import { expect, test } from "@playwright/test";

test("fixture e2e page has a heading", async ({ page }) => {
    await page.goto("https://example.com");
    await expect(page.getByRole("heading")).toBeVisible();
});
