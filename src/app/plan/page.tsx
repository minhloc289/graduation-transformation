"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useMonolith } from "@/lib/useMonolith";
import { supabase, PROGRAM_DAYS, PROGRAM_START, MEAL_ICONS, DEFAULT_MEALS, getTodayString } from "@/lib/supabase";
import type { DailyMeal } from "@/lib/supabase";

const WEEKDAYS = ["M", "T", "W", "T", "F", "S", "S"];
const MONTH_SHORT = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

function buildCalendarDates() {
  const dates: { dateStr: string; day: number; month: string; dow: number }[] = [];
  for (let i = 0; i < PROGRAM_DAYS; i++) {
    const d = new Date(PROGRAM_START);
    d.setDate(d.getDate() + i);
    dates.push({
      dateStr: d.toISOString().split("T")[0],
      day: d.getDate(),
      month: MONTH_SHORT[d.getMonth()],
      dow: (d.getDay() + 6) % 7,
    });
  }
  return dates;
}

const TRAINING_TYPES = [
  { key: "U", label: "UPPER", detail: "Chest / Back / Shoulders / Arms", color: "bg-secondary/20", text: "text-secondary" },
  { key: "L", label: "LOWER", detail: "Quads / Hams / Glutes / Calves", color: "bg-[#1a6b3a]/30", text: "text-secondary" },
  { key: "C", label: "CARDIO", detail: "LISS 30-45 min / HIIT 20 min", color: "bg-tertiary-fixed/10", text: "text-tertiary-fixed" },
  { key: "R", label: "REST", detail: "Recovery & stretching", color: "bg-surface-container-low", text: "text-neutral-600" },
] as const;

const DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

