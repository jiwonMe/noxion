---
sidebar_position: 4
title: Comments Plugin
---

# Comments Plugin

## Giscus (recommended)

Uses GitHub Discussions. Free, no ads, open source.

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

Set up at [giscus.app](https://giscus.app) to get your `repoId` and `categoryId`.

## Utterances

Uses GitHub Issues.

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
