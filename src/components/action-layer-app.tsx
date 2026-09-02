"use client";

import Link from "next/link";
import { useState, type CSSProperties } from "react";
import { useActionLayer } from "@/app/providers";
import { BrandMark } from "./brand-mark";
import { BusinessSwitcher } from "./business-switcher";

export function ActionLayerApp() {
  const { selected, business, tools, webmcp, activity, prepared, runTool, confirmPrepared, reset } = useActionLayer();
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string>();

  async function runScenario() {
    setRunning(true); setError(undefined); reset();
    try {
      if (selected === "luma") {
        await runTool("find_services", { goal: "back tension", maxPriceEur: 100 });
        await runTool("find_available_times", { serviceId: "therapeutic-massage", day: "Friday", period: "afternoon" });
        await runTool("prepare_booking", { serviceId: "therapeutic-massage", date: "2026-09-04", time: "16:30", note: "Focus on upper-back tension" });
      } else {
        await runTool("find_print_options", { product: "postcards", quantity: 500, priority: "premium" });
        await runTool("check_artwork_requirements", { productId: "event-postcards", artworkSupplied: true });
        await runTool("prepare_quote_request", { productId: "event-postcards", quantity: 500, size: "A6", stockId: "silk-350", artworkSupplied: true, neededBy: "2026-09-11" });
      }
    } catch (reason) { setError(reason instanceof Error ? reason.message : "The demonstration could not run."); }
    finally { setRunning(false); }
  }

  return <main>
    <header className="site-header shell">
      <Link className="brand" href="/"><BrandMark /><span>ALIIGO <i>LABS</i></span></Link>
      <div className="header-links"><span className={webmcp.available ? "status-pill live" : "status-pill"}><b>{webmcp.available ? "Agent ready" : "Demo ready"}</b>{tools.length} tools</span><Link href="/diagnostics">Diagnostics</Link></div>
    </header>

    <section className="hero shell">
      <div className="hero-copy"><p className="kicker">Aliigo Action Layer · WebMCP experiment</p><h1>Make a business usable by people <em>and</em> their agents.</h1><p className="lede">Approved business knowledge becomes safe, task-specific tools. The agent researches and prepares. The person stays in control.</p></div>
      <div className="idea-diagram" aria-label="Business knowledge and capabilities become agent tools"><div><span>01</span> Business knowledge</div><b>+</b><div><span>02</span> Business capabilities</div><b>→</b><div className="diagram-result"><span>03</span> Structured agent tools</div></div>
    </section>

    <section className="experience shell">
      <div className="experience-intro"><div><p className="section-label">One publisher, two businesses</p><h2>Change the business. Change the tools.</h2></div><BusinessSwitcher /></div>
      <div className="workspace" style={{ "--accent": business.accent } as CSSProperties}>
        <section className="business-panel">
          <div className="business-heading"><div className="business-monogram">{selected === "luma" ? "LU" : "NS"}</div><div><p>{business.category} · {business.location}</p><h2>{business.name}</h2></div></div>
          <p className="business-promise">{business.promise}</p>
          <div className="offering-grid">{business.offerings.map((offering, index) => <article className={index === 0 ? "offering featured" : "offering"} key={offering.id}><div><p>{index === 0 ? "Recommended path" : "Approved option"}</p><h3>{offering.name}</h3><span>{offering.summary}</span></div><strong>{offering.priceLabel}</strong></article>)}</div>
          <div className="prompt-card"><span className="prompt-icon">✦</span><div><p>Try this with an agent</p><blockquote>{selected === "luma" ? "I have back tension and want something Friday afternoon under €100. Find an appropriate service and prepare the best option for me." : "I need 500 premium event postcards for next Friday. I have artwork but don’t know which stock to choose. Prepare a quote request."}</blockquote></div></div>
          <div className="simulation-callout"><div><p>Preview without WebMCP</p><span>This runs the same bounded handlers in clearly labeled simulation mode.</span></div><button className="primary-button" type="button" onClick={runScenario} disabled={running}>{running ? "Preparing…" : "Simulate agent flow"}</button></div>
          {error && <p className="error-message" role="alert">{error}</p>}
        </section>

        <aside className="shared-panel">
          <div className="panel-title"><div><p>Shared action</p><h2>{prepared ? (prepared.status === "confirmed" ? "Completed" : "Ready to review") : "Waiting for an agent"}</h2></div><span className={prepared ? "pulse active" : "pulse"} /></div>
          {!prepared ? <div className="empty-state"><span>↗</span><h3>Research stays visible.</h3><p>When an agent uses a tool, the resulting draft appears here for the person to review.</p></div>
          : prepared.kind === "booking" ? <div className="ready-card" data-testid="prepared-booking"><p className="ready-label">{prepared.status === "confirmed" ? "Booking confirmed" : "Appointment draft"}</p><h3>{prepared.serviceName}</h3><dl><div><dt>When</dt><dd>{prepared.date} · {prepared.time}</dd></div><div><dt>Price</dt><dd>{prepared.price}</dd></div><div><dt>Note</dt><dd>{prepared.note || "No note"}</dd></div></dl><p className="provenance">✓ {prepared.provenance.source} · reviewed {prepared.provenance.lastReviewed}</p>{prepared.status === "ready" && <button className="confirm-button" type="button" onClick={confirmPrepared}>Confirm booking</button>}{prepared.status === "confirmed" && <p className="confirmed-message">Confirmed by you — not silently by the agent.</p>}</div>
          : <div className="ready-card" data-testid="prepared-quote"><p className="ready-label">{prepared.status === "confirmed" ? "Request submitted" : "Quote request draft"}</p><h3>{prepared.quantity} {prepared.productName}</h3><dl><div><dt>Specification</dt><dd>{prepared.size} · {prepared.stock}</dd></div><div><dt>Artwork</dt><dd>{prepared.artworkSupplied ? "Customer artwork supplied" : "Design help needed"}</dd></div><div><dt>Needed</dt><dd>{prepared.neededBy}</dd></div><div><dt>Estimate</dt><dd>{prepared.estimate}</dd></div></dl><p className="provenance">✓ {prepared.provenance.source} · reviewed {prepared.provenance.lastReviewed}</p>{prepared.status === "ready" && <button className="confirm-button" type="button" onClick={confirmPrepared}>Review and submit</button>}{prepared.status === "confirmed" && <p className="confirmed-message">Submitted by you — the agent only prepared it.</p>}</div>}
          <div className="activity-feed"><div className="activity-heading"><h3>Agent activity</h3><span>{activity.length ? `${activity.length} events` : "No activity yet"}</span></div>{activity.slice(0, 4).map((entry) => <div className="activity-item" key={entry.id}><span>{entry.source === "human" ? "You" : entry.source === "webmcp" ? "Agent" : "Sim"}</span><p>{entry.summary}</p></div>)}</div>
        </aside>
      </div>
    </section>

    <section className="trust-section shell"><p className="section-label">Designed for trust</p><div className="trust-grid"><article><span>01</span><h3>Approved facts</h3><p>Results identify the business-approved source and review date for important facts.</p></article><article><span>02</span><h3>Narrow actions</h3><p>No arbitrary commands or URLs. Each capability is bounded to the selected business.</p></article><article><span>03</span><h3>Human confirmation</h3><p>Agents prepare consequential actions; people review and complete them in the visible UI.</p></article></div></section>
    <footer className="site-footer shell"><div><BrandMark /><p><b>Aliigo Action Layer</b><span>An independent 2026 WebMCP Challenge experiment.</span></p></div><div><Link href="/diagnostics">WebMCP diagnostics</Link><a href="https://github.com/eacastel/aliigo-webmcp-challenge">Source code</a></div></footer>
  </main>;
}
