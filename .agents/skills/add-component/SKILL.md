# Skill: Add Component

Add a new React component to the portfolio.

## Steps

1. Determine if component needs browser APIs or interactivity → add `"use client"` directive if yes
2. Create `app/components/<ComponentName>.tsx` (or co-locate with the page that owns it)
3. Use Tailwind utility classes for styling — no CSS modules, no inline styles
4. For custom design tokens, add to `@theme {}` in `app/globals.css`
5. Export as named export for components, default export for pages

## Constraints

- Server Components by default — only add `"use client"` when needed
- All images via `next/image`
- Accessible: semantic HTML, `alt` text, keyboard navigation
