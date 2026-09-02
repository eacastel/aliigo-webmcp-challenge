import { describe, expect, it, vi } from "vitest";
import { createRegistry } from "@/webmcp/registry";
import { WebMCPPublisher } from "@/webmcp/publisher";
import type { ModelContextLike } from "@/webmcp/types";

function mockContext() {
  const registrations: Array<{
    name: string;
    signal?: AbortSignal;
    execute: (input: Record<string, unknown>, options: { signal: AbortSignal }) => Promise<unknown>;
  }> = [];
  const context: ModelContextLike = {
    registerTool: vi.fn(async (tool, options) => {
      registrations.push({ name: tool.name, signal: options?.signal, execute: tool.execute });
    }),
  };
  return { context, registrations };
}

describe("WebMCP publisher", () => {
  it("degrades cleanly without document.modelContext", async () => {
    const publisher = new WebMCPPublisher();
    const tools = createRegistry("luma", vi.fn()).tools;
    await expect(publisher.reconcile(undefined, tools)).resolves.toEqual({ available: false, registered: [] });
  });

  it("registers the selected business and aborts previous registrations", async () => {
    const publisher = new WebMCPPublisher();
    const { context, registrations } = mockContext();
    const luma = createRegistry("luma", vi.fn()).tools;
    const northstar = createRegistry("northstar", vi.fn()).tools;
    const first = await publisher.reconcile(context, luma);
    expect(first.registered).toEqual(luma.map((tool) => tool.name));
    const oldSignals = registrations.map((item) => item.signal);
    const second = await publisher.reconcile(context, northstar);
    expect(oldSignals.every((signal) => signal?.aborted)).toBe(true);
    expect(second.registered).toEqual(northstar.map((tool) => tool.name));
  });

  it("delegates WebMCP execution to a bounded domain tool", async () => {
    const emit = vi.fn();
    const publisher = new WebMCPPublisher();
    const { context, registrations } = mockContext();
    await publisher.reconcile(context, createRegistry("luma", emit).tools);
    const prepare = registrations.find((item) => item.name === "prepare_booking")!;
    const result = await prepare.execute({ serviceId: "therapeutic-massage", date: "2026-09-04", time: "16:30" }, { signal: new AbortController().signal }) as Record<string, unknown>;
    expect(result.message).toContain("Human confirmation");
    expect(emit.mock.calls.at(-1)?.[0].source).toBe("webmcp");
  });
});
