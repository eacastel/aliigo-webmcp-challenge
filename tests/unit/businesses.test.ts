import { describe, expect, it, vi } from "vitest";
import { businesses } from "@/businesses";
import { validateBusinessDefinition, toolNamePattern } from "@/businesses/shared";
import { createRegistry } from "@/webmcp/registry";

describe("business capability definitions", () => {
  it.each(Object.values(businesses))("validates $name", (business) => {
    expect(validateBusinessDefinition(business)).toEqual([]);
  });

  it.each(["luma", "northstar"] as const)("publishes unique, valid tools for %s", (id) => {
    const { tools } = createRegistry(id, vi.fn());
    const names = tools.map((tool) => tool.name);
    expect(new Set(names).size).toBe(names.length);
    expect(names.every((name) => toolNamePattern.test(name))).toBe(true);
    expect(tools.every((tool) => tool.inputSchema.type === "object" && tool.inputSchema.additionalProperties === false)).toBe(true);
  });

  it("changes the exposed capability set with the business", () => {
    const luma = createRegistry("luma", vi.fn()).tools.map((tool) => tool.name);
    const northstar = createRegistry("northstar", vi.fn()).tools.map((tool) => tool.name);
    expect(luma).toContain("prepare_booking");
    expect(luma).not.toContain("prepare_quote_request");
    expect(northstar).toContain("prepare_quote_request");
    expect(northstar).not.toContain("prepare_booking");
  });
});

describe("bounded domain execution", () => {
  it("returns an approved Luma recommendation and prepares visible state", async () => {
    const emit = vi.fn();
    const { tools } = createRegistry("luma", emit);
    const find = tools.find((tool) => tool.name === "find_services")!;
    const prepare = tools.find((tool) => tool.name === "prepare_booking")!;
    const matches = await find.execute({ goal: "back tension", maxPriceEur: 100 }, { source: "webmcp" });
    expect(JSON.stringify(matches)).toContain("Therapeutic Massage");
    const result = await prepare.execute({ serviceId: "therapeutic-massage", date: "2026-09-04", time: "16:30" }, { source: "webmcp" });
    expect(result.message).toContain("Human confirmation is required");
    expect(emit.mock.calls.at(-1)?.[0].prepared).toMatchObject({ kind: "booking", status: "ready", price: "€85" });
  });

  it("returns Northstar artwork guidance and prepares a quote", async () => {
    const emit = vi.fn();
    const { tools } = createRegistry("northstar", emit);
    const artwork = tools.find((tool) => tool.name === "check_artwork_requirements")!;
    const prepare = tools.find((tool) => tool.name === "prepare_quote_request")!;
    const guidance = await artwork.execute({ productId: "event-postcards", artworkSupplied: true }, { source: "webmcp" });
    expect(JSON.stringify(guidance)).toContain("3 mm bleed");
    await prepare.execute({ productId: "event-postcards", quantity: 500, size: "A6", stockId: "silk-350", artworkSupplied: true, neededBy: "2026-09-11" }, { source: "webmcp" });
    expect(emit.mock.calls.at(-1)?.[0].prepared).toMatchObject({ kind: "quote", quantity: 500, stock: "350gsm Silk" });
  });
});
