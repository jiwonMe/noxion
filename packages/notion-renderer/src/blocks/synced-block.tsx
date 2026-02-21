import type { NotionBlockProps } from "../types";
import { useNotionRenderer } from "../context";
import { NotionBlock } from "../block";

export function SyncedContainerBlock({ children }: NotionBlockProps) {
  return <div className="noxion-synced-block">{children}</div>;
}

export function SyncedReferenceBlock({ block }: NotionBlockProps) {
  const { recordMap } = useNotionRenderer();

  const format = block.format as {
    transclusion_reference_pointer?: { id: string; spaceId?: string };
  } | undefined;

  const sourceId = format?.transclusion_reference_pointer?.id;
  if (!sourceId) return null;

  const sourceBlock = recordMap.block[sourceId];
  if (!sourceBlock) return null;

  const source = sourceBlock.value;
  const resolved = (source && typeof source === "object" && "role" in source && "value" in source)
    ? (source as { value: { content?: string[] } }).value
    : source as { content?: string[] } | undefined;

  if (!resolved?.content?.length) return null;

  return (
    <div className="noxion-synced-block noxion-synced-block--reference">
      {resolved.content.map((childId) => (
        <NotionBlock key={childId} blockId={childId} level={1} />
      ))}
    </div>
  );
}
