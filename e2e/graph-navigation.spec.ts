import { expect, test } from "@playwright/test";

test.describe("hex graph journeys", () => {
  test("app loads and shows overview", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("navigation", { name: "View navigation" })).toBeVisible();
    await expect(page.getByRole("button", { name: "All" })).toBeVisible();
    await expect(page.locator(".hex-overview")).toBeVisible();
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

    const activeDotAria = page.locator(".minimap__dot--active").first().locator("xpath=.");
    await expect(activeDotAria).toHaveAttribute("aria-label", new RegExp(firstLabel));

    const secondDot = page.locator(".minimap__dot").nth(1);
    const secondDotLabel = (await secondDot.getAttribute("aria-label")) ?? "";
    await secondDot.click();

    await expect(page.locator(".hex-ring")).toBeVisible();
    await expect(page.locator(".minimap__dot--active").first()).toHaveAttribute("aria-label", secondDotLabel);

    await page.getByRole("button", { name: "All" }).click();
    await expect(page.locator(".hex-overview")).toBeVisible();
    await expect(page.locator(".minimap")).toHaveCount(0);
  });

  test("overflow stub supports keyboard activation", async ({ page }) => {
    await page.goto("/");

    await page.locator(".hex-overview .hex-pill").first().click();
    await expect(page.locator(".hex-ring")).toBeVisible();

    const stub = page.locator(".hex-ring__stub").first();
    if ((await stub.count()) === 0) {
      test.skip(true, "No overflow stubs for current deterministic dataset");
    }

    const before = await page.locator(".breadcrumbs__item--active").last().textContent();
    await stub.focus();
    await page.keyboard.press("Enter");

    await expect(page.locator(".hex-ring")).toBeVisible();
    await expect(page.locator(".breadcrumbs__item--active").last()).not.toHaveText(before ?? "");
  });
});
