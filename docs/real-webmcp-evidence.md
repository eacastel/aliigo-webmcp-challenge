# Real WebMCP verification evidence

Verified on **2 September 2026** with:

- Google Chrome **151.0.7922.137** (stable Linux binary);
- real Blink WebMCP implementation enabled with `--enable-features=WebMCP`, the command-line equivalent used for automated flag testing;
- Playwright driving the installed Chrome channel, not its bundled Chromium;
- origin-isolated local Next.js app with `Permissions-Policy: tools=(self)`;
- test: `tests/e2e/real-webmcp.spec.ts` with `REAL_WEBMCP=1`.

## Passed evidence

- `document.modelContext.registerTool` was genuinely available.
- `getTools()` returned the four Luma tools in Chrome.
- Chrome genuinely invoked `prepare_booking`.
- The website visibly rendered the Therapeutic Massage booking draft.
- Switching to Northstar unregistered/reconciled the capability set.
- `getTools()` returned the four Northstar tools and no Luma-only tools.
- Chrome genuinely invoked `prepare_quote_request`.
- The website visibly rendered the 500-postcard quote draft.
- Browser output: `REAL_WEBMCP_BROWSER=151.0.7922.137`.
- Result: **1 passed**.

## Chrome/spec compatibility observation

The 2 September 2026 WebMCP specification defines `executeTool(tool, inputObject, options)` with an object argument. Chrome 151's in-page `executeTool()` implementation still expects the JSON-string input form shown in Chrome's 20 August imperative API documentation; an object produced `Failed to parse input arguments`.

Chrome 151 may also omit the callback-options object for a local in-page `executeTool()` call. The publisher therefore treats the execution `signal` as optional while still forwarding it whenever the browser supplies it. The registered tool definition remains the current `document.modelContext.registerTool({ ..., execute(input, options) })` shape.

These compatibility details affect only the optional in-page inspection/execution test. Browser agents retrieve exposed tools through their browser integration, while application tool registration and callbacks use the current imperative API.

## Reproduce

```bash
REAL_WEBMCP=1 pnpm exec playwright test \
  tests/e2e/real-webmcp.spec.ts \
  --project desktop-chromium
```

The test is skipped by default so ordinary CI and browsers without Chrome 149+ remain supported.

## Remaining human evidence

Automated real-browser verification is complete. Emilio still needs to capture the real inspector/ChatGPT interaction as a visible video clip for the challenge submission; this is presentation evidence, not an implementation blocker.
