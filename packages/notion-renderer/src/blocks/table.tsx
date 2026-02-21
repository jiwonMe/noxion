import type { Decoration } from "notion-types";
import type { NotionBlockProps } from "../types";
import { useNotionRenderer } from "../context";
import { Text } from "../components/text";

export function TableBlock({ block }: NotionBlockProps) {
  const { recordMap } = useNotionRenderer();

  const format = block.format as {
    table_block_column_order?: string[];
    table_block_column_header?: boolean;
    table_block_row_header?: boolean;
  } | undefined;

  const columnOrder = format?.table_block_column_order ?? [];
  const hasColumnHeader = format?.table_block_column_header ?? false;
  const hasRowHeader = format?.table_block_row_header ?? false;
  const rowIds = block.content ?? [];

  if (!rowIds.length || !columnOrder.length) return null;

  const rows = rowIds
    .map((rowId) => {
      const rowBlock = recordMap.block[rowId];
      if (!rowBlock) return null;
      const val = rowBlock.value;
      const row = (val && typeof val === "object" && "role" in val && "value" in val)
        ? (val as { value: unknown }).value
        : val;
      return row as { id: string; type: string; properties?: Record<string, Decoration[]> } | null;
    })
    .filter((r): r is NonNullable<typeof r> => r != null && r.type === "table_row");

  return (
    <table className="noxion-table">
      {hasColumnHeader && rows.length > 0 && (
        <thead className="noxion-table__head">
          <tr className="noxion-table__row">
            {columnOrder.map((colId, colIndex) => (
              <th
                key={colId}
                className={`noxion-table__cell noxion-table__cell--header${colIndex === 0 && hasRowHeader ? " noxion-table__cell--row-header" : ""}`}
              >
                <Text value={rows[0].properties?.[colId]} />
              </th>
            ))}
          </tr>
        </thead>
      )}
      <tbody className="noxion-table__body">
        {(hasColumnHeader ? rows.slice(1) : rows).map((row) => (
          <tr key={row.id} className="noxion-table__row">
            {columnOrder.map((colId, colIndex) => {
              const CellTag = colIndex === 0 && hasRowHeader ? "th" : "td";
              return (
                <CellTag
                  key={colId}
                  className={`noxion-table__cell${colIndex === 0 && hasRowHeader ? " noxion-table__cell--row-header" : ""}`}
                >
                  <Text value={row.properties?.[colId]} />
                </CellTag>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
