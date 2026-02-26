"use client";

import { useMemo, useState } from "react";
import type { NotionBlockProps } from "../types";

export interface CollectionViewInteractiveProps extends NotionBlockProps {
  schema: Record<string, { name: string; type: string }>;
  visibleColumns: string[];
  rows: Array<{ id: string; properties: Record<string, unknown> }>;
}

export default function CollectionViewInteractive({
  schema,
  visibleColumns,
  rows,
}: CollectionViewInteractiveProps) {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [filterText, setFilterText] = useState("");

  const filteredRows = useMemo(() => {
    let result = [...rows];

    if (filterText) {
      const normalizedFilter = filterText.toLowerCase();
      result = result.filter((row) =>
        visibleColumns.some((colId) => {
          const text = getTextFromProperty(row.properties[colId]);
          return text.toLowerCase().includes(normalizedFilter);
        })
      );
    }

    if (sortColumn) {
      result.sort((a, b) => {
        const aVal = getTextFromProperty(a.properties[sortColumn]);
        const bVal = getTextFromProperty(b.properties[sortColumn]);
        const cmp = aVal.localeCompare(bVal);
        return sortDirection === "asc" ? cmp : -cmp;
      });
    }

    return result;
  }, [rows, sortColumn, sortDirection, filterText, visibleColumns]);

  const handleSort = (colId: string) => {
    if (sortColumn === colId) {
      setSortDirection((direction) => (direction === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(colId);
      setSortDirection("asc");
    }
  };

  return (
    <div className="noxion-collection-view noxion-collection-view--interactive">
      <div className="noxion-collection-view__toolbar">
        <input
          type="text"
          className="noxion-collection-view__filter"
          placeholder="Filter..."
          value={filterText}
          onChange={(event) => setFilterText(event.target.value)}
          aria-label="Filter table rows"
        />
      </div>
      <table className="noxion-collection-view__table">
        <thead>
          <tr>
            {visibleColumns.map((propertyId) => (
              <th
                key={propertyId}
                scope="col"
                onClick={() => handleSort(propertyId)}
                style={{ cursor: "pointer" }}
                aria-sort={
                  sortColumn === propertyId
                    ? sortDirection === "asc"
                      ? "ascending"
                      : "descending"
                    : "none"
                }
              >
                {schema[propertyId]?.name ?? propertyId}
                {sortColumn === propertyId && (sortDirection === "asc" ? " ↑" : " ↓")}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredRows.map((row) => (
            <tr key={row.id}>
              {visibleColumns.map((propertyId) => (
                <td key={`${row.id}-${propertyId}`}>{getTextFromProperty(row.properties[propertyId])}</td>
              ))}
            </tr>
          ))}
          {filteredRows.length === 0 && (
            <tr>
              <td colSpan={visibleColumns.length} className="noxion-collection-view__empty">
                No matching items
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function getTextFromProperty(value: unknown): string {
  if (!Array.isArray(value)) return "";

  return value
    .map((item) => {
      if (!Array.isArray(item)) return "";
      const raw = item[0];
      return typeof raw === "string" ? raw : "";
    })
    .join("");
}
