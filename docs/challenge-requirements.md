# WebMCP Challenge requirements

Verified on **2 September 2026** against the current sources below. The optional Devpost Hackathons Codex plugin was not installed in this environment, so no plugin output was used.

## Authoritative sources

1. [Current WebMCP specification](https://webmachinelearning.github.io/webmcp/) — Draft Community Group Report dated 2 September 2026.
2. [Chrome WebMCP documentation](https://developer.chrome.com/docs/ai/webmcp) and [Imperative API](https://developer.chrome.com/docs/ai/webmcp/imperative-api) — last updated 7 and 20 August 2026.
3. [OpenAI WebMCP Challenge](https://openai.com/webmcp-challenge/).
4. [Official Devpost rules](https://webmcp.devpost.com/rules) and [challenge overview](https://webmcp.devpost.com/).

If these sources conflict, the official rules and current specification govern.

## Deadline

- Submission closes **3 September 2026 at 1:00 p.m. Pacific Daylight Time**.
- Europe/Madrid equivalent supplied by the project owner: **3 September 2026 at 22:00**.
- Devpost draft submissions can be saved before the deadline; no edits are permitted to the hackathon submission after the submission period ends, except limited administrator-permitted corrections.

## Build requirements

- Build a WebMCP-powered web app exploring an open web where people and agents interact, collaborate, and create together.
- The project must run consistently as depicted in its video and description.
- A new project is allowed and encouraged. Existing projects must clearly document the WebMCP work added during the submission period.
- Third-party SDKs, APIs, data, and assets must be authorized and license-compliant.
- Judges must be able to use the live project free of charge through ChatGPT's in-app browser or Chrome with WebMCP enabled.

## Required submission materials

- [x] Working, publicly accessible live URL.
- [x] English text description explaining:
  - [x] why the use case strongly fits WebMCP;
  - [x] how it creates a better user experience;
  - [x] what people and agents can do together that was previously difficult or impossible;
  - [x] how WebMCP was implemented.
- [ ] Public YouTube demo video under three minutes.
  - [ ] Clear functioning product demo.
  - [ ] Audio describes what was built and how WebMCP is used.
  - [ ] Public visibility.
  - [ ] No unauthorized trademarks, music, or copyrighted material.
- [ ] Public code repository URL entered in Devpost.
  - [x] All source, assets, and run instructions present locally.
  - [x] Apache-2.0 license at repository root.
  - [x] Current `document.modelContext.registerTool(...)` implementation present.
- [ ] Complete every required field on Devpost's submission page.
- [ ] Entrant personally verifies eligibility and accepts legal attestations.

## Current WebMCP API notes

- The current secure-context document surface is `document.modelContext`.
- `registerTool(tool, options)` returns a promise and accepts a tool with `name`, optional `title`, `description`, optional JSON `inputSchema`, optional `annotations`, and async `execute(input, { signal })`.
- Tool names must be 1–128 ASCII characters using alphanumerics, `_`, `-`, or `.`.
- Registration options can contain an `AbortSignal`; aborting it unregisters the tool.
- The current specification also defines `getTools()`, `executeTool()`, and `toolchange`.
- Tool registration requires origin isolation and is gated by the `tools` Permissions Policy, defaulting to self.
- Chrome documents local testing through `chrome://flags/#enable-webmcp-testing` in Chrome 149+.
- OpenAI documents testing in ChatGPT's supported in-app browser.

## Judging criteria

The four criteria are equally weighted:

1. **WebMCP Leverage** — thorough, skillful, working, non-trivial use.
2. **Execution** — complete and coherent product experience.
3. **Potential Impact** — credible, specific problem and audience.
4. **Creativity & Ambition** — novel concept that differs from existing work.

## Project compliance snapshot

- [x] Two different business journeys use the same publisher architecture.
- [x] Structured, narrow, business-specific JSON Schemas.
- [x] Feature detection and non-WebMCP fallback.
- [x] Visible shared state and activity.
- [x] Human confirmation for consequential actions.
- [x] Approved-source provenance in structured results.
- [x] No authentication, external API, API key, or paid dependency.
- [x] Desktop/mobile and diagnostics coverage.
- [x] Live Vercel deployment.
- [x] Original fictional data and original CSS visuals.
- [x] Real WebMCP invocation verified for both businesses in Chrome 151.0.7922.137.
- [ ] Public YouTube video uploaded and linked.
- [ ] Devpost submission legally attested and submitted by Emilio.
