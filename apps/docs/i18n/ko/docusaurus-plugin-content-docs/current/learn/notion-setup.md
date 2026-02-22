---
sidebar_position: 3
title: Notion 설정
description: Noxion용 Notion 데이터베이스를 설정하세요.
---

# Notion 설정

## 데이터베이스 만들기

Notion에서 새 **전체 페이지 데이터베이스**를 만듭니다(인라인 아님). 다음 속성을 추가하세요:

| 속성 | 타입 | 필수 | 설명 |
|------|------|------|------|
| Title | 제목 | ✅ | 포스트 제목 |
| Public | 체크박스 | ✅ | 체크하면 포스트 공개 |
| Published | 날짜 | — | 포스트에 표시되는 발행일 |
| Tags | 다중 선택 | — | 필터링용 포스트 태그 |
| Category | 선택 | — | 포스트 카테고리 |
| Slug | 텍스트 | — | 커스텀 URL 슬러그 (예: `my-post`) |
| Description | 텍스트 | — | SEO용 메타 설명 |
| Author | 텍스트 | — | 작성자 이름 (사이트 레벨 작성자 덮어씀) |

:::tip 유연한 스키마
Noxion은 속성 이름을 **대소문자 구분 없이** 매칭합니다. `public`과 `Public` 모두 작동합니다. 추가 속성은 무시됩니다.
:::

## 페이지 ID 가져오기

데이터베이스 페이지 URL에서:

```
https://notion.so/your-workspace/My-Database-abc123def456...
                                                ^^^^^^^^^^^^^^^^
                                                이것이 페이지 ID입니다
```

또는 공유 메뉴 → 링크 복사. 끝부분의 32자 16진수 문자열이 ID입니다.

## 비공개 페이지 (선택사항)

비공개 Notion 페이지를 위해 통합 토큰을 만드세요:

1. [notion.so/my-integrations](https://www.notion.so/my-integrations)로 이동
2. **새 통합** 클릭 → 이름 지정
3. **내부 통합 토큰** 복사
4. 데이터베이스에서 **...** → **연결 추가** → 통합 선택

그런 다음 `.env`에 추가:

```bash
NOTION_TOKEN=secret_xxx...
```

## 프론트매터 오버라이드

페이지의 **첫 번째 코드 블록**에 포스트별 메타데이터를 오버라이드할 수 있습니다:

```
cleanUrl: /my-custom-slug
title: 커스텀 SEO 제목 | 사이트 이름
description: 검색 엔진용 커스텀 메타 설명
floatFirstTOC: right
```

지원 키:

| 키 | 효과 |
|----|------|
| `cleanUrl` | URL 슬러그 오버라이드 |
| `title` | `<title>` 태그 오버라이드 |
| `description` | 메타 설명 오버라이드 |
| `date` | 발행일 오버라이드 |
| `category` | 카테고리 오버라이드 |
| `tags` | 태그 오버라이드 (쉼표 구분) |
| `coverImage` | 커버 이미지 URL 오버라이드 |

알 수 없는 키는 `post.frontmatter`에 보존됩니다.

:::note 프론트매터 주석
`#`으로 시작하는 줄은 주석으로 처리되어 무시됩니다:

```
cleanUrl: /my-post
# title: 초안 제목 (주석 처리됨)
description: 나의 설명
```
:::

---

## 지원하는 Notion 블록 타입

Noxion은 자체 블록 렌더러([`@noxion/notion-renderer`](https://github.com/jiwonme/noxion/tree/main/packages/notion-renderer))를 사용하여 30개 이상의 Notion 블록 타입을 지원합니다:

| 블록 타입 | 렌더링 결과 |
|-----------|------------|
| 문단 | `<p>` (볼드, 이탤릭, 코드, 컬러, 링크, 멘션 등 리치 텍스트 지원) |
| 제목 1/2/3 | `<h1>` / `<h2>` / `<h3>` (앵커 링크 포함) |
| 글머리 기호 목록 | `<ul><li>` (중첩 지원) |
| 번호 매기기 목록 | `<ol><li>` (중첩 지원) |
| 할 일 목록 | 체크박스 목록 |
| 토글 | `<details><summary>` (애니메이션 펼침/접기) |
| 인용 | `<blockquote>` |
| 콜아웃 | 이모지/아이콘이 포함된 스타일 콜아웃 상자 |
| 코드 블록 | [Shiki](https://shiki.style) 기반 구문 강조 (38개 언어, 라이트/다크 듀얼 테마, VS Code 수준) |
| 이미지 | `notion.so/image/` 프록시 URL로 최적화 |
| 구분선 | `<hr>` |
| 테이블 | HTML `<table>` (헤더 행 지원) |
| 컬럼 레이아웃 | 다중 컬럼 flex 레이아웃 |
| 임베드 | iFrame 임베드 |
| 비디오 | HTML5 `<video>` 또는 YouTube/Vimeo 임베드 |
| 오디오 | HTML5 `<audio>` 플레이어 |
| PDF | 임베드 PDF 뷰어 |
| 파일 | 파일 메타데이터가 포함된 다운로드 링크 |
| 북마크 | 제목, 설명, 아이콘이 포함된 리치 링크 카드 |
| 수식 (블록) | 서버 사이드 KaTeX 렌더링 (클라이언트 JS 불필요) |
| 수식 (인라인) | 리치 텍스트 내 인라인 KaTeX |
| 멘션 | 페이지, 사용자, 날짜, 데이터베이스 멘션 |
| 동기화 블록 | 소스 콘텐츠로 인라인 렌더링 |
| 목차 | 페이지 제목에서 자동 생성 |

:::note 인라인 데이터베이스
인라인 데이터베이스(컬렉션 뷰)는 현재 플레이스홀더로 렌더링됩니다. 전체 컬렉션 뷰 지원은 향후 릴리스에서 계획 중입니다.
:::
