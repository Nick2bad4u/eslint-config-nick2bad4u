import { expect, test } from "@playwright/test";

test("fixture homepage title", async ({ page }) => {
    await page.goto("https://example.com");
    await expect(page).toHaveTitle(/Example/u);
});
