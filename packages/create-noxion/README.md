# create-noxion

CLI scaffolding tool for [Noxion](https://github.com/jiwonme/noxion) — a Notion-powered website builder.

## Usage

```bash
bun create noxion my-blog
# or
npx create-noxion my-blog
```

This scaffolds a complete Next.js project in seconds (blog, docs, portfolio, or full), pre-configured with:

- Next.js App Router
- Notion as CMS (via `@noxion/core`)
- SEO automation (via `@noxion/adapter-nextjs`)
- React components (via `@noxion/renderer`)
- ISR with on-demand revalidation
- Docker support

## After Scaffolding

```bash
cd my-blog
# Edit .env with your Notion page ID
bun run dev
```

Open `http://localhost:3000` — your blog is live.

## Documentation

See the [full documentation](https://github.com/jiwonme/noxion) for Notion setup, configuration, deployment guides, and more.

## License

MIT
