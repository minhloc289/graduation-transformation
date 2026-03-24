# GRIND - Graduation Transformation Dashboard

> *"Trust the process, twin. Good things take time — but great things take grinding every single day."*

A 30-day fitness transformation tracker built for **Bui Mai Anh Duy's** graduation. Designed to push, track, and hold accountable every rep, every meal, and every day until April 22, 2026.

Built with fire by **Minh Loc**.

---

## Features

- **Dashboard** - Daily checklist, weight/body fat tracking, streak visualization, YouTube debloat tutorial
- **Daily Log** - Task execution with "Execute Now" button, energy tracker, today's training focus with motivational quotes
- **Progress** - Weight progression chart, body composition ring, strength matrix, graduation countdown timer, consistency heatmap
- **Plan Strategy** - 30-day calendar with real dates, per-day editable meal plans, weekly training rotation, rules of engagement, face debloat protocol

## Data Tracking

All data persists to **Supabase** in real-time:
- Daily weight & body fat measurements
- 8-task daily checklist (streak tracking)
- Per-day meal plans (breakfast, lunch, dinner, snack, drinks)
- Strength matrix (bench, squat, dumbbell, cardio, machine, shoulder press)
- Training schedule (editable weekly rotation)
- Energy level

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 15 (App Router) |
| Styling | Tailwind CSS 4 |
| Database | Supabase (PostgreSQL) |
| Fonts | Anton + Outfit |
| Icons | Material Symbols Outlined |
| Deployment | Vercel |

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Add your Supabase URL and anon key

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |

## Program Details

- **Competitor**: Bui Mai Anh Duy
- **University**: University of Finance - Marketing
- **Graduation**: April 22, 2026
- **Starting Weight**: 81 KG
- **Target Weight**: 74 KG
- **Starting Body Fat**: 35%
- **Duration**: 30 days

## Screenshots

Dashboard | Daily | Progress | Plan
--- | --- | --- | ---
Checklist + Stats | Task Execution | Weight Chart + Countdown | Calendar + Meals

---

**They might not see it, but I know how hard you've been working — and I respect that.**

Happy graduation — YOUR GYM BRO, Minh Loc
