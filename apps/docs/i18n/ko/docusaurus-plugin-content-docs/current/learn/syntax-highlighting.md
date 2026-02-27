---
sidebar_position: 8
title: 구문 강조 (Syntax Highlighting)
description: Shiki를 사용한 VS Code 수준의 코드 블록 렌더링, 듀얼 테마, 38개 이상의 언어 지원, 클라이언트 JS 없음.
---

Noxion은 코드 블록에 고품질 구문 강조를 제공하기 위해 [Shiki](https://shiki.style/)를 사용합니다. Prism이나 Highlight.js와 달리, Shiki는 VS Code와 동일한 TextMate 문법 엔진을 사용하여 코드가 에디터에서와 똑같이 보이도록 보장합니다.

---

## 작동 방식

Noxion은 코드 블록을 완전히 서버에서 렌더링합니다. 구문 강조 프로세스는 빌드 또는 요청 단계에서 발생하며, 이는 브라우저로 전송되는 최종 HTML에 이미 필요한 스타일이 포함되어 있음을 의미합니다. 이 방식은 무거운 클라이언트 측 구문 강조 라이브러리의 필요성을 없애고 레이아웃 시프트를 방지합니다.

이 시스템의 핵심은 `createShikiHighlighter` 함수입니다. 이 함수는 Shiki 엔진을 초기화하고 `NotionRenderer`가 코드 블록을 처리하는 데 사용하는 `HighlightCodeFn`을 반환합니다.

```typescript
import { createShikiHighlighter } from '@noxion/notion-renderer';

// Initialize the highlighter
const highlightCode = await createShikiHighlighter({
  theme: 'github-light',
  darkTheme: 'github-dark',
});

// The resulting function matches this type:
// type HighlightCodeFn = (code: string, language: string) => string;
```

---

## 자동 설정

`@noxion/renderer`의 고수준 `<NotionPage />` 컴포넌트를 사용하면 구문 강조가 자동으로 설정됩니다. 기본적으로 `github-light`와 `github-dark` 테마를 사용합니다.

```tsx
import { NotionPage } from '@noxion/renderer';

export default function Page({ recordMap }) {
  return <NotionPage recordMap={recordMap} />;
}
```

저수준 `NotionRenderer`를 사용하는 사용자 정의 구현의 경우, 구문 강조 함수를 수동으로 전달해야 합니다.

```tsx
import { NotionRenderer, createShikiHighlighter } from '@noxion/notion-renderer';

const highlightCode = await createShikiHighlighter();

<NotionRenderer recordMap={recordMap} highlightCode={highlightCode} />
```

---

## 듀얼 테마 지원

Noxion은 라이트 테마와 다크 테마의 동시 렌더링을 지원합니다. 하이라이터에 `theme`과 `darkTheme`을 모두 제공하면, Shiki는 두 테마에 대한 토큰이 포함된 HTML을 생성합니다.

가시성은 CSS 변수를 통해 제어됩니다. 렌더러는 생성된 코드 블록에 특정 클래스를 적용하여, 사이트의 테마 토글이 다시 렌더링하지 않고도 즉시 테마를 전환할 수 있게 합니다.

:::tip
이 듀얼 테마 방식은 초기 로드 시 잘못된 테마가 잠깐 나타나는 "플래시" 현상 없이 다크 모드를 지원하려는 정적 사이트에 특히 유용합니다.
:::

---

## 지원되는 언어

Noxion은 기본적으로 38개의 자주 사용되는 언어를 포함합니다. 이 선택은 기능 범위와 번들 크기 및 성능 사이의 균형을 맞춘 것입니다.

| Language | Shiki ID | Language | Shiki ID |
| :--- | :--- | :--- | :--- |
| Bash | `bash` | C | `c` |
| C++ | `cpp` | C# | `csharp` |
| CSS | `css` | Dart | `dart` |
| Diff | `diff` | Docker | `docker` |
| Go | `go` | GraphQL | `graphql` |
| HTML | `html` | Java | `java` |
| JavaScript | `javascript` | JSON | `json` |
| JSX | `jsx` | Kotlin | `kotlin` |
| LaTeX | `latex` | Lua | `lua` |
| Makefile | `makefile` | Markdown | `markdown` |
| Objective-C | `objective-c` | Perl | `perl` |
| PHP | `php` | Python | `python` |
| R | `r` | Ruby | `ruby` |
| Rust | `rust` | Sass | `sass` |
| Scala | `scala` | SCSS | `scss` |
| Shell | `shellscript` | SQL | `sql` |
| Swift | `swift` | TOML | `toml` |
| TSX | `tsx` | TypeScript | `typescript` |
| XML | `xml` | YAML | `yaml` |

---

## 언어 매핑

Notion은 종종 Shiki의 내부 ID와 일치하지 않는 사람이 읽기 쉬운 이름이나 별칭을 언어에 사용합니다. Noxion은 `normalizeLanguage` 유틸리티를 사용하여 이러한 이름을 자동으로 정규화합니다.

| Notion Name | Shiki ID |
| :--- | :--- |
| `c++` | `cpp` |
| `c#` | `csharp` |
| `flow` | `javascript` |
| `shell` | `shellscript` |
| `plain text` | `text` |
| `java/c/c++/c#` | `java` |
| `markup` | `html` |

전체 언어 매핑 표는 [Shiki 참조](../reference/notion-renderer/shiki)를 확인하세요.

---

## 사용자 정의 설정

`createShikiHighlighter`에 옵션을 전달하여 하이라이터를 사용자 정의할 수 있습니다. 이를 통해 테마를 변경하거나 기본 세트에 포함되지 않은 추가 언어에 대한 지원을 추가할 수 있습니다.

```typescript
const highlightCode = await createShikiHighlighter({
  theme: 'nord',
  darkTheme: 'dracula',
  langs: ['python', 'rust', 'zig'], // Only load these specific languages
});
```

:::warning
많은 수의 추가 언어를 로드하면 서버 측 실행 시간과 메모리 사용량이 늘어날 수 있습니다. Notion 워크스페이스에서 실제로 사용하는 언어만 유지하세요.
:::

---

## 성능

Shiki는 완전히 빌드 또는 렌더링 시점에 실행됩니다. 출력물은 인라인 스타일이나 CSS 변수가 포함된 순수 HTML입니다.

- **클라이언트 JS 없음**: 사용자는 구문 강조를 위해 어떠한 자바스크립트도 다운로드하지 않습니다.
- **레이아웃 시프트 없음**: 구문 강조가 HTML에 포함되어 있으므로 페이지 로드 후 코드 블록이 갑자기 나타나지 않습니다.
- **빠른 실행**: Noxion은 하이라이터 인스턴스를 캐시하여 이후의 렌더링이 매우 빠르게 이루어지도록 합니다.

구현에 대한 더 자세한 기술적 내용은 [Shiki 참조](../reference/notion-renderer/shiki)를 확인하세요.
