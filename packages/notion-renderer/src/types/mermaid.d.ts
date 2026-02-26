declare module "mermaid" {
  interface MermaidAPI {
    initialize(config: { startOnLoad?: boolean; theme?: string }): void;
    render(id: string, text: string): Promise<{ svg: string }>;
  }
  const mermaid: MermaidAPI;
  export default mermaid;
}
