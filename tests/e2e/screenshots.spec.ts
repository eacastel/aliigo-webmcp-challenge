import { test, expect } from "@playwright/test";

test("@screenshots capture desktop submission states", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chromium");
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Make a business usable/ })).toBeVisible();
  await page.screenshot({ path: "public/screenshots/app-hero.png", fullPage: true });

  await page.getByRole("button", { name: "Simulate agent flow" }).click();
  await expect(page.getByTestId("prepared-booking")).toBeVisible();
  await page.screenshot({ path: "public/screenshots/luma-ready.png", fullPage: true });

  await page.getByRole("button", { name: /Northstar Print & Sign/ }).click();
  await page.getByRole("button", { name: "Simulate agent flow" }).click();
  await expect(page.getByTestId("prepared-quote")).toBeVisible();
  await page.screenshot({ path: "public/screenshots/northstar-ready.png", fullPage: true });

  await page.goto("/diagnostics");
  await expect(page.getByRole("heading", { name: "WebMCP diagnostics" })).toBeVisible();
  await page.screenshot({ path: "public/screenshots/webmcp-diagnostics.png", fullPage: true });
});

test("@screenshots capture focused mobile ready state", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-chromium");
  await page.goto("/");
  await page.getByRole("button", { name: "Simulate agent flow" }).click();
  const card = page.getByTestId("prepared-booking");
  await expect(card).toBeVisible();
  await card.scrollIntoViewIfNeeded();
  await page.screenshot({ path: "public/screenshots/mobile-luma-ready.png" });
});
