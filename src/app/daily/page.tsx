"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useMonolith } from "@/lib/useMonolith";
import { PROGRAM_DAYS } from "@/lib/supabase";
import StreakBreakBanner from "@/components/StreakBreakBanner";

const AGGRESSIVE_QUOTES = [
  {
    title: "LOOK IN THE MIRROR. THAT'S YOUR OPPONENT.",
    body: "EVERY GRAM OF SODIUM IS SABOTAGE. EVERY GLASS OF WATER IS A WEAPON. YOU'RE NOT DIETING — YOU'RE GOING TO WAR WITH MEDIOCRITY.",
    icon: "warning",
  },
  {
    title: "GRADUATION PHOTOS ARE FOREVER.",
    body: "EVERYONE WILL SEE THAT FACE. YOUR FAMILY. YOUR FRIENDS. YOUR FUTURE SELF. MAKE SURE THE MAN IN THE PHOTO EARNED IT.",
    icon: "school",
  },
  {
    title: "COMFORT IS WHERE AMBITION GOES TO DIE.",
    body: "YOUR BRAIN IS BEGGING YOU TO QUIT. THAT'S HOW YOU KNOW IT'S WORKING. THE PAIN IS TEMPORARY. THAT JAWLINE IS PERMANENT.",
    icon: "local_fire_department",
  },
];

