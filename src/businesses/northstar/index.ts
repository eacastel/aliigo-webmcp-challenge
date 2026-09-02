import type { BusinessAdapter, BusinessDefinition, ToolEvent } from "../types";
import { boolean, createTool, integer, success, text } from "../shared";

export const northstarDefinition: BusinessDefinition = {
  id: "northstar",
  name: "Northstar Print & Sign",
  category: "Print and signage",
  location: "Leeds, United Kingdom",
  promise: "Clear choices and production-ready print, without the jargon.",
  accent: "#367b75",
  capabilities: ["searchKnowledge", "recommendOffering", "artworkRequirements", "prepareQuote"],
  offerings: [
    {
      id: "event-postcards",
      name: "Premium Event Postcards",
      summary: "A6 double-sided postcards for launches, invitations, and event follow-up.",
      priceLabel: "from £112",
      tags: ["postcards", "events", "A6", "short run"],
      provenance: { source: "Northstar approved product catalog", authority: "business-approved", lastReviewed: "2026-08-31" },
    },
    {
      id: "event-signage",
      name: "Event Welcome Boards",
      summary: "Rigid recyclable display boards for entrances and wayfinding.",
      priceLabel: "from £48",
      tags: ["sign", "event", "display", "board"],
      provenance: { source: "Northstar approved product catalog", authority: "business-approved", lastReviewed: "2026-08-31" },
    },
  ],
  knowledge: [
    {
      id: "artwork",
      topic: "artwork requirements",
      answer: "Supply print-ready PDF in CMYK with 3 mm bleed, embedded fonts, and images at 300 dpi.",
      provenance: { source: "Northstar approved artwork guide", authority: "business-approved", lastReviewed: "2026-08-31" },
    },
    {
      id: "turnaround",
      topic: "turnaround and delivery",
      answer: "Standard postcard production is three working days after artwork approval; delivery timing is confirmed in the reviewed quote.",
      provenance: { source: "Northstar approved production policy", authority: "business-approved", lastReviewed: "2026-08-31" },
    },
  ],
};

const stocks = [
  { id: "silk-350", name: "350gsm Silk", bestFor: "crisp event graphics and reliable colour", premium: true },
  { id: "uncoated-350", name: "350gsm Uncoated", bestFor: "a tactile finish that can be written on", premium: true },
  { id: "recycled-300", name: "300gsm Recycled", bestFor: "a natural finish with strong environmental cues", premium: false },
];

