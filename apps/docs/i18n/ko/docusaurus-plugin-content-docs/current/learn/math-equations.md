---
sidebar_position: 9
title: 수학 수식 (Math Equations)
description: KaTeX를 사용한 LaTeX 수학 수식 렌더링, 서버 측 렌더링, 클라이언트 JS 없음.
---

Noxion은 [KaTeX](https://katex.org/)를 사용하여 수학 수식을 렌더링하는 내장 지원을 제공합니다. 이를 통해 복잡한 공식, 그리스 문자, 수학적 표기법을 높은 성능과 아름다운 타이포그래피로 표시할 수 있습니다.

---

## 작동 방식

Noxion의 수식은 `katex.renderToString()`을 사용하여 서버에서 렌더링됩니다. 이는 수학적 표기법이 사용자의 브라우저에 도달하기 전에 표준 HTML과 CSS로 변환됨을 의미합니다.

- **클라이언트 JS 없음**: 수식을 렌더링하기 위해 클라이언트 측에서 자바스크립트가 필요하지 않습니다.
- **유연한 오류 처리**: 수식에 잘못된 LaTeX가 포함된 경우, Noxion은 오류를 포착하고 페이지를 깨뜨리는 대신 원본 텍스트를 렌더링합니다.
- **동적 로딩**: `katex` 패키지는 수식이 발견될 때만 동적으로 로드되어 초기 번들 크기를 작게 유지합니다.

---

## 수식의 종류

Notion은 페이지에 수학 수식을 포함하는 두 가지 고유한 방법을 지원합니다. Noxion은 두 가지 모두를 자동으로 처리합니다.

### 블록 수식 (Block Equations)
블록 수식은 별도의 줄을 차지하며 기본적으로 중앙에 배치됩니다. 중요한 공식이나 복잡한 유도 과정에 적합합니다. Notion에서 `/equation`을 입력하거나 블록 메뉴를 사용하여 생성할 수 있습니다.

### 인라인 수식 (Inline Equations)
인라인 수식은 텍스트 줄 안에 나타납니다. 단락의 흐름을 깨지 않고 $x$와 같은 변수나 $e=mc^2$와 같은 간단한 표현을 언급하는 데 적합합니다. Notion에서 텍스트를 강조 표시하고 서식 메뉴에서 "수식" 옵션을 선택하여 생성할 수 있습니다.

---

## 수식 작성하기

표준 LaTeX 문법을 사용하여 수식을 작성합니다. Notion은 입력하는 동안 실시간 미리보기를 제공하여 공식을 쉽게 확인할 수 있게 해줍니다.

### 일반적인 예시

| 설명 | LaTeX 문법 |
| :--- | :--- |
| 분수 | `\frac{a}{b}` |
| 지수 | `x^{2}` |
| 아래 첨자 | `a_{i}` |
| 적분 | `\int_{a}^{b} f(x) dx` |
| 합계 | `\sum_{i=1}^{n} i` |
| 그리스 문자 | `\alpha, \beta, \gamma, \Delta` |
| 행렬 | `\begin{matrix} a & b \\ c & d \end{matrix}` |

---

## 필수 CSS

수식용 HTML은 서버에서 생성되지만, 수식이 올바르게 표시되려면 프로젝트에 KaTeX CSS 파일을 포함해야 합니다. 이 CSS가 없으면 기호가 스타일이 적용되지 않은 텍스트로 나타납니다.

루트 레이아웃이나 문서 헤드에 다음 링크 태그를 추가하세요:

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/katex@0.16.0/dist/katex.min.css"
  integrity="sha384-Xi8rHCmBzhNVz4GV5Q1Z8veWtfk8MLVMzMzxtKyc6nqtAf2uLCZnwYB9QPWOyYKu"
  crossorigin="anonymous"
/>
```

또는 Next.js와 같은 프레임워크를 사용하는 경우 `_app.tsx`나 `layout.tsx`에서 임포트할 수 있습니다:

```typescript
import 'katex/dist/katex.min.css';
```

---

## 사용자 정의

Noxion은 사용자 정의 스타일링에 사용할 수 있는 특정 CSS 클래스로 수식을 감쌉니다.

- **블록 수식**: `.notion-equation-block`으로 감싸집니다.
- **인라인 수식**: `.notion-inline-equation`으로 감싸집니다.

글로벌 CSS에서 모든 수식의 글꼴 크기나 간격을 조정할 수 있습니다:

```css
.notion-equation-block {
  font-size: 1.2rem;
  margin: 2rem 0;
}

.notion-inline-equation {
  color: var(--primary-color);
}
```

---

## 성능상의 이점

수학 수식에 서버 측 렌더링 방식을 사용함으로써, Noxion은 MathJax와 같은 클라이언트 측 대안에 비해 여러 가지 장점을 제공합니다:

1. **즉각적인 가시성**: HTML이 로드되는 즉시 수식이 보입니다.
2. **SEO 친화적**: 검색 엔진이 렌더링된 공식의 HTML 콘텐츠를 인덱싱할 수 있습니다.
3. **낮은 리소스 사용량**: 모바일 기기에서 LaTeX를 파싱하고 렌더링하는 데 CPU 사이클을 소모할 필요가 없습니다.

:::note
지원되는 LaTeX 함수 및 기호의 전체 목록은 [KaTeX 문서](https://katex.org/docs/supported.html)를 참조하세요.
:::

`EquationBlock`과 `InlineEquation`이 어떻게 구현되어 있는지에 대한 자세한 내용은 [컴포넌트 참조](../reference/notion-renderer/components)를 확인하세요.
