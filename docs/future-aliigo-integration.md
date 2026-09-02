# Future Aliigo integration boundary

This document is architectural guidance, not a commitment or production design. The challenge app is independently implemented, contains no private Aliigo code or customer data, and does not depend on an Aliigo repository or service.

## Conceptual seam

```text
future Aliigo Business Knowledge Package
              ↓
authenticated capability provider
              ↓
reviewed WebMCP tool factory
              ↓
document.modelContext publisher
              ↓
agent prepares → person confirms
```

The challenge boundary worth preserving is the separation between domain capability handlers and the browser adapter:

- `src/businesses/types.ts` defines the minimum data and capability contract.
- each business adapter turns structured knowledge and bounded actions into tool definitions;
- `src/webmcp/registry.ts` validates and selects the exposed set;
- `src/webmcp/publisher.ts` owns `document.modelContext`, feature detection, registration lifecycle, and unregistration;
- React consumes prepared domain state and never registers WebMCP tools directly.

A production provider could replace the static fictional definitions without rewriting the browser-facing lifecycle.

## Concepts that may carry over

- Capability-driven tool publication rather than page-specific wiring.
- Narrow semantic tool names and strict JSON Schemas.
- Business-specific descriptions generated from reviewed templates.
- Read vs prepare action classification.
- Explicit provenance fields for business-approved facts.
- Visible shared action state.
- Agent preparation followed by human confirmation.
- Registration reconciliation when business, page, authorization, or capability state changes.
- Structured bounded success and error results.

These are concepts, not production-ready copied modules.

## What must be rewritten or reviewed

Everything that crosses a trust, identity, tenant, network, or persistence boundary needs a fresh production implementation and security review. In particular:

- demo in-memory state and deterministic data;
- client-side authorization assumptions;
- tool description generation;
- schema generation and runtime validation;
- server calls, caches, and persistence;
- UI confirmation semantics;
- provenance storage and review workflow;
- observability, error handling, and rate limits;
- browser compatibility strategy as the experimental API evolves.

The challenge tool schemas should be treated as product research, not a production contract.

## Business Knowledge Package input

A future Business Knowledge Package could expose a versioned, approved projection containing:

- business identity and locale;
- public offerings and option identifiers;
- approved descriptions, prices, policies, and provenance;
- capability declarations and action risk class;
- required inputs and validation constraints;
- freshness, approval status, and expiry;
- permitted channel and origin scope.

The WebMCP adapter should receive only the minimum approved projection needed for the active page and user. It should not receive an unrestricted tenant graph or internal editorial data.

## Authentication and authorization

WebMCP discovery is not authorization. Production handlers must validate the authenticated user, session, tenant, active business, and permission for every execution. Client state and model-provided arguments are untrusted.

For cross-origin exposure, origins must be explicitly allowlisted and reviewed. Broad wildcards should not be used for sensitive capabilities.

## Tenant isolation

- Resolve tenant identity server-side from trusted routing and session context.
- Bind every read and mutation to that tenant.
- Avoid agent-supplied tenant IDs when the server can derive them.
- Partition caches, logs, idempotency records, and files by tenant.
- Test horizontal and vertical authorization failures.
- Unregister stale tools immediately on tenant or session change.

## Business-owner approval

Business owners should approve:

- which knowledge is exposed;
- which capabilities are agent-callable;
- tool names and descriptions;
- allowed inputs and outcomes;
- whether an action is read, prepare, confirm, or prohibited;
- provenance and review cadence;
- permitted agent/browser channels.

Changes should be versioned, attributable, reversible, and subject to preview before publication.

## Sensitive and consequential actions

Risk-classify actions. Public catalog search may execute directly. Appointment, quote, message, order, payment, cancellation, refund, access, or regulated actions require additional controls.

The default pattern should remain:

```text
agent researches and prepares
            ↓
server validates a draft
            ↓
person reviews the exact consequence
            ↓
person confirms in a trusted UI
            ↓
server revalidates and commits
```

Confirmation should name the business, action, material terms, price, destination, and relevant policy. A model should not be able to forge or bypass this UI state.

## Server-side validation

JSON Schema improves selection but is not a security boundary. Server handlers must validate types, allowed identifiers, current price, availability, authorization, state transitions, policy, quotas, and freshness immediately before commit. Never accept arbitrary URLs, HTML, commands, code, or database expressions.

## Audit logging

Record an immutable, privacy-minimized event for discovery-sensitive and consequential operations:

- tenant, actor, session, and channel;
- tool and schema version;
- sanitized inputs and result class;
- provenance/version used;
- draft, confirmation, and commit identifiers;
- timing, authorization decision, and failure class.

Do not log secrets, unnecessary personal data, payment credentials, or raw regulated content.

## Replay and idempotency

Every prepare/commit flow needs server-issued draft IDs, short expiry, one-time or idempotent confirmation tokens, and clear state transitions. Retries must not duplicate bookings, quote submissions, messages, charges, or refunds. Revalidate mutable facts at confirmation.

## Payments

Do not expose raw payment credentials to a WebMCP tool. Use a PCI-compliant payment provider, trusted human checkout UI, amount/currency/payee confirmation, strong customer authentication where required, and server-verified webhook outcomes. Agent preparation must not equal payment authorization.

## Regulated verticals

Healthcare, legal, finance, employment, insurance, housing, education, and other regulated areas require vertical-specific review. Limit exposed data, separate general business information from professional advice, establish lawful basis and retention, support accessibility, and require qualified human oversight where appropriate.

## Production release gates

Before any future Aliigo adoption:

1. update against the then-current WebMCP specification and browser behavior;
2. complete threat modeling and privacy review;
3. define capability risk classes and owner approval controls;
4. implement server authorization and tenant isolation;
5. add runtime validation, idempotency, and audit trails;
6. run adversarial prompt-injection and confused-deputy tests;
7. verify accessible, comprehensible human confirmation;
8. pilot only with explicit business-owner and user consent.
