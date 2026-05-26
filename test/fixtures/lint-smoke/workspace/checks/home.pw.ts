import { expect, test } from "@playwright/test";

test("renders the home page by file-name convention", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { name: "Fixture" })).toBeVisible();
});
