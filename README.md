# mariuswinger.github.io

Personal website, deployed to GitHub Pages at <https://mariuswinger.github.io>.

## Stack

- [Astro](https://astro.build) — static site, file-based routing, content collections
- [React](https://react.dev) — used only for interactive islands (e.g. the portfolio filter)
- [Tailwind CSS v4](https://tailwindcss.com) — design tokens live in `src/styles/global.css` under `@theme`
- [MDX](https://mdxjs.com) — blog posts
- [Biome](https://biomejs.dev) — formatting and linting
- [Bun](https://bun.sh) — package manager and script runner (version pinned in `package.json` → `packageManager`)

## Development

```sh
mise install
bun install
bun run dev        # http://localhost:4321
```

| Script             | What it does                          |
| ------------------ | ------------------------------------- |
| `bun run dev`      | Start the dev server                  |
| `bun run build`    | Build the static site into `dist/`    |
| `bun run preview`  | Serve the built `dist/` locally       |
| `bun run check`    | Type-check `.astro`/`.ts` files       |
| `bun run lint`     | Biome format + lint check (no writes) |
| `bun run lint:fix` | Biome format + lint with auto-fixes   |

> Restart the dev server after adding or changing `src/content.config.ts`; collections are only loaded on startup.

## Project layout

```
src/
  consts.ts            # site-wide constants (name, etc.)
  content.config.ts    # content collection schemas
  content/blog/        # blog posts (.md / .mdx)
  components/          # .astro and .tsx components
  layouts/Layout.astro # html shell, sidebar + nav, SEO meta
  pages/               # one file per route
  styles/global.css    # Tailwind import, @theme tokens, component classes
public/                # static assets served as-is
```

Page-specific data (services, resume entries, projects) is defined inline in the page that renders it.

## Adding content

**Blog post** — create `src/content/blog/<slug>.mdx` with frontmatter:

```md
---
title: "Post title"
description: "One-line summary"
pubDate: 2026-01-31
tags: ["tag"]
draft: false
---
```

The URL becomes `/blog/<slug>/`. Posts with `draft: true` are excluded from the build.

**Project** — add an entry to the `projects` array in `src/pages/portfolio.astro`. Categories are derived automatically from the entries.

**Resume** — edit the `education`, `experience` and `skills` arrays in `src/pages/resume.astro`.

**Profile / social links** — edit `src/components/Sidebar.astro`.

## CI

- `.github/workflows/on_pull_request.yaml` — lint, type-check and build on every pull request.
- `.github/workflows/deploy.yaml` — builds and deploys to GitHub Pages; triggered manually via **Actions → Deploy to GitHub Pages → Run workflow**.

## Deployment

Deployment is manual: run the **Deploy to GitHub Pages** workflow from the Actions tab (or `gh workflow run deploy.yaml`). One-time setup in the repository:
**Settings → Pages → Build and deployment → Source: GitHub Actions**.
