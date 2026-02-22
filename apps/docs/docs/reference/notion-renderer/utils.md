---
title: Utilities
description: "@noxion/notion-renderer utility functions — date formatting, block unwrapping, title extraction, classname joining"
---

# Utilities

```ts
import {
  formatNotionDate,
  unwrapBlockValue,
  getBlockTitle,
  cs,
} from "@noxion/notion-renderer";
```

Low-level helpers used internally by block components. Useful when building custom block overrides.

---

## `formatNotionDate()`

Format a Notion date value object into a human-readable English string.

### Signature

```ts
function formatNotionDate(dateValue: {
  type: string;       // "date" | "datetime" | "daterange" | "datetimerange"
  start_date: string; // ISO 8601 date (YYYY-MM-DD)
  start_time?: string;
  end_date?: string;
  end_time?: string;
}): string
```

### Returns

A formatted string based on `type`:

| `type` | Output format |
|--------|---------------|
| `"date"` | `"Jan 1, 2024"` |
| `"datetime"` | `"Jan 1, 2024 10:30"` |
| `"daterange"` | `"Jan 1, 2024 → Jan 7, 2024"` |
| `"datetimerange"` | `"Jan 1, 2024 10:30 → Jan 7, 2024"` |

### Example

```ts
formatNotionDate({
  type: "date",
  start_date: "2024-01-15",
});
// → "Jan 15, 2024"

formatNotionDate({
  type: "daterange",
  start_date: "2024-01-01",
  end_date: "2024-01-07",
});
// → "Jan 1, 2024 → Jan 7, 2024"

formatNotionDate({
  type: "datetime",
  start_date: "2024-03-20",
  start_time: "14:30",
});
// → "Mar 20, 2024 14:30"
```

### Notes

- Uses `Date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })`
- Invalid date strings are returned as-is (no throw)
- The locale is fixed to `"en-US"` — format is always `"Mon DD, YYYY"`

---

## `unwrapBlockValue()`

Unwrap a Notion record map entry into its underlying value. Handles the `{ role, value }` wrapper that the unofficial Notion API sometimes returns.

### Signature

```ts
function unwrapBlockValue<T>(record: unknown): T | undefined
```

### Returns

The unwrapped value, or `undefined` if `record` is null/undefined.

### Background

The unofficial Notion API returns record map entries in two possible shapes:

**Shape 1** (direct value):
```json
{ "type": "text", "id": "abc123", "content": [...], ... }
```

**Shape 2** (role-wrapped):
```json
{
  "role": "reader",
  "value": { "type": "text", "id": "abc123", "content": [...], ... }
}
```

`unwrapBlockValue()` handles both transparently.

### Example

```ts
import { unwrapBlockValue } from "@noxion/notion-renderer";
import type { Block } from "notion-types";

const rawRecord = recordMap.block["abc123"];
const block = unwrapBlockValue<Block>(rawRecord);
// block is now the actual Block object, regardless of wrapper shape
```

---

## `getBlockTitle()`

Extract the plain-text title from a Notion block's `properties.title` rich-text array.

### Signature

```ts
function getBlockTitle(block: Block): string
```

### Returns

`string` — the concatenated plain text of all title segments, or `"Untitled"` if the block has no title property.

### Example

```ts
import { getBlockTitle } from "@noxion/notion-renderer";

// A block with properties.title = [["Hello, "], ["world", [["b"]]]]
getBlockTitle(block);
// → "Hello, world"
```

### Notes

- Strips all formatting — returns plain text only
- Returns `"Untitled"` for blocks without `properties.title`
- Used internally by `PageBlock`, `AliasBlock`, and `TableOfContentsBlock` to get page/block titles for link labels

---

## `cs()`

A minimal conditional className utility — similar to [`clsx`](https://github.com/lukeed/clsx) but with zero dependencies.

### Signature

```ts
function cs(...classes: Array<string | undefined | false | null>): string
```

### Returns

A space-separated string of all truthy class values.

### Example

```ts
import { cs } from "@noxion/notion-renderer";

cs("noxion-image", true && "noxion-image--full-width", false && "noxion-image--dark")
// → "noxion-image noxion-image--full-width"

cs("base", undefined, null, "", "extra")
// → "base extra"

cs("a", condition ? "b" : undefined, "c")
// → "a c"  (when condition is false)
// → "a b c" (when condition is true)
```

### Usage in custom blocks

```tsx
import { cs } from "@noxion/notion-renderer";

function MyBlock({ block, active }: { block: Block; active: boolean }) {
  return (
    <div className={cs(
      "my-block",
      active && "my-block--active",
      block.type === "text" && "my-block--text",
    )}>
      ...
    </div>
  );
}
```
