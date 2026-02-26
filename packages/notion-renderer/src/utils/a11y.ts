import type { Block } from "notion-types";

/**
 * Generates an accessible label for a block based on its type and content.
 * Used for aria-label attributes on interactive and semantic elements.
 */
export function getAriaLabel(block: Block): string {
  const blockType = block.type || "block";
  const properties = block.properties as Record<string, unknown[][]> | undefined;
  const title = (properties?.title?.[0]?.[0] as string) ?? "";

  switch (blockType) {
    case "toggle":
      return `Toggle: ${title}`;
    case "callout":
      return `Callout: ${title}`;
    case "to_do":
      return `To-do: ${title}`;
    case "code":
      const language = (properties?.language?.[0]?.[0] as string) || "plain text";
      return `Code block in ${language}`;
    case "table":
      return "Data table";
    case "image":
      return "Image";
    case "quote":
      return `Quote: ${title}`;
    // 'heading' is not a valid notion block type; header/sub_header/sub_sub_header are used instead
    case "header":
      return `Heading: ${title}`;
    case "sub_header":
      return `Subheading: ${title}`;
    case "sub_sub_header":
      return `Sub-subheading: ${title}`;
    default:
      return title || blockType;
  }
}

/**
 * Handles keyboard activation for interactive elements.
 * Calls the provided callback when Enter or Space key is pressed.
 * Prevents default behavior to avoid unwanted scrolling or form submission.
 */
export function handleKeyboardActivation(
  event: React.KeyboardEvent,
  callback: () => void
): void {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    callback();
  }
}

/**
 * Generates a unique ID for toggle content based on block ID.
 * Used for aria-controls and id attributes to link toggle header to content.
 */
export function getToggleContentId(blockId: string): string {
  return `toggle-content-${blockId}`;
}
