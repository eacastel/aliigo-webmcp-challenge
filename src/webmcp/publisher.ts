import type { ActionLayerTool, ModelContextLike } from "./types";

export type PublishStatus = {
  available: boolean;
  registered: string[];
  error?: string;
};

export class WebMCPPublisher {
  private controller?: AbortController;
  private generation = 0;

  async reconcile(
    modelContext: ModelContextLike | undefined,
    tools: ActionLayerTool[],
  ): Promise<PublishStatus> {
    const generation = ++this.generation;
    this.controller?.abort("Business capability set changed");
    this.controller = undefined;

    if (!modelContext?.registerTool) {
      return { available: false, registered: [] };
    }

    const controller = new AbortController();
    this.controller = controller;
    try {
      for (const tool of tools) {
        if (generation !== this.generation || controller.signal.aborted) break;
        await modelContext.registerTool(
          {
            name: tool.name,
            title: tool.title,
            description: tool.description,
            inputSchema: tool.inputSchema,
            annotations: tool.annotations,
            execute: (input, options) =>
              tool.execute(input, { source: "webmcp", signal: options.signal }),
          },
          { signal: controller.signal },
        );
      }
      if (generation !== this.generation) return { available: true, registered: [] };
      return { available: true, registered: tools.map((tool) => tool.name) };
    } catch (error) {
      if (controller.signal.aborted || generation !== this.generation) {
        return { available: true, registered: [] };
      }
      return {
        available: true,
        registered: [],
        error: error instanceof Error ? error.message : "WebMCP registration failed",
      };
    }
  }

  dispose() {
    this.generation += 1;
    this.controller?.abort("Publisher disposed");
    this.controller = undefined;
  }
}
