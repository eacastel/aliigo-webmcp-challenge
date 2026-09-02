import type { BusinessAdapter, BusinessDefinition, ToolEvent } from "../types";
import { createTool, success, text } from "../shared";

export const lumaDefinition: BusinessDefinition = {
  id: "luma",
  name: "Luma Wellness Studio",
  category: "Wellness studio",
  location: "Valencia, Spain",
  promise: "Restorative care, thoughtfully matched to how you feel.",
  accent: "#d8795c",
  capabilities: ["searchKnowledge", "recommendOffering", "availability", "prepareBooking"],
  offerings: [
    {
      id: "therapeutic-massage",
      name: "Therapeutic Massage",
      summary: "Targeted 60-minute treatment for back tension and muscular fatigue.",
      priceLabel: "€85",
      tags: ["back tension", "recovery", "massage", "60 minutes"],
      provenance: {
        source: "Luma approved service catalog",
        authority: "business-approved",
        lastReviewed: "2026-08-30",
      },
    },
    {
      id: "guided-mobility",
      name: "Guided Mobility Session",
      summary: "A gentle 45-minute assisted stretching session for stiffness and mobility.",
      priceLabel: "€65",
      tags: ["stiffness", "stretching", "mobility", "45 minutes"],
      provenance: {
        source: "Luma approved service catalog",
        authority: "business-approved",
        lastReviewed: "2026-08-30",
      },
    },
    {
      id: "deep-release",
      name: "Deep Release Treatment",
      summary: "Intensive 75-minute bodywork for persistent tension.",
      priceLabel: "€110",
      tags: ["persistent tension", "deep tissue", "75 minutes"],
      provenance: {
        source: "Luma approved service catalog",
        authority: "business-approved",
        lastReviewed: "2026-08-30",
      },
    },
  ],
  knowledge: [
    {
      id: "arrival",
      topic: "arrival and cancellation",
      answer: "Please arrive 10 minutes early. Changes are free up to 24 hours before a session.",
      provenance: {
        source: "Luma approved booking policy",
        authority: "business-approved",
        lastReviewed: "2026-08-29",
      },
    },
    {
      id: "scope",
      topic: "wellness scope",
      answer: "Services support general wellbeing and do not replace medical assessment or treatment.",
      provenance: {
        source: "Luma approved service policy",
        authority: "business-approved",
        lastReviewed: "2026-08-30",
      },
    },
  ],
};

const fridaySlots = ["14:30", "16:30", "18:00"];

