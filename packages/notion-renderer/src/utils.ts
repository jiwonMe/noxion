import type { Block } from "notion-types";

interface NotionDateValue {
  type: string;
  start_date: string;
  start_time?: string;
  end_date?: string;
  end_time?: string;
}

export function formatNotionDate(dateValue: NotionDateValue): string {
  const { type, start_date, start_time, end_date } = dateValue;

  switch (type) {
    case "date":
      return formatDateString(start_date);
    case "datetime":
      return `${formatDateString(start_date)} ${start_time ?? ""}`.trim();
    case "daterange":
      return `${formatDateString(start_date)} → ${formatDateString(end_date ?? "")}`;
    case "datetimerange":
      return `${formatDateString(start_date)} ${start_time ?? ""} → ${formatDateString(end_date ?? "")}`.trim();
    default:
      return start_date;
  }
}

function formatDateString(dateStr: string): string {
  if (!dateStr) return "";
  try {
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export function unwrapBlockValue<T>(record: unknown): T | undefined {
  if (!record) return undefined;
  const rec = record as { value?: unknown };
  const val = rec.value;
  if (val && typeof val === "object" && "role" in (val as Record<string, unknown>) && "value" in (val as Record<string, unknown>)) {
    return ((val as Record<string, unknown>).value) as T;
  }
  return val as T | undefined;
}

export function getBlockTitle(block: Block): string {
  const props = block.properties as Record<string, unknown[][]> | undefined;
  if (!props?.title) return "Untitled";
  const titleSegments = props.title;
  return titleSegments.map((segment) => (segment as string[])[0] ?? "").join("");
}

export function cs(...classes: Array<string | undefined | false | null>): string {
  return classes.filter(Boolean).join(" ");
}
