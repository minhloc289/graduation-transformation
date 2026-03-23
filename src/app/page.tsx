"use client";

import { useState } from "react";

interface Task {
  id: number;
  label: string;
  done: boolean;
}

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, label: "45 Minute Morning Fasted Cardio", done: true },
    { id: 2, label: "Macro Goals: 220g Protein", done: true },
    { id: 3, label: "Heavy Compound Session (Push)", done: false },
    { id: 4, label: "Gallon of Water", done: false },
    { id: 5, label: "Cold Exposure (3 Mins)", done: false },
  ]);

  const toggleTask = (id: number) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  const completedCount = tasks.filter((t) => t.done).length;
  const percentage = Math.round((completedCount / tasks.length) * 100);
  const remaining = tasks.length - completedCount;

  const streakDays = Array.from({ length: 30 }, (_, i) => {
    if (i < 4) return "completed";
    if (i === 4) return "missed";
    if (i >= 5 && i < 12) return "completed";
    return "future";
  });

  return (
    <div className="bg-surface-container-lowest min-h-screen p-4 sm:p-6 md:p-8 lg:p-12">
      {/* Hero Section */}
      <section className="mb-8 md:mb-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:gap-8">
          <div className="max-w-2xl">
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-black font-[var(--font-headline)] leading-[0.9] tracking-tighter uppercase mb-4 md:mb-6">
              YOU ARE <br /> DISTRACTING <br /> YOUR FUTURE
            </h2>
            <div className="flex items-center gap-4">
              <div className="h-[2px] w-12 bg-primary"></div>
              <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-primary">
                TRANSFORMATION IN PROGRESS
              </p>
            </div>
          </div>
          <div className="bg-surface-container-high p-6 sm:p-8 flex flex-col justify-between aspect-square w-36 sm:w-48 border-l-4 border-tertiary-fixed shrink-0">
            <span className="text-4xl sm:text-5xl font-black font-[var(--font-headline)] leading-none">
              {remaining.toString().padStart(2, "0")}
            </span>
            <div>
              <p className="text-[0.65rem] font-bold text-neutral-400 uppercase tracking-tighter">
                Tasks Remaining
              </p>
              <p className="text-[0.65rem] font-black text-tertiary-fixed uppercase">
                Status: {remaining > 2 ? "Critical" : remaining > 0 ? "Active" : "Complete"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-6">
        {/* Daily Checklist */}
        <div className="md:col-span-2 lg:col-span-5 bg-surface-container p-4 sm:p-6 rounded-xl">
          <div className="flex justify-between items-center mb-6 md:mb-8">
            <h3 className="font-[var(--font-headline)] text-lg sm:text-xl font-bold uppercase">
              Daily Checklist
            </h3>
            <div className="text-right">
              <p className="text-xl sm:text-2xl font-black font-[var(--font-headline)] text-secondary">
                {percentage}%
              </p>
              <p className="text-[0.6rem] font-bold text-neutral-500 uppercase">
                Completed
              </p>
            </div>
          </div>
          <div className="space-y-2 sm:space-y-3">
            {tasks.map((task) => (
              <button
                key={task.id}
                onClick={() => toggleTask(task.id)}
                className={`w-full flex items-center gap-3 sm:gap-4 bg-surface-container-low p-3 sm:p-4 rounded group hover:bg-surface-container-high transition-colors text-left ${
                  !task.done ? "border border-transparent hover:border-outline-variant" : ""
                }`}
              >
                <div
                  className={`w-5 h-5 border-2 flex items-center justify-center shrink-0 ${
                    task.done
                      ? "border-secondary bg-secondary"
                      : "border-outline-variant"
                  }`}
                >
                  {task.done && (
                    <span
                      className="material-symbols-outlined text-on-secondary text-sm"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      check
                    </span>
                  )}
                </div>
                <span
                  className={`text-xs sm:text-sm font-bold uppercase tracking-tight ${
                    task.done ? "text-white" : "text-neutral-400"
                  }`}
                >
                  {task.label}
                </span>
                <span
                  className={`ml-auto text-[0.6rem] font-black shrink-0 ${
                    task.done ? "text-secondary" : "text-neutral-600"
                  }`}
                >
                  {task.done ? "DONE" : "PENDING"}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Progress & Stats */}
        <div className="md:col-span-2 lg:col-span-7 flex flex-col gap-4 sm:gap-6">
          {/* Streak */}
          <div className="bg-surface-container p-4 sm:p-6 rounded-xl">
            <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-2 mb-4">
              <div>
                <p className="text-[0.65rem] font-bold text-neutral-500 uppercase tracking-widest mb-1">
                  CURRENT STREAK
                </p>
                <h3 className="font-[var(--font-headline)] text-3xl sm:text-5xl font-black">
                  12 DAYS
                </h3>
              </div>
              <div className="sm:text-right">
                <p className="text-[0.65rem] font-bold text-neutral-500 uppercase tracking-widest mb-1">
                  CONSISTENCY SCORE
                </p>
                <p className="text-lg sm:text-xl font-bold text-secondary">94.2%</p>
              </div>
            </div>
            <div className="flex gap-[2px] sm:gap-1 h-6 sm:h-8">
              {streakDays.map((status, i) => (
                <div
                  key={i}
                  className={`flex-1 ${
                    status === "completed"
                      ? "bg-secondary"
                      : status === "missed"
                      ? "bg-tertiary-fixed-dim"
                      : "bg-surface-container-highest"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Weight & Body Fat */}
          <div className="grid grid-cols-2 gap-4 sm:gap-6 h-full">
            <div className="bg-surface-container p-4 sm:p-6 rounded-xl flex flex-col">
              <p className="text-[0.65rem] font-bold text-neutral-500 uppercase tracking-widest mb-4">
                WEIGHT TRACKING
              </p>
              <div className="flex-1 flex items-end gap-1 sm:gap-2 px-1 sm:px-2 pb-2 min-h-[80px]">
                {[80, 78, 75, 72, 70].map((h, i) => (
                  <div
                    key={i}
                    className={`flex-1 ${
                      i === 4 ? "bg-secondary" : "bg-surface-container-highest"
                    }`}
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
              <div className="mt-4 flex justify-between items-baseline">
                <span className="text-2xl sm:text-3xl font-black font-[var(--font-headline)]">
                  184.2
                </span>
                <span className="text-xs font-bold text-secondary">LB</span>
              </div>
            </div>
            <div className="bg-surface-container p-4 sm:p-6 rounded-xl flex flex-col justify-between">
              <div>
                <p className="text-[0.65rem] font-bold text-neutral-500 uppercase tracking-widest mb-1">
                  BODY FAT
                </p>
                <p className="text-2xl sm:text-3xl font-black font-[var(--font-headline)]">
                  14.8%
                </p>
              </div>
              <div className="pt-4 border-t border-outline-variant">
                <p className="text-[0.65rem] font-bold text-neutral-500 uppercase tracking-widest mb-1">
                  TOTAL LOSS
                </p>
                <p className="text-lg sm:text-xl font-bold text-secondary">-6.4 LB</p>
              </div>
            </div>
          </div>
        </div>

        {/* Face Progress */}
        <div className="md:col-span-2 lg:col-span-8 bg-surface-container p-4 sm:p-6 rounded-xl">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-4 sm:mb-6">
            <h3 className="font-[var(--font-headline)] text-lg sm:text-xl font-bold uppercase">
              Face Progress
            </h3>
            <div className="flex gap-2">
              <button className="bg-surface-container-high px-3 sm:px-4 py-2 text-[0.65rem] font-bold uppercase hover:bg-white hover:text-black transition-colors">
                Upload
              </button>
              <button className="bg-surface-container-high px-3 sm:px-4 py-2 text-[0.65rem] font-bold uppercase hover:bg-white hover:text-black transition-colors">
                Compare Full
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:gap-4">
            <div className="relative group overflow-hidden bg-black aspect-[3/4] rounded">
              <img
                alt="Before photo"
                className="w-full h-full object-cover grayscale opacity-50 group-hover:opacity-80 transition-opacity"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB36RREqBpPIZZ5oOgnaMvsSsH80hbhhsOJpZTp_QLJEl_JUC5CBeDp-pNiNKyrz9BZkNuNClc5VU6MzVnXM-0IhFjm511w1TYwGaQa4RLTQ46YzMRvE7Li4DnhYpobkuKSpttM1DgDuA_J6HpcRvPxldcgY7Ak6X1bCKdJCUmPCFt4_1Adf_bjAzcf7qRUqUsdG2DWr21Rp0tNZPUKqVKPoiA-2YGyvvyVyj9lyBLp_NCx-a6Eqipf306JRPtIPNeOpFkcn5vPLg"
              />
              <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-black/60 backdrop-blur px-2 sm:px-3 py-1 text-[0.55rem] sm:text-[0.6rem] font-black uppercase tracking-tighter">
                Day 01
              </div>
            </div>
            <div className="relative group overflow-hidden bg-black aspect-[3/4] rounded border-2 border-secondary">
              <img
                alt="Current photo"
                className="w-full h-full object-cover grayscale group-hover:scale-105 transition-transform duration-500"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB3i_LFcTeBKpd6NCsA0WF2ThPObDKYhm9HeVzOpeF4SkpJDqgiszgnFBVkTEAjXoiYmdDGr0JREx4-L0DZlInDz7cluZZb6ise19SULrfqdd5vim8CoMxjbQIU2V-n2D2kN8oc4Qu_TG32ItopgB_v7dVmbrZdI0UVtEZpNJmVpM-DzZujvZqo51acxGaCZnLa_qk8qajBkwoUJGNXGFQgpx7olcjak1zVosGpKt9hNkFY9ZjLmXGrgjhNUdCr_NJ0s4hOZd46Fg"
              />
              <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-secondary text-on-secondary px-2 sm:px-3 py-1 text-[0.55rem] sm:text-[0.6rem] font-black uppercase tracking-tighter">
                Current (Day 12)
              </div>
            </div>
          </div>
        </div>

        {/* Mindset Feedback */}
        <div className="md:col-span-2 lg:col-span-4 flex flex-col gap-4 sm:gap-6">
          <div className="flex-1 bg-surface-container-high p-6 sm:p-8 rounded-xl flex flex-col justify-center items-center text-center border-t-8 border-secondary">
            <span className="material-symbols-outlined text-secondary text-4xl sm:text-5xl mb-4 sm:mb-6">
              verified
            </span>
            <h3 className="text-2xl sm:text-3xl font-black font-[var(--font-headline)] uppercase leading-none mb-3 sm:mb-4">
              YOU&apos;RE BECOMING <br /> DISCIPLINED
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400">
              The noise is fading. Your actions are speaking for you. Do not let
              up now.
            </p>
          </div>
          <div className="bg-tertiary-fixed p-4 sm:p-6 rounded-xl group cursor-pointer overflow-hidden relative">
            <div className="relative z-10 flex flex-col justify-between h-full min-h-[100px] sm:min-h-[120px]">
              <p className="text-[0.65rem] font-black text-white/60 uppercase tracking-widest">
                NEXT MILESTONE
              </p>
              <h4 className="text-xl sm:text-2xl font-black font-[var(--font-headline)] text-white uppercase italic">
                CRUSH THE MIDPOINT
              </h4>
            </div>
            <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-9xl text-white/10 rotate-12">
              bolt
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-10 sm:mt-16 pt-6 sm:pt-8 border-t border-outline-variant flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex gap-6 sm:gap-8">
          <div>
            <p className="text-[0.6rem] font-bold text-neutral-600 uppercase">
              SYSTEM LOAD
            </p>
            <p className="text-[0.75rem] font-black text-neutral-400">
              OPTIMAL
            </p>
          </div>
          <div>
            <p className="text-[0.6rem] font-bold text-neutral-600 uppercase">
              DATA SYNC
            </p>
            <p className="text-[0.75rem] font-black text-neutral-400">
              0.04S AGO
            </p>
          </div>
        </div>
        <p className="text-[0.65rem] font-bold text-neutral-600 uppercase tracking-widest">
          &copy; 2024 MONOLITH CORE v2.4.0
        </p>
      </footer>
    </div>
  );
}
