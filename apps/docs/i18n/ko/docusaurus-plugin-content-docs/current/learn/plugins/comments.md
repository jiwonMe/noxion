---
sidebar_position: 4
title: 댓글 플러그인
---

# 댓글 플러그인

## Giscus (추천)

GitHub Discussions 기반. 무료, 광고 없음, 오픈소스.

```ts
createCommentsPlugin({
  provider: "giscus",
  config: {
    repo: "owner/repo",
    repoId: "R_xxx",
    category: "Announcements",
    categoryId: "DIC_xxx",
  },
})
```

`repoId`와 `categoryId`는 [giscus.app](https://giscus.app)에서 설정하세요.

## Utterances

GitHub Issues 기반.

```ts
createCommentsPlugin({
  provider: "utterances",
  config: {
    repo: "owner/repo",
    issueTerm: "pathname",
    theme: "github-light",
  },
})
```

## Disqus

```ts
createCommentsPlugin({
  provider: "disqus",
  config: {
    shortname: "your-disqus-shortname",
  },
})
```
