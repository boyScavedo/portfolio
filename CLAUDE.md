## Stack

| Layer | Tech | Version |
|---|---|---|
| Framework | Next.js (App Router) | 16.2.7 |
| UI | React | 19.2.4 |
| Styling | Tailwind CSS | v4 (PostCSS plugin, no config file) |
| Language | TypeScript | ^5 |
| Lint | ESLint (flat config) | ^9 |

## Commands

| Task | Command |
|---|---|
| Dev server | `npm run dev` |
| Build | `npm run build` |
| Start prod | `npm start` |
| Lint | `npm run lint` |

## Project Layout

```
app/              # App Router — layouts, pages, global styles
public/           # Static assets served at /
next.config.ts    # Next.js config
postcss.config.mjs # Tailwind v4 via PostCSS (no tailwind.config.js)
eslint.config.mjs # Flat ESLint config (ESLint 9+)
```

## Judgment Boundaries

**NEVER**
- Add `tailwind.config.js` — Tailwind v4 configures via CSS `@theme` in `globals.css`
- Use `pages/` directory — this project is App Router only
- Skip reading `node_modules/next/dist/docs/` before using Next.js APIs

**ASK FIRST**
- Adding new dependencies
- Changing the font setup (Geist via `next/font/google`)
- Adding analytics, auth, or DB layers

**ALWAYS**
- Read `node_modules/next/dist/docs/01-app/` before using App Router APIs — Next.js 16 has breaking changes from training data
- Use TypeScript strict mode (already set in `tsconfig.json`)
- Use `next/image` for all images

## Conventions

- Tailwind v4: custom tokens go in `app/globals.css` under `@theme {}`, not a config file
- ESLint 9 flat config: rules in `eslint.config.mjs`, not `.eslintrc`
- No test runner configured yet — ask before adding one

## Agentic Config

See `.agents/` for subagent definitions, skills, and wiki.
See `.claude/` for Claude Code-specific agents and skills.

@AGENTS.md
