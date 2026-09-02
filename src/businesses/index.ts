import { createLumaAdapter, lumaDefinition } from "./luma";
import { createNorthstarAdapter, northstarDefinition } from "./northstar";
import type { BusinessAdapter, BusinessDefinition, BusinessId, ToolEvent } from "./types";

export const businesses: Record<BusinessId, BusinessDefinition> = {
  luma: lumaDefinition,
  northstar: northstarDefinition,
};

export function createBusinessAdapter(
  id: BusinessId,
  emit: (event: ToolEvent) => void,
): BusinessAdapter {
  return id === "luma" ? createLumaAdapter(emit) : createNorthstarAdapter(emit);
}
