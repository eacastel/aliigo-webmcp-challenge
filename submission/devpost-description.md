# Devpost description

## Project name

Aliigo Action Layer — Make Any Business Agent-Ready

## One-line pitch

A reusable WebMCP publishing layer turns approved business knowledge and bounded capabilities into safe tools, so agents can prepare useful actions while people stay in control.

## Inspiration

Websites are optimized for people, not agents. An agent can scrape text and simulate clicks, but it must infer which facts are authoritative, which option fits the user's situation, what an action requires, and whether the action actually succeeded.

That works poorly for the long tail of local and specialist businesses. Their expertise is often present, but fragmented across pages, catalogs, policies, and forms.

We wanted to test a stronger idea than “add WebMCP to a booking form”: could one clean publishing layer convert a business's approved knowledge and real capabilities into an agent-ready interface appropriate to that business?

## What it does

Aliigo Action Layer supports two fictional businesses with the same engine.

At Luma Wellness Studio, an agent can search approved service guidance, match a goal and budget to a service, check deterministic availability, and prepare an appointment. The website visibly changes to a structured **Ready to review** state. The person—not the agent—confirms the booking.

At Northstar Print & Sign, the exposed capability set changes. An agent can compare print options, check approved artwork requirements, and prepare a 500-postcard quote request with the recommended stock. The person reviews and submits it.

Every important catalog fact includes simple business-approved provenance and a review date. The visible activity panel shows how agent actions change shared website state.

## Why WebMCP is essential

Without WebMCP, an agent must infer intent from presentation and repeatedly actuate UI controls. With WebMCP, the page publishes narrow semantic tools with explicit JSON Schemas and deterministic structured results.

The agent no longer has to guess which page text is authoritative, whether “prepare” means “confirm,” or which arbitrary values are accepted. The website remains the visible shared workspace, preserving the business experience and the person's control.

## What people and agents do together

The agent handles the high-friction research and preparation:

- interpret the person's goal;
- search only approved business knowledge;
- compare bounded offerings;
- check availability or production requirements;
- prepare a structured action draft.

The person sees the result in the website, reviews the exact service, schedule, specification, price/estimate, and source, then performs the consequential final action.

That division is difficult with ordinary UI actuation because the page and agent do not share an explicit action contract or reliable completion state.

## How it works technically

The app is a self-contained Next.js, React, and TypeScript project deployed on Vercel. Static fictional business definitions declare identity, approved knowledge, offerings, provenance, and capabilities.

A domain registry derives the active business's four tool definitions. A bounded WebMCP adapter feature-detects `document.modelContext.registerTool`, registers each current imperative tool, delegates execution to domain handlers, and sends results into shared React state. On a business switch, an `AbortController` unregisters the previous capability set before publishing the new tools.

Input Schemas use enumerated catalog IDs, dates, times, quantities, products, and stocks with `additionalProperties: false`. No tool accepts arbitrary URLs, code, HTML, commands, filesystem paths, or network targets. Read actions execute directly; booking and quote tools only prepare drafts.

When WebMCP is unavailable, the human site remains functional and a clearly labeled simulation invokes the same bounded domain handlers. Diagnostics report browser support, selected business, capabilities, expected and registered tool names, last execution, and structured output.

No external API, API key, database, authentication, payment, model backend, or paid service is required.

## Challenges

WebMCP is moving quickly. We implemented against the current 2 September 2026 specification rather than older examples, including the `document.modelContext` surface, current `registerTool()` dictionary, execution signal, annotations, origin isolation, and AbortSignal registration lifecycle.

The other design challenge was making WebMCP visible as product behavior, not hidden plumbing. The shared action and activity panels show what changed, why it changed, where important facts came from, and what still requires a person.

## Accomplishments

- One publisher architecture supports two distinct business verticals.
- Business switching genuinely changes the registered tool set.
- Agent preparation creates visible, human-confirmable state.
- Approved-source provenance travels in structured results.
- Unsupported browsers degrade honestly and remain useful.
- Automated tests cover domain data, schemas, tool execution, registration reconciliation, desktop/mobile journeys, diagnostics, confirmation, viewport fit, and console errors.
- The app is free, deterministic, responsive, public, and requires no credentials.

## What we learned

WebMCP is most compelling when treated as a capability design problem, not an automation shortcut. Good tools need clear business semantics, constrained arguments, source authority, lifecycle management, and an explicit distinction between researching, preparing, and committing.

The strongest human-agent experiences do not remove the person. They give the agent reliable leverage while making the agent's effect legible and keeping consequential decisions in a trusted interface.

## Future Aliigo direction

The experiment suggests a future Business Knowledge Package could feed a reviewed WebMCP adapter. Production adoption would require new work for authentication, authorization, tenant isolation, business-owner approval, server validation, audit logging, replay protection, idempotency, payments, and regulated verticals. None of that production work is assumed by this challenge prototype.

## Built with

- WebMCP imperative API
- `document.modelContext.registerTool()`
- Next.js 16
- React 19
- TypeScript 5
- CSS
- Vitest
- Playwright
- Vercel

## Links

- Live app: https://aliigo-webmcp-challenge.vercel.app
- Diagnostics: https://aliigo-webmcp-challenge.vercel.app/diagnostics
- Public repository: https://github.com/eacastel/aliigo-webmcp-challenge