function AggressiveQuote() {
  const [index, setIndex] = useState(0);

  const goTo = useCallback((i: number) => setIndex(i), []);

  const next = useCallback(() => {
    setIndex((prev) => (prev + 1) % AGGRESSIVE_QUOTES.length);
  }, []);

  useEffect(() => {
    const interval = setInterval(next, 7000);
    return () => clearInterval(interval);
  }, [next]);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={next}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") next(); }}
      className="bg-tertiary-fixed p-6 sm:p-8 relative overflow-hidden text-left w-full cursor-pointer group"
    >
      {/* Background icons */}
      {AGGRESSIVE_QUOTES.map((aq, i) => (
        <span
          key={aq.icon}
          className={`material-symbols-outlined absolute -right-4 -bottom-4 text-[10rem] sm:text-[12rem] pointer-events-none transition-all duration-700 ease-out group-hover:rotate-12 ${
            i === index ? "opacity-20" : "opacity-0"
          }`}
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          {aq.icon}
        </span>
      ))}

      {/* Grid stack — all quotes in same cell, container sizes to tallest */}
      <div className="relative z-10 grid">
        {AGGRESSIVE_QUOTES.map((aq, i) => (
          <div
            key={i}
            className={`[grid-area:1/1] flex flex-col gap-4 sm:gap-6 transition-all duration-500 ease-out ${
              i === index ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
            }`}
          >
            <h4 className="font-[var(--font-headline)] font-black text-2xl sm:text-4xl uppercase leading-none tracking-tighter text-white">
              {aq.title}
            </h4>
            <p className="text-white/80 text-xs sm:text-sm uppercase tracking-wide leading-relaxed">
              {aq.body}
            </p>
          </div>
        ))}
      </div>

      {/* Indicators */}
      <div className="relative z-10 flex gap-1.5 mt-5 sm:mt-6">
        {AGGRESSIVE_QUOTES.map((_, i) => (
          <button
            key={i}
            onClick={(e) => { e.stopPropagation(); goTo(i); }}
            className={`h-1 rounded-full transition-all duration-500 ${
              i === index ? "bg-white w-8" : "bg-white/25 w-4 hover:bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

const TRAINING_INFO: Record<string, { name: string; icon: string; muscles: string; color: string; borderColor: string; quotes: string[] }> = {
  U: {
    name: "UPPER BODY",
    icon: "fitness_center",
    muscles: "Chest / Back / Shoulders / Arms",
    color: "bg-secondary/15",
    borderColor: "border-secondary",
    quotes: [
      "CHEST DOESN'T BUILD ITSELF. GET IN THERE.",
      "YOUR BACK IS YOUR ARMOR. MAKE IT STRONGER.",
      "PUSH UNTIL THE MIRROR NOTICES.",
    ],
  },
  L: {
    name: "LOWER BODY",
    icon: "directions_run",
    muscles: "Quads / Hams / Glutes / Calves",
    color: "bg-secondary/15",
    borderColor: "border-secondary",
    quotes: [
      "LEGS FEED THE WOLF. NEVER SKIP.",
      "THE GROUND SHOULD FEAR YOUR NEXT STEP.",
      "SQUAT LIKE YOUR JAWLINE DEPENDS ON IT.",
    ],
  },
  C: {
    name: "CARDIO",
    icon: "monitor_heart",
    muscles: "LISS 30-45 min / HIIT 20 min",
    color: "bg-tertiary-fixed/15",
    borderColor: "border-tertiary-fixed",
    quotes: [
      "SWEAT IS FAT CRYING. MAKE IT WEEP.",
      "EVERY STEP BURNS SODIUM. EVERY STEP DEBLOATS.",
      "CARDIO ISN'T OPTIONAL. YOUR FACE FAT SAYS SO.",
    ],
  },
  R: {
    name: "REST DAY",
    icon: "self_improvement",
    muscles: "Recovery / Stretching / Mobility",
    color: "bg-surface-container-high",
    borderColor: "border-outline-variant",
    quotes: [
      "REST IS PART OF THE PLAN. NOT A BREAK FROM IT.",
      "MUSCLES GROW DURING RECOVERY. TRUST THE PROCESS.",
      "TODAY YOU REST. TOMORROW YOU DESTROY.",
    ],
  },
};

function TodaysFocusCard({ trainingSchedule, energy, updateEnergy }: {
  trainingSchedule: string[];
  energy: "LOW" | "MID" | "HIGH";
  updateEnergy: (level: "LOW" | "MID" | "HIGH") => void;
}) {
  const todayDow = (new Date().getDay() + 6) % 7;
  const todayType = trainingSchedule[todayDow] || "U";
  const info = TRAINING_INFO[todayType] || TRAINING_INFO.U;
  const quote = info.quotes[new Date().getDate() % info.quotes.length];

  return (
    <div className={`bg-surface-container rounded-lg border-l-4 ${info.borderColor} relative overflow-hidden flex-1 flex flex-col`}>
      <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-[10rem] opacity-[0.03] pointer-events-none">{info.icon}</span>
      <div className="relative z-10 flex flex-col flex-1 p-5 sm:p-6">
        <div className="flex items-center justify-between mb-5">
          <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">TODAY&apos;S FOCUS</span>
          <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
            {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"][todayDow]}
          </span>
        </div>
        <div className="flex items-center gap-4 mb-5">
          <div className={`w-14 h-14 rounded-lg flex items-center justify-center ${info.color}`}>
            <span className={`material-symbols-outlined text-3xl ${
              todayType === "R" ? "text-neutral-400" : todayType === "C" ? "text-tertiary-fixed" : "text-secondary"
            }`}>{info.icon}</span>
          </div>
          <div>
            <h4 className="font-[var(--font-headline)] font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">{info.name}</h4>
            <p className="text-sm text-neutral-400 uppercase tracking-wider">{info.muscles}</p>
          </div>
        </div>
        <div className="bg-surface-container-low p-4 rounded mb-5">
          <p className="text-sm text-white/70 font-bold italic leading-relaxed">&ldquo;{quote}&rdquo;</p>
        </div>
        <div className="mt-auto pt-4 border-t border-outline-variant/15">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">ENERGY LEVEL</span>
            <span className="font-[var(--font-headline)] font-black text-lg text-white uppercase">{energy}</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {(["LOW", "MID", "HIGH"] as const).map((level) => (
              <button
                key={level}
                onClick={() => updateEnergy(level)}
                className={`py-2.5 text-xs font-bold uppercase tracking-widest transition-all rounded ${
                  energy === level
                    ? level === "HIGH" ? "bg-secondary text-on-secondary" : level === "MID" ? "bg-white text-black" : "bg-tertiary-fixed text-white"
                    : "bg-surface-container-highest text-neutral-500 hover:text-white"
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const TASK_META: Record<string, { subtitle: string; icon: string }> = {
  "Morning Lemon Water (500ml)": { subtitle: "HYDRATION FIRST THING", icon: "water_drop" },
  "Macro Target: 180g Protein / 1800 KCAL": { subtitle: "CALORIC DEFICIT PROTOCOL", icon: "restaurant" },
  "Strength Training (45 min)": { subtitle: "PRESERVE MUSCLE MASS", icon: "fitness_center" },
  "Cardio Session (30 min LISS)": { subtitle: "FAT BURNING ZONE", icon: "directions_run" },
  "Water Intake: 3.7L Total": { subtitle: "FLUSH SODIUM / DEBLOAT", icon: "water_drop" },
  "Face Exercise & Lymphatic Massage (5 min)": { subtitle: "5 MIN DEBLOAT PROTOCOL", icon: "face" },
  "No Sodium After 6PM": { subtitle: "REDUCE WATER RETENTION", icon: "block" },
  "Sleep 8 Hours (Before 11PM)": { subtitle: "CORTISOL & RECOVERY CONTROL", icon: "bedtime" },
};

export default function DailyPage() {
  const {
    tasks, toggleTask, streakDays, streakCount, energy, updateEnergy,
    trainingSchedule, completedCount, dayNumber, loaded,
  } = useMonolith();

  const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  const currentMonth = monthNames[new Date().getMonth()];

  const firstPendingId = useMemo(() => tasks.find((t) => !t.done)?.id, [tasks]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* TopAppBar */}
      <header className="flex flex-col sm:flex-row justify-between sm:items-center w-full px-4 sm:px-8 py-4 sm:py-6 sticky top-0 z-40 bg-[#0e0e0e]/60 backdrop-blur-xl gap-2">
        <div className="flex items-center gap-4 sm:gap-6">
          <h2 className="font-[var(--font-headline)] font-bold uppercase tracking-tight text-white text-lg sm:text-xl">
            DAILY LOG
          </h2>
          <div className="h-4 w-[1px] bg-outline-variant hidden sm:block"></div>
          <p className="font-[var(--font-headline)] font-bold text-tertiary-fixed text-xs sm:text-sm tracking-widest uppercase">
            DEBLOAT & CUT
          </p>
        </div>
        <div className="flex items-center gap-6 sm:gap-8">
          <button className="text-[#919191] hover:text-white transition-colors duration-150">
            <span className="material-symbols-outlined text-xl">notifications</span>
          </button>
          <button className="text-[#919191] hover:text-white transition-colors duration-150">
            <span className="material-symbols-outlined text-xl">settings</span>
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 p-4 sm:p-8 md:p-12 lg:p-16 max-w-7xl w-full mx-auto">
        {/* Hero */}
        <section className="mb-12 sm:mb-20">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 sm:gap-8">
            <div className="max-w-2xl">
              <span className="text-tertiary-fixed font-[var(--font-headline)] font-black text-xs sm:text-sm tracking-[0.3em] sm:tracking-[0.4em] uppercase mb-3 sm:mb-4 block">
                PHASE 01 / DEBLOAT & CUT
              </span>
              <h3 className="font-[var(--font-headline)] font-black text-4xl sm:text-6xl md:text-8xl text-white leading-[0.9] uppercase tracking-tighter">
                TODAY IS FOR THE RELENTLESS
              </h3>
            </div>
            <div className="flex flex-col items-start md:items-end">
              <div className="text-[4rem] sm:text-[5rem] font-[var(--font-headline)] font-black text-white leading-none">
                {dayNumber.toString().padStart(2, "0")}
              </div>
              <div className="text-xs sm:text-sm font-[var(--font-headline)] font-bold text-outline tracking-[0.2em] sm:tracking-[0.3em] uppercase">
                {currentMonth} MISSION
              </div>
            </div>
          </div>
          <div className="h-[2px] bg-outline-variant w-full mt-8 sm:mt-12 opacity-30"></div>
        </section>

        {/* Streak Break Notification */}
        <div className="mb-8 sm:mb-12">
          <StreakBreakBanner streakDays={streakDays} streakCount={streakCount} loaded={loaded} />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12">
          {/* Tasks */}
          <div className="lg:col-span-8 space-y-3 sm:space-y-4">
            <div className="flex justify-between items-center mb-6 sm:mb-8">
              <h4 className="font-[var(--font-headline)] font-bold text-xl sm:text-2xl tracking-tighter uppercase">
                MISSION PARAMETERS
              </h4>
              <span className="text-outline font-[var(--font-label)] text-[0.7rem] uppercase tracking-widest">
                {completedCount}/{tasks.length} COMPLETE
              </span>
            </div>

            {tasks.map((task) => {
              const meta = TASK_META[task.label] || { subtitle: "", icon: "check_circle" };
              const isActive = task.id === firstPendingId && !task.done;

              if (isActive) {
                return (
                  <div
                    key={task.id}
                    className="bg-surface-container-high border-2 border-white/10 p-5 sm:p-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between relative overflow-hidden"
                  >
                    <div className="absolute right-0 top-0 h-full w-1 bg-white opacity-20"></div>
                    <div className="flex items-center gap-4 sm:gap-6 w-full md:w-auto">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-white text-black shrink-0">
                        <span className="material-symbols-outlined">{meta.icon}</span>
                      </div>
                      <div className="min-w-0">
                        <h5 className="font-[var(--font-headline)] font-black text-base sm:text-xl uppercase tracking-tighter text-white">
                          {task.label}
                        </h5>
                        <p className="text-xs text-on-surface-variant uppercase tracking-wider">
                          {meta.subtitle}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleTask(task.id)}
                      className="w-full md:w-auto bg-white text-black px-6 sm:px-8 py-3 font-[var(--font-headline)] font-black text-xs sm:text-sm uppercase tracking-widest hover:bg-secondary hover:text-black transition-all active:scale-95 duration-150 shrink-0 whitespace-nowrap"
                    >
                      EXECUTE NOW
                    </button>
                  </div>
                );
              }

              return (
                <button
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className="w-full bg-surface-container-low p-4 sm:p-6 flex items-center justify-between group hover:bg-surface-container-high transition-all duration-150 text-left"
                >
                  <div className="flex items-center gap-4 sm:gap-6 min-w-0">
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center shrink-0 ${
                        task.done
                          ? "bg-secondary/10 border border-secondary text-secondary"
                          : "bg-surface-container-highest border border-outline-variant text-outline"
                      }`}
                    >
                      <span
                        className="material-symbols-outlined"
                        style={task.done ? { fontVariationSettings: "'FILL' 1" } : undefined}
                      >
                        {task.done ? "check" : meta.icon}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <h5
                        className={`font-[var(--font-headline)] font-bold text-sm sm:text-lg uppercase tracking-tight truncate ${
                          task.done ? "text-secondary" : "text-white opacity-50"
                        }`}
                      >
                        {task.label}
                      </h5>
                      <p className="text-xs text-outline uppercase tracking-wider">
                        {task.done ? "COMPLETED" : meta.subtitle}
                      </p>
                    </div>
                  </div>
                  <div className="text-right hidden sm:block shrink-0 ml-4">
                    <p className={`font-[var(--font-headline)] font-bold uppercase text-sm tracking-tighter ${
                      task.done ? "text-secondary" : "text-tertiary-fixed"
                    }`}>
                      {task.done ? "DONE" : "PENDING"}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6 sm:space-y-8 self-start lg:sticky lg:top-20">
            {/* Aggressive Note — rotating quotes */}
            <AggressiveQuote />

            {/* Today's Focus + Energy — combined card */}
            <TodaysFocusCard trainingSchedule={trainingSchedule} energy={energy} updateEnergy={updateEnergy} />
          </div>
        </div>

        {/* Streak Matrix */}
        <section className="mt-12 sm:mt-20">
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h4 className="font-[var(--font-headline)] font-bold text-sm tracking-[0.2em] sm:tracking-[0.3em] uppercase">
              SYSTEM PERSISTENCE
            </h4>
            <span className="text-[0.6rem] font-bold text-outline tracking-[0.15em] sm:tracking-[0.2em] uppercase">
              {PROGRAM_DAYS}-DAY CHALLENGE
            </span>
          </div>
          <div className="flex flex-wrap gap-1">
            {streakDays.map((status, i) => (
              <div
                key={i}
                className={`w-6 h-6 sm:w-8 sm:h-8 border border-black/20 ${
                  status === "current"
                    ? "bg-white shadow-[inset_0_0_8px_rgba(0,0,0,0.5)] animate-pulse"
                    : status === "completed"
                    ? "bg-secondary"
                    : status === "missed"
                    ? "bg-tertiary-fixed-dim"
                    : "bg-surface-container-highest opacity-20"
                }`}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
