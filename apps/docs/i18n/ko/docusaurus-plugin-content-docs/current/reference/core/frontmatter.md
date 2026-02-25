---
title: 프론트매터
description: "@noxion/core 프론트매터 API"
---

# 프론트매터

```ts
import { parseFrontmatter, parseKeyValuePairs, applyFrontmatter } from "@noxion/core";
```

Noxion은 Notion 페이지의 **첫 번째 코드 블록**에서 프론트매터를 읽습니다. 해당 블록은 `code` 타입이어야 하며 `key: value` 형식으로 작성합니다.

## `parseFrontmatter()`

```ts
function parseFrontmatter(
  recordMap: ExtendedRecordMap,
  pageId: string
): Record<string, string> | null
```

페이지의 첫 번째 코드 블록에서 키-값 쌍을 추출합니다. 코드 블록이 없으면 `null`을 반환합니다.

```ts
const frontmatter = parseFrontmatter(recordMap, post.id);
// { cleanUrl: "/my-post", title: "내 SEO 제목", description: "..." }
```

---

## `parseKeyValuePairs()`

```ts
function parseKeyValuePairs(text: string): Record<string, string>
```

여러 줄의 `key: value` 문자열을 파싱합니다. `#`으로 시작하는 줄은 주석으로 처리해 무시합니다.

```ts
parseKeyValuePairs(`
cleanUrl: /my-post
title: 내 포스트
# description: (초안)
floatFirstTOC: right
`);
// { cleanUrl: "/my-post", title: "내 포스트", floatFirstTOC: "right" }
```

---

## `applyFrontmatter()`

```ts
function applyFrontmatter<T extends NoxionPage>(
  page: T,
  frontmatter: Record<string, string>
): T
```

프론트매터 값을 `NoxionPage`(또는 하위 타입)에 적용합니다. 알려진 키는 상위 필드/metadata에 매핑됩니다:

| 프론트매터 키 | 대상 필드 |
|--------------|----------|
| `cleanUrl` | `slug` (앞의 `/` 제거) |
| `slug` | `slug` (앞의 `/` 제거) |
| `title` | `title` |
| `description` | `description` |
| `tags` | `metadata.tags` (쉼표 구분) |
| `coverImage` / `cover` | `coverImage` |

알 수 없는 키를 포함한 모든 키는 `page.frontmatter`에 보존되며, 알 수 없는 키는 `page.metadata`에도 복사됩니다.
