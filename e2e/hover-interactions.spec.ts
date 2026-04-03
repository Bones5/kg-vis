import { test, takeSnapshot } from "@chromatic-com/playwright";
import { expect } from "@playwright/test";

test.use({ disableAutoSnapshot: true });

test.describe("hover interactions", () => {
  test("hovering a cluster pill dims non-connected pills in overview", async ({ page }, testInfo) => {
    await page.goto("/");
    await expect(page.locator(".hex-overview")).toBeVisible();

    const pills = page.locator(".hex-overview .hex-pill");
    const pillCount = await pills.count();
    expect(pillCount).toBeGreaterThan(1);

    // Hover the first pill
    await pills.first().hover();

    // At least one non-connected pill should get dimmed class
    const dimmedPills = page.locator(".hex-overview .hex-pill--dimmed");
    await expect(dimmedPills.first()).toBeVisible();

    await takeSnapshot(page, "Overview hover dimming", testInfo);
  });

  test("unhovering restores all pills", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(".hex-overview")).toBeVisible();

    const pills = page.locator(".hex-overview .hex-pill");
    await pills.first().hover();

    // Verify dimming exists
    await expect(page.locator(".hex-pill--dimmed").first()).toBeVisible();

    // Move mouse away to unhover
    await page.mouse.move(0, 0);

    // Wait for dimming to clear
    await expect(page.locator(".hex-pill--dimmed")).toHaveCount(0);
  });

  test("hovering a cluster pill in ring view dims non-connected pills", async ({ page }, testInfo) => {
    await page.goto("/");
    await page.locator(".hex-overview .hex-pill").first().click();
    await expect(page.locator(".hex-ring")).toBeVisible();

    const ringPills = page.locator(".hex-ring .hex-pill");
    const count = await ringPills.count();

    if (count > 1) {
      await ringPills.first().hover();

      // Some pills should be dimmed
      const dimmedPills = page.locator(".hex-ring .hex-pill--dimmed");
      await expect(dimmedPills.first()).toBeVisible();

      await takeSnapshot(page, "Ring hover dimming", testInfo);
    }
  });

  test("hovered pill gets hover class", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(".hex-overview")).toBeVisible();

    const firstPill = page.locator(".hex-overview .hex-pill").first();
    await firstPill.hover();

    await expect(firstPill).toHaveClass(/hex-pill--hovered/);
  });
});
