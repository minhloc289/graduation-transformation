import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { supabaseServer } from "@/lib/supabase-server";
import {
  PROGRAM_START,
  PROGRAM_END,
  PROGRAM_DAYS,
  TARGET_WEIGHT,
  getDayNumber,
  getTodayString,
} from "@/lib/supabase";
import {
  MORNING_QUOTES,
  EVENING_QUOTES,
  STREAK_BREAK_QUOTES,
  getQuoteOfTheDay,
} from "@/lib/quotes";
import { buildEmailHTML, getSubjectLine } from "@/lib/email-template";

const resend = new Resend(process.env.RESEND_API_KEY);

type NotificationType = "morning" | "evening" | "streak-break";

function getYesterdayString(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split("T")[0];
}

async function getStreakCount(): Promise<number> {
  const todayStr = new Date().toISOString().split("T")[0];

  // Single query instead of N sequential queries
  const { data: allTasks } = await supabaseServer
    .from("daily_tasks")
    .select("date, completed")
    .gte("date", PROGRAM_START)
    .lte("date", todayStr)
    .order("date", { ascending: false });

  if (!allTasks || allTasks.length === 0) return 0;

  // Group by date
  const tasksByDate: Record<string, boolean[]> = {};
  for (const t of allTasks) {
    if (!tasksByDate[t.date]) tasksByDate[t.date] = [];
    tasksByDate[t.date].push(t.completed);
  }

  // Get unique dates sorted descending (skip today)
  const dates = Object.keys(tasksByDate)
    .filter((d) => d < todayStr)
    .sort((a, b) => b.localeCompare(a));

  let streak = 0;
  for (const date of dates) {
    const dayTasks = tasksByDate[date];
    if (dayTasks.length > 0 && dayTasks.every(Boolean)) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

async function sendNotification(type: NotificationType): Promise<{
  sent: boolean;
  reason?: string;
}> {
  const today = getTodayString();
  const dayNumber = getDayNumber(today);

  // Check if we're within the program period
  if (today < PROGRAM_START || today > PROGRAM_END) {
    return { sent: false, reason: "Outside program period" };
  }

  // Fetch today's tasks
  const { data: tasks } = await supabaseServer
    .from("daily_tasks")
    .select("task_name, completed")
    .eq("date", today);

  const incompleteTasks = tasks?.filter((t) => !t.completed).map((t) => t.task_name) ?? [];
  const completedTasks = tasks?.filter((t) => t.completed).map((t) => t.task_name) ?? [];

  // Type-specific skip conditions
  if (type === "evening" && incompleteTasks.length === 0) {
    return { sent: false, reason: "All tasks completed" };
  }

  if (type === "streak-break") {
    const yesterday = getYesterdayString();
    if (yesterday < PROGRAM_START) {
      return { sent: false, reason: "Yesterday before program start" };
    }
    const { data: yesterdayTasks } = await supabaseServer
      .from("daily_tasks")
      .select("completed")
      .eq("date", yesterday);

    if (!yesterdayTasks || yesterdayTasks.length === 0) {
      return { sent: false, reason: "No tasks found for yesterday" };
    }
    if (yesterdayTasks.every((t) => t.completed)) {
      return { sent: false, reason: "Yesterday was completed" };
    }
  }

  // Get streak and weight data
  const streakCount = await getStreakCount();

  const { data: latestLog } = await supabaseServer
    .from("daily_logs")
    .select("weight_kg")
    .order("date", { ascending: false })
    .limit(1)
    .single();

  // Pick quote
  const quotePool =
    type === "morning"
      ? MORNING_QUOTES
      : type === "evening"
        ? EVENING_QUOTES
        : STREAK_BREAK_QUOTES;
  const quote = getQuoteOfTheDay(quotePool, today);

  const daysLeft = Math.max(
    0,
    Math.ceil(
      (new Date(PROGRAM_END).getTime() - new Date(today).getTime()) /
        (1000 * 60 * 60 * 24)
    )
  );

  const emailParams = {
    type,
    quote,
    dayNumber,
    totalDays: PROGRAM_DAYS,
    daysLeft,
    incompleteTasks,
    completedTasks,
    streakCount,
    currentWeight: latestLog?.weight_kg ?? null,
    targetWeight: TARGET_WEIGHT,
    appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "https://graduation-transformation-due.vercel.app",
  };

  const html = buildEmailHTML(emailParams);
  const subject = getSubjectLine(emailParams);

  const { error } = await resend.emails.send({
    from: "GRIND <onboarding@resend.dev>",
    to: process.env.NOTIFICATION_EMAIL!,
    subject,
    html,
  });

  if (error) {
    console.error("Resend error:", error);
    return { sent: false, reason: error.message };
  }

  return { sent: true };
}

export async function GET(req: NextRequest) {
  // Verify cron secret
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const type = req.nextUrl.searchParams.get("type") as NotificationType | null;
  const validTypes: NotificationType[] = ["morning", "evening", "streak-break"];

  if (!type || !validTypes.includes(type)) {
    // If no specific type, handle combined morning + streak-break (for Hobby plan 2-cron limit)
    const results: Record<string, { sent: boolean; reason?: string }> = {};

    const typesToRun = req.nextUrl.searchParams.get("types")?.split(",") as
      | NotificationType[]
      | undefined;

    if (typesToRun) {
      for (const t of typesToRun) {
        if (validTypes.includes(t)) {
          results[t] = await sendNotification(t);
        }
      }
      return NextResponse.json({ results });
    }

    return NextResponse.json(
      { error: "Invalid type. Use ?type=morning|evening|streak-break or ?types=morning,streak-break" },
      { status: 400 }
    );
  }

  const result = await sendNotification(type);
  return NextResponse.json({ type, ...result });
}