export function createNorthstarAdapter(emit: (event: ToolEvent) => void): BusinessAdapter {
  const business = northstarDefinition;
  return {
    definition: business,
    tools: [
      createTool(
        {
          name: "search_business_knowledge",
          title: "Search approved Northstar knowledge",
          description: "Search Northstar Print & Sign's approved production, artwork, and delivery guidance.",
          inputSchema: { type: "object", properties: { query: { type: "string", minLength: 2, maxLength: 180, description: "Print question or topic" } }, required: ["query"], additionalProperties: false },
          annotations: { readOnlyHint: true, untrustedContentHint: false },
          run: async (input) => {
            const query = text(input, "query", "print").toLowerCase();
            const matches = business.knowledge.filter((item) => `${item.topic} ${item.answer}`.toLowerCase().includes(query) || query.split(/\s+/).some((word) => `${item.topic} ${item.answer}`.toLowerCase().includes(word)));
            const result = success(business, "Approved business knowledge found.", { matches: matches.length ? matches : business.knowledge });
            return { result, event: { summary: `Checked approved Northstar guidance for “${query}”.`, result } };
          },
        },
        emit,
      ),
      createTool(
        {
          name: "find_print_options",
          title: "Find Northstar print options",
          description: "Compare bounded Northstar print products and approved paper stocks for a stated job.",
          inputSchema: {
            type: "object",
            properties: {
              product: { type: "string", enum: ["postcards", "signage"], description: "Type of printed item" },
              quantity: { type: "integer", minimum: 25, maximum: 5000, description: "Required quantity" },
              priority: { type: "string", enum: ["premium", "writable", "sustainable"], description: "Most important stock quality" },
            },
            required: ["product", "quantity"],
            additionalProperties: false,
          },
          annotations: { readOnlyHint: true, untrustedContentHint: false },
          run: async (input) => {
            const quantity = integer(input, "quantity", 500, 25, 5000);
            const priority = text(input, "priority", "premium");
            const ranked = [...stocks].sort((a) => (a.id.includes(priority) || (priority === "premium" && a.premium) ? -1 : 1));
            const result = success(business, "Suitable print and stock options found.", { product: business.offerings[0], quantity, recommendedStocks: ranked, provenance: business.offerings[0].provenance });
            return { result, event: { summary: `Compared approved stocks for ${quantity} event postcards.`, result } };
          },
        },
        emit,
      ),
      createTool(
        {
          name: "check_artwork_requirements",
          title: "Check Northstar artwork requirements",
          description: "Return the approved artwork checklist for a Northstar print product; does not upload or inspect files.",
          inputSchema: { type: "object", properties: { productId: { type: "string", enum: business.offerings.map((item) => item.id), description: "Approved product ID" }, artworkSupplied: { type: "boolean", description: "Whether the customer has artwork" } }, required: ["productId", "artworkSupplied"], additionalProperties: false },
          annotations: { readOnlyHint: true, untrustedContentHint: false },
          run: async (input) => {
            const artworkSupplied = boolean(input, "artworkSupplied", true);
            const guidance = business.knowledge.find((item) => item.id === "artwork")!;
            const result = success(business, "Approved artwork checklist ready.", { artworkSupplied, checklist: ["Print-ready PDF", "CMYK colour", "3 mm bleed", "Fonts embedded", "Images at 300 dpi"], guidance });
            return { result, event: { summary: "Checked the approved artwork requirements.", result } };
          },
        },
        emit,
      ),
      createTool(
        {
          name: "prepare_quote_request",
          title: "Prepare a Northstar quote request",
          description: "Prepare a visible bounded print quote request for human review. This never submits an order or accepts payment.",
          inputSchema: {
            type: "object",
            properties: {
              productId: { type: "string", enum: ["event-postcards"], description: "Approved product ID" },
              quantity: { type: "integer", enum: [100, 250, 500, 1000], description: "Supported postcard quantity" },
              size: { type: "string", enum: ["A6"], description: "Finished size" },
              stockId: { type: "string", enum: stocks.map((stock) => stock.id), description: "Approved paper stock" },
              artworkSupplied: { type: "boolean", description: "Whether customer artwork is supplied" },
              neededBy: { type: "string", enum: ["2026-09-11"], description: "Requested delivery date" },
            },
            required: ["productId", "quantity", "size", "stockId", "artworkSupplied", "neededBy"],
            additionalProperties: false,
          },
          annotations: { readOnlyHint: false, untrustedContentHint: false },
          run: async (input) => {
            const quantity = integer(input, "quantity", 500, 100, 1000);
            const stock = stocks.find((item) => item.id === text(input, "stockId"));
            if (!stock) throw new Error("The requested stock is not available for this quote.");
            const prepared = { kind: "quote" as const, status: "ready" as const, productName: "Premium Event Postcards", quantity, size: "A6", stock: stock.name, artworkSupplied: boolean(input, "artworkSupplied", true), neededBy: "Friday, 11 September 2026", estimate: quantity === 500 ? "£112–£138 + delivery" : "Price confirmed after review", provenance: business.offerings[0].provenance };
            const result = success(business, "Quote request prepared. Human review and submission are required.", { prepared, artworkCheckRequired: true, nextAction: "Review the visible request and select Submit quote request." });
            return { result, event: { summary: `Prepared a quote request for ${quantity} A6 postcards on ${stock.name}; waiting for human review.`, result, prepared } };
          },
        },
        emit,
      ),
    ],
  };
}
