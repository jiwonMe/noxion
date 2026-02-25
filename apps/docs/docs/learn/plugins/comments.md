---
sidebar_position: 4
title: Comments Plugin
description: Add a comment system to your Noxion blog with Giscus, Utterances, or Disqus.
---

# Comments Plugin

The comments plugin adds a comment section below each blog post. Three providers are supported: **Giscus** (recommended), **Utterances**, and **Disqus**.

---

## Giscus (recommended)

[Giscus](https://giscus.app) is a comments system powered by **[GitHub Discussions](https://docs.github.com/en/discussions)**. It's:
- **Free** and open source ([github.com/giscus/giscus](https://github.com/giscus/giscus))
- **No ads** and no tracking
- Requires a GitHub account to comment
- Comments are stored in your GitHub repository's Discussions tab

### Prerequisites

1. Your repository must be **public** (GitHub Discussions is not available on private repos for free)
2. Enable GitHub Discussions on your repo: **Settings → Features → Discussions** ✅
3. Install the [Giscus GitHub App](https://github.com/apps/giscus) and grant access to your repository

### Getting your IDs

The easiest way is to use the [Giscus configurator](https://giscus.app):

1. Enter your repository name (e.g., `owner/my-blog`)
2. Choose a discussion mapping (recommended: **pathname** — maps each post URL to a Discussion)
3. Choose a category (recommended: **Announcements** — prevents readers from creating new discussions directly)
4. Copy the `data-repo-id` and `data-category-id` values

Alternatively, you can find these IDs via the GitHub GraphQL API:

```bash
# Get repo ID
gh api graphql -f query='
  query { repository(owner: "owner", name: "my-blog") { id } }
'

# Get category ID
gh api graphql -f query='
  query {
    repository(owner: "owner", name: "my-blog") {
      discussionCategories(first: 10) {
        nodes { id name }
      }
    }
  }
'
```

### Configuration

```ts
createCommentsPlugin({
  provider: "giscus",
  config: {
    repo: "owner/my-blog",                          // GitHub repo
    repoId: "R_kgDOxxxxxxxx",                       // From Giscus configurator
    category: "Announcements",                       // Discussion category name
    categoryId: "DIC_kwDOxxxxxxxxx4Axxxxx",         // From Giscus configurator
    mapping: "pathname",                             // Optional: default "pathname"
    reactionsEnabled: true,                          // Optional: default true
    theme: "preferred_color_scheme",                 // Optional: auto dark/light
  },
})
```

### What gets injected

```html
<script src="https://giscus.app/client.js"
  data-repo="owner/my-blog"
  data-repo-id="R_kgDOxxxxxxxx"
  data-category="Announcements"
  data-category-id="DIC_kwDOxxxxxxxxx4Axxxxx"
  data-mapping="pathname"
  data-strict="0"
  data-reactions-enabled="1"
  data-emit-metadata="0"
  data-input-position="bottom"
  data-theme="preferred_color_scheme"
  data-lang="en"
  crossorigin="anonymous"
  async>
</script>
```

### Theme integration

The `"preferred_color_scheme"` theme for Giscus automatically matches the user's OS light/dark preference. If you want it to follow Noxion's in-app theme preference, use `useThemePreference()` and pass the resolved mode to your custom comments component:

```tsx
// In your post layout component
import { useThemePreference } from "@noxion/renderer";

function GiscusComments() {
  const { resolved } = useThemePreference();

  return (
    <div>
      {/* Giscus will pick up the data-theme attribute */}
      <div
        className="giscus"
        data-theme={resolved === "dark" ? "dark" : "light"}
      />
    </div>
  );
}
```

---

## Utterances

[Utterances](https://utteranc.es) is similar to Giscus but uses **GitHub Issues** instead of Discussions. Each post maps to a GitHub Issue.

Utterances is slightly simpler to set up (no Discussions required), but GitHub Issues are more "public" — anyone can see and create issues on your repo.

### Prerequisites

1. Your repository must be **public**
2. Install the [Utterances GitHub App](https://github.com/apps/utterances) and grant access to your repository

### Configuration

```ts
createCommentsPlugin({
  provider: "utterances",
  config: {
    repo: "owner/my-blog",
    issueTerm: "pathname",   // Maps post URL to an issue
    theme: "github-light",   // or "github-dark", "preferred-color-scheme"
    label: "comments",       // Optional: GitHub issue label
  },
})
```

### `issueTerm` options

| Value | Description |
|-------|-------------|
| `"pathname"` | Maps `/my-post` to issue title `/my-post` |
| `"url"` | Maps full URL to issue title |
| `"title"` | Maps page `<title>` to issue title |
| `"og:title"` | Maps OG title to issue title |

---

## Disqus

[Disqus](https://disqus.com) is a long-established comment platform. It's easy to set up and doesn't require GitHub, but:
- Has ads on the free tier
- Collects user data (privacy concerns)
- Adds significant JavaScript weight (~100 KB) to each post

Use Disqus if your audience is less technical and GitHub logins would be a barrier.

### Setup

1. Create an account at [disqus.com](https://disqus.com)
2. Click **I want to install Disqus on my site**
3. Create a new site and choose a **shortname** (e.g., `my-blog`)

### Configuration

```ts
createCommentsPlugin({
  provider: "disqus",
  config: {
    shortname: "my-blog",   // Your Disqus site shortname
  },
})
```

---

## Provider comparison

| | Giscus | Utterances | Disqus |
|---|---|---|---|
| Backend | GitHub Discussions | GitHub Issues | Disqus cloud |
| GitHub account required | ✅ to comment | ✅ to comment | ❌ (email/social) |
| Self-hostable | ✅ | ❌ | ❌ |
| Ads | ❌ | ❌ | ✅ (free tier) |
| Privacy | 🟢 Good | 🟢 Good | 🔴 Poor |
| Markdown support | ✅ | ✅ | Limited |
| Reactions | ✅ | ✅ | ✅ |
| Size | ~50 KB | ~30 KB | ~100 KB |

---

## Disabling comments on specific posts

To hide comments on a specific post, use frontmatter:

```
# In the Notion code block at the top of the page:
comments: false
```

Then in your post layout component, check for this value:

```tsx
// app/[slug]/page.tsx
{post.frontmatter?.comments !== "false" && (
  <CommentsSection post={post} />
)}
```
