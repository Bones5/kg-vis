import { test, takeSnapshot } from "@chromatic-com/playwright";
import { expect } from "@playwright/test";

test.use({ disableAutoSnapshot: true });

test.describe("data variation journeys", () => {
  test("minimal graph: 2 clusters, sparse edges", async ({ page }, testInfo) => {
    await page.goto("/?mockClusterCount=2&mockNodesPerCluster=5&mockEdgeDensity=0.1");
    await expect(page.locator(".hex-overview")).toBeVisible();

    const pills = page.locator(".hex-overview .hex-pill");
    await expect(pills).toHaveCount(2);

    await takeSnapshot(page, "Minimal graph overview", testInfo);

    // Drill into first cluster
    await pills.first().click();
    await expect(page.locator(".hex-ring")).toBeVisible();

    await takeSnapshot(page, "Minimal graph drill-in", testInfo);

    // Return to overview
    await page.getByRole("button", { name: "All" }).click();
    await expect(page.locator(".hex-overview")).toBeVisible();
  });

  test("single cluster graph", async ({ page }, testInfo) => {
    await page.goto("/?mockClusterCount=1&mockNodesPerCluster=10&mockEdgeDensity=0.3");
    await expect(page.locator(".hex-overview")).toBeVisible();

    const pills = page.locator(".hex-overview .hex-pill");
    await expect(pills).toHaveCount(1);

    await takeSnapshot(page, "Single cluster overview", testInfo);

    // Drill in — should show ring with no neighbor pills
    await pills.first().click();
    await expect(page.locator(".hex-ring")).toBeVisible();
    await expect(page.locator(".hex-ring .hex-pill")).toHaveCount(0);
    await expect(page.locator(".hex-ring__stub")).toHaveCount(0);

    await takeSnapshot(page, "Single cluster ring no neighbors", testInfo);
  });

  test("dense graph: many clusters, high edge density", async ({ page }, testInfo) => {
    await page.goto("/?mockClusterCount=15&mockNodesPerCluster=60&mockEdgeDensity=0.5");
    await expect(page.locator(".hex-overview")).toBeVisible();

    const pills = page.locator(".hex-overview .hex-pill");
    const count = await pills.count();
    expect(count).toBe(15);

    await takeSnapshot(page, "Dense graph overview", testInfo);

    // Drill in
    await pills.first().click();
    await expect(page.locator(".hex-ring")).toBeVisible();

    await takeSnapshot(page, "Dense graph drill-in", testInfo);
  });

  test("sparse graph: few or no edges", async ({ page }, testInfo) => {
    await page.goto(
      "/?mockClusterCount=8&mockNodesPerCluster=30&mockEdgeDensity=0.05&mockInterClusterDensity=0.05"
    );
    await expect(page.locator(".hex-overview")).toBeVisible();
    await expect(page.locator(".hex-overview .hex-pill")).toHaveCount(8);

    await takeSnapshot(page, "Sparse graph overview", testInfo);
  });
});

test.describe("error and edge case handling", () => {
  test("invalid URL params fall back to defaults", async ({ page }) => {
    await page.goto("/?mockClusterCount=-1&mockNodesPerCluster=abc&mockEdgeDensity=999");

    // App should load with default config (negative/invalid parsed to defaults)
    await expect(page.locator(".hex-overview")).toBeVisible();
    const pills = page.locator(".hex-overview .hex-pill");
    const count = await pills.count();
    // Default is 8 clusters
    expect(count).toBe(8);
  });

  test("zero-valued params use defaults", async ({ page }) => {
    await page.goto("/?mockClusterCount=0&mockNodesPerCluster=0");

    // parsePositiveInt requires > 0, so 0 falls back to default 8
    await expect(page.locator(".hex-overview")).toBeVisible();
    const pills = page.locator(".hex-overview .hex-pill");
    const count = await pills.count();
    expect(count).toBe(8);
  });
});
