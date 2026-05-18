This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Database Setup

This app now stores its shared state in Supabase instead of browser-only storage.

1. Create a Supabase project.
2. Run the SQL in [supabase/migrations/0001_create_app_state.sql](supabase/migrations/0001_create_app_state.sql) to create the `app_state` table.
3. Set these environment variables in your deployment environment and locally in `.env.local`:
	- `SUPABASE_URL` (your project URL)
	- `SUPABASE_SERVICE_ROLE_KEY` (the service_role / secret key — required for server-side writes)

Note: you can set `SUPABASE_PUBLISHABLE_KEY` or `NEXT_PUBLIC_SUPABASE_KEY` for client-side reads, but those keys are read-only and cannot be used to persist state from the server. To allow the API to write, provide the service role key from your Supabase project settings (Settings → API → Service key). Keep that value secret.
4. Deploy the app to Netlify as usual. The app talks to `/api/state`, and that route reads and writes the shared database row.

If the database is not configured yet, the app will still open with the starter data, but changes will not persist.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
# mayfl-stats
