import { test, takeSnapshot } from "@chromatic-com/playwright";
import { expect } from "@playwright/test";

test.use({ disableAutoSnapshot: true });

test.describe("navigation robustness", () => {
  test("rapid cluster clicks don't break state", async ({ page }, testInfo) => {
    await page.goto("/");
    await expect(page.locator(".hex-overview")).toBeVisible();

    const pills = page.locator(".hex-overview .hex-pill");
    const count = await pills.count();

    // Rapidly click multiple pills
    if (count >= 3) {
      await pills.nth(0).click();
      await pills.nth(1).click({ force: true }).catch(() => {
        // May fail if overview is no longer visible — that's expected
      });
    } else {
      await pills.first().click();
    }

    // Should end up in a valid drill-in state
    await expect(page.locator(".hex-ring")).toBeVisible();

    await takeSnapshot(page, "Rapid clicks stabilized", testInfo);
  });

  test("rapid minimap navigation stabilizes", async ({ page }) => {
    await page.goto("/");
    await page.locator(".hex-overview .hex-pill").first().click();
    await expect(page.locator(".hex-ring")).toBeVisible();

    const dots = page.locator(".minimap__dot");
    const dotCount = await dots.count();

    // Rapidly click through minimap dots
    for (let i = 0; i < Math.min(dotCount, 4); i++) {
      await dots.nth(i).click();
    }

    // Should still be in a valid ring view
    await expect(page.locator(".hex-ring")).toBeVisible();
    await expect(page.locator(".minimap")).toBeVisible();
  });

  test("breadcrumb All returns to overview immediately after drill-in", async ({ page }, testInfo) => {
    await page.goto("/");
    await page.locator(".hex-overview .hex-pill").first().click();
    await expect(page.locator(".hex-ring")).toBeVisible();

    // Immediately click All
    await page.getByRole("button", { name: "All" }).click();
    await expect(page.locator(".hex-overview")).toBeVisible();
    await expect(page.locator(".minimap")).toHaveCount(0);

    await takeSnapshot(page, "Immediate breadcrumb return", testInfo);
  });

  test("double-click on cluster pill ends in ring view", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(".hex-overview")).toBeVisible();

    const firstPill = page.locator(".hex-overview .hex-pill").first();
    await firstPill.dblclick();

    // Should end in ring view (not broken state)
    await expect(page.locator(".hex-ring")).toBeVisible();
  });

  test("re-clicking All while already in overview does nothing", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(".hex-overview")).toBeVisible();

    await page.getByRole("button", { name: "All" }).click();
    await expect(page.locator(".hex-overview")).toBeVisible();
  });
});
