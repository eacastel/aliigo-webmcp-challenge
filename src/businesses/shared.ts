import type { BusinessDefinition, ToolEvent } from "./types";
import type { ActionLayerTool, ToolExecutionContext } from "@/webmcp/types";

export const toolNamePattern = /^[A-Za-z0-9_.-]{1,128}$/;

export function text(input: Record<string, unknown>, key: string, fallback = "") {
  const value = input[key];
  return typeof value === "string" ? value.trim().slice(0, 180) : fallback;
}

export function integer(
  input: Record<string, unknown>,
  key: string,
  fallback: number,
  min: number,
  max: number,
) {
  const value = input[key];
  return typeof value === "number" && Number.isInteger(value)
    ? Math.min(max, Math.max(min, value))
    : fallback;
}

export function boolean(input: Record<string, unknown>, key: string, fallback: boolean) {
  return typeof input[key] === "boolean" ? (input[key] as boolean) : fallback;
}

export function success(
  business: BusinessDefinition,
  message: string,
  data: Record<string, unknown>,
) {
  return {
    ok: true,
    business: { id: business.id, name: business.name },
    message,
    data,
    generatedAt: new Date().toISOString(),
  };
}

export function createTool(
  config: Omit<ActionLayerTool, "execute"> & {
    run: (
      input: Record<string, unknown>,
      context: ToolExecutionContext,
    ) => Promise<{ result: Record<string, unknown>; event: Omit<ToolEvent, "source" | "tool"> }>;
  },
  emit: (event: ToolEvent) => void,
): ActionLayerTool {
  return {
    name: config.name,
    title: config.title,
    description: config.description,
    inputSchema: config.inputSchema,
    annotations: config.annotations,
    execute: async (input, context) => {
      if (context.signal?.aborted) throw context.signal.reason;
      const { result, event } = await config.run(input, context);
      emit({ ...event, source: context.source, tool: config.name });
      return result;
    },
  };
}

export function validateBusinessDefinition(definition: BusinessDefinition) {
  const issues: string[] = [];
  if (!definition.id || !definition.name) issues.push("identity is required");
  if (new Set(definition.capabilities).size !== definition.capabilities.length) {
    issues.push("capabilities must be unique");
  }
  if (definition.offerings.length === 0) issues.push("at least one offering is required");
  for (const offering of definition.offerings) {
    if (!offering.provenance.source || !offering.provenance.lastReviewed) {
      issues.push(`offering ${offering.id} is missing provenance`);
    }
  }
  return issues;
}
