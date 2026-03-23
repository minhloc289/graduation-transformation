"use client";

import { useState } from "react";

export default function PlanPage() {
  const [supplements, setSupplements] = useState([
    { name: "WHEY ISOLATE", checked: true },
    { name: "CREATINE MONO", checked: true },
    { name: "MULTIVITAMIN", checked: false },
    { name: "OMEGA-3", checked: true },
    { name: "ZMA (NIGHT)", checked: false },
  ]);

  const toggleSupplement = (index: number) => {
    setSupplements((prev) =>
      prev.map((s, i) => (i === index ? { ...s, checked: !s.checked } : s))
    );
  };

  const calendarDays = [
    ...Array(8).fill("done"),
    "failed",
    "done",
    "done",
    "current",
    ...Array(18).fill("future"),
  ];

  return (
    <div className="min-h-screen bg-surface-container-lowest">
      {/* TopAppBar */}
      <header className="flex flex-col sm:flex-row justify-between sm:items-center w-full px-4 sm:px-8 py-4 sm:py-6 bg-[#0e0e0e]/60 backdrop-blur-xl sticky top-0 z-40 gap-2">
        <div className="flex items-center gap-4">
          <span className="font-[var(--font-headline)] font-bold uppercase tracking-tight text-white text-lg sm:text-xl">
            Plan Strategy
          </span>
        </div>
        <div className="flex items-center gap-4 sm:gap-8">
          <span className="font-[var(--font-headline)] font-bold uppercase tracking-tight text-white text-xs sm:text-sm">
            MINDSET: AGGRESSIVE
          </span>
          <div className="flex gap-3 sm:gap-4">
            <span className="material-symbols-outlined text-[#919191] cursor-pointer hover:text-white">
              notifications
            </span>
            <span className="material-symbols-outlined text-[#919191] cursor-pointer hover:text-white">
              settings
            </span>
          </div>
        </div>
      </header>

      <div className="p-4 sm:p-8 space-y-8 sm:space-y-12 max-w-7xl mx-auto">
        {/* Hero */}
        <section className="relative h-[280px] sm:h-[350px] md:h-[409px] flex items-end overflow-hidden rounded-lg">
          <img
            alt="Brutalist gym architecture"
            className="absolute inset-0 w-full h-full object-cover grayscale brightness-50 contrast-125"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC5iZ9thpW78s0tOhTqzqdTrWC_yngAf3de6mbXdZoJ-zyT2xRH5YUMXgnFztYu-T9KtUoe-xntakB_9vDgXbl52Fh66Mh_esW9-bE8Qz_TP_kKLdxibzWfUekrtzskQ5o5AMFN82n3CYb_9lSyIvD292ebO65fefkWE8HE8-ao4pVavO0EZzXukDjHVY7WfYD4b7JjEb9geNEQxr1hdJ4ht2l0V4WAobuEvwHAtmWfs15oy0RE8oOhha-DoliYk1tAkjjLL-hnsA"
          />
          <div className="relative p-6 sm:p-8 md:p-12 w-full bg-gradient-to-t from-black/80 to-transparent">
            <p className="text-secondary font-[var(--font-headline)] font-bold tracking-[0.3em] sm:tracking-[0.4em] text-[0.6rem] sm:text-xs mb-3 sm:mb-4">
              TACTICAL OPERATING PROCEDURE
            </p>
            <h2 className="font-[var(--font-headline)] text-white font-black text-3xl sm:text-6xl md:text-8xl tracking-tighter leading-none">
              STRUCTURE IS
              <br />
              YOUR WEAPON
            </h2>
          </div>
        </section>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8">
          {/* 30-Day Calendar */}
          <div className="md:col-span-8 bg-surface-container-low p-5 sm:p-8 rounded-lg">
            <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-3 mb-6 sm:mb-8">
              <div>
                <h3 className="font-[var(--font-headline)] font-bold text-xl sm:text-2xl text-white">
                  30-DAY CALENDAR
                </h3>
                <p className="text-outline text-xs tracking-widest font-[var(--font-headline)]">
                  PHASE 1: FOUNDATION
                </p>
              </div>
              <div className="sm:text-right">
                <span className="text-secondary font-mono text-lg sm:text-xl">
                  12 / 30
                </span>
              </div>
            </div>
            <div className="grid grid-cols-6 sm:grid-cols-7 md:grid-cols-10 gap-1">
              {calendarDays.map((status, i) => (
                <div
                  key={i}
                  className={`aspect-square flex items-center justify-center ${
                    status === "done"
                      ? "bg-secondary-container"
                      : status === "failed"
                      ? "bg-tertiary-container"
                      : status === "current"
                      ? "bg-white"
                      : "bg-surface-container-highest"
                  }`}
                >
                  {status === "done" && (
                    <span className="material-symbols-outlined text-secondary text-[10px]">
                      check
                    </span>
                  )}
                  {status === "failed" && (
                    <span className="material-symbols-outlined text-black text-[10px]">
                      close
                    </span>
                  )}
                  {status === "current" && (
                    <span className="text-black font-black text-xs">12</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Milestones */}
          <div className="md:col-span-4 space-y-6">
            <div className="bg-surface-container-low p-5 sm:p-8 rounded-lg h-full border-l-2 border-primary/20">
              <h3 className="font-[var(--font-headline)] font-bold text-lg sm:text-xl text-white mb-4 sm:mb-6 uppercase tracking-tight">
                Milestones
              </h3>
              <div className="space-y-6 sm:space-y-8">
                <div className="flex gap-3 sm:gap-4">
                  <div className="text-secondary font-mono text-xl sm:text-2xl font-bold">
                    15
                  </div>
                  <div>
                    <p className="text-white font-bold text-xs sm:text-sm uppercase">
                      Mid-Point Check-in
                    </p>
                    <p className="text-outline text-xs mt-1">
                      Full biometric scan and performance audit.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 sm:gap-4">
                  <div className="text-[#919191] font-mono text-xl sm:text-2xl font-bold">
                    30
                  </div>
                  <div>
                    <p className="text-white font-bold text-xs sm:text-sm uppercase">
                      Final Reveal
                    </p>
                    <p className="text-outline text-xs mt-1">
                      Program completion and transition to Elite phase.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Training Split */}
          <div className="md:col-span-6 bg-surface-container-low p-5 sm:p-8 rounded-lg">
            <h3 className="font-[var(--font-headline)] font-bold text-xl sm:text-2xl text-white mb-6 sm:mb-8 uppercase tracking-tighter">
              Training Split
            </h3>
            <div className="space-y-3 sm:space-y-4">
              {[
                { name: "PUSH", muscles: "CHEST / SHOULDERS / TRICEPS" },
                { name: "PULL", muscles: "BACK / BICEPS / REAR DELTS" },
                { name: "LEGS", muscles: "QUADS / HAMS / CALVES / CORE" },
              ].map((split) => (
                <div
                  key={split.name}
                  className="flex justify-between items-center p-3 sm:p-4 bg-surface-container-highest rounded"
                >
                  <span className="font-[var(--font-headline)] font-bold tracking-widest text-xs">
                    {split.name}
                  </span>
                  <span className="text-outline text-[9px] sm:text-[10px]">
                    {split.muscles}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Nutrition */}
          <div className="md:col-span-6 bg-surface p-5 sm:p-8 rounded-lg border-2 border-outline-variant/30">
            <h3 className="font-[var(--font-headline)] font-bold text-xl sm:text-2xl text-white mb-6 sm:mb-8 uppercase tracking-tighter">
              Nutrition Blueprint
            </h3>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {[
                { value: "2800", label: "KCAL" },
                { value: "220G", label: "Protein" },
                { value: "300G", label: "Carbs" },
                { value: "80G", label: "Fats" },
              ].map((macro) => (
                <div
                  key={macro.label}
                  className="p-4 sm:p-6 bg-surface-container-lowest flex flex-col items-center justify-center"
                >
                  <span className="text-white font-black text-2xl sm:text-3xl">
                    {macro.value}
                  </span>
                  <span className="text-outline text-[9px] sm:text-[10px] uppercase font-bold tracking-widest">
                    {macro.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Rules */}
          <div className="md:col-span-7 bg-surface-container-high p-5 sm:p-8 rounded-lg">
            <h3 className="font-[var(--font-headline)] font-bold text-xl sm:text-2xl text-white mb-6 sm:mb-8 uppercase tracking-tighter">
              Rules of Engagement
            </h3>
            <ul className="space-y-4 sm:space-y-6">
              {[
                "No missed workouts. ZERO excuses for absence.",
                "No processed sugar. Pure fuel only.",
                "4L water daily. Hydration is non-negotiable.",
              ].map((rule, i) => (
                <li key={i} className="flex items-start gap-3 sm:gap-4">
                  <span className="font-[var(--font-headline)] font-bold text-secondary text-base sm:text-lg">
                    {String(i + 1).padStart(2, "0")}.
                  </span>
                  <span className="text-white font-bold tracking-tight text-sm sm:text-base">
                    {rule}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Supplement Stack */}
          <div className="md:col-span-5 bg-surface-container-lowest p-5 sm:p-8 rounded-lg border border-outline-variant/20">
            <h3 className="font-[var(--font-headline)] font-bold text-xl sm:text-2xl text-white mb-6 sm:mb-8 uppercase tracking-tighter">
              Stack Checklist
            </h3>
            <div className="space-y-2 sm:space-y-3">
              {supplements.map((supp, i) => (
                <label
                  key={supp.name}
                  className="flex items-center gap-3 sm:gap-4 cursor-pointer group p-2.5 sm:p-3 bg-surface-container hover:bg-surface-container-high transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={supp.checked}
                    onChange={() => toggleSupplement(i)}
                    className="w-4 h-4 rounded-none bg-black border-2 border-outline-variant text-white focus:ring-0"
                  />
                  <span
                    className={`text-[0.65rem] sm:text-xs font-bold uppercase tracking-widest ${
                      supp.checked ? "text-white" : "text-outline"
                    }`}
                  >
                    {supp.name}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* FAB */}
      <button className="fixed bottom-6 right-6 sm:bottom-12 sm:right-12 w-14 h-14 sm:w-16 sm:h-16 bg-white text-black flex items-center justify-center rounded-lg shadow-2xl hover:scale-110 active:scale-95 transition-all duration-150 z-50">
        <span className="material-symbols-outlined font-bold text-2xl sm:text-3xl">
          edit
        </span>
      </button>
    </div>
  );
}
