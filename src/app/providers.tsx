"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { businesses } from "@/businesses";
import { createRegistry } from "@/webmcp/registry";
import { WebMCPPublisher, type PublishStatus } from "@/webmcp/publisher";
import type { ActivityEntry, BusinessId, PreparedAction, ToolEvent } from "@/businesses/types";
import type { InvocationSource } from "@/webmcp/types";

type ContextValue = {
  selected: BusinessId;
  selectBusiness: (id: BusinessId) => void;
  business: (typeof businesses)[BusinessId];
  tools: ReturnType<typeof createRegistry>["tools"];
  webmcp: PublishStatus;
  activity: ActivityEntry[];
  prepared?: PreparedAction;
  lastResult?: Record<string, unknown>;
  runTool: (name: string, input: Record<string, unknown>, source?: InvocationSource) => Promise<Record<string, unknown>>;
  confirmPrepared: () => void;
  reset: () => void;
};

const Context = createContext<ContextValue | null>(null);

export function ActionLayerProvider({ children }: { children: ReactNode }) {
  const [selected, setSelected] = useState<BusinessId>("luma");
  const [activity, setActivity] = useState<ActivityEntry[]>([]);
  const [prepared, setPrepared] = useState<PreparedAction>();
  const [lastResult, setLastResult] = useState<Record<string, unknown>>();
  const [webmcp, setWebmcp] = useState<PublishStatus>({ available: false, registered: [] });
  const publisher = useRef(new WebMCPPublisher());

  const emit = useCallback((event: ToolEvent) => {
    setActivity((current) => [{
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      at: new Date().toISOString(), source: event.source, tool: event.tool, summary: event.summary,
    }, ...current].slice(0, 8));
    setLastResult(event.result);
    if (event.prepared) setPrepared(event.prepared);
  }, []);

  const adapter = useMemo(() => createRegistry(selected, emit), [selected, emit]);

  useEffect(() => {
    let active = true;
    publisher.current.reconcile(document.modelContext, adapter.tools).then((status) => active && setWebmcp(status));
    return () => { active = false; };
  }, [adapter]);
  useEffect(() => () => publisher.current.dispose(), []);

  const selectBusiness = useCallback((id: BusinessId) => {
    setSelected(id); setPrepared(undefined); setActivity([]); setLastResult(undefined);
  }, []);
  const runTool = useCallback(async (name: string, input: Record<string, unknown>, source: InvocationSource = "simulation") => {
    const tool = adapter.tools.find((candidate) => candidate.name === name);
    if (!tool) throw new Error(`${name} is not exposed for ${adapter.definition.name}`);
    return tool.execute(input, { source });
  }, [adapter]);
  const confirmPrepared = useCallback(() => {
    setPrepared((current) => current ? { ...current, status: "confirmed" } : current);
    setActivity((current) => [{
      id: `${Date.now()}-confirm`, at: new Date().toISOString(), source: "human", tool: "human_confirmation",
      summary: prepared?.kind === "booking" ? "Booking confirmed by the person in the website." : "Quote request submitted by the person in the website.",
    }, ...current]);
  }, [prepared]);
  const reset = useCallback(() => { setPrepared(undefined); setActivity([]); setLastResult(undefined); }, []);
  const value = useMemo<ContextValue>(() => ({ selected, selectBusiness, business: businesses[selected], tools: adapter.tools, webmcp, activity, prepared, lastResult, runTool, confirmPrepared, reset }), [selected, selectBusiness, adapter.tools, webmcp, activity, prepared, lastResult, runTool, confirmPrepared, reset]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useActionLayer() {
  const value = useContext(Context);
  if (!value) throw new Error("useActionLayer must be used inside ActionLayerProvider");
  return value;
}
