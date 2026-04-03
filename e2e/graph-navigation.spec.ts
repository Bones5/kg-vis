import { test, takeSnapshot } from "@chromatic-com/playwright";
import { expect } from "@playwright/test";

const OVERFLOW_FIXTURE_CLUSTER_COUNT = 200;
const OVERFLOW_FIXTURE_NODES_PER_CLUSTER = 1;
const OVERFLOW_FIXTURE_EDGE_DENSITY = 1;

test.use({ disableAutoSnapshot: true });

test.describe("hex graph journeys", () => {
  test("app loads and shows overview", async ({ page }, testInfo) => {
    await page.goto("/");

    await expect(page.getByRole("navigation", { name: "View navigation" })).toBeVisible();
    await expect(page.getByRole("button", { name: "All" })).toBeVisible();
    await expect(page.locator(".hex-overview")).toBeVisible();

    await takeSnapshot(page, "Overview loaded", testInfo);
  });

  test("cluster drill-in, breadcrumbs return, and minimap navigation", async ({ page }, testInfo) => {
    await page.goto("/");

    const firstCluster = page.locator(".hex-overview .hex-pill").first();
    const firstLabel = (await firstCluster.getAttribute("aria-label")) ?? "";
    await firstCluster.click();

    await expect(page.locator(".hex-ring")).toBeVisible();
    await expect(page.locator(".minimap")).toBeVisible();
    await expect(page.locator(".rive-node")).toBeVisible();
    await expect(page.getByText(firstLabel, { exact: true })).toBeVisible();

    await takeSnapshot(page, "Cluster drill-in", testInfo);

    const activeDotAria = page.locator(".minimap__dot--active").first().locator("xpath=.");
    await expect(activeDotAria).toHaveAttribute("aria-label", new RegExp(firstLabel));

    const secondDot = page.locator(".minimap__dot").nth(1);
    const secondDotLabel = (await secondDot.getAttribute("aria-label")) ?? "";
    await secondDot.click();

    await expect(page.locator(".hex-ring")).toBeVisible();
    await expect(page.locator(".minimap__dot--active").first()).toHaveAttribute("aria-label", secondDotLabel);

    await takeSnapshot(page, "Minimap navigation", testInfo);

    await page.getByRole("button", { name: "All" }).click();
    await expect(page.locator(".hex-overview")).toBeVisible();
    await expect(page.locator(".minimap")).toHaveCount(0);

    await takeSnapshot(page, "Breadcrumb return to overview", testInfo);
  });

  test("overflow stub supports keyboard activation", async ({ page }, testInfo) => {
    await page.goto(`/?mockClusterCount=${OVERFLOW_FIXTURE_CLUSTER_COUNT}&mockNodesPerCluster=${OVERFLOW_FIXTURE_NODES_PER_CLUSTER}&mockEdgeDensity=${OVERFLOW_FIXTURE_EDGE_DENSITY}`);

    await page.locator(".hex-overview .hex-pill").first().click();
    await expect(page.locator(".hex-ring")).toBeVisible();

    const stub = page.locator(".hex-ring__stub").first();
    await expect(stub).toBeVisible();

    const before = await page.locator(".breadcrumbs__item--active").last().textContent();
    await stub.focus();
    await page.keyboard.press("Enter");

    await expect(page.locator(".hex-ring")).toBeVisible();
    await expect(page.locator(".breadcrumbs__item--active").last()).not.toHaveText(before ?? "");

    await takeSnapshot(page, "Overflow stub navigation", testInfo);
  });
});
