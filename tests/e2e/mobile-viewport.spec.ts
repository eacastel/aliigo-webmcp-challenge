import { test, expect } from "@playwright/test";

test("mobile submission viewport shows the prepared shared state", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-chromium");
  await page.goto("/");
  await page.getByRole("button", { name: "Simulate agent flow" }).click();
  const card = page.getByTestId("prepared-booking");
  await expect(card).toBeVisible();
  await card.scrollIntoViewIfNeeded();
  await page.screenshot({ path: "public/screenshots/mobile-luma-ready.png" });
});
