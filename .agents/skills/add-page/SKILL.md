# Skill: Add Page

Add a new route/page to the Next.js App Router portfolio.

## Steps

1. Read `node_modules/next/dist/docs/01-app/01-getting-started/` to confirm current page conventions
2. Create `app/<route>/page.tsx` — default export is the page component
3. If the route needs a layout, create `app/<route>/layout.tsx`
4. Use `next/link` for any internal navigation to this route
5. Add the route to the site nav if one exists

## Constraints

- No `pages/` directory entries
- All async data fetching goes in Server Components (no `useEffect` for data)
- Metadata exported as `export const metadata` or `export async function generateMetadata`
