import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Make a business usable/ })).toBeVisible();
  (page as typeof page & { __errors?: string[] }).__errors = errors;
});

test.afterEach(async ({ page }) => {
  expect((page as typeof page & { __errors?: string[] }).__errors).toEqual([]);
});

test("Luma agent preparation stays visible for human confirmation", async ({ page }) => {
  await page.getByRole("button", { name: "Simulate agent flow" }).click();
  await expect(page.getByTestId("prepared-booking")).toContainText("Therapeutic Massage");
  await expect(page.getByTestId("prepared-booking")).toContainText("16:30");
  await page.getByRole("button", { name: "Confirm booking" }).click();
  await expect(page.getByText(/Confirmed by you/)).toBeVisible();
});

test("business switch changes tools and prepares a Northstar quote", async ({ page }) => {
  await page.getByRole("button", { name: /Northstar Print & Sign/ }).click();
  await expect(page.getByRole("heading", { name: "Northstar Print & Sign" })).toBeVisible();
  await page.getByRole("button", { name: "Simulate agent flow" }).click();
  await expect(page.getByTestId("prepared-quote")).toContainText("500 Premium Event Postcards");
  await page.getByRole("button", { name: "Review and submit" }).click();
  await expect(page.getByText(/Submitted by you/)).toBeVisible();
});

test("diagnostics explains unsupported WebMCP and lists tools", async ({ page }) => {
  await page.goto("/diagnostics");
  await expect(page.getByRole("heading", { name: "WebMCP diagnostics" })).toBeVisible();
  await expect(page.getByText("WebMCP is not enabled in this browser.")).toBeVisible();
  await expect(page.getByText("prepare_booking", { exact: true })).toBeVisible();
});

test("layout fits the active viewport", async ({ page }) => {
  const dimensions = await page.evaluate(() => ({ scrollWidth: document.documentElement.scrollWidth, innerWidth: window.innerWidth }));
  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.innerWidth + 1);
});
