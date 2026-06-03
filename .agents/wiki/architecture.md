# Architecture

## Request Flow

Browser → Next.js 16 App Router → `app/layout.tsx` (root layout) → page component

Root layout (`app/layout.tsx`) sets:
- HTML lang
- Geist font CSS variables (`--font-geist-sans`, `--font-geist-mono`)
- Body flex column layout

## Key Patterns

- **Server Components by default**: components render on the server unless marked `"use client"`
- **Tailwind v4**: design tokens in `app/globals.css` `@theme {}` block, not a config file
- **Fonts**: loaded via `next/font/google` in `layout.tsx`, applied as CSS variables

## Gotchas

- Next.js 16 APIs differ from v13-15 training data — always check `node_modules/next/dist/docs/`
- Tailwind v4 removed `tailwind.config.js` — agents often try to create one, don't
- `eslint.config.mjs` is ESLint 9 flat config — no `.eslintrc` support
