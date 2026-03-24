"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useMonolith } from "@/lib/useMonolith";
import { PROGRAM_DAYS, TARGET_WEIGHT, START_WEIGHT, START_BODY_FAT } from "@/lib/supabase";
import StreakBreakBanner from "@/components/StreakBreakBanner";

const VideoEmbed = dynamic(() => import("@/components/VideoEmbed"), {
  ssr: false,
  loading: () => (
    <div className="md:col-span-2 lg:col-span-8 bg-black rounded-xl overflow-hidden aspect-video animate-pulse" />
  ),
});

export default function Dashboard() {
  const {
    tasks, toggleTask, allLogs, streakDays, streakCount, consistency,
    loaded, dayNumber, daysLeft, currentWeight, currentBodyFat, totalLoss,
    percentage, remaining,
  } = useMonolith();

  const weightBars = useMemo(
    () => allLogs.filter((l) => l.weight_kg != null).map((l) => l.weight_kg as number),
    [allLogs]
  );

  return (
    <div className="bg-surface-container-lowest min-h-screen p-4 sm:p-6 md:p-8 lg:p-12">
      {/* Hero Section */}
      <section className="mb-8 md:mb-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:gap-8">
          <div className="max-w-2xl">
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-black font-[var(--font-headline)] leading-[0.9] tracking-tighter uppercase mb-4 md:mb-6">
              THE MIRROR <br /> REMEMBERS.
            </h2>
            <p className="text-sm sm:text-base text-neutral-400 font-bold uppercase tracking-wider mb-4 max-w-lg">
              Duy, the clock doesn&apos;t wait. Every day counts. Every meal matters. Every rep builds the man at graduation.
            </p>
            <div className="flex items-center gap-4">
              <div className="h-[2px] w-12 bg-tertiary-fixed"></div>
              <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-tertiary-fixed">
                {PROGRAM_DAYS}-DAY GRADUATION CUT
              </p>
            </div>
          </div>
          <div className="bg-surface-container-high p-6 sm:p-8 flex flex-col justify-between aspect-square w-36 sm:w-48 border-l-4 border-tertiary-fixed shrink-0">
            <span className="text-4xl sm:text-5xl font-black font-[var(--font-headline)] leading-none">
              {remaining.toString().padStart(2, "0")}
            </span>
            <div>
              <p className="text-xs font-bold text-neutral-400 uppercase tracking-tighter">
                Tasks Remaining
              </p>
              <p className="text-xs font-black text-tertiary-fixed uppercase">
                Status: {!loaded ? "--" : remaining > 4 ? "Critical" : remaining > 0 ? "Active" : "Complete"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Competitor Section */}
      <section className="mb-6 sm:mb-8 relative overflow-hidden">
        <div className="bg-surface-container rounded-xl border border-outline-variant/30 p-5 sm:p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-tertiary-fixed/5 to-transparent pointer-events-none" />
          <div className="absolute -right-8 -top-8 w-40 h-40 bg-tertiary-fixed/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-start gap-5 sm:gap-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 overflow-hidden border-2 border-tertiary-fixed">
                <Image src="/competitor.jpg" alt="Bui Mai Anh Duy" width={80} height={80} className="w-full h-full object-cover object-top" />
              </div>
              <div>
                <p className="text-xs font-bold text-tertiary-fixed uppercase tracking-[0.3em] mb-1">THE COMPETITOR</p>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-black font-[var(--font-headline)] uppercase leading-none tracking-tight text-white">BUI MAI ANH DUY</h3>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-2 sm:mt-3">
                  <span className="material-symbols-outlined text-secondary text-sm">school</span>
                  <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">University of Finance — Marketing</span>
                  <span className="hidden sm:inline text-neutral-600">|</span>
                  <span className="inline-flex items-center gap-1 bg-tertiary-fixed/10 border border-tertiary-fixed/30 px-2 py-0.5 text-xs font-black text-tertiary-fixed uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 bg-tertiary-fixed rounded-full animate-pulse"></span>
                    GRADUATING 22 APR 2026
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-start md:items-end gap-3">
              <div className="flex gap-4 sm:gap-6">
                <div className="text-center">
                  <p className="text-2xl sm:text-3xl font-black font-[var(--font-headline)] text-white">{Math.round(currentWeight)}</p>
                  <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider">KG NOW</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl sm:text-3xl font-black font-[var(--font-headline)] text-secondary">{TARGET_WEIGHT}</p>
                  <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider">KG TARGET</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl sm:text-3xl font-black font-[var(--font-headline)] text-tertiary-fixed">{daysLeft}</p>
                  <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider">DAYS LEFT</p>
                </div>
              </div>
              <p className="text-sm text-neutral-500 uppercase tracking-wider font-bold md:text-right">Debloat. Cut. Graduate different.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Streak Break Notification */}
      <div className="mb-4 sm:mb-6">
        <StreakBreakBanner streakDays={streakDays} streakCount={streakCount} loaded={loaded} />
      </div>

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
                  {streakCount.toString().padStart(2, "0")} DAYS
                </h3>
              </div>
              <div className="sm:text-right">
                <p className="text-[0.65rem] font-bold text-neutral-500 uppercase tracking-widest mb-1">
                  CONSISTENCY SCORE
                </p>
                <p className={`text-lg sm:text-xl font-bold ${consistency !== null ? "text-secondary" : "text-neutral-600"}`}>
                  {consistency !== null ? `${consistency}%` : "--"}
                </p>
              </div>
            </div>
            <div className="flex gap-[2px] sm:gap-1 h-6 sm:h-8">
              {streakDays.map((status, i) => (
                <div
                  key={i}
                  className={`flex-1 ${
                    status === "current"
                      ? "bg-white animate-pulse"
                      : status === "completed"
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
          <div className="grid grid-cols-2 gap-4 sm:gap-6 flex-1">
            {/* Weight */}
            <div className="bg-surface-container p-4 sm:p-6 rounded-xl flex flex-col">
              <div className="flex justify-between items-center mb-3">
                <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">WEIGHT</p>
                <span className={`text-sm font-black ${totalLoss > 0 ? "text-secondary" : "text-neutral-600"}`}>
                  {totalLoss > 0 ? `-${totalLoss}` : totalLoss} KG
                </span>
              </div>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="font-[var(--font-headline)] text-3xl sm:text-4xl font-black text-white">{currentWeight.toFixed(1)}</span>
                <span className="text-sm font-bold text-secondary">KG</span>
              </div>
              {/* SVG line chart */}
              <div className="flex-1 min-h-[80px] relative">
                {weightBars.length > 1 ? (
                  <svg className="w-full h-full" viewBox="0 0 200 60" preserveAspectRatio="none">
                    {(() => {
                      const minW = TARGET_WEIGHT - 2;
                      const maxW = START_WEIGHT + 2;
                      const points = weightBars.map((w, i) => {
                        const x = (i / (weightBars.length - 1)) * 200;
                        const y = 60 - ((w - minW) / (maxW - minW)) * 55;
                        return `${x},${y}`;
                      });
                      const areaPoints = [...points, `200,60`, `0,60`].join(" ");
                      return (
                        <>
                          <defs>
                            <linearGradient id="wg" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#4ae176" stopOpacity="0.3" />
                              <stop offset="100%" stopColor="#4ae176" stopOpacity="0" />
                            </linearGradient>
                          </defs>
                          <polygon points={areaPoints} fill="url(#wg)" />
                          <polyline points={points.join(" ")} fill="none" stroke="#4ae176" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                          {(() => {
                            const lastX = (weightBars.length - 1) / (weightBars.length - 1) * 200;
                            const lastY = 60 - ((weightBars[weightBars.length - 1] - minW) / (maxW - minW)) * 55;
                            return <circle cx={lastX} cy={lastY} r="3" fill="#4ae176" />;
                          })()}
                        </>
                      );
                    })()}
                  </svg>
                ) : (
                  <div className="flex items-end h-full gap-1">
                    <div className="flex-1 bg-secondary/20 rounded-t-sm" style={{ height: "100%" }} />
                  </div>
                )}
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs font-bold text-neutral-400">START: {START_WEIGHT} KG</span>
                <span className="text-xs font-bold text-secondary">TARGET: {TARGET_WEIGHT} KG</span>
              </div>
            </div>
            {/* Body Fat */}
            <div className="bg-surface-container p-4 sm:p-6 rounded-xl flex flex-col">
              <div className="flex justify-between items-center mb-3">
                <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">BODY FAT</p>
                <span className={`text-sm font-black ${(START_BODY_FAT - currentBodyFat) > 0 ? "text-secondary" : "text-neutral-600"}`}>
                  {(START_BODY_FAT - currentBodyFat) > 0 ? `-${(START_BODY_FAT - currentBodyFat).toFixed(1)}` : "0"}%
                </span>
              </div>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="font-[var(--font-headline)] text-3xl sm:text-4xl font-black text-white">{currentBodyFat}</span>
                <span className="text-sm font-bold text-tertiary-fixed">%</span>
              </div>
              {/* Gauge visualization */}
              <div className="flex-1 flex items-center justify-center min-h-[80px]">
                <div className="relative w-full max-w-[140px] aspect-square">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="48" fill="none" stroke="currentColor" strokeWidth="10" className="text-surface-container-highest" />
                    <circle cx="60" cy="60" r="48" fill="none" stroke="currentColor" strokeWidth="10" className="text-tertiary-fixed"
                      strokeDasharray={`${2 * Math.PI * 48}`}
                      strokeDashoffset={`${2 * Math.PI * 48 * (1 - currentBodyFat / 50)}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-[var(--font-headline)] text-2xl font-black text-white">{currentBodyFat}%</span>
                    <span className="text-[0.6rem] text-neutral-500 font-bold">OF 50%</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs font-bold text-neutral-400">START: {START_BODY_FAT}%</span>
                <span className="text-xs font-bold text-white">NOW: {currentBodyFat}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Face Debloat Video */}
        <VideoEmbed />

        {/* Mission & Graduation — combined */}
        <div className="md:col-span-2 lg:col-span-4 bg-surface-container rounded-xl overflow-hidden relative flex flex-col">
          {/* Top — Mission brief */}
          <div className="flex-1 p-6 sm:p-8 flex flex-col justify-center relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 bg-tertiary-fixed rounded-full animate-pulse"></div>
              <span className="text-xs font-black text-tertiary-fixed uppercase tracking-[0.3em]">ACTIVE MISSION</span>
            </div>
            <h3 className="font-[var(--font-headline)] text-3xl sm:text-4xl font-black text-white uppercase tracking-tight leading-none mb-4">
              DEBLOAT & CUT
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-secondary text-lg">scale</span>
                <span className="text-sm text-neutral-300 font-bold">{currentWeight}kg → {TARGET_WEIGHT}kg</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-secondary text-lg">timer</span>
                <span className="text-sm text-neutral-300 font-bold">{daysLeft} days remaining</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-secondary text-lg">face</span>
                <span className="text-sm text-neutral-300 font-bold">Debloat face, sharpen jawline</span>
              </div>
            </div>
          </div>
          {/* Bottom — Graduation countdown */}
          <div className="bg-tertiary-fixed p-5 sm:p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-tertiary-fixed to-tertiary-fixed-dim opacity-50" />
            <span className="material-symbols-outlined absolute -right-3 -bottom-3 text-[6rem] text-white/10 rotate-12">school</span>
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-xs font-black text-white/60 uppercase tracking-widest mb-1">GRADUATION</p>
                <p className="font-[var(--font-headline)] text-xl sm:text-2xl font-black text-white uppercase">22 APRIL 2026</p>
              </div>
              <div className="text-right">
                <p className="font-[var(--font-headline)] text-3xl sm:text-4xl font-black text-white">{daysLeft}</p>
                <p className="text-xs font-bold text-white/60 uppercase tracking-widest">DAYS</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-14 pt-6 border-t border-outline-variant/20 text-center">
        <p className="text-sm text-neutral-400 font-bold italic max-w-lg mx-auto">
          Trust the process, twin.
        </p>
        <p className="text-sm text-neutral-400 font-bold italic max-w-lg mx-auto mt-0.5">
          Good things take time — but great things take grinding every single day.
        </p>
        <p className="text-sm text-neutral-400 font-bold italic max-w-2xl mx-auto mt-0.5">
          They might not see it, but I know how hard you&apos;ve been working — and I respect that.
        </p>
        <p className="text-sm text-neutral-400 max-w-lg mx-auto mt-2">
          Happy graduation — <span className="font-bold text-white uppercase tracking-[0.2em]">Your Gym Bro</span>
        </p>
      </footer>
    </div>
  );
}
