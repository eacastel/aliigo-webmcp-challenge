import { createBusinessAdapter } from "@/businesses";
import type { BusinessId, ToolEvent } from "@/businesses/types";
import { toolNamePattern } from "@/businesses/shared";

export function createRegistry(id: BusinessId, emit: (event: ToolEvent) => void) {
  const adapter = createBusinessAdapter(id, emit);
  const names = adapter.tools.map((tool) => tool.name);
  if (new Set(names).size !== names.length) throw new Error(`Duplicate tool name for ${id}`);
  if (names.some((name) => !toolNamePattern.test(name))) throw new Error(`Invalid tool name for ${id}`);
  return adapter;
}
