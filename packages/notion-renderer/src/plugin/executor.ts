import type { Block } from "notion-types";
import type { Decoration } from "notion-types";
import { PluginPriority, type BlockOverrideResult, type RendererPlugin, type TextTransformResult } from "./types";

function normalizePriority(priority?: RendererPlugin["priority"]): number {
  if (typeof priority === "number") return priority;
  return PluginPriority.NORMAL;
}

function sortPluginsByPriority(plugins: RendererPlugin[]): RendererPlugin[] {
  return [...plugins].sort((a, b) => normalizePriority(a.priority) - normalizePriority(b.priority));
}

export function resolveBlockRenderer(
  block: Block,
  blockId: string,
  plugins: RendererPlugin[]
): BlockOverrideResult | null {
  for (const plugin of sortPluginsByPriority(plugins)) {
    if (!plugin.blockOverride) continue;

    try {
      const result = plugin.blockOverride({ block, blockId });
      if (result) return result;
    } catch (error) {
      console.warn("[noxion] Plugin blockOverride error:", plugin.name, error);
    }
  }

  return null;
}
export function executeBlockTransforms(
  block: Block,
  blockId: string,
  plugins: RendererPlugin[]
): Block {
  let transformedBlock = block;

  for (const plugin of sortPluginsByPriority(plugins)) {
    if (!plugin.transformBlock) continue;

    try {
      transformedBlock = plugin.transformBlock({ block: transformedBlock, blockId });
    } catch (error) {
      console.warn("[noxion] Plugin block transform error:", plugin.name, error);
    }
  }

  return transformedBlock;
}

export function executeTextTransforms(
  decorations: Decoration[],
  block: Block,
  plugins: RendererPlugin[]
): Decoration[] {
  let transformedDecorations = [...decorations];
  const sortedPlugins = sortPluginsByPriority(plugins);

  for (const plugin of sortedPlugins) {
    if (!plugin.transformText) continue;

    const nextDecorations: Decoration[] = [];

    for (const decoration of transformedDecorations) {
      const text = decoration[0] as string;
      const formatting = decoration[1];

      // Skip decorated segments (code, equations, links)
      if (typeof text !== "string" || (Array.isArray(formatting) && formatting.length > 0)) {
        nextDecorations.push(decoration);
        continue;
      }

      try {
        const result = plugin.transformText({
          text,
          decorations: [decoration],
          block,
        });
        // Convert TextTransformResult back to Decoration[]
        const converted = textTransformResultToDecorations(result, text);
        nextDecorations.push(...converted);
      } catch (error) {
        console.warn("[noxion] Plugin text transform error:", plugin.name, error);
        nextDecorations.push(decoration);
      }
    }

    transformedDecorations = nextDecorations;
  }

  return transformedDecorations;
}

function textTransformResultToDecorations(
  result: TextTransformResult,
  originalText: string
): Decoration[] {
  if (!result.replacements || result.replacements.length === 0) {
    // No replacements, return text as plain decoration
    if (result.text === originalText) return [[originalText] as Decoration];
    return [[result.text] as Decoration];
  }

  const decorations: Decoration[] = [];
  const sorted = [...result.replacements]
    .filter((r) => r.start >= 0 && r.end > r.start && r.end <= result.text.length)
    .sort((a, b) => a.start - b.start);

  let cursor = 0;
  for (const replacement of sorted) {
    if (replacement.start < cursor) continue;
    if (replacement.start > cursor) {
      const before = result.text.slice(cursor, replacement.start);
      if (before) decorations.push([before] as Decoration);
    }
    // Render the replacement component as a decoration with the component as text
    decorations.push([replacement.component as unknown as string] as Decoration);
    cursor = replacement.end;
  }

  if (cursor < result.text.length) {
    const after = result.text.slice(cursor);
    if (after) decorations.push([after] as Decoration);
  }

  return decorations.length > 0 ? decorations : [[result.text] as Decoration];
}

export const applyTextTransforms = executeTextTransforms;
