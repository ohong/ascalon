# Ascalon

Track the words you write each day.

## Features

- Email and password accounts
- Daily word counts and optional notes
- Writing heatmap, streaks, stats, and history

## How it works

- Each entry is a word count for a date. Entries for the same date add up, and entries cannot be edited or deleted.
- Heatmap levels by words in a day: none, under 500, 500-999, 1,000-1,999, 2,000+.
- Writing days counts dates with an entry. The current streak runs back from today, or from yesterday until you log today.
- The browser talks to Supabase directly with the publishable key. Row-level security in `supabase/migrations` is the only access control: each account reads and inserts its own entries.

## Stack

Next.js, Supabase, and Vercel. Set `NEXT_PUBLIC_COMMIT_SHA` at build time to show the deployed commit in the `ascalon-version` meta tag.

## Local setup

1. Run `bun install`.
2. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` in `.env.local`.
3. Run `supabase db push` for your linked Supabase project.
4. Run `bun run dev`.

## Scripts

- `bun run dev`: development server
- `bun run build`: production build
- `bun run start`: production server
- `bun run lint`: ESLint
- `bun run typecheck`: TypeScript checks
