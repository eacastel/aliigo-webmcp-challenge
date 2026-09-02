export type JsonSchema = {
  type: "object";
  properties: Record<string, Record<string, unknown>>;
  required?: string[];
  additionalProperties: false;
};

export type InvocationSource = "webmcp" | "simulation" | "human";
export type ToolExecutionContext = { signal?: AbortSignal; source: InvocationSource };
export type ActionLayerTool = {
  name: string;
  title: string;
  description: string;
  inputSchema: JsonSchema;
  annotations: { readOnlyHint: boolean; untrustedContentHint: boolean };
  execute: (input: Record<string, unknown>, context: ToolExecutionContext) => Promise<Record<string, unknown>>;
};
export type RegisteredToolSummary = { name: string; title?: string; description: string; inputSchema?: JsonSchema | string };

export interface ModelContextLike {
  registerTool(
    tool: {
      name: string;
      title?: string;
      description: string;
      inputSchema?: JsonSchema;
      annotations?: { readOnlyHint?: boolean; untrustedContentHint?: boolean };
      execute: (input: Record<string, unknown>, options?: { signal: AbortSignal }) => Promise<unknown>;
    },
    options?: { signal?: AbortSignal; exposedTo?: string[] },
  ): Promise<void>;
  getTools?(): Promise<RegisteredToolSummary[]>;
  executeTool?(tool: RegisteredToolSummary, inputObject?: Record<string, unknown> | string, options?: { signal?: AbortSignal }): Promise<string>;
}

declare global { interface Document { modelContext?: ModelContextLike; } }
