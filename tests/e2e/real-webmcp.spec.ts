import { test, expect } from "@playwright/test";

test.use({ channel: "chrome", launchOptions: { args: ["--enable-features=WebMCP"] } });

test("real Chrome registers, invokes, and reconciles WebMCP tools", async ({ page, browser }) => {
  test.skip(process.env.REAL_WEBMCP !== "1", "Set REAL_WEBMCP=1 with Chrome 149+ installed.");
  await page.goto(process.env.REAL_WEBMCP_URL ?? "/");
  await expect(page.getByRole("heading", { name: /Make a business usable/ })).toBeVisible();

  const luma = await page.evaluate(async () => {
    if (!document.modelContext?.getTools || !document.modelContext.executeTool) throw new Error("WebMCP inspection APIs unavailable");
    const tools = await document.modelContext.getTools();
    const prepare = tools.find((tool) => tool.name === "prepare_booking");
    if (!prepare) throw new Error("prepare_booking was not registered");
    // Chrome 151 still implements the JSON-string input form documented by Chrome.
    const result = await document.modelContext.executeTool(prepare, JSON.stringify({ serviceId: "therapeutic-massage", date: "2026-09-04", time: "16:30" }));
    return { names: tools.map((tool) => tool.name), result };
  });
  expect(luma.names).toEqual(["find_available_times", "find_services", "prepare_booking", "search_business_knowledge"]);
  expect(luma.result).toContain("Human confirmation is required");
  await expect(page.getByTestId("prepared-booking")).toContainText("Therapeutic Massage");

  await page.getByRole("button", { name: /Northstar Print & Sign/ }).click();
  await expect.poll(async () => page.evaluate(async () => (await document.modelContext!.getTools!()).map((tool) => tool.name))).toContain("prepare_quote_request");
  const northstar = await page.evaluate(async () => {
    const tools = await document.modelContext!.getTools!();
    const prepare = tools.find((tool) => tool.name === "prepare_quote_request")!;
    const result = await document.modelContext!.executeTool!(prepare, JSON.stringify({ productId: "event-postcards", quantity: 500, size: "A6", stockId: "silk-350", artworkSupplied: true, neededBy: "2026-09-11" }));
    return { names: tools.map((tool) => tool.name), result };
  });
  expect(northstar.names).toEqual(["check_artwork_requirements", "find_print_options", "prepare_quote_request", "search_business_knowledge"]);
  expect(northstar.result).toContain("Human review and submission are required");
  await expect(page.getByTestId("prepared-quote")).toContainText("500 Premium Event Postcards");
  console.log(`REAL_WEBMCP_BROWSER=${browser.version()}`);
});
