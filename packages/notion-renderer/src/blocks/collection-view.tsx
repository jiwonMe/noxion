import type { Block, Decoration } from "notion-types";
import type { ReactElement } from "react";
import type { NotionBlockProps } from "../types";
import { useNotionRenderer } from "../context";
import { CollectionViewPlaceholder } from "./collection-view-placeholder";
import { unwrapBlockValue } from "../utils";
import { createLazyBlock } from "../utils/lazy-block";

interface CollectionSchemaProperty {
  name?: string;
  type?: string;
  options?: Array<{ id?: string; value?: string }>;
}

interface CollectionViewProperty {
  property?: string;
  visible?: boolean;
}

interface CollectionViewValue {
  type?: string;
  format?: {
    table_properties?: CollectionViewProperty[];
  };
}

interface CollectionRow {
  id: string;
  properties: Record<string, unknown>;
}

interface CollectionViewInteractiveProps extends NotionBlockProps {
  schema: Record<string, { name: string; type: string }>;
  visibleColumns: string[];
  rows: CollectionRow[];
}

const LazyCollectionViewInteractive = createLazyBlock<CollectionViewInteractiveProps>(
  () => import("./collection-view-interactive")
);

export interface CollectionViewProps {
  collectionId: string;
  viewId: string;
  schema: Record<string, { name: string; type: string }>;
  rows: Array<{ id: string; properties: Record<string, unknown> }>;
}

export interface CollectionViewExtensionPoint {
  type: string;
  render: (props: CollectionViewProps) => ReactElement | null;
}

export function CollectionViewBlock(props: NotionBlockProps) {
  const { block, blockId } = props;
  const { recordMap } = useNotionRenderer();

  const blockValue = unwrapBlockValue<Block>(recordMap.block[blockId]) ?? block;
  const collectionId = (blockValue as { collection_id?: string }).collection_id;
  const viewIds = (blockValue as { view_ids?: string[] }).view_ids;
  const viewId = viewIds?.[0];

  if (!collectionId || !viewId) {
    return <CollectionViewPlaceholder {...props} />;
  }

  const collectionValue = unwrapBlockValue<{ schema?: Record<string, CollectionSchemaProperty> }>(
    recordMap.collection[collectionId]
  );
  const viewValue = unwrapBlockValue<CollectionViewValue>(recordMap.collection_view[viewId]);

  if (!collectionValue?.schema || !viewValue) {
    return <CollectionViewPlaceholder {...props} />;
  }

  const schema = collectionValue.schema;
  const schemaKeys = Object.keys(schema);
  const tableProperties = viewValue.format?.table_properties;
  const visibleColumns = tableProperties?.length
    ? tableProperties
      .filter((property) => property.property && property.visible !== false)
      .map((property) => property.property as string)
      .filter((propertyId) => schema[propertyId])
    : schemaKeys;

  const queryRoot = (recordMap.collection_query as Record<string, Record<string, unknown> | undefined>)[collectionId];
  const queryValue = queryRoot?.[viewId] as
    | {
      collection_group_results?: { blockIds?: string[] };
      blockIds?: string[];
    }
    | undefined;

  const rowIds = queryValue?.collection_group_results?.blockIds ?? queryValue?.blockIds ?? [];
  const rows: CollectionRow[] = rowIds
    .map((rowId) => {
      const rowBlock = unwrapBlockValue<Block>(recordMap.block[rowId]);
      if (!rowBlock) return null;
      return {
        id: rowId,
        properties: (rowBlock.properties as Record<string, unknown> | undefined) ?? {},
      };
    })
    .filter((row): row is CollectionRow => row != null);

  if (!rows.length) {
    return <div className="noxion-collection-view__empty">No items</div>;
  }

  const normalizedSchema = Object.fromEntries(
    visibleColumns.map((propertyId) => [
      propertyId,
      {
        name: schema[propertyId]?.name ?? propertyId,
        type: schema[propertyId]?.type ?? "text",
      },
    ])
  );

  const staticTable = (
    <table className="noxion-collection-view noxion-collection-view__table">
      <thead>
        <tr>
          {visibleColumns.map((propertyId) => (
            <th key={propertyId} scope="col">
              {schema[propertyId]?.name ?? propertyId}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.id}>
            {visibleColumns.map((propertyId) => (
              <td key={`${row.id}-${propertyId}`}>
                {renderCellValue(row.properties[propertyId], schema[propertyId])}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <>
      {staticTable}
      <LazyCollectionViewInteractive
        block={block}
        blockId={blockId}
        level={props.level}
        schema={normalizedSchema}
        visibleColumns={visibleColumns}
        rows={rows}
      />
    </>
  );
}

function renderCellValue(value: unknown, schemaProperty: CollectionSchemaProperty | undefined): ReactElement | string {
  const type = schemaProperty?.type;

  if (type === "checkbox") {
    return isTruthyCheckbox(value) ? "✓" : "✗";
  }

  const texts = getPropertyTexts(value);

  if (type === "select") {
    return getSelectLabel(texts[0], schemaProperty) ?? texts[0] ?? "";
  }

  if (type === "multi_select") {
    return texts
      .map((item) => getSelectLabel(item, schemaProperty) ?? item)
      .filter(Boolean)
      .join(", ");
  }

  if (type === "url") {
    const url = texts[0] ?? "";
    if (!url) return "";
    return <a href={url}>{url}</a>;
  }

  if (type === "date") {
    return texts.join(", ");
  }

  if (type === "number") {
    return texts[0] ?? "";
  }

  if (type === "title" || type === "text") {
    return texts.join("");
  }

  return texts.join(", ");
}

function getPropertyTexts(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  const results: string[] = [];
  for (const item of value as Decoration[]) {
    if (!Array.isArray(item)) continue;
    const raw = item[0];
    if (typeof raw === "string") {
      results.push(raw);
      continue;
    }
    if (raw && typeof raw === "object" && "start_date" in raw) {
      const startDate = (raw as { start_date?: string }).start_date;
      if (typeof startDate === "string") results.push(startDate);
    }
  }

  return results;
}

function isTruthyCheckbox(value: unknown): boolean {
  const text = getPropertyTexts(value)[0]?.toLowerCase().trim();
  return text === "yes" || text === "true" || text === "1";
}

function getSelectLabel(value: string | undefined, schemaProperty: CollectionSchemaProperty | undefined): string | undefined {
  if (!value) return undefined;
  const option = schemaProperty?.options?.find((item) => item.id === value || item.value === value);
  return option?.value ?? value;
}
