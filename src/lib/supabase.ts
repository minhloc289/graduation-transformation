import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types matching our database schema
export interface DailyLog {
  id: string;
  date: string;
  weight_kg: number | null;
  body_fat_pct: number | null;
  energy_level: "LOW" | "MID" | "HIGH" | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface DailyTask {
  id: string;
  date: string;
  task_name: string;
  completed: boolean;
  completed_at: string | null;
  created_at: string;
}

export interface Measurement {
  id: string;
  date: string;
  metric_name: string;
  value: number;
  unit: string;
  created_at: string;
}

export interface DailyMeal {
  id: string;
  date: string;
  meal_type: "breakfast" | "lunch" | "dinner" | "snack" | "drink";
  description: string;
  created_at: string;
}

export const DEFAULT_MEALS: Record<string, string> = {
  breakfast: "Oats + 2 eggs + banana",
  lunch: "Grilled chicken breast + brown rice + broccoli",
  dinner: "Fish + sweet potato + spinach salad",
  snack: "Greek yogurt + almonds",
  drink: "3.7L water, 2 cups green tea, 1 lemon water",
};

export const MEAL_ICONS: Record<string, string> = {
  breakfast: "egg_alt",
  lunch: "lunch_dining",
  dinner: "dinner_dining",
  snack: "grocery",
  drink: "water_drop",
};

// Default tasks for a new day
export const DEFAULT_TASKS = [
  "Morning Lemon Water (500ml)",
  "Macro Target: 180g Protein / 1800 KCAL",
  "Strength Training (45 min)",
  "Cardio Session (30 min LISS)",
  "Water Intake: 3.7L Total",
  "Face Exercise & Lymphatic Massage (5 min)",
  "No Sodium After 6PM",
  "Sleep 8 Hours (Before 11PM)",
];

// Program constants
export const PROGRAM_START = "2026-03-24";
export const PROGRAM_END = "2026-04-22";
export const PROGRAM_DAYS = 30;
export const START_WEIGHT = 81.0;
export const TARGET_WEIGHT = 74.0;
export const START_BODY_FAT = 35;

export function getDayNumber(date: string): number {
  const start = new Date(PROGRAM_START);
  const current = new Date(date);
  const diff = Math.floor(
    (current.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
  );
  return Math.max(1, Math.min(diff + 1, PROGRAM_DAYS));
}

export function getTodayString(): string {
  return new Date().toISOString().split("T")[0];
}
