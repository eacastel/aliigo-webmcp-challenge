"use client";
import Link from "next/link";
import { useActionLayer } from "@/app/providers";
import { BrandMark } from "./brand-mark";
import { BusinessSwitcher } from "./business-switcher";

export function DiagnosticsClient() {
  const { business, tools, webmcp, activity, lastResult } = useActionLayer();
  return <main className="diagnostics-page shell">
    <header className="site-header"><Link className="brand" href="/"><BrandMark /><span>ALIIGO <i>LABS</i></span></Link><Link href="/">← Back to demo</Link></header>
    <div className="diagnostics-heading"><p className="kicker">Developer verification</p><h1>WebMCP diagnostics</h1><p>Verify progressive enhancement, the current capability set, and the last structured result.</p></div>
    <BusinessSwitcher />
    <section className="diagnostic-grid">
      <article className="diagnostic-card summary-card"><p>Browser support</p><h2>{webmcp.available ? "WebMCP is available" : "WebMCP is not enabled in this browser."}</h2><span>{webmcp.available ? "document.modelContext.registerTool detected" : "The human UI and labeled simulation still work."}</span>{!webmcp.available && <div className="instruction"><b>Chrome testing</b><code>chrome://flags/#enable-webmcp-testing</code><p>Enable in Chrome 149+, relaunch, and reload. Or use ChatGPT’s supported in-app browser.</p></div>}{webmcp.error && <p className="error-message">Registration error: {webmcp.error}</p>}</article>
      <article className="diagnostic-card"><p>Selected business</p><h2>{business.name}</h2><span>{business.capabilities.length} domain capabilities</span><ul>{business.capabilities.map((capability) => <li key={capability}>{capability}</li>)}</ul></article>
      <article className="diagnostic-card tool-list-card"><p>Expected tool registry</p><h2>{tools.length} tools</h2><ul>{tools.map((tool) => <li key={tool.name}><code>{tool.name}</code><span>{tool.annotations.readOnlyHint ? "Read" : "Prepare"}</span></li>)}</ul></article>
      <article className="diagnostic-card tool-list-card"><p>Registered through WebMCP</p><h2>{webmcp.registered.length} tools</h2>{webmcp.registered.length ? <ul>{webmcp.registered.map((name) => <li key={name}><code>{name}</code><span>Registered</span></li>)}</ul> : <span>None reported. Enable WebMCP and reload.</span>}</article>
      <article className="diagnostic-card result-card"><p>Last tool execution</p><h2>{activity[0]?.tool ?? "No execution yet"}</h2><pre>{lastResult ? JSON.stringify(lastResult, null, 2) : "Run a scenario on the demo page to inspect its structured result."}</pre></article>
    </section>
  </main>;
}
