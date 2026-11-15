# Ascalon

Track the words you write each day.

## Features

- Email and password accounts
- Daily word counts and optional notes
- Writing heatmap, streaks, stats, and history

## Stack

Next.js, Supabase, and Vercel.

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
