<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# mayfl-stats

## Stack
- Next.js 16.2.6, React 19, pnpm, TypeScript, Tailwind CSS v4 (`@tailwindcss/postcss`), Supabase
- Single-page `"use client"` app in `app/page.tsx` (no router pages, no server components)
- Edit access: cookie `mayfl-stats-edit-access=1` (password `milav123` via auth modal)
- Roster sourced from `public/roster.json`

## Commands
| Command | What it does |
|---------|-------------|
| `pnpm dev` | Dev server on :3000 |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `pnpm lint` | ESLint only (no typechecking) |

There are no tests. No typecheck script exists.

## Supabase persistence
- Env required: `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` (writes). Reads fall back to `SUPABASE_PUBLISHABLE_KEY` / `NEXT_PUBLIC_SUPABASE_KEY`.
- Schema: single row in `public.app_state` table (id `mayfl-stats-sheet`, column `data` jsonb).
- API route: `GET /api/state` (read), `PUT /api/state` (write).

## Paths
- `@/*` maps to project root (e.g. `import { x } from "@/app/api/state/route"`).
