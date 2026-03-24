"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  supabase,
  DEFAULT_TASKS,
  DEFAULT_MEALS,
  PROGRAM_DAYS,
  PROGRAM_START,
  PROGRAM_END,
  START_WEIGHT,
  START_BODY_FAT,
  getDayNumber,
  getTodayString,
} from "./supabase";
import type { DailyLog, DailyTask, Measurement, DailyMeal } from "./supabase";

export interface TaskView {
  id: string;
  label: string;
  done: boolean;
}

export function useMonolith() {
  const [tasks, setTasks] = useState<TaskView[]>([]);
  const [latestLog, setLatestLog] = useState<DailyLog | null>(null);
  const [allLogs, setAllLogs] = useState<DailyLog[]>([]);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [streakDays, setStreakDays] = useState<string[]>(
    Array(PROGRAM_DAYS).fill("future")
  );
  const [streakCount, setStreakCount] = useState(0);
  const [consistency, setConsistency] = useState<number | null>(null);
  const [energy, setEnergy] = useState<"LOW" | "MID" | "HIGH">("MID");
  const [meals, setMeals] = useState<Record<string, string>>({});
  const [trainingSchedule, setTrainingSchedule] = useState<string[]>(["U", "L", "C", "U", "L", "C", "R"]);
  const [loaded, setLoaded] = useState(false);

  const today = getTodayString();
  const dayNumber = getDayNumber(today);

  const loadData = useCallback(async () => {
    // 1. Check existing log and tasks in parallel
    const [{ data: existingLog }, { data: existingTasks }] = await Promise.all([
      supabase.from("daily_logs").select("*").eq("date", today).single(),
      supabase.from("daily_tasks").select("*").eq("date", today),
    ]);

    // Ensure daily_log exists
    if (!existingLog) {
      await supabase.from("daily_logs").insert({
        date: today,
        weight_kg: START_WEIGHT,
        body_fat_pct: START_BODY_FAT,
        energy_level: "MID",
      });
    } else {
      if (existingLog.energy_level) {
        setEnergy(existingLog.energy_level as "LOW" | "MID" | "HIGH");
      }
      if (existingLog.training_schedule) {
        setTrainingSchedule(existingLog.training_schedule);
      }
    }

    // Ensure tasks exist
    if (!existingTasks || existingTasks.length === 0) {
      const taskRows = DEFAULT_TASKS.map((name) => ({
        date: today,
        task_name: name,
        completed: false,
      }));
      await supabase.from("daily_tasks").insert(taskRows);
    }

    // 2. Fetch all independent data in parallel
    const [
      { data: todayTasks },
      { data: latest },
      { data: logs },
      { data: meas },
      { data: allTasks },
      { data: mealRows },
    ] = await Promise.all([
      supabase.from("daily_tasks").select("*").eq("date", today).order("created_at"),
      supabase.from("daily_logs").select("*").order("date", { ascending: false }).limit(1).single(),
      supabase.from("daily_logs").select("*").gte("date", PROGRAM_START).lte("date", PROGRAM_END).order("date"),
      supabase.from("measurements").select("*").order("date", { ascending: false }),
      supabase.from("daily_tasks").select("date, completed").gte("date", PROGRAM_START).lte("date", PROGRAM_END),
      supabase.from("daily_meals").select("*").eq("date", today),
    ]);

    // Process tasks
    if (todayTasks) {
      setTasks(
        todayTasks.map((t: DailyTask) => ({
          id: t.id,
          label: t.task_name,
          done: t.completed,
        }))
      );
    }

    // Process latest log
    if (latest) setLatestLog(latest as DailyLog);

    // Process all logs
    if (logs) setAllLogs(logs as DailyLog[]);

    // Process measurements
    if (meas) setMeasurements(meas as Measurement[]);

    // Build streak data
    if (allTasks) {
      const tasksByDate: Record<string, boolean[]> = {};
      for (const t of allTasks) {
        if (!tasksByDate[t.date]) tasksByDate[t.date] = [];
        tasksByDate[t.date].push(t.completed);
      }

      const days: string[] = [];
      let streak = 0;
      let completedDays = 0;
      let pastDays = 0;

      for (let i = 0; i < PROGRAM_DAYS; i++) {
        const d = new Date(PROGRAM_START);
        d.setDate(d.getDate() + i);
        const dateStr = d.toISOString().split("T")[0];

        if (dateStr === today) {
          days.push("current");
        } else if (dateStr > today) {
          days.push("future");
        } else {
          pastDays++;
          const dayTasks = tasksByDate[dateStr];
          if (dayTasks && dayTasks.length > 0 && dayTasks.every(Boolean)) {
            days.push("completed");
            completedDays++;
          } else {
            days.push("missed");
          }
        }
      }

      for (let i = days.length - 1; i >= 0; i--) {
        if (days[i] === "completed") streak++;
        else if (days[i] === "current" || days[i] === "future") continue;
        else break;
      }

      setStreakDays(days);
      setStreakCount(streak);
      setConsistency(
        pastDays > 0 ? Math.round((completedDays / pastDays) * 100) : null
      );
    }

    // Process meals
    if (mealRows && mealRows.length > 0) {
      const mealMap: Record<string, string> = {};
      for (const m of mealRows as DailyMeal[]) {
        mealMap[m.meal_type] = m.description;
      }
      setMeals(mealMap);
    } else {
      const rows = Object.entries(DEFAULT_MEALS).map(([meal_type, description]) => ({
        date: today,
        meal_type,
        description,
      }));
      await supabase.from("daily_meals").insert(rows);
      setMeals({ ...DEFAULT_MEALS });
    }

    setLoaded(true);
  }, [today]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const toggleTask = useCallback(async (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    const newDone = !task.done;
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: newDone } : t))
    );
    await supabase
      .from("daily_tasks")
      .update({
        completed: newDone,
        completed_at: newDone ? new Date().toISOString() : null,
      })
      .eq("id", id);
  }, [tasks]);

  const updateLog = useCallback(async (fields: { weight_kg?: number; body_fat_pct?: number }) => {
    await supabase.from("daily_logs").update(fields).eq("date", today);
    if (fields.weight_kg !== undefined || fields.body_fat_pct !== undefined) {
      setLatestLog((prev) => prev ? { ...prev, ...fields } : prev);
      setAllLogs((prev) =>
        prev.map((l) => (l.date === today ? { ...l, ...fields } : l))
      );
    }
  }, [today]);

  const addMeasurement = useCallback(async (metric_name: string, value: number, unit = "KG") => {
    await supabase
      .from("measurements")
      .delete()
      .eq("date", today)
      .eq("metric_name", metric_name);
    await supabase.from("measurements").insert({ date: today, metric_name, value, unit });
    setMeasurements((prev) => {
      const filtered = prev.filter((m) => !(m.date === today && m.metric_name === metric_name));
      return [{ id: "", date: today, metric_name, value, unit, created_at: new Date().toISOString() }, ...filtered];
    });
  }, [today]);

  const updateEnergy = useCallback(async (level: "LOW" | "MID" | "HIGH") => {
    setEnergy(level);
    await supabase
      .from("daily_logs")
      .update({ energy_level: level })
      .eq("date", today);
  }, [today]);

  const updateTrainingSchedule = useCallback(async (schedule: string[]) => {
    setTrainingSchedule(schedule);
    await supabase
      .from("daily_logs")
      .update({ training_schedule: schedule })
      .eq("date", today);
  }, [today]);

  const updateMeal = useCallback(async (meal_type: string, description: string) => {
    setMeals((prev) => ({ ...prev, [meal_type]: description }));
    await supabase
      .from("daily_meals")
      .upsert({ date: today, meal_type, description }, { onConflict: "date,meal_type" });
  }, [today]);

  const currentWeight = latestLog?.weight_kg ?? START_WEIGHT;
  const currentBodyFat = latestLog?.body_fat_pct ?? START_BODY_FAT;
  const totalLoss = useMemo(() => +(START_WEIGHT - currentWeight).toFixed(1), [currentWeight]);
  const daysLeft = useMemo(() => Math.max(0, PROGRAM_DAYS - dayNumber + 1), [dayNumber]);
  const completedCount = useMemo(() => tasks.filter((t) => t.done).length, [tasks]);
  const percentage = useMemo(
    () => tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0,
    [tasks.length, completedCount]
  );
  const remaining = useMemo(() => tasks.length - completedCount, [tasks.length, completedCount]);

  const getMetric = useCallback((name: string): number | null => {
    const m = measurements.find((m) => m.metric_name === name);
    return m ? m.value : null;
  }, [measurements]);

  return {
    tasks,
    toggleTask,
    updateLog,
    addMeasurement,
    meals,
    updateMeal,
    trainingSchedule,
    updateTrainingSchedule,
    latestLog,
    allLogs,
    measurements,
    getMetric,
    streakDays,
    streakCount,
    consistency,
    energy,
    updateEnergy,
    loaded,
    today,
    dayNumber,
    daysLeft,
    currentWeight,
    currentBodyFat,
    totalLoss,
    completedCount,
    percentage,
    remaining,
  };
}
