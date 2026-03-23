"use client";

import { useState } from "react";

interface DailyTask {
  id: number;
  label: string;
  subtitle: string;
  icon: string;
  status: "done" | "active" | "pending" | "progress";
  detail?: string;
  detailLabel?: string;
  progress?: number;
}

export default function DailyPage() {
  const [tasks, setTasks] = useState<DailyTask[]>([
    {
      id: 1,
      label: "45 MIN MORNING FASTED CARDIO",
      subtitle: "COMPLETED AT 05:45 AM",
      icon: "check",
      status: "done",
      detail: "00:45:12",
      detailLabel: "ELAPSED TIME",
    },
    {
      id: 2,
      label: "MACRO GOALS: 220G PROTEIN",
      subtitle: "FUELING RATIO OPTIMIZED",
      icon: "check",
      status: "done",
      detail: "100%",
      detailLabel: "QUOTA MET",
    },
    {
      id: 3,
      label: "HEAVY COMPOUND SESSION (PUSH)",
      subtitle: "TARGET: FAILURE REPS",
      icon: "fitness_center",
      status: "active",
    },
    {
      id: 4,
      label: "GALLON OF WATER",
      subtitle: "",
      icon: "water_drop",
      status: "progress",
      detail: "3/4 QUARTS",
      detailLabel: "HYDRATION STATUS",
      progress: 75,
    },
    {
      id: 5,
      label: "COLD EXPOSURE",
      subtitle: "3 MINUTE IMMERSION",
      icon: "ac_unit",
      status: "pending",
    },
  ]);

  const [energy, setEnergy] = useState<"LOW" | "MID" | "HIGH">("MID");

  const completedCount = tasks.filter(
    (t) => t.status === "done"
  ).length;

  const executeTask = (id: number) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, status: "done" as const, icon: "check", subtitle: "COMPLETED" }
          : t
      )
    );
  };

  const streakDays = [
    ...Array(4).fill("completed"),
    "missed",
    ...Array(7).fill("completed"),
    ...Array(18).fill("future"),
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* TopAppBar */}
      <header className="flex flex-col sm:flex-row justify-between sm:items-center w-full px-4 sm:px-8 py-4 sm:py-6 sticky top-0 z-40 bg-[#0e0e0e]/60 backdrop-blur-xl gap-2">
        <div className="flex items-center gap-4 sm:gap-6">
          <h2 className="font-[var(--font-headline)] font-bold uppercase tracking-tight text-white text-lg sm:text-xl">
            DAILY LOG
          </h2>
          <div className="h-4 w-[1px] bg-outline-variant hidden sm:block"></div>
          <p className="font-[var(--font-headline)] font-bold text-secondary text-xs sm:text-sm tracking-widest uppercase">
            MINDSET: AGGRESSIVE
          </p>
        </div>
        <div className="flex items-center gap-6 sm:gap-8">
          <button className="text-[#919191] hover:text-white transition-colors duration-150">
            <span className="material-symbols-outlined text-xl">
              notifications
            </span>
          </button>
          <button className="text-[#919191] hover:text-white transition-colors duration-150">
            <span className="material-symbols-outlined text-xl">
              settings
            </span>
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 p-4 sm:p-8 md:p-12 lg:p-16 max-w-7xl w-full mx-auto">
        {/* Hero */}
        <section className="mb-12 sm:mb-20">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 sm:gap-8">
            <div className="max-w-2xl">
              <span className="text-secondary font-[var(--font-headline)] font-black text-xs sm:text-sm tracking-[0.3em] sm:tracking-[0.4em] uppercase mb-3 sm:mb-4 block">
                PHASE 01 / RECONSTRUCTION
              </span>
              <h3 className="font-[var(--font-headline)] font-black text-4xl sm:text-6xl md:text-8xl text-white leading-[0.9] uppercase tracking-tighter">
                TODAY IS FOR THE RELENTLESS
              </h3>
            </div>
            <div className="flex flex-col items-start md:items-end">
              <div className="text-[4rem] sm:text-[5rem] font-[var(--font-headline)] font-black text-white leading-none">
                12
              </div>
              <div className="text-xs sm:text-sm font-[var(--font-headline)] font-bold text-outline tracking-[0.2em] sm:tracking-[0.3em] uppercase">
                OCTOBER MISSION
              </div>
            </div>
          </div>
          <div className="h-[2px] bg-outline-variant w-full mt-8 sm:mt-12 opacity-30"></div>
        </section>

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
              if (task.status === "active") {
                return (
                  <div
                    key={task.id}
                    className="bg-surface-container-high border-2 border-white/10 p-5 sm:p-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between relative overflow-hidden"
                  >
                    <div className="absolute right-0 top-0 h-full w-1 bg-white opacity-20"></div>
                    <div className="flex items-center gap-4 sm:gap-6 w-full md:w-auto">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-white text-black shrink-0">
                        <span className="material-symbols-outlined">
                          {task.icon}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <h5 className="font-[var(--font-headline)] font-black text-base sm:text-xl uppercase tracking-tighter text-white truncate">
                          {task.label}
                        </h5>
                        <p className="text-xs text-on-surface-variant uppercase tracking-wider">
                          {task.subtitle}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => executeTask(task.id)}
                      className="w-full md:w-auto bg-white text-black px-6 sm:px-8 py-3 font-[var(--font-headline)] font-black text-sm uppercase tracking-widest hover:bg-secondary hover:text-black transition-all active:scale-95 duration-150 shrink-0"
                    >
                      EXECUTE NOW
                    </button>
                  </div>
                );
              }

              return (
                <div
                  key={task.id}
                  className="bg-surface-container-low p-4 sm:p-6 flex items-center justify-between group hover:bg-surface-container-high transition-all duration-150"
                >
                  <div className="flex items-center gap-4 sm:gap-6 min-w-0">
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center shrink-0 ${
                        task.status === "done"
                          ? "bg-secondary/10 border border-secondary text-secondary"
                          : "bg-surface-container-highest border border-outline-variant text-outline"
                      }`}
                    >
                      <span
                        className="material-symbols-outlined"
                        style={
                          task.status === "done"
                            ? { fontVariationSettings: "'FILL' 1" }
                            : undefined
                        }
                      >
                        {task.icon}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <h5
                        className={`font-[var(--font-headline)] font-bold text-sm sm:text-lg uppercase tracking-tight truncate ${
                          task.status === "done"
                            ? "text-secondary"
                            : task.status === "pending"
                            ? "text-white opacity-50"
                            : "text-white"
                        }`}
                      >
                        {task.label}
                      </h5>
                      {task.subtitle && (
                        <p className="text-xs text-outline uppercase tracking-wider">
                          {task.subtitle}
                        </p>
                      )}
                      {task.status === "progress" && (
                        <div className="w-32 sm:w-48 h-1.5 bg-surface-container-highest mt-2">
                          <div
                            className="h-full bg-primary"
                            style={{ width: `${task.progress}%` }}
                          ></div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right hidden sm:block shrink-0 ml-4">
                    {task.status === "done" && task.detail && (
                      <>
                        <p className="font-[var(--font-headline)] font-bold text-white uppercase text-sm tracking-tighter">
                          {task.detail}
                        </p>
                        <p className="text-[0.6rem] text-outline uppercase tracking-widest">
                          {task.detailLabel}
                        </p>
                      </>
                    )}
                    {task.status === "progress" && (
                      <>
                        <p className="font-[var(--font-headline)] font-bold text-white uppercase text-sm tracking-tighter">
                          {task.detail}
                        </p>
                        <p className="text-[0.6rem] text-outline uppercase tracking-widest">
                          {task.detailLabel}
                        </p>
                      </>
                    )}
                    {task.status === "pending" && (
                      <p className="font-[var(--font-headline)] font-bold text-tertiary-fixed uppercase text-sm tracking-tighter">
                        PENDING
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6 sm:space-y-8">
            {/* Aggressive Note */}
            <div className="bg-tertiary-fixed p-6 sm:p-8 flex flex-col justify-between min-h-[240px] sm:min-h-[300px] relative overflow-hidden">
              <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-[10rem] sm:text-[12rem] opacity-20 pointer-events-none">
                warning
              </span>
              <h4 className="font-[var(--font-headline)] font-black text-2xl sm:text-4xl uppercase leading-none tracking-tighter text-white z-10">
                DO NOT NEGOTIATE WITH YOURSELF.
              </h4>
              <div className="mt-6 sm:mt-8 z-10">
                <p className="text-white/80 text-xs sm:text-sm uppercase tracking-wide leading-relaxed">
                  YOUR BRAIN WILL SEEK COMFORT. IT IS A TRAP. THE VOID IS WHERE
                  THE GROWTH IS. FINISH THE MISSION.
                </p>
                <div className="mt-4 sm:mt-6 flex gap-1">
                  <div className="w-4 h-4 bg-white"></div>
                  <div className="w-4 h-4 bg-white/40"></div>
                  <div className="w-4 h-4 bg-white/20"></div>
                </div>
              </div>
            </div>

            {/* Energy Tracker */}
            <div className="bg-surface-container-low p-6 sm:p-8">
              <h4 className="font-[var(--font-headline)] font-bold text-sm tracking-[0.2em] uppercase mb-6 sm:mb-8">
                CURRENT VITALITY
              </h4>
              <div className="space-y-4 sm:space-y-6">
                <div className="flex justify-between items-end">
                  <span className="text-xs font-bold uppercase tracking-widest text-outline">
                    ENERGY LEVEL
                  </span>
                  <span className="font-[var(--font-headline)] font-black text-xl sm:text-2xl uppercase text-white">
                    {energy}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {(["LOW", "MID", "HIGH"] as const).map((level) => (
                    <button
                      key={level}
                      onClick={() => setEnergy(level)}
                      className={`h-10 sm:h-12 border-b-2 transition-colors cursor-pointer ${
                        energy === level
                          ? "bg-white border-white shadow-[0px_0px_20px_rgba(255,255,255,0.2)]"
                          : "bg-surface-container-highest border-outline-variant hover:bg-surface-container-high"
                      }`}
                    />
                  ))}
                </div>
                <div className="flex justify-between text-[0.6rem] font-bold text-outline tracking-widest uppercase">
                  <span>LOW</span>
                  <span>MID</span>
                  <span>HIGH</span>
                </div>
              </div>
            </div>

            {/* Timer */}
            <div className="bg-surface-container-lowest border border-outline-variant/20 p-6 sm:p-8 flex flex-col items-center justify-center">
              <div className="relative w-36 h-36 sm:w-48 sm:h-48 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 192 192">
                  <circle
                    className="text-surface-container-high"
                    cx="96"
                    cy="96"
                    fill="none"
                    r="88"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <circle
                    className="text-white"
                    cx="96"
                    cy="96"
                    fill="none"
                    r="88"
                    stroke="currentColor"
                    strokeDasharray="552.92"
                    strokeDashoffset="138"
                    strokeWidth="8"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="font-[var(--font-headline)] font-black text-3xl sm:text-4xl text-white">
                    45:00
                  </span>
                  <span className="text-[0.6rem] font-bold text-outline uppercase tracking-widest">
                    NEXT SESSION
                  </span>
                </div>
              </div>
              <p className="mt-4 sm:mt-6 text-xs font-bold text-outline uppercase tracking-[0.15em] sm:tracking-[0.2em] text-center">
                PUSH WORKOUT WINDOW CLOSES IN 2H 14M
              </p>
            </div>
          </div>
        </div>

        {/* Streak Matrix */}
        <section className="mt-12 sm:mt-20">
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h4 className="font-[var(--font-headline)] font-bold text-sm tracking-[0.2em] sm:tracking-[0.3em] uppercase">
              SYSTEM PERSISTENCE
            </h4>
            <span className="text-[0.6rem] font-bold text-outline tracking-[0.15em] sm:tracking-[0.2em] uppercase">
              LAST 30 DAYS
            </span>
          </div>
          <div className="flex flex-wrap gap-1">
            {streakDays.map((status, i) => (
              <div
                key={i}
                className={`w-6 h-6 sm:w-8 sm:h-8 border border-black/20 ${
                  status === "completed"
                    ? "bg-secondary"
                    : status === "missed"
                    ? "bg-tertiary-fixed-dim"
                    : i === 11
                    ? "bg-white shadow-[inset_0_0_8px_rgba(0,0,0,0.5)]"
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