export function createLumaAdapter(emit: (event: ToolEvent) => void): BusinessAdapter {
  const business = lumaDefinition;
  const provenance = business.offerings[0].provenance;
  return {
    definition: business,
    tools: [
      createTool(
        {
          name: "search_business_knowledge",
          title: "Search approved Luma knowledge",
          description: "Search Luma Wellness Studio's approved policies and service guidance. Use for authoritative business facts, not medical advice.",
          inputSchema: {
            type: "object",
            properties: { query: { type: "string", minLength: 2, maxLength: 180, description: "Business question or topic" } },
            required: ["query"],
            additionalProperties: false,
          },
          annotations: { readOnlyHint: true, untrustedContentHint: false },
          run: async (input) => {
            const query = text(input, "query", "services").toLowerCase();
            const matches = business.knowledge.filter((item) => `${item.topic} ${item.answer}`.toLowerCase().includes(query) || query.split(/\s+/).some((word) => `${item.topic} ${item.answer}`.toLowerCase().includes(word)));
            const result = success(business, "Approved business knowledge found.", { matches: matches.length ? matches : business.knowledge });
            return { result, event: { summary: `Checked approved guidance for “${query}”.`, result } };
          },
        },
        emit,
      ),
      createTool(
        {
          name: "find_services",
          title: "Find suitable Luma services",
          description: "Recommend Luma services by goal and optional maximum EUR budget using only the approved service catalog.",
          inputSchema: {
            type: "object",
            properties: {
              goal: { type: "string", minLength: 2, maxLength: 180, description: "What the person wants help with, such as back tension" },
              maxPriceEur: { type: "number", minimum: 40, maximum: 200, description: "Optional maximum price in EUR" },
            },
            required: ["goal"],
            additionalProperties: false,
          },
          annotations: { readOnlyHint: true, untrustedContentHint: false },
          run: async (input) => {
            const goal = text(input, "goal", "wellbeing").toLowerCase();
            const max = typeof input.maxPriceEur === "number" ? input.maxPriceEur : 200;
            const matches = business.offerings.filter((offering) => Number(offering.priceLabel.replace(/\D/g, "")) <= max).sort((a, b) => Number(b.tags.some((tag) => goal.includes(tag) || tag.includes(goal))) - Number(a.tags.some((tag) => goal.includes(tag) || tag.includes(goal))));
            const result = success(business, `${matches.length} suitable service options found.`, { goal, maxPriceEur: max, services: matches });
            return { result, event: { summary: `Matched ${matches.length} services to the requested outcome and budget.`, result } };
          },
        },
        emit,
      ),
      createTool(
        {
          name: "find_available_times",
          title: "Find Luma appointment times",
          description: "Find deterministic available Luma appointment times for an approved service and day preference.",
          inputSchema: {
            type: "object",
            properties: {
              serviceId: { type: "string", enum: business.offerings.map((item) => item.id), description: "Approved Luma service ID" },
              day: { type: "string", enum: ["Friday"], description: "Requested day" },
              period: { type: "string", enum: ["afternoon", "evening", "any"], description: "Preferred part of day" },
            },
            required: ["serviceId", "day"],
            additionalProperties: false,
          },
          annotations: { readOnlyHint: true, untrustedContentHint: false },
          run: async (input) => {
            const serviceId = text(input, "serviceId", "therapeutic-massage");
            const service = business.offerings.find((item) => item.id === serviceId);
            const result = success(business, "Available appointment times found.", { service, date: "Friday, 4 September 2026", timezone: "Europe/Madrid", slots: fridaySlots, provenance: { ...provenance, source: "Luma demo availability calendar" } });
            return { result, event: { summary: `Checked Friday availability for ${service?.name ?? "the selected service"}.`, result } };
          },
        },
        emit,
      ),
      createTool(
        {
          name: "prepare_booking",
          title: "Prepare a Luma booking",
          description: "Prepare a visible appointment draft for human review. This never confirms or charges for a booking.",
          inputSchema: {
            type: "object",
            properties: {
              serviceId: { type: "string", enum: business.offerings.map((item) => item.id), description: "Approved Luma service ID" },
              date: { type: "string", enum: ["2026-09-04"], description: "Appointment date" },
              time: { type: "string", enum: fridaySlots, description: "Available local time" },
              note: { type: "string", maxLength: 180, description: "Optional non-sensitive preference" },
            },
            required: ["serviceId", "date", "time"],
            additionalProperties: false,
          },
          annotations: { readOnlyHint: false, untrustedContentHint: false },
          run: async (input) => {
            const service = business.offerings.find((item) => item.id === text(input, "serviceId"));
            if (!service) throw new Error("The requested service is not in Luma's approved catalog.");
            const time = text(input, "time");
            if (!fridaySlots.includes(time)) throw new Error("That time is not currently available.");
            const prepared = { kind: "booking" as const, status: "ready" as const, serviceId: service.id, serviceName: service.name, date: "Friday, 4 September 2026", time, price: service.priceLabel, note: text(input, "note") || undefined, provenance: service.provenance };
            const result = success(business, "Booking draft prepared. Human confirmation is required.", { prepared, nextAction: "Review the visible draft and select Confirm booking." });
            return { result, event: { summary: `Prepared ${service.name} for Friday at ${time}; waiting for human confirmation.`, result, prepared } };
          },
        },
        emit,
      ),
    ],
  };
}
