import { expect, test, type Page } from "@playwright/test";
import { takeSnapshot } from "@chromatic-com/playwright";

const OVERFLOW_FIXTURE_CLUSTER_COUNT = 200;
const OVERFLOW_FIXTURE_NODES_PER_CLUSTER = 1;
const OVERFLOW_FIXTURE_EDGE_DENSITY = 1;

/** Captures a Chromatic snapshot when run via `chromatic --playwright`; no-op otherwise. */
async function chromaticSnapshot(page: Page, name: string) {
  try {
    await takeSnapshot(page, name);
  } catch (error) {
    // Swallow the known benign error when not running under `chromatic --playwright`.
    // The library throws "Incorrect usage" in that scenario.
    if (
      error instanceof Error &&
      /incorrect usage/i.test(error.message)
    ) {
      return;
    }

    // Log unexpected errors to aid debugging, then rethrow so the test fails.
    // eslint-disable-next-line no-console
    console.error("Chromatic snapshot failed:", error);
    throw error;
  }
}

test.describe("hex graph journeys", () => {
  test("app loads and shows overview", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("navigation", { name: "View navigation" })).toBeVisible();
    await expect(page.getByRole("button", { name: "All" })).toBeVisible();
    await expect(page.locator(".hex-overview")).toBeVisible();

    await chromaticSnapshot(page, "Overview loaded");
  });

  test("cluster drill-in, breadcrumbs return, and minimap navigation", async ({ page }) => {
    await page.goto("/");

    const firstCluster = page.locator(".hex-overview .hex-pill").first();
    const firstLabel = (await firstCluster.getAttribute("aria-label")) ?? "";
    await firstCluster.click();

    await expect(page.locator(".hex-ring")).toBeVisible();
    await expect(page.locator(".minimap")).toBeVisible();
    await expect(page.locator(".rive-node")).toBeVisible();
    await expect(page.getByText(firstLabel, { exact: true })).toBeVisible();

    await chromaticSnapshot(page, "Cluster drill-in");

    const activeDotAria = page.locator(".minimap__dot--active").first().locator("xpath=.");
    await expect(activeDotAria).toHaveAttribute("aria-label", new RegExp(firstLabel));

    const secondDot = page.locator(".minimap__dot").nth(1);
    const secondDotLabel = (await secondDot.getAttribute("aria-label")) ?? "";
    await secondDot.click();

    await expect(page.locator(".hex-ring")).toBeVisible();
    await expect(page.locator(".minimap__dot--active").first()).toHaveAttribute("aria-label", secondDotLabel);

    await chromaticSnapshot(page, "Minimap navigation");

    await page.getByRole("button", { name: "All" }).click();
    await expect(page.locator(".hex-overview")).toBeVisible();
    await expect(page.locator(".minimap")).toHaveCount(0);

    await chromaticSnapshot(page, "Breadcrumb return to overview");
  });

  test("overflow stub supports keyboard activation", async ({ page }) => {
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

    await chromaticSnapshot(page, "Overflow stub navigation");
  });
});