function WeeklyRotation() {
  const { trainingSchedule, updateTrainingSchedule } = useMonolith();
  const schedule = trainingSchedule;

  const cycleType = (index: number) => {
    const order = ["U", "L", "C", "R"];
    const current = schedule[index];
    const next = order[(order.indexOf(current) + 1) % order.length];
    const newSchedule = schedule.map((v, i) => (i === index ? next : v));
    updateTrainingSchedule(newSchedule);
  };

  return (
    <div className="mt-4 pt-4 border-t border-outline-variant/15">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-black text-white uppercase tracking-[0.3em]">WEEKLY ROTATION</span>
        <span className="text-xs text-neutral-500 uppercase tracking-wider">TAP TO CHANGE</span>
      </div>
      <div className="grid grid-cols-7 gap-px bg-outline-variant/10 rounded overflow-hidden">
        {DAYS.map((day, i) => {
          const t = TRAINING_TYPES.find((tt) => tt.key === schedule[i])!;
          return (
            <button
              key={day}
              onClick={() => cycleType(i)}
              className={`${t.color} ${t.text} py-2.5 sm:py-3 flex flex-col items-center gap-0.5 cursor-pointer hover:brightness-125 transition-all active:scale-95`}
            >
              <span className="text-[0.5rem] sm:text-[0.6rem] font-bold uppercase tracking-wider opacity-60">{day}</span>
              <span className="font-[var(--font-headline)] text-sm sm:text-base font-bold">{schedule[i]}</span>
            </button>
          );
        })}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
        {TRAINING_TYPES.filter((t) => schedule.includes(t.key)).map((l) => (
          <div key={l.key} className={`${l.color} rounded px-3 py-2 flex items-center gap-2.5`}>
            <span className={`font-[var(--font-headline)] text-lg font-bold ${l.text}`}>{l.key}</span>
            <div>
              <p className={`text-xs font-bold uppercase tracking-wider ${l.text}`}>{l.label}</p>
              <p className="text-[0.6rem] text-neutral-400 leading-snug">{l.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PlanPage() {
  const { streakDays, dayNumber, daysLeft, meals, updateMeal } = useMonolith();
  const today = getTodayString();

  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedMeals, setSelectedMeals] = useState<Record<string, string>>({});
  const [editingMeal, setEditingMeal] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState("");

  const calendarDates = useMemo(() => buildCalendarDates(), []);
  const firstDow = calendarDates[0].dow;

  const loadMealsForDate = useCallback(async (date: string) => {
    if (date === today) { setSelectedMeals(meals); return; }
    const { data } = await supabase.from("daily_meals").select("*").eq("date", date);
    if (data && data.length > 0) {
      const map: Record<string, string> = {};
      for (const m of data as DailyMeal[]) map[m.meal_type] = m.description;
      setSelectedMeals(map);
    } else {
      setSelectedMeals({});
    }
  }, [today, meals]);

  useEffect(() => { loadMealsForDate(selectedDate); }, [selectedDate, loadMealsForDate]);

  const saveMeal = async (meal_type: string, description: string) => {
    setSelectedMeals((prev) => ({ ...prev, [meal_type]: description }));
    if (selectedDate === today) { updateMeal(meal_type, description); }
    else { await supabase.from("daily_meals").upsert({ date: selectedDate, meal_type, description }, { onConflict: "date,meal_type" }); }
    setEditingMeal(null);
  };

  const startEdit = (type: string) => {
    setEditDraft(selectedMeals[type] || DEFAULT_MEALS[type] || "");
    setEditingMeal(type);
  };

  const selectedDateObj = calendarDates.find((d) => d.dateStr === selectedDate);
  const selectedLabel = selectedDateObj ? `${selectedDateObj.month} ${selectedDateObj.day}` : "";

  return (
    <div className="min-h-screen bg-surface-container-lowest">
      {/* Header */}
      <header className="flex justify-between items-center w-full px-4 sm:px-8 py-4 sm:py-6 bg-[#0e0e0e]/60 backdrop-blur-xl sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 bg-tertiary-fixed"></div>
          <span className="font-[var(--font-headline)] font-bold uppercase tracking-tight text-white text-lg sm:text-xl">
            TACTICAL PLAN
          </span>
        </div>
        <div className="flex items-center gap-3 sm:gap-6">
          <span className="text-xs sm:text-xs font-bold text-outline uppercase tracking-[0.3em]">
            DAY {dayNumber.toString().padStart(2, "0")}
          </span>
          <div className="h-4 w-px bg-outline-variant"></div>
          <span className="text-xs sm:text-xs font-bold text-tertiary-fixed uppercase tracking-[0.3em]">
            {daysLeft}D LEFT
          </span>
        </div>
      </header>

      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-5 sm:space-y-6">
        {/* Hero */}
        <section className="mb-4 sm:mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:gap-8">
            <div className="max-w-2xl">
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-black font-[var(--font-headline)] leading-[0.9] tracking-tighter uppercase mb-4 md:mb-6">
                STRUCTURE IS <br /> YOUR WEAPON.
              </h2>
              <div className="flex items-center gap-4">
                <div className="h-[2px] w-12 bg-tertiary-fixed"></div>
                <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-tertiary-fixed">
                  {PROGRAM_DAYS}-DAY PROTOCOL
                </p>
              </div>
            </div>
            <div className="flex flex-col items-start md:items-end">
              <div className="text-[4rem] sm:text-[5rem] font-[var(--font-headline)] font-black text-white leading-none">
                {dayNumber.toString().padStart(2, "0")}
              </div>
              <div className="text-xs sm:text-sm font-[var(--font-headline)] font-bold text-outline tracking-[0.2em] sm:tracking-[0.3em] uppercase">
                DAY / {PROGRAM_DAYS}
              </div>
            </div>
          </div>
        </section>

        {/* === ROW 1: Calendar (8) + Milestones & Training (4) === */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
          {/* Calendar */}
          <div className="lg:col-span-8 bg-surface-container p-4 sm:p-6">
            <div className="flex justify-between items-end mb-3 sm:mb-4">
              <div className="flex items-center gap-3">
                <h3 className="font-[var(--font-headline)] font-bold text-lg sm:text-xl text-white uppercase">CALENDAR</h3>
                <span className="text-xs font-bold text-outline uppercase tracking-widest">
                  {calendarDates[0].month} {calendarDates[0].day} — {calendarDates[calendarDates.length - 1].month} {calendarDates[calendarDates.length - 1].day}
                </span>
              </div>
              <div className="flex gap-3">
                {[
                  { c: "bg-secondary-container", l: "DONE" },
                  { c: "bg-tertiary-fixed-dim", l: "MISS" },
                  { c: "bg-white", l: "NOW" },
                ].map((x) => (
                  <div key={x.l} className="flex items-center gap-1">
                    <div className={`w-2 h-2 ${x.c}`} />
                    <span className="text-xs text-outline font-bold uppercase tracking-wider">{x.l}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Weekday row */}
            <div className="grid grid-cols-7 gap-px mb-px">
              {WEEKDAYS.map((d, i) => (
                <div key={i} className="text-center text-xs font-bold text-outline uppercase py-1">{d}</div>
              ))}
            </div>
            {/* Date grid — compact cells */}
            <div className="grid grid-cols-7 gap-px bg-outline-variant/10">
              {Array.from({ length: firstDow }).map((_, i) => <div key={`e-${i}`} className="bg-surface-container" />)}
              {calendarDates.map((cd, i) => {
                const status = streakDays[i] || "future";
                const isSelected = cd.dateStr === selectedDate;
                const showMonth = i === 0 || cd.month !== calendarDates[i - 1].month;
                return (
                  <button
                    key={cd.dateStr}
                    onClick={() => setSelectedDate(cd.dateStr)}
                    className={`py-2 sm:py-2.5 flex flex-col items-center justify-center transition-all relative ${
                      isSelected ? "ring-1 ring-white ring-inset" : ""
                    } ${
                      status === "completed" ? "bg-secondary-container"
                      : status === "missed" ? "bg-tertiary-fixed-dim"
                      : status === "current" ? "bg-white"
                      : "bg-surface-container hover:bg-surface-container-high"
                    }`}
                  >
                    {showMonth && (
                      <span className={`text-xs sm:text-[0.4rem] font-black uppercase leading-none tracking-wider ${
                        status === "current" ? "text-black/40" : status === "completed" ? "text-secondary/70" : "text-outline/50"
                      }`}>{cd.month}</span>
                    )}
                    <span className={`text-xs sm:text-sm font-black leading-none ${
                      status === "current" ? "text-black"
                      : status === "completed" ? "text-secondary"
                      : status === "missed" ? "text-white/80"
                      : "text-neutral-600"
                    }`}>{cd.day}</span>
                  </button>
                );
              })}
            </div>
            {/* Training — editable weekly rotation schedule */}
            <WeeklyRotation />
          </div>

          {/* Right column: Milestones — stretches to match calendar */}
          <div className="lg:col-span-4 bg-surface-container p-5 sm:p-7 rounded-lg flex flex-col">
            <h3 className="font-[var(--font-headline)] font-bold text-xl sm:text-2xl text-white uppercase mb-5 tracking-tight">Milestones</h3>
            <div className="relative flex-1 flex flex-col justify-between">
              {/* Progress track */}
              <div className="absolute left-[18px] top-3 bottom-3 w-0.5 bg-outline-variant/20" />
              <div className="absolute left-[18px] top-3 w-0.5 bg-secondary transition-all" style={{ height: `${Math.min(100, (dayNumber / PROGRAM_DAYS) * 100)}%` }} />

              {[
                { day: 7, title: "BLOAT LOSS", desc: "-1-2kg lost. Face visibly less puffy.", icon: "water_drop" },
                { day: 14, title: "FAT LOSS BEGINS", desc: "Jawline emerging. Strength maintained.", icon: "trending_down" },
                { day: 21, title: "DEFINITION", desc: "Visible changes. Discipline locked in.", icon: "visibility" },
                { day: PROGRAM_DAYS, title: "GRADUATION", desc: "Target: -7kg. Face debloated.", icon: "school" },
              ].map((m) => {
                const reached = m.day <= dayNumber;
                const isNext = !reached && (m.day === [7, 14, 21, PROGRAM_DAYS].find(d => d > dayNumber));
                return (
                  <div key={m.day} className={`flex gap-4 py-3 ${reached ? "bg-secondary/[0.04] -mx-3 px-3 rounded-lg" : ""}`}>
                    <div className="relative z-10 shrink-0">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        reached ? "bg-secondary text-on-secondary shadow-[0_0_12px_rgba(74,225,118,0.3)]" : isNext ? "bg-surface-container-high ring-2 ring-white/30" : "bg-surface-container-high ring-1 ring-outline-variant/30"
                      }`}>
                        {reached ? (
                          <span className="material-symbols-outlined text-on-secondary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                        ) : (
                          <span className={`material-symbols-outlined text-lg ${isNext ? "text-white" : "text-neutral-600"}`}>{m.icon}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex-1 pt-0.5">
                      <div className="flex items-baseline gap-2 mb-0.5">
                        <span className={`font-mono text-sm font-bold ${reached ? "text-secondary" : isNext ? "text-white" : "text-neutral-600"}`}>DAY {String(m.day).padStart(2, "0")}</span>
                        {reached && <span className="text-xs font-black text-secondary uppercase tracking-widest">DONE</span>}
                        {isNext && <span className="text-xs font-black text-white/40 uppercase tracking-widest">NEXT</span>}
                      </div>
                      <p className={`text-sm font-black uppercase tracking-wide ${reached ? "text-white" : isNext ? "text-white/80" : "text-neutral-500"}`}>{m.title}</p>
                      <p className={`text-sm mt-0.5 ${reached ? "text-neutral-300" : "text-neutral-600"}`}>{m.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* === ROW 2: What to Drink (6) + What to Eat (6) === */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {/* What To Drink */}
          <div className="bg-surface-container p-5 sm:p-8 rounded-lg">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-[var(--font-headline)] font-bold text-xl sm:text-2xl text-white uppercase tracking-tight">What To Drink</h3>
              <span className="bg-secondary/10 border border-secondary/20 px-3 py-1 text-xs font-black text-secondary uppercase tracking-widest">{selectedLabel}</span>
            </div>
            <div className="space-y-3">
              {[
                { icon: "water_drop", label: "WATER", suggest: "3.7L throughout the day" },
                { icon: "water_drop", label: "LEMON WATER", suggest: "1 cup, morning empty stomach" },
                { icon: "emoji_food_beverage", label: "COCONUT WATER", suggest: "1-2 cups, post-workout for electrolytes" },
                { icon: "emoji_food_beverage", label: "GREEN TEA", suggest: "2 cups, morning & afternoon" },
              ].map((d) => (
                <div key={d.label} className="bg-surface-container-low p-4 rounded border-l-2 border-secondary/30">
                  <div className="flex items-center gap-3 mb-1.5">
                    <span className="material-symbols-outlined text-secondary text-xl shrink-0">{d.icon}</span>
                    <span className="text-sm font-black text-secondary uppercase tracking-widest flex-1">{d.label}</span>
                  </div>
                  <p className="text-sm text-white/70 leading-relaxed pl-9">{d.suggest}</p>
                </div>
              ))}
            </div>
          </div>

          {/* What To Eat */}
          <div className="bg-surface-container p-5 sm:p-8 rounded-lg">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-[var(--font-headline)] font-bold text-xl sm:text-2xl text-white uppercase tracking-tight">What To Eat</h3>
              <span className="bg-secondary/10 border border-secondary/20 px-3 py-1 text-xs font-black text-secondary uppercase tracking-widest">{selectedLabel}</span>
            </div>
            <div className="space-y-3">
              {(["breakfast", "lunch", "dinner", "snack"] as const).map((type) => (
                <div key={type} className="bg-surface-container-low p-4 rounded border-l-2 border-secondary/30">
                  <div className="flex items-center gap-3 mb-1.5">
                    <span className="material-symbols-outlined text-secondary text-xl shrink-0">{MEAL_ICONS[type]}</span>
                    <span className="text-sm font-black text-secondary uppercase tracking-widest flex-1">{type}</span>
                    <button onClick={() => editingMeal === type ? saveMeal(type, editDraft) : startEdit(type)} className="text-outline hover:text-white transition-colors p-1">
                      <span className="material-symbols-outlined text-lg">{editingMeal === type ? "check" : "edit"}</span>
                    </button>
                  </div>
                  {editingMeal === type ? (
                    <input value={editDraft} onChange={(e) => setEditDraft(e.target.value)} onKeyDown={(e) => e.key === "Enter" && saveMeal(type, editDraft)} autoFocus className="w-full bg-surface-container-lowest border border-outline-variant/30 px-3 py-2 text-sm text-white focus:outline-none focus:border-secondary rounded" />
                  ) : (
                    <p className="text-sm text-white/70 leading-relaxed pl-9">{selectedMeals[type] || DEFAULT_MEALS[type] || "Click edit to plan..."}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* === TACTICAL OPERATIONS SECTION === */}
        <div className="relative">
          {/* Section header */}
          <div className="flex items-center gap-4 mb-5">
            <div className="h-px flex-1 bg-gradient-to-r from-tertiary-fixed/40 to-transparent"></div>
            <span className="text-sm font-black text-tertiary-fixed uppercase tracking-[0.5em] shrink-0">OPERATIONAL DIRECTIVES</span>
            <div className="h-px flex-1 bg-gradient-to-l from-tertiary-fixed/40 to-transparent"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Rules */}
            <div className="bg-surface-container p-6 sm:p-8 rounded-lg relative overflow-hidden">
              {/* Corner classification mark */}
              <div className="absolute top-0 right-0 bg-tertiary-fixed/10 px-4 py-1.5">
                <span className="text-xs font-black text-tertiary-fixed uppercase tracking-[0.3em]">MANDATORY</span>
              </div>

              <h3 className="font-[var(--font-headline)] font-bold text-2xl sm:text-3xl text-white uppercase tracking-tight mb-2">
                Rules of Engagement
              </h3>
              <p className="text-sm text-neutral-400 mb-6">Violation of any directive resets your streak to zero.</p>

              <div className="space-y-0">
                {[
                  { rule: "No alcohol. ZERO. It bloats your face overnight.", icon: "no_drinks", severity: "CRITICAL" },
                  { rule: "No processed food or refined sugar. Clean fuel only.", icon: "block", severity: "CRITICAL" },
                  { rule: "3.7L water daily. Flush the sodium. Debloat the face.", icon: "water_drop", severity: "HIGH" },
                  { rule: "No eating after 8PM. Let your body process overnight.", icon: "schedule", severity: "HIGH" },
                  { rule: "8 hours sleep minimum. Cortisol kills your jawline.", icon: "bedtime", severity: "HIGH" },
                ].map((r, i) => (
                  <div key={i} className="flex items-stretch border-b border-outline-variant/10 last:border-0">
                    {/* Severity bar */}
                    <div className={`w-1 shrink-0 ${r.severity === "CRITICAL" ? "bg-tertiary-fixed" : "bg-tertiary-fixed/40"}`} />
                    <div className="flex items-center gap-4 py-4 px-4 flex-1">
                      <div className="w-10 h-10 bg-surface-container-low flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-tertiary-fixed text-xl">{r.icon}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm sm:text-base text-white font-bold leading-snug">{r.rule}</p>
                      </div>
                      <span className={`text-xs font-black uppercase tracking-widest shrink-0 hidden sm:block ${
                        r.severity === "CRITICAL" ? "text-tertiary-fixed" : "text-tertiary-fixed/70"
                      }`}>{r.severity}</span>
                    </div>
                  </div>
                ))}
              </div>

            </div>

            {/* Debloat Protocol */}
            <div className="bg-surface-container p-6 sm:p-8 rounded-lg relative overflow-hidden">
              {/* Corner classification mark */}
              <div className="absolute top-0 right-0 bg-tertiary-fixed/10 px-4 py-1.5">
                <span className="text-xs font-black text-tertiary-fixed uppercase tracking-[0.3em]">DAILY OPS</span>
              </div>

              <h3 className="font-[var(--font-headline)] font-bold text-2xl sm:text-3xl text-white uppercase tracking-tight mb-2">
                Face Debloat Protocol
              </h3>
              <p className="text-sm text-neutral-400 mb-6">Execute every step. Every day. No exceptions until graduation.</p>

              {/* Timeline-connected steps */}
              <div className="relative">
                {/* Vertical timeline line */}
                <div className="absolute left-[19px] top-2 bottom-2 w-px bg-gradient-to-b from-tertiary-fixed/50 via-tertiary-fixed/20 to-transparent" />

                <div className="space-y-0">
                  {[
                    { icon: "water_drop", t: "LEMON WATER", d: "500ml warm + lemon, empty stomach", time: "06:00" },
                    { icon: "self_improvement", t: "CHIN-TO-CEILING", d: "Head back, push jaw. 20 reps ×2", time: "06:10" },
                    { icon: "face", t: "FISH FACE", d: "Cheeks in, smile. Hold 10s, 15 reps", time: "06:15" },
                    { icon: "spa", t: "FACE MASSAGE", d: "Jawline → ears → neck. 3 minutes", time: "06:20" },
                    { icon: "block", t: "SODIUM CAP", d: "Under 2000mg/day. Zero after 6PM", time: "ALL DAY" },
                    { icon: "bedtime", t: "ELEVATED SLEEP", d: "Head raised to prevent puffiness", time: "23:00" },
                  ].map((s, i) => (
                    <div key={s.t} className="flex items-stretch">
                      {/* Timeline node */}
                      <div className="w-10 shrink-0 flex flex-col items-center pt-4">
                        <div className="w-3 h-3 bg-tertiary-fixed rounded-full ring-2 ring-surface-container z-10" />
                      </div>
                      {/* Content */}
                      <div className="flex-1 flex items-center gap-3 py-3 border-b border-outline-variant/10 last:border-0">
                        <div className="flex-1">
                          <p className="text-sm font-black text-white uppercase tracking-wider">{s.t}</p>
                          <p className="text-sm text-neutral-400 leading-relaxed">{s.d}</p>
                        </div>
                        <span className="text-xs font-black text-tertiary-fixed uppercase tracking-widest shrink-0 hidden sm:block">{s.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* === AVOID Section === */}
        <div className="bg-surface-container-low p-5 sm:p-8 rounded-lg relative overflow-hidden">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-tertiary-fixed/15 rounded flex items-center justify-center">
                <span className="material-symbols-outlined text-tertiary-fixed text-lg">block</span>
              </div>
              <h3 className="font-[var(--font-headline)] font-bold text-lg sm:text-xl text-white uppercase tracking-tight">Bloat Triggers</h3>
            </div>
            <span className="text-xs font-black text-tertiary-fixed uppercase tracking-[0.3em]">AVOID</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3">
            {[
              { name: "Alcohol", icon: "no_drinks" },
              { name: "Soda", icon: "local_drink" },
              { name: "Sugary Drinks", icon: "emoji_food_beverage" },
              { name: "Caffeine", icon: "local_cafe" },
              { name: "Processed Meats", icon: "restaurant" },
              { name: "Instant Noodles", icon: "ramen_dining" },
              { name: "White Bread", icon: "bakery_dining" },
              { name: "Fried Food", icon: "fastfood" },
              { name: "Soy Sauce", icon: "liquor" },
              { name: "Dairy Milk", icon: "water_drop" },
            ].map((item) => (
              <div key={item.name} className="flex items-center gap-2.5 bg-tertiary-fixed/[0.06] border border-tertiary-fixed/15 p-2.5 sm:p-3 rounded hover:bg-tertiary-fixed/10 transition-colors">
                <span className="material-symbols-outlined text-tertiary-fixed/40 text-lg shrink-0">{item.icon}</span>
                <span className="text-xs sm:text-sm font-bold text-tertiary-fixed uppercase tracking-wider">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
