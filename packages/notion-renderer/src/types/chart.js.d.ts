declare module "chart.js" {
  export class Chart {
    static register(...items: unknown[]): void;
    constructor(ctx: CanvasRenderingContext2D, config: { type: string; data: unknown; options?: unknown });
    destroy(): void;
  }
  export const registerables: unknown[];
}
