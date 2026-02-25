# Contributing to Noxion

Thank you for taking the time to contribute! Noxion is a community-driven project and every contribution matters — whether it's a bug report, a feature idea, a documentation fix, or a new plugin.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Ways to Contribute](#ways-to-contribute)
- [Reporting Issues](#reporting-issues)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Commit Convention](#commit-convention)
- [Code Style](#code-style)
- [Testing](#testing)
- [Writing a Plugin](#writing-a-plugin)
- [Release Process](#release-process)
- [Getting Help](#getting-help)

---

## Code of Conduct

Be respectful. We follow the standard [Contributor Covenant](https://www.contributor-covenant.org/). Harassment, discrimination, or toxic behavior of any kind will not be tolerated.

---

## Ways to Contribute

| Type | Where |
|------|-------|
| Bug reports | [GitHub Issues](https://github.com/jiwonme/noxion/issues) |
| Feature requests | [GitHub Issues](https://github.com/jiwonme/noxion/issues) |
| Code (bugfixes, features) | Pull Request against `main` |
| Documentation | Pull Request against `main` (edit files under `apps/docs/`) |
| New plugin | Pull Request adding to `packages/core/src/plugins/` |

If you plan to work on something large, open an issue first to discuss the approach. This avoids duplicated effort and ensures your contribution can be merged.

---

## Reporting Issues

Before filing a new issue, search existing issues to avoid duplicates.

**Bug report checklist**
- Noxion version (check `package.json` in your project)
- Node / Bun version (`bun --version`)
- Minimal reproduction steps
- Expected vs. actual behavior
- Error messages / stack traces (if any)

**Feature request checklist**
- What problem does this solve?
- Describe the proposed API / behavior
- Any alternative approaches you considered?

---

## Development Setup

### Prerequisites

| Tool | Version |
|------|---------|
| [Bun](https://bun.sh) | ≥ 1.2 |
| Node.js | ≥ 18 (required by some build tools) |
| Git | any recent version |

### 1. Fork and clone

```bash
git clone https://github.com/<your-username>/noxion.git
cd noxion
```

### 2. Install dependencies

```bash
bun install
```

Bun workspaces will link all packages automatically.

### 3. Build packages

```bash
bun run build
```

Packages are built in dependency order by Turborepo. Output goes to each package's `dist/` directory.

### 4. Run the demo app

```bash
cd apps/web
cp .env.example .env   # fill in NOTION_PAGE_ID
bun run dev
```

Open `http://localhost:3000`.

### 5. Run tests

```bash
bun run test
```

To watch a specific package:

```bash
cd packages/core
bun test --watch
```

---

## Project Structure

```
noxion/
├── apps/
│   ├── web/                  # Demo blog — Next.js 16 App Router
│   ├── docs/                 # Documentation site (Docusaurus)
│   └── theme-dev/            # Theme development & preview app
├── packages/
│   ├── core/                 # @noxion/core
│   │   └── src/
│   │       ├── plugins/      # Built-in plugins (analytics, RSS, comments)
│   │       └── __tests__/    # Unit tests (co-located with source)
│   ├── renderer/             # @noxion/renderer — theme contracts & components
│   ├── notion-renderer/      # @noxion/notion-renderer — Notion block renderer
│   ├── adapter-nextjs/       # @noxion/adapter-nextjs — metadata, sitemap, JSON-LD
│   ├── theme-default/        # @noxion/theme-default — base theme contract
│   ├── theme-beacon/         # @noxion/theme-beacon — content-first theme contract
│   ├── plugin-utils/         # @noxion/plugin-utils — mock data, test helpers
│   └── create-noxion/        # CLI scaffolding tool (bun create noxion)
├── scripts/
│   └── release.sh            # Manual release helper
└── .github/
    └── workflows/
        ├── ci.yml            # Build + test on every push / PR
        └── release.yml       # Publish to npm on v* tags
```

### Package responsibilities

| Package | Responsibility |
|---------|---------------|
| `@noxion/core` | Notion API client, post fetcher, config schema, plugin system, frontmatter parser |
| `@noxion/renderer` | Theme contract system, React components, CSS theme system |
| `@noxion/notion-renderer` | Notion block renderer (30+ block types, KaTeX SSR, Shiki syntax highlighting) |
| `@noxion/adapter-nextjs` | `generateMetadata`, `generateSitemap`, `generateRobotsTxt`, JSON-LD helpers |
| `@noxion/theme-default` | Base theme contract (`defaultThemeContract`) |
| `@noxion/theme-beacon` | Content-first theme contract (`beaconThemeContract`) |
| `create-noxion` | `bun create noxion` CLI — scaffolds a new Next.js site |

---

## Development Workflow

### Branching

| Branch | Purpose |
|--------|---------|
| `main` | Stable, always green |
| `feat/<name>` | New feature |
| `fix/<name>` | Bug fix |
| `docs/<name>` | Documentation only |
| `chore/<name>` | Build, tooling, dependency changes |

Branch off `main`, keep branches focused on a single concern.

### Pull Requests

1. Open your PR against `main`.
2. Fill in the PR template (title + summary of changes).
3. Ensure CI passes — the `ci.yml` workflow runs build + tests on every PR.
4. Link any related issue with `Closes #<issue-number>`.
5. Keep the diff small and reviewable. Large PRs should be split into logical steps.

**PR title format** follows the same [commit convention](#commit-convention) below.

---

## Commit Convention

Noxion follows [Conventional Commits](https://www.conventionalcommits.org/).

```
<type>(<scope>): <short description>

[optional body]

[optional footer: Closes #123]
```

### Types

| Type | When to use |
|------|------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `test` | Adding or updating tests |
| `chore` | Build process, dependency updates, tooling |
| `perf` | Performance improvement |

### Scopes (optional but helpful)

`core`, `renderer`, `adapter-nextjs`, `create-noxion`, `web`, `docs`, `ci`

### Examples

```
feat(core): add support for Gallery block type
fix(renderer): correct heading anchor id generation for CJK characters
docs: add plugin authoring guide to CONTRIBUTING
chore(ci): pin bun version to 1.2.0
```

---

## Code Style

- **Language**: TypeScript — strict mode, no `as any`, no `@ts-ignore`.
- **Formatter / Linter**: The project does not enforce a specific formatter today; match the style of the file you are editing.
- **Imports**: Use ESM (`import`/`export`). No CommonJS `require()`.
- **Named exports**: Prefer named exports over default exports in library packages.
- **File naming**: `kebab-case` for all source files.
- **No magic strings**: Extract repeated string literals into constants.

TypeScript `strict` is enabled in `tsconfig.base.json`. All packages inherit from it.

---

## Testing

Tests live in `src/__tests__/` inside each package and are run with Bun's built-in test runner.

```bash
# Run all tests
bun run test

# Run tests in a single package
cd packages/core && bun test

# Run a single test file
cd packages/core && bun test src/__tests__/slug.test.ts
```

### Writing tests

- Test file names mirror the source file: `slug.ts` → `slug.test.ts`.
- Use Bun's `describe` / `it` / `expect` (no extra libraries needed).
- Prefer unit tests that are fast and deterministic — mock external calls (Notion API, filesystem).
- When adding a new feature, include at least one happy-path test and one edge-case test.
- When fixing a bug, add a regression test that would have caught it.

---

## Writing a Plugin

Plugins extend Noxion with analytics, comments, RSS, or anything else. They live in `packages/core/src/plugins/`.

### Plugin shape

```ts
// packages/core/src/plugin.ts
export interface NoxionPlugin {
  name: string;
  /** Called once after config is resolved */
  onConfigResolved?: (config: NoxionConfig) => void | Promise<void>;
  /** Inject arbitrary <head> tags */
  headScripts?: () => string[];
}
```

### Example

```ts
// packages/core/src/plugins/my-plugin.ts
import type { NoxionPlugin } from "../plugin";

export interface MyPluginOptions {
  apiKey: string;
}

export function createMyPlugin(options: MyPluginOptions): NoxionPlugin {
  return {
    name: "my-plugin",
    headScripts() {
      return [`<script>window.MY_KEY = "${options.apiKey}"</script>`];
    },
  };
}
```

Export the factory from `packages/core/src/plugins/index.ts` and re-export it from `packages/core/src/index.ts`.

Add tests in `packages/core/src/__tests__/plugins/my-plugin.test.ts`.

---

## Release Process

> This section is for maintainers.

Releases are triggered by pushing a `v*.*.*` tag. The `release.yml` GitHub Actions workflow calls `scripts/release.sh`, which builds all packages and publishes them to npm.

**Steps**

1. Bump the `version` field in **each** package's `package.json` following [semver](https://semver.org/).
2. Update `CHANGELOG.md` (if maintained).
3. Commit: `chore: release v0.1.0`
4. Tag and push:
   ```bash
   git tag v0.1.0
   git push origin main --tags
   ```
5. GitHub Actions takes it from there.

The `NPM_TOKEN` secret must be set in the repository settings (Settings → Secrets → Actions).

---

## Getting Help

- **Question about usage** → open a [GitHub Discussion](https://github.com/jiwonme/noxion/discussions)
- **Found a bug** → open a [GitHub Issue](https://github.com/jiwonme/noxion/issues)
- **Want to chat** → mention `@jiwonme` in an issue or PR

---

Thank you for contributing to Noxion! ✨
