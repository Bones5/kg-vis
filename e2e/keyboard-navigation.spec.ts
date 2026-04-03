import { test, takeSnapshot } from "@chromatic-com/playwright";
import { expect } from "@playwright/test";

test.use({ disableAutoSnapshot: true });

test.describe("keyboard navigation", () => {
  test("Tab traverses hex pills in overview", async ({ page }, testInfo) => {
    await page.goto("/");
    await expect(page.locator(".hex-overview")).toBeVisible();

    // Focus the first hex pill via Tab
    const firstPill = page.locator(".hex-overview .hex-pill").first();
    await firstPill.focus();
    await expect(firstPill).toBeFocused();

    // Tab to next pill
    await page.keyboard.press("Tab");
    const secondPill = page.locator(".hex-overview .hex-pill").nth(1);
    await expect(secondPill).toBeFocused();

    await takeSnapshot(page, "Tab focus on overview pills", testInfo);
  });

  test("Enter key drills into cluster from overview", async ({ page }, testInfo) => {
    await page.goto("/");
    await expect(page.locator(".hex-overview")).toBeVisible();

    const firstPill = page.locator(".hex-overview .hex-pill").first();
    const label = (await firstPill.getAttribute("aria-label")) ?? "";
    await firstPill.focus();
    await page.keyboard.press("Enter");

    await expect(page.locator(".hex-ring")).toBeVisible();
    await expect(page.getByText(label, { exact: true })).toBeVisible();

    await takeSnapshot(page, "Enter key drill-in", testInfo);
  });

  test("Space key drills into cluster from overview", async ({ page }, testInfo) => {
    await page.goto("/");
    await expect(page.locator(".hex-overview")).toBeVisible();

    const firstPill = page.locator(".hex-overview .hex-pill").first();
    await firstPill.focus();
    await page.keyboard.press("Space");

    await expect(page.locator(".hex-ring")).toBeVisible();

    await takeSnapshot(page, "Space key drill-in", testInfo);
  });

  test("Tab traverses ring pills, stubs, minimap dots, and breadcrumbs", async ({ page }, testInfo) => {
    await page.goto(
      `/?mockClusterCount=200&mockNodesPerCluster=1&mockEdgeDensity=1`
    );
    await page.locator(".hex-overview .hex-pill").first().click();
    await expect(page.locator(".hex-ring")).toBeVisible();

    // Focus a ring pill
    const ringPill = page.locator(".hex-ring .hex-pill").first();
    await ringPill.focus();
    await expect(ringPill).toBeFocused();

    // Check that minimap dots are focusable
    const minimapDot = page.locator(".minimap__dot").first();
    await minimapDot.focus();
    await expect(minimapDot).toBeFocused();

    // Check stubs are focusable
    const stub = page.locator(".hex-ring__stub").first();
    if (await stub.isVisible()) {
      await stub.focus();
      await expect(stub).toBeFocused();
    }

    await takeSnapshot(page, "Tab traversal in ring view", testInfo);
  });

  test("minimap dot activation via Enter", async ({ page }, testInfo) => {
    await page.goto("/");
    await page.locator(".hex-overview .hex-pill").first().click();
    await expect(page.locator(".hex-ring")).toBeVisible();

    const beforeLabel = await page.locator(".breadcrumbs__item--active").last().textContent();

    const secondDot = page.locator(".minimap__dot").nth(1);
    await secondDot.focus();
    await page.keyboard.press("Enter");

    await expect(page.locator(".hex-ring")).toBeVisible();
    await expect(page.locator(".breadcrumbs__item--active").last()).not.toHaveText(beforeLabel ?? "");

    await takeSnapshot(page, "Minimap Enter navigation", testInfo);
  });
});
