---
sidebar_position: 3
title: RSS 플러그인
---

# RSS 플러그인

```ts
createRSSPlugin({
  feedPath: "/feed.xml",  // 피드 URL 경로
  limit: 20,              // 피드에 포함할 최대 포스트 수
})
```

`/feed.xml`의 RSS 피드에는 다음이 포함됩니다:
- 포스트 제목, 링크, 설명, 발행일
- `dc:creator` (작성자)
- 포스트 태그별 `category` 태그
- `atom:link` 자기 참조

피드 자동 감지를 위해 `<head>`에 `<link rel="alternate" type="application/rss+xml">`이 자동으로 추가됩니다.
