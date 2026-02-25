# Noxion v0.2 마이그레이션 가이드

## 개요

Noxion v0.2는 Notion 블로그 빌더에서 Blog, Docs, Portfolio 페이지 타입을 지원하는 완전한 Notion 웹사이트 빌더로 변모했습니다.

## 호환성 변경 사항

### 1. `BlogPost` → `NoxionPage` / `BlogPage`

`BlogPost` 인터페이스가 제네릭 `NoxionPage` 인터페이스로 대체되었습니다. 블로그 전용 필드는 `metadata` 객체로 이동했습니다.

**이전 (v0.1):**

```ts
interface BlogPost {
  id: string;
  title: string;
  slug: string;
  date: string;
  tags: string[];
  category?: string;
  author?: string;
  // ...
}

const post: BlogPost = await fetchPostBySlug(notion, dbId, "my-post");
console.log(post.date);
console.log(post.tags);
console.log(post.category);
```

**이후 (v0.2):**

```ts
interface BlogPage extends NoxionPage {
  pageType: 'blog';
  metadata: {
    date: string;
    tags: string[];
    category?: string;
    author?: string;
  };
}

const post: BlogPage = await fetchPostBySlug(notion, dbId, "my-post");
console.log(post.metadata.date);
console.log(post.metadata.tags);
console.log(post.metadata.category);
```

> **호환성 참고:** `BlogPost`는 `BlogPage`의 타입 별칭으로 유지되며 v0.3에서 제거될 예정입니다.

### 2. 어댑터 함수가 `NoxionPage`를 받음

모든 `@noxion/adapter-nextjs` 함수가 `BlogPost` 대신 `NoxionPage`를 받습니다:

```ts
// 이전
generateNoxionMetadata(blogPost, config);
generateBlogPostingLD(blogPost, config);
generateNoxionSitemap(blogPosts, config);

// 이후 — 동일한 호출 시그니처, NoxionPage를 전달
generateNoxionMetadata(page, config);
generateBlogPostingLD(page, config);
generateNoxionSitemap(pages, config);
```

### 3. Config: `defaultPageType` 필드 추가

`NoxionConfig`에 `defaultPageType`이 추가되었습니다 (기본값: `"blog"`). `loadConfig`가 아닌 수동으로 config를 구성하는 경우 이 필드를 추가하세요:

```ts
const config: NoxionConfig = {
  // ...기존 필드
  defaultPageType: "blog",
};
```

### 4. Config: 멀티 데이터베이스를 위한 `collections`

이제 여러 Notion 데이터베이스를 다른 페이지 타입으로 설정할 수 있습니다:

```ts
defineConfig({
  name: "My Site",
  domain: "mysite.com",
  collections: [
    { databaseId: "abc123", pageType: "blog" },
    { databaseId: "def456", pageType: "docs", pathPrefix: "/docs" },
    { databaseId: "ghi789", pageType: "portfolio", pathPrefix: "/projects" },
  ],
  // ...
});
```

`rootNotionPageId`를 사용하는 단일 데이터베이스 모드는 변경 없이 계속 작동합니다.

## 새 기능

### 페이지 타입

- **Blog** — 이전과 동일하지만 metadata 구조로 변경
- **Docs** — 섹션, 버전, 사이드바 내비게이션이 있는 문서 페이지
- **Portfolio** — 기술, 프로젝트 URL, 연도가 있는 프로젝트 쇼케이스

### 새 어댑터 내보내기

```ts
// 라우팅
import { generateNoxionRoutes, resolvePageType, buildPageUrl } from "@noxion/adapter-nextjs";

// JSON-LD
import { generateTechArticleLD, generateCreativeWorkLD, generatePageLD } from "@noxion/adapter-nextjs";
```

### 테마 시스템

- 컴포넌트, 레이아웃, 템플릿을 번들링하는 테마 컨트랙트 생성을 위한 `defineThemeContract()`
- 네임스페이스 템플릿: `docs/page`, `portfolio/grid`, `portfolio/project`
- `NoxionThemeContract.supports`로 테마가 지원하는 페이지 타입 선언

### 새 컴포넌트

테마 컨트랙트(`NoxionThemeContractComponents`)를 통해 사용 가능:
- `DocsSidebar`, `DocsBreadcrumb`
- `PortfolioProjectCard`, `PortfolioFilter`

## 마이그레이션 체크리스트

- [ ] `post.date` → `post.metadata.date`로 변경
- [ ] `post.tags` → `post.metadata.tags`로 변경
- [ ] `post.category` → `post.metadata.category`로 변경
- [ ] `post.author` → `post.metadata.author`로 변경
- [ ] 수동으로 구성한 `NoxionConfig`에 `defaultPageType: "blog"` 추가
- [ ] `BlogPost` 임포트를 `BlogPage`로 업데이트 (선택사항, 별칭이 아직 작동)
- [ ] 기존 블로그 페이지의 SEO 출력이 동일한지 테스트
