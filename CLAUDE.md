# GRIND - Graduation Transformation Dashboard

## Project Overview
A fitness transformation dashboard built for **Bui Mai Anh Duy** to track his 30-day graduation cut (March 24 - April 22, 2026). Built by **Minh Loc** as a gift to push his gym bro to transform before graduation.

## Tech Stack
- **Framework**: Next.js 15.5 (App Router) + React 19
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4 with custom dark theme (`@theme inline` in globals.css)
- **Database**: Supabase (PostgreSQL)
- **Email**: Resend API (cron-triggered notifications)
- **Fonts**: Anton (headlines, `next/font/google`), Outfit (body, `next/font/google`)
- **Icons**: Material Symbols Outlined (Google Fonts CDN with preconnect)
- **Images**: `next/image` for optimized WebP/AVIF delivery
- **Deployment**: Vercel (with cron jobs via `vercel.json`)

## Project Structure
```
src/
  app/
    page.tsx              # Dashboard - overview with checklist, stats, video embed
    daily/page.tsx        # Daily log - task execution, energy tracker, today's focus
    progress/page.tsx     # Progress - weight chart, body fat, strength matrix, countdown
    plan/page.tsx         # Plan - calendar, meals, training rotation, rules, debloat protocol
    layout.tsx            # Root layout with Sidebar, metadata, fonts
    globals.css           # Tailwind @theme with design tokens
    api/
      notify/route.ts     # Email notification endpoint (Vercel cron-triggered)
  components/
    Sidebar.tsx           # Navigation sidebar with day counter
    StreakBreakBanner.tsx  # Streak break notification banner
    VideoEmbed.tsx        # YouTube video player (dynamically imported, no SSR)
  lib/
    supabase.ts           # Client-side Supabase client, types, constants, defaults
    supabase-server.ts    # Server-side Supabase client (guarded with `server-only`)
    useMonolith.ts        # Shared React hook for all Supabase data operations
    quotes.ts             # Motivational quote pools (morning/evening/streak-break)
    email-template.ts     # HTML email builder for notifications
```

## Configuration Files
- `next.config.ts` - Image remote patterns (img.youtube.com)
- `vercel.json` - Cron jobs (morning 00:00 UTC, evening 13:00 UTC)
- `.npmrc` - Forces public npm registry (avoids private registry conflicts)
- `postcss.config.mjs` - Tailwind CSS v4 plugin

## Database Schema (Supabase)
- **daily_logs**: id, date, weight_kg, body_fat_pct, energy_level, training_schedule, notes, created_at, updated_at
- **daily_tasks**: id, date, task_name, completed, completed_at, created_at
- **daily_meals**: id, date, meal_type (breakfast/lunch/dinner/snack/drink), description, created_at
- **measurements**: id, date, metric_name, value, unit, created_at

## Key Constants (src/lib/supabase.ts)
- `PROGRAM_START`: "2026-03-24"
- `PROGRAM_END`: "2026-04-22"
- `PROGRAM_DAYS`: 30
- `START_WEIGHT`: 81.0 KG
- `TARGET_WEIGHT`: 74.0 KG
- `START_BODY_FAT`: 35%

## Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL=<supabase project url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<supabase anon key>
SUPABASE_SERVICE_ROLE_KEY=<supabase service role key> (used by supabase-server.ts, falls back to anon key)
NEXT_PUBLIC_APP_URL=<app url for email links>
NOTIFICATION_EMAIL=<recipient email for cron notifications>
RESEND_API_KEY=<resend api key>
CRON_SECRET=<bearer token for cron endpoint auth>
```

## Design System
- **Dark theme**: bg #0e0e0e, surfaces #131313/#1c1b1b/#201f1f/#2a2a2a
- **Green accent** (#4ae176): positive metrics, completed states, secondary
- **Red accent** (#c00018): warnings, streak breaks, avoid items, tertiary-fixed
- **Font headline**: Anton - bold, condensed, aggressive (`display: swap`)
- **Font body**: Outfit - clean, geometric (`display: swap`)
- **Aesthetic**: Brutalist/military tactical, uppercase, bold, aggressive tone
- **Design tokens**: Defined as CSS custom properties via Tailwind `@theme inline` in globals.css

## Commands
- `npm run dev` - Start dev server
- `npm run build` - Production build
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Architecture Notes

### Performance Optimizations Applied
- **Parallel data fetching**: `useMonolith` uses `Promise.all()` for 6 independent Supabase queries (was sequential)
- **API route optimization**: `getStreakCount()` fetches all tasks in 1 query, computes streak in-memory (was N sequential queries)
- **Dynamic imports**: `VideoEmbed` loaded via `next/dynamic` with `ssr: false`
- **Image optimization**: All images use `next/image` with proper sizing
- **Memoization**: `useCallback` on all mutation functions, `useMemo` on computed values in `useMonolith`
- **Module-level constants**: `TRAINING_INFO`, `TASK_META`, `AGGRESSIVE_QUOTES` hoisted out of render
- **Font optimization**: `display: "swap"` on both fonts, preconnect for Material Symbols

### Key Patterns
- The `useMonolith` hook is the single source of truth — all pages share it
- All pages are `"use client"` with client-side data fetching via the hook
- Streak only counts when ALL 8 daily tasks are completed for a day
- Training schedule is editable per-day and persists to `training_schedule` column on `daily_logs`
- Meals are per-day editable via the Plan page calendar
- `AggressiveQuote` uses a `<div role="button">` wrapper (not `<button>`) to avoid nested button hydration errors
- `<html>` tag has `suppressHydrationWarning` to handle browser extension class injection
- `supabase-server.ts` is guarded with `import "server-only"` to prevent client bundle leakage

### Cron Jobs (vercel.json)
- **00:00 UTC** (7:00 AM Vietnam): Morning briefing + streak-break check → `/api/notify?types=morning,streak-break`
- **13:00 UTC** (8:00 PM Vietnam): Evening reminder if tasks incomplete → `/api/notify?type=evening`
- Authenticated via `Authorization: Bearer <CRON_SECRET>` header

## Important Notes
- The app is built specifically for Duy's graduation transformation — all content is personalized
- The aggressive motivational quotes rotate every 7 seconds on the Daily page
- `TodaysFocusCard` component shows training type based on the weekly rotation schedule
- `GraduationCountdown` initializes with computed time (not zeros) to avoid layout shift
