import type { ActionLayerTool, InvocationSource } from "@/webmcp/types";

export type BusinessId = "luma" | "northstar";

export type Provenance = {
  source: string;
  authority: "business-approved";
  lastReviewed: string;
};

export type Offering = {
  id: string;
  name: string;
  summary: string;
  priceLabel: string;
  tags: string[];
  provenance: Provenance;
};

export type Capability =
  | "searchKnowledge"
  | "recommendOffering"
  | "availability"
  | "prepareBooking"
  | "artworkRequirements"
  | "prepareQuote";

export type BusinessDefinition = {
  id: BusinessId;
  name: string;
  category: string;
  location: string;
  promise: string;
  accent: string;
  capabilities: Capability[];
  offerings: Offering[];
  knowledge: Array<{
    id: string;
    topic: string;
    answer: string;
    provenance: Provenance;
  }>;
};

export type PreparedBooking = {
  kind: "booking";
  status: "ready" | "confirmed";
  serviceId: string;
  serviceName: string;
  date: string;
  time: string;
  price: string;
  note?: string;
  provenance: Provenance;
};

export type PreparedQuote = {
  kind: "quote";
  status: "ready" | "confirmed";
  productName: string;
  quantity: number;
  size: string;
  stock: string;
  artworkSupplied: boolean;
  neededBy: string;
  estimate: string;
  provenance: Provenance;
};

export type PreparedAction = PreparedBooking | PreparedQuote;

export type ActivityEntry = {
  id: string;
  at: string;
  source: InvocationSource;
  tool: string;
  summary: string;
};

export type ToolEvent = {
  source: InvocationSource;
  tool: string;
  summary: string;
  result: Record<string, unknown>;
  prepared?: PreparedAction;
};

export type BusinessAdapter = {
  definition: BusinessDefinition;
  tools: ActionLayerTool[];
};
