<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Mission

Personal portfolio site built with Next.js 16 App Router, React 19, and Tailwind CSS v4. Currently a blank slate — the goal is to build out a professional portfolio. All routing is file-based under `app/`.

## Toolchain

| Task | Command |
|---|---|
| Dev | `npm run dev` (port 3000) |
| Build | `npm run build` |
| Lint | `npm run lint` |

## Judgment Boundaries

**NEVER**
- Create `tailwind.config.js` — Tailwind v4 uses CSS `@theme` in `globals.css`
- Add files to `pages/` — App Router only
- Use legacy `getServerSideProps` / `getStaticProps` — these don't exist in App Router

**ASK FIRST**
- Adding npm dependencies
- Introducing a CMS, database, or auth provider

**ALWAYS**
- Read `node_modules/next/dist/docs/01-app/` for any App Router API before using it
- Use `next/image` for images, `next/link` for internal navigation
- Check `node_modules/next/dist/docs/` for deprecation notices before using any Next.js API

## Non-Standard Tooling

- **Tailwind v4**: No `tailwind.config.js`. Custom design tokens live in `app/globals.css` under `@theme {}`. PostCSS plugin configured in `postcss.config.mjs`.
- **ESLint 9 flat config**: Config in `eslint.config.mjs`, not `.eslintrc.*`.
- **React 19**: New hooks and APIs available. Check React 19 changelog before using bleeding-edge APIs.
- **Next.js 16**: Significant API changes from v13–15. Always read local docs.

## Agentic Resources

- `.agents/agents/` — subagent persona specs
- `.agents/skills/` — reusable task workflows
- `.agents/wiki/` — architecture notes and domain knowledge
