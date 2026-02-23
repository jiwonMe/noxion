---
sidebar_position: 2
title: 빠른 시작
description: 5분 안에 Noxion 사이트를 스캐폴딩하세요.
---

# 빠른 시작

이 가이드는 처음부터 실행 가능한 Noxion 사이트까지 5분 안에 안내합니다.

## 사전 요구사항

시작하기 전에 다음이 필요합니다:

- **[Bun](https://bun.sh) 1.0+** — Noxion은 패키지 관리와 스캐폴딩 CLI에 Bun을 사용합니다. 설치:
  ```bash
  curl -fsSL https://bun.sh/install | bash
  ```
  npm이나 pnpm을 선호하면 `bun` 대신 해당 패키지 매니저를 사용해도 됩니다.

- **[Notion](https://notion.so) 계정** — 무료 플랜으로 충분합니다.

- **Notion 데이터베이스** — 아직 만들지 않았다면 [Notion 설정](./notion-setup)을 참조하세요. 최소한 `Title`(제목 속성)과 `Public`(체크박스) 컬럼이 있는 데이터베이스가 필요합니다.

---

## 1단계: 프로젝트 스캐폴딩

스캐폴딩 CLI를 실행합니다:

```bash
bun create noxion my-site
```

### 템플릿 선택

CLI가 템플릿을 선택하라고 안내합니다:

| 템플릿 | 제공되는 것 |
|--------|------------|
| **Blog** (기본) | 포스트 목록과 상세 페이지가 있는 단일 블로그 |
| **Docs** | 사이드바 내비게이션과 섹션 그룹이 있는 문서 사이트 |
| **Portfolio** | 프로젝트 그리드, 필터링, 상세 페이지가 있는 포트폴리오 |
| **Full** | 세 가지 페이지 타입을 하나의 사이트에 결합 (블로그 + 문서 + 포트폴리오) |

`--template`을 전달하면 프롬프트를 건너뛸 수 있습니다:

```bash
bun create noxion my-blog --template blog
bun create noxion my-docs --template docs
bun create noxion my-site --template full
```

### 플러그인 또는 테마 스캐폴딩

플러그인이나 테마 스타터 프로젝트를 만들려면:

```bash
bun create noxion my-plugin --plugin
bun create noxion my-theme --theme
```

### 대화형 프롬프트

CLI가 다음 정보를 물어봅니다:

| 프롬프트 | 예시 | 참고 |
|---------|------|------|
| 프로젝트 이름 | `my-site` | 폴더 이름이 됩니다 |
| 템플릿 | `blog` | Blog, Docs, Portfolio, 또는 Full |
| Notion 페이지 ID | `abc123def456...` | 데이터베이스 URL의 32자 16진수 문자열 |
| 사이트 이름 | `My Site` | `<title>` 태그와 OG 메타데이터에 사용 |
| 사이트 설명 | `A site about...` | `<meta description>`에 사용 |
| 작성자 | `Jane Doe` | 기본 작성자 이름 |
| 도메인 | `mysite.com` | 프로덕션 도메인 — 캐노니컬 URL과 OG에 사용 |

**docs**와 **full** 템플릿에서는 Docs Notion 데이터베이스 ID도 물어봅니다. **portfolio**와 **full** 템플릿에서는 Portfolio Notion 데이터베이스 ID를 물어봅니다.

### Notion 페이지 ID 찾기

브라우저에서 Notion 데이터베이스를 엽니다. URL이 다음과 같이 보입니다:

```
https://notion.so/your-workspace/My-Database-abc123def456...
                                                ^^^^^^^^^^^^^^^^
```

끝부분의 32자 16진수 문자열(하이픈 포함 또는 미포함)이 **페이지 ID**입니다.

또는: 데이터베이스를 열고 **공유** → **링크 복사**를 클릭한 다음 URL에서 ID를 추출합니다.

### 비대화형 모드

프롬프트를 건너뛰고 싶다면 (CI/CD 또는 자동화에 유용):

```bash
bun create noxion my-blog \
  --yes \
  --template blog \
  --notion-id=abc123def456 \
  --name="My Blog" \
  --description="A blog about things I find interesting" \
  --author="Your Name" \
  --domain=myblog.com
```

---

## 2단계: 환경 변수 설정

```bash
cd my-site
cp .env.example .env
```

`.env`를 열어 값을 입력합니다:

```bash
# 필수
NOTION_PAGE_ID=abc123def456...   # Notion 데이터베이스 페이지 ID

# 사이트 메타데이터 (noxion.config.ts에서도 설정 가능)
SITE_DOMAIN=mysite.com
SITE_NAME=My Site
SITE_AUTHOR=Your Name
SITE_DESCRIPTION=A site about things I find interesting

# 선택: 비공개 Notion 페이지용
# NOTION_TOKEN=secret_xxx...

# 선택: 온디맨드 ISR 재검증용
# REVALIDATE_SECRET=some-random-secret

# docs/portfolio/full 템플릿용:
# DOCS_NOTION_ID=def456...
# PORTFOLIO_NOTION_ID=ghi789...
```

:::info 공개 vs. 비공개 Notion 페이지
기본적으로 Noxion은 **인증 없이** Notion 페이지에 접근합니다 (Notion의 웹 공유 기능과 동일한 방식). 데이터베이스가 비공개라면 통합 토큰을 만들어야 합니다 — [Notion 설정 → 비공개 페이지](./notion-setup#비공개-페이지-선택사항)를 참조하세요.
:::

---

## 3단계: 개발 서버 시작

```bash
bun install
bun run dev
```

[http://localhost:3000](http://localhost:3000)을 엽니다. Notion 페이지가 자동으로 나타납니다.

:::tip 첫 로딩이 느립니다
첫 페이지 로드는 Notion API에서 데이터를 가져옵니다 (보통 300–800ms). 이후 로드는 ISR 캐시를 사용하여 거의 즉시입니다. Vercel CDN을 사용하는 프로덕션에서는 캐시된 페이지가 50ms 이내에 제공됩니다.
:::

---

## 4단계: 배포

### Vercel (대부분의 사용자에게 추천)

```bash
vercel
```

Vercel이 ISR, 이미지 최적화 (Vercel Image Optimization), CDN을 자동으로 처리합니다. Vercel 대시보드의 **Settings → Environment Variables**에서 동일한 환경 변수를 추가하세요.

온디맨드 재검증 설정을 포함한 전체 안내는 [배포 → Vercel](./deployment/vercel)을 참조하세요.

### Docker (셀프호스팅 또는 VPS용)

```bash
docker compose up -d
```

멀티 스테이지 Dockerfile, 리소스 요구사항, nginx 리버스 프록시 설정에 대한 자세한 내용은 [배포 → Docker](./deployment/docker)를 참조하세요.

---

## 생성되는 파일 구조

### Blog 템플릿

```
my-blog/
├── app/
│   ├── layout.tsx              # 루트 레이아웃: ThemeProvider, 폰트, SEO 메타데이터
│   ├── page.tsx                # 홈페이지: PostList + JSON-LD
│   ├── [slug]/
│   │   └── page.tsx            # 포스트 상세: NotionPage + JSON-LD BlogPosting
│   ├── tag/[tag]/page.tsx      # 태그 필터 페이지
│   ├── feed.xml/route.ts       # RSS 2.0 피드
│   ├── sitemap.ts              # XML 사이트맵
│   └── robots.ts               # robots.txt
├── lib/
│   ├── config.ts               # noxion.config.ts 로드
│   └── notion.ts               # Notion 클라이언트와 데이터 페칭
├── noxion.config.ts            # 사이트 설정
└── package.json
```

### Full 템플릿 (멀티 타입)

```
my-site/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                # 모든 컬렉션이 포함된 홈페이지
│   ├── [slug]/page.tsx         # 블로그 포스트 페이지
│   ├── docs/[slug]/page.tsx    # 문서 페이지
│   ├── portfolio/[slug]/page.tsx  # 포트폴리오 프로젝트 페이지
│   ├── tag/[tag]/page.tsx
│   ├── feed.xml/route.ts
│   ├── sitemap.ts
│   └── robots.ts
├── lib/
│   ├── config.ts
│   └── notion.ts               # 페이지 타입별 fetchCollection
├── noxion.config.ts            # 컬렉션 설정
└── package.json
```

### 주요 파일 설명

**`noxion.config.ts`** — 사이트의 단일 소스. 모든 Noxion 패키지가 이 설정을 읽습니다. 플러그인 추가, 컬렉션 설정, 도메인 설정 등을 여기서 합니다.

**`lib/notion.ts`** — Notion 클라이언트를 생성하고 데이터 페칭 함수를 내보냅니다. 단일 데이터베이스 모드: `getAllPosts()`, `getPostBySlug()`. 멀티 데이터베이스 모드: 페이지 타입별 `fetchCollection()`.

**`app/[slug]/page.tsx`** — 포스트/페이지 상세 페이지. `generateStaticParams()`로 빌드 시 모든 공개 페이지를 사전 렌더링합니다. `generateMetadata()`로 페이지별 Open Graph / Twitter 메타데이터를 생성합니다.

**`app/sitemap.ts`** — Next.js가 `/sitemap.xml`을 자동 생성하는 데 사용하는 `MetadataRoute.Sitemap` 배열을 반환합니다.

---

## 작동 확인

개발 서버를 시작한 후 다음을 확인하세요:

1. **페이지 로드** — Notion 페이지가 홈페이지에 나타나야 합니다
2. **내비게이션 작동** — 카드를 클릭하면 전체 페이지가 렌더링되어야 합니다
3. **태그 작동** — 태그를 클릭하면 `/tag/[tag]`의 해당 태그 페이지로 필터링되어야 합니다

페이지가 나타나지 않으면 가장 흔한 원인은:
- `NOTION_PAGE_ID`가 잘못됨 (16진수 문자열을 다시 확인)
- 어떤 페이지에도 `Public` 체크박스가 체크되지 않음
- 데이터베이스의 컬럼 이름이 `Public`과 다름 (Noxion은 대소문자를 구분하지 않지만, 컬럼 타입은 `Checkbox`여야 함)

예상되는 데이터베이스 스키마는 [Notion 설정](./notion-setup)을 참조하세요.
