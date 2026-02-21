---
title: create-noxion
description: CLI scaffolding tool
---

# `create-noxion`

Scaffolds a new Noxion blog project.

## Usage

```bash
bun create noxion [project-name] [options]
```

Or via npx:

```bash
npx create-noxion [project-name]
```

## Interactive mode

```bash
bun create noxion my-blog
```

Prompts for:
- Project name
- Notion database page ID
- Site name
- Site description
- Author
- Domain

## Non-interactive mode

```bash
bun create noxion my-blog \
  --yes \
  --notion-id=abc123def456 \
  --name="My Blog" \
  --description="A blog" \
  --author="Your Name" \
  --domain=myblog.com
```

## Flags

| Flag | Description |
|------|-------------|
| `--yes` | Skip prompts, use defaults |
| `--notion-id=<id>` | Notion page ID |
| `--name=<name>` | Site name |
| `--description=<desc>` | Site description |
| `--author=<name>` | Author name |
| `--domain=<domain>` | Production domain |

## What gets created

```
my-blog/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── [slug]/page.tsx
│   ├── tag/[tag]/page.tsx
│   ├── feed.xml/route.ts
│   ├── sitemap.ts
│   └── robots.ts
├── lib/
│   ├── config.ts
│   └── notion.ts
├── noxion.config.ts
├── next.config.ts
├── .env.example
└── package.json
```
