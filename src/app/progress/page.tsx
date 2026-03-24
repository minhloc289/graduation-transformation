"use client";

import { useState, useEffect } from "react";
import { useMonolith } from "@/lib/useMonolith";
import { PROGRAM_DAYS, PROGRAM_END, START_WEIGHT, START_BODY_FAT, TARGET_WEIGHT } from "@/lib/supabase";

const QUOTES = [
  "THE BODY ACHIEVES WHAT THE MIND BELIEVES.",
  "PAIN IS TEMPORARY. QUITTING LASTS FOREVER.",
  "YOU DON'T FIND WILLPOWER. YOU CREATE IT.",
  "DISCIPLINE IS CHOOSING BETWEEN WHAT YOU WANT NOW AND WHAT YOU WANT MOST.",
  "YOUR FACE WILL THANK YOU ON GRADUATION DAY.",
  "EVERY REP, EVERY MEAL, EVERY GLASS OF WATER — IT ALL COUNTS.",
  "THE MIRROR WILL SHOW WHAT THE CALENDAR WON'T.",
];

function calcTimeLeft() {
  const target = new Date(PROGRAM_END + "T18:00:00");
  const diff = Math.max(0, target.getTime() - Date.now());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function GraduationCountdown() {
  const [timeLeft, setTimeLeft] = useState(calcTimeLeft);

  useEffect(() => {
    const interval = setInterval(() => setTimeLeft(calcTimeLeft()), 1000);
    return () => clearInterval(interval);
  }, []);

  const quote = QUOTES[new Date().getDate() % QUOTES.length];

  return (
    <div className="relative overflow-hidden bg-surface-container rounded-lg mb-6 sm:mb-8">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-tertiary-fixed/8 via-transparent to-tertiary-fixed/5 pointer-events-none" />
      <div className="absolute -right-20 -top-20 w-60 h-60 bg-tertiary-fixed/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative p-5 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-10">
          {/* Left — label + quote */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <span className="material-symbols-outlined text-tertiary-fixed text-2xl">school</span>
              <h4 className="font-[var(--font-headline)] text-xl sm:text-2xl font-black text-white uppercase tracking-tight">Graduation Countdown</h4>
            </div>
            <p className="text-sm text-white/50 font-bold italic leading-relaxed max-w-md">&ldquo;{quote}&rdquo;</p>
          </div>

          {/* Center — timer blocks */}
          <div className="flex items-center gap-2 sm:gap-3">
            {[
              { value: timeLeft.days, label: "DAYS" },
              { value: timeLeft.hours, label: "HRS" },
              { value: timeLeft.minutes, label: "MIN" },
              { value: timeLeft.seconds, label: "SEC" },
            ].map((unit, i) => (
              <div key={unit.label} className="flex items-center gap-2 sm:gap-3">
                <div className="flex flex-col items-center">
                  <div className="bg-surface-container-lowest w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center rounded border border-outline-variant/20">
                    <span className="font-[var(--font-headline)] text-2xl sm:text-4xl font-black text-white">
                      {String(unit.value).padStart(2, "0")}
                    </span>
                  </div>
                  <span className="text-[0.5rem] sm:text-[0.6rem] font-bold text-neutral-500 uppercase tracking-widest mt-1.5">{unit.label}</span>
                </div>
                {i < 3 && <span className="font-[var(--font-headline)] text-xl sm:text-2xl text-tertiary-fixed/40 font-bold mb-4">:</span>}
              </div>
            ))}
          </div>

          {/* Right — date */}
          <div className="text-left lg:text-right shrink-0">
            <p className="text-xs font-black text-tertiary-fixed uppercase tracking-[0.3em]">TARGET DATE</p>
            <p className="text-base sm:text-lg font-black text-white mt-1 font-[var(--font-headline)] uppercase">22 April 2026</p>
            <p className="text-xs text-neutral-500 mt-0.5">6:00 PM — Ceremony</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProgressPage() {
  const {
    streakDays, streakCount, consistency, allLogs, measurements,
    currentWeight, currentBodyFat, totalLoss, dayNumber, daysLeft,
    getMetric, updateLog, addMeasurement, loaded,
  } = useMonolith();

  const [editing, setEditing] = useState(false);
  const [weightInput, setWeightInput] = useState("");
  const [bodyFatInput, setBodyFatInput] = useState("");
  const [saving, setSaving] = useState(false);

  // Add Lift modal
  const [addingLift, setAddingLift] = useState(false);
  const [liftType, setLiftType] = useState("bench_press");
  const [liftValue, setLiftValue] = useState("");

  const bodyFatDelta = +(START_BODY_FAT - currentBodyFat).toFixed(1);

  const bench = getMetric("bench_press");
  const squat = getMetric("squat");
  const deadlift = getMetric("deadlift");

  const openEditor = () => {
    setWeightInput(currentWeight.toString());
    setBodyFatInput(currentBodyFat.toString());
    setEditing(true);
  };

  const saveData = async () => {
    setSaving(true);

    const w = parseFloat(weightInput);
    const bf = parseFloat(bodyFatInput);

    if (!isNaN(w) || !isNaN(bf)) {
      const fields: { weight_kg?: number; body_fat_pct?: number } = {};
      if (!isNaN(w)) fields.weight_kg = w;
      if (!isNaN(bf)) fields.body_fat_pct = bf;
      await updateLog(fields);
    }

    setSaving(false);
    setEditing(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* TopAppBar */}
      <header className="flex justify-between items-center w-full px-4 sm:px-8 py-4 sm:py-6 bg-[#0e0e0e]/60 backdrop-blur-xl sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-tertiary-fixed rounded-full animate-pulse"></span>
          <span className="text-white font-[var(--font-headline)] font-bold uppercase tracking-tight text-xs sm:text-sm">
            DEBLOAT & CUT
          </span>
        </div>
        <div className="flex items-center gap-4 sm:gap-6">
          <button
            onClick={openEditor}
            className="bg-white text-black px-4 py-2 font-[var(--font-headline)] font-black text-[0.65rem] uppercase tracking-widest hover:bg-secondary transition-colors"
          >
            Log Today
          </button>
          <span className="material-symbols-outlined text-[#919191] hover:text-white cursor-pointer transition-colors duration-150">notifications</span>
          <span className="material-symbols-outlined text-[#919191] hover:text-white cursor-pointer transition-colors duration-150">settings</span>
        </div>
      </header>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setEditing(false)} />
          <div className="relative bg-surface-container border border-outline-variant/30 rounded-xl p-6 sm:p-8 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-[var(--font-headline)] text-xl font-black text-white uppercase tracking-tight">
                Log Progress
              </h3>
              <button onClick={() => setEditing(false)} className="text-neutral-500 hover:text-white transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[0.65rem] font-bold text-neutral-500 uppercase tracking-widest block mb-1.5">
                  Weight (KG)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={weightInput}
                  onChange={(e) => setWeightInput(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-outline-variant/30 px-4 py-3 text-white font-bold text-lg focus:outline-none focus:border-secondary transition-colors"
                  placeholder="81.0"
                />
              </div>
              <div>
                <label className="text-[0.65rem] font-bold text-neutral-500 uppercase tracking-widest block mb-1.5">
                  Body Fat (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={bodyFatInput}
                  onChange={(e) => setBodyFatInput(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-outline-variant/30 px-4 py-3 text-white font-bold text-lg focus:outline-none focus:border-secondary transition-colors"
                  placeholder="23"
                />
              </div>

            </div>

            <button
              onClick={saveData}
              disabled={saving}
              className="w-full mt-6 bg-secondary text-on-secondary py-3 font-[var(--font-headline)] font-black text-sm uppercase tracking-widest hover:bg-secondary-fixed-dim transition-colors disabled:opacity-50"
            >
              {saving ? "SAVING..." : "SAVE PROGRESS"}
            </button>
          </div>
        </div>
      )}

      {/* Add Lift Modal */}
      {addingLift && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setAddingLift(false)} />
          <div className="relative bg-surface-container border border-outline-variant/30 rounded-xl p-6 sm:p-8 w-full max-w-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-[var(--font-headline)] text-xl font-black text-white uppercase tracking-tight">Add Lift</h3>
              <button onClick={() => setAddingLift(false)} className="text-neutral-500 hover:text-white transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest block mb-2">Exercise Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { key: "bench_press", label: "BENCH", icon: "fitness_center" },
                    { key: "squat", label: "SQUAT", icon: "directions_run" },
                    { key: "dumbbell", label: "DUMBBELL", icon: "exercise" },
                    { key: "machine", label: "MACHINE", icon: "precision_manufacturing" },
                    { key: "cardio_mins", label: "CARDIO", icon: "monitor_heart" },
                  ].map((ex) => (
                    <button
                      key={ex.key}
                      onClick={() => setLiftType(ex.key)}
                      className={`flex items-center gap-2 p-3 rounded transition-all ${
                        liftType === ex.key
                          ? "bg-secondary/20 border border-secondary text-secondary"
                          : "bg-surface-container-low border border-outline-variant/20 text-neutral-400 hover:text-white"
                      }`}
                    >
                      <span className="material-symbols-outlined text-lg">{ex.icon}</span>
                      <span className="text-xs font-bold uppercase tracking-wider">{ex.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest block mb-1.5">
                  {liftType === "cardio_mins" ? "Duration (minutes)" : "Weight (KG)"}
                </label>
                <input
                  type="number"
                  step={liftType === "cardio_mins" ? "1" : "0.5"}
                  value={liftValue}
                  onChange={(e) => setLiftValue(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-outline-variant/30 px-4 py-3 text-white font-bold text-lg focus:outline-none focus:border-secondary transition-colors rounded"
                  placeholder={liftType === "cardio_mins" ? "30" : "80"}
                />
              </div>
            </div>

            <button
              onClick={async () => {
                const val = parseFloat(liftValue);
                if (!isNaN(val)) {
                  await addMeasurement(liftType, val, liftType === "cardio_mins" ? "MIN" : "KG");
                  setLiftValue("");
                  setAddingLift(false);
                }
              }}
              className="w-full mt-6 bg-secondary text-on-secondary py-3 font-[var(--font-headline)] font-black text-sm uppercase tracking-widest hover:bg-secondary-fixed-dim transition-colors rounded"
            >
              SAVE LIFT
            </button>
          </div>
        </div>
      )}

      {/* Hero */}
      <section className="px-4 sm:px-8 pt-8 sm:pt-12 pb-6 sm:pb-8">
        <h2 className="font-[var(--font-headline)] text-[3rem] sm:text-[5rem] md:text-[8rem] font-extrabold leading-[0.85] tracking-tighter uppercase text-white mb-3 sm:mb-4">
          DATA DOES NOT <span className="block">LIE</span>
        </h2>
        <p className="font-[var(--font-headline)] text-outline text-sm sm:text-lg tracking-widest uppercase mb-6 sm:mb-8">
          {PROGRAM_DAYS}-Day Graduation Cut // Day {dayNumber.toString().padStart(2, "0")}
        </p>
      </section>

      <section className="px-4 sm:px-8 pt-6 sm:pt-8 pb-6 sm:pb-8">
        {/* Graduation Countdown — hero position */}
        <GraduationCountdown />

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              label: "NET LOSS",
              value: totalLoss > 0 ? `-${totalLoss}` : `${totalLoss}`,
              unit: "KG",
              icon: totalLoss > 0 ? "trending_down" : "scale",
              iconText: totalLoss > 0 ? "OPTIMAL" : "START",
              accent: totalLoss > 0 ? "text-secondary" : "text-neutral-500",
              iconBg: totalLoss > 0 ? "bg-secondary/10" : "bg-surface-container-highest",
              iconColor: totalLoss > 0 ? "text-secondary" : "text-neutral-500",
              border: totalLoss > 0 ? "border-secondary" : "border-outline-variant/30",
            },
            {
              label: "STREAK",
              value: streakCount.toString().padStart(2, "0"),
              unit: "DAYS",
              icon: "bolt",
              iconText: streakCount > 0 ? "ACTIVE" : "BEGIN",
              accent: "text-white",
              iconBg: "bg-white/10",
              iconColor: "text-white",
              border: "border-white/20",
            },
            {
              label: "ADHERENCE",
              value: consistency !== null ? `${consistency}` : "--",
              unit: "%",
              icon: consistency !== null && consistency >= 80 ? "check_circle" : "hourglass_empty",
              iconText: consistency !== null ? (consistency >= 80 ? "HIGH" : "LOW") : "N/A",
              accent: consistency !== null && consistency >= 80 ? "text-secondary" : "text-tertiary-fixed",
              iconBg: consistency !== null && consistency >= 80 ? "bg-secondary/10" : "bg-tertiary-fixed/10",
              iconColor: consistency !== null && consistency >= 80 ? "text-secondary" : "text-tertiary-fixed",
              border: consistency !== null && consistency >= 80 ? "border-secondary" : "border-tertiary-fixed/30",
            },
          ].map((card) => (
            <div
              key={card.label}
              className={`bg-surface-container rounded-lg p-5 sm:p-6 border-l-4 ${card.border} relative overflow-hidden`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">{card.label}</span>
                <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded ${card.iconBg}`}>
                  <span className={`material-symbols-outlined text-sm ${card.iconColor}`} style={{ fontVariationSettings: "'FILL' 1" }}>{card.icon}</span>
                  <span className={`text-xs font-black uppercase tracking-wider ${card.iconColor}`}>{card.iconText}</span>
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className={`font-[var(--font-headline)] text-4xl sm:text-5xl font-black ${card.accent}`}>
                  {card.value}
                </span>
                <span className="text-lg sm:text-xl font-bold text-neutral-500">{card.unit}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Main Grid */}
      <section className="px-4 sm:px-8 pb-12 sm:pb-20 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        {/* Weight Chart */}
        <div className="lg:col-span-8 bg-surface-container-lowest p-5 sm:p-8 relative overflow-hidden group">
          <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4 mb-8 sm:mb-12 relative z-10">
            <div>
              <h4 className="font-[var(--font-headline)] text-xl sm:text-2xl font-black text-white uppercase tracking-tighter">Weight Progression</h4>
              <p className="text-outline text-xs tracking-widest uppercase">{PROGRAM_DAYS}-Day Analysis Period</p>
            </div>
            <div className="sm:text-right">
              <span className="block font-[var(--font-headline)] text-2xl sm:text-3xl font-black text-white">{currentWeight.toFixed(1)}</span>
              <span className="text-outline text-[0.6rem] tracking-widest uppercase">CURRENT KG</span>
            </div>
          </div>
          {(() => {
            const weightLogs = allLogs.filter(l => l.weight_kg);
            const MONTH_S = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

            if (weightLogs.length <= 1) {
              const w = weightLogs.length === 1 ? (weightLogs[0].weight_kg as number) : START_WEIGHT;
              const loss = START_WEIGHT - TARGET_WEIGHT;
              return (
                <div className="py-6 sm:py-8">
                  {/* Mission bar */}
                  <div className="grid grid-cols-3 gap-4 sm:gap-6 mb-8">
                    <div className="bg-surface-container-high p-4 sm:p-5 rounded-lg text-center">
                      <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-1">NOW</p>
                      <p className="font-[var(--font-headline)] text-3xl sm:text-4xl font-black text-white">{w.toFixed(1)}</p>
                      <p className="text-xs font-bold text-neutral-500 mt-1">KG</p>
                    </div>
                    <div className="bg-surface-container-high p-4 sm:p-5 rounded-lg text-center border border-secondary/20">
                      <p className="text-xs font-bold text-secondary uppercase tracking-widest mb-1">TARGET</p>
                      <p className="font-[var(--font-headline)] text-3xl sm:text-4xl font-black text-secondary">{TARGET_WEIGHT}</p>
                      <p className="text-xs font-bold text-secondary/60 mt-1">KG</p>
                    </div>
                    <div className="bg-surface-container-high p-4 sm:p-5 rounded-lg text-center">
                      <p className="text-xs font-bold text-tertiary-fixed uppercase tracking-widest mb-1">TO LOSE</p>
                      <p className="font-[var(--font-headline)] text-3xl sm:text-4xl font-black text-tertiary-fixed">{loss.toFixed(0)}</p>
                      <p className="text-xs font-bold text-tertiary-fixed/60 mt-1">KG</p>
                    </div>
                  </div>
                  {/* Timeline */}
                  <div className="relative">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-black text-white uppercase tracking-widest">DAY 01</span>
                      <span className="text-xs font-black text-secondary uppercase tracking-widest">DAY {PROGRAM_DAYS}</span>
                    </div>
                    <div className="relative h-3 bg-surface-container-highest rounded-full overflow-hidden">
                      <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-white via-secondary/80 to-secondary rounded-full" style={{ width: `${Math.max(5, (dayNumber / PROGRAM_DAYS) * 100)}%` }} />
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-neutral-500 font-bold">{w.toFixed(1)} KG</span>
                      <span className="text-xs text-secondary font-bold">{TARGET_WEIGHT} KG</span>
                    </div>
                  </div>
                  {/* Message */}
                  <p className="text-sm text-neutral-400 font-bold text-center mt-6 italic">
                    &ldquo;Day 1. The grind starts here. Log daily to watch the line drop.&rdquo;
                  </p>
                </div>
              );
            }

            const weights = weightLogs.map(l => l.weight_kg as number);
            const dataMax = Math.max(...weights);
            const dataMin = Math.min(...weights);
            const dataSpan = dataMax - dataMin;
            // Ensure minimum visual spread — at least 3kg range so the slope is visible
            const padding = Math.max(1.5, dataSpan * 0.5);
            const maxW = dataMax + padding;
            const minW = dataMin - padding;
            const range = maxW - minW;

            const chartH = 350;
            const getY = (w: number) => ((maxW - w) / range) * chartH;
            const targetYPct = (getY(TARGET_WEIGHT) / chartH) * 100;

            const padX = 40; // left/right padding for labels
            const padTop = 40; // top padding for labels above dots
            const svgW = 1000;
            const svgH = chartH + padTop;
            const chartBottom = svgH;
            const chartTop = padTop;
            const chartRange = chartBottom - chartTop;

            const pts = weights.map((w, i) => {
              const x = weightLogs.length === 1 ? svgW / 2 : padX + (i / (weightLogs.length - 1)) * (svgW - padX * 2);
              const y = chartTop + ((maxW - w) / range) * chartRange;
              return { x, y, w, date: weightLogs[i].date };
            });

            const targetYSvg = chartTop + ((maxW - TARGET_WEIGHT) / range) * chartRange;

            return (
              <div>
                <svg viewBox={`0 0 ${svgW} ${svgH + 30}`} className="w-full" style={{ height: "auto" }}>
                  <defs>
                    <linearGradient id="chartGrad2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4ae176" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#4ae176" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {/* Grid lines */}
                  {[0, 0.25, 0.5, 0.75, 1].map(f => (
                    <line key={f} x1={padX} y1={chartTop + f * chartRange} x2={svgW - padX} y2={chartTop + f * chartRange} stroke="#474747" strokeWidth="0.5" strokeOpacity="0.3" />
                  ))}

                  {/* Target line */}
                  <line x1={padX} y1={targetYSvg} x2={svgW - padX} y2={targetYSvg} stroke="#4ae176" strokeWidth="1.5" strokeDasharray="8,6" opacity="0.4" />
                  <text x={svgW - padX + 5} y={targetYSvg + 5} fill="#4ae176" fontSize="13" fontWeight="bold" fontFamily="var(--font-body)">{TARGET_WEIGHT} KG</text>

                  {/* Area fill */}
                  {pts.length > 1 && (
                    <polygon
                      points={`${pts.map(p => `${p.x},${p.y}`).join(" ")} ${pts[pts.length - 1].x},${chartBottom} ${pts[0].x},${chartBottom}`}
                      fill="url(#chartGrad2)"
                    />
                  )}

                  {/* Line */}
                  {pts.length > 1 && (
                    <polyline
                      points={pts.map(p => `${p.x},${p.y}`).join(" ")}
                      fill="none" stroke="white" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round"
                    />
                  )}

                  {/* Dots + labels */}
                  {pts.map((p, i) => {
                    const isLast = i === pts.length - 1;
                    return (
                      <g key={p.date}>
                        {/* Value label above dot */}
                        <text
                          x={p.x} y={p.y - 14}
                          textAnchor="middle"
                          fill={isLast ? "#4ae176" : "white"}
                          fontSize="18" fontWeight="900"
                          fontFamily="var(--font-body)"
                        >
                          {p.w.toFixed(1)}
                        </text>
                        {/* Dot */}
                        {isLast ? (
                          <>
                            <circle cx={p.x} cy={p.y} r="10" fill="#4ae176" opacity="0.2" />
                            <circle cx={p.x} cy={p.y} r="6" fill="#4ae176" />
                          </>
                        ) : (
                          <circle cx={p.x} cy={p.y} r="5" fill="white" />
                        )}
                        {/* Date label below chart */}
                        <text
                          x={p.x} y={chartBottom + 20}
                          textAnchor="middle"
                          fill="#919191"
                          fontSize="14" fontWeight="bold"
                          fontFamily="var(--font-body)"
                          style={{ textTransform: "uppercase" }}
                        >
                          {(() => { const d = new Date(p.date); return `${MONTH_S[d.getMonth()].toUpperCase()} ${d.getDate()}`; })()}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            );
          })()}
        </div>

        {/* Heatmap */}
        <div className="lg:col-span-4 bg-surface-container-high p-5 sm:p-8 flex flex-col justify-between">
          <div>
            <h4 className="font-[var(--font-headline)] text-xl sm:text-2xl font-black text-white uppercase tracking-tighter mb-1">Consistency</h4>
            <p className="text-outline text-xs tracking-widest uppercase mb-6 sm:mb-8">Daily Protocol Execution</p>
            <div className="grid grid-cols-7 gap-1">
              {streakDays.map((status, i) => (
                <div
                  key={i}
                  className={`aspect-square ${
                    status === "completed" ? "bg-secondary-container"
                    : status === "missed" ? "bg-tertiary-fixed-dim"
                    : status === "current" ? "bg-white border-4 border-white animate-pulse"
                    : "bg-surface-container-lowest"
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-outline-variant/20">
            <div className="flex justify-between items-center">
              <span className="text-[0.65rem] text-outline font-bold tracking-widest uppercase">PROTOCOL COMPLIANCE</span>
              <span className={`font-black text-xl font-[var(--font-headline)] ${consistency !== null ? "text-secondary underline underline-offset-4" : "text-neutral-600"}`}>
                {consistency !== null ? `${consistency}%` : "--"}
              </span>
            </div>
          </div>
        </div>

        {/* Strength Matrix — 8 cols, dynamic from DB */}
        <div className="lg:col-span-8 bg-surface-container-low p-4 sm:p-6 rounded-lg">
          <div className="flex justify-between items-center mb-3 sm:mb-4">
            <h4 className="font-[var(--font-headline)] text-xl sm:text-2xl font-black text-white uppercase tracking-tighter">Strength Matrix</h4>
            <button
              onClick={() => setAddingLift(true)}
              className="bg-secondary/10 hover:bg-secondary/20 border border-secondary/30 px-4 py-2 text-xs font-bold text-secondary uppercase tracking-widest transition-colors flex items-center gap-2 rounded"
            >
              <span className="material-symbols-outlined text-base">add</span>
              Add Lift
            </button>
          </div>
          {(() => {
            const LIFT_META: Record<string, { name: string; icon: string; unit: string }> = {
              bench_press: { name: "BENCH", icon: "fitness_center", unit: "KG" },
              squat: { name: "SQUAT", icon: "directions_run", unit: "KG" },
              dumbbell: { name: "DUMBBELL", icon: "exercise", unit: "KG" },
              cardio_mins: { name: "CARDIO", icon: "monitor_heart", unit: "MIN" },
              machine: { name: "MACHINE", icon: "precision_manufacturing", unit: "KG" },
              shoulder_press: { name: "SHOULDER", icon: "fitness_center", unit: "KG" },
            };

            const dbMetrics = measurements.map((m) => m.metric_name);
            const allMetrics = Array.from(new Set([...dbMetrics, "bench_press", "squat", "dumbbell", "cardio_mins"]));

            // Split into logged (has value) and empty
            const logged = allMetrics.filter((m) => getMetric(m) !== null);
            const empty = allMetrics.filter((m) => getMetric(m) === null);

            return (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {allMetrics.map((metric) => {
                  const meta = LIFT_META[metric] || { name: metric.toUpperCase().replace(/_/g, " "), icon: "fitness_center", unit: "KG" };
                  const val = getMetric(metric);
                  return (
                    <button
                      key={metric}
                      onClick={() => { setLiftType(metric); setAddingLift(true); }}
                      className="bg-surface-container p-3 sm:p-4 rounded-lg text-left hover:bg-surface-container-high transition-colors group relative overflow-hidden"
                    >
                      {val !== null && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-secondary" />}
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className={`material-symbols-outlined text-base ${val !== null ? "text-secondary" : "text-neutral-600 group-hover:text-secondary"} transition-colors`}>{meta.icon}</span>
                        <span className={`text-[0.65rem] font-bold uppercase tracking-wider ${val !== null ? "text-white" : "text-neutral-500 group-hover:text-white"} transition-colors`}>{meta.name}</span>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className={`font-[var(--font-headline)] text-xl sm:text-2xl font-black ${val !== null ? "text-secondary" : "text-neutral-700"}`}>
                          {val !== null ? val : "--"}
                        </span>
                        <span className="text-[0.65rem] font-bold text-neutral-500">{meta.unit}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            );
          })()}
        </div>

        {/* Body Composition — 4 cols to match consistency */}
        <div className="lg:col-span-4 bg-surface-container p-4 sm:p-6 rounded-lg border-t-2 border-tertiary-fixed self-start">
          <div>
            <h4 className="font-[var(--font-headline)] text-xl sm:text-2xl font-black text-white uppercase tracking-tighter mb-4">Body Fat</h4>
            <div className="flex items-center gap-5">
              <div className="relative shrink-0">
                <svg className="w-24 h-24 sm:w-28 sm:h-28 -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="currentColor" strokeWidth="10" className="text-surface-container-highest" />
                  <circle cx="60" cy="60" r="50" fill="none" stroke="currentColor" strokeWidth="10" className="text-tertiary-fixed"
                    strokeDasharray={`${2 * Math.PI * 50}`}
                    strokeDashoffset={`${2 * Math.PI * 50 * (1 - currentBodyFat / 50)}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-[var(--font-headline)] text-2xl sm:text-3xl font-black text-white">{currentBodyFat}</span>
                  <span className="text-[0.6rem] text-neutral-500 font-bold">%</span>
                </div>
              </div>
              <div className="space-y-2 flex-1">
                <div className="flex justify-between">
                  <span className="text-xs text-neutral-500 uppercase tracking-wider">Start</span>
                  <span className="text-sm font-black text-white">{START_BODY_FAT}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-neutral-500 uppercase tracking-wider">Now</span>
                  <span className="text-sm font-black text-white">{currentBodyFat}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-neutral-500 uppercase tracking-wider">Delta</span>
                  <span className={`text-sm font-black ${bodyFatDelta > 0 ? "text-secondary" : "text-neutral-600"}`}>
                    {bodyFatDelta > 0 ? `-${bodyFatDelta}` : bodyFatDelta}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto px-4 sm:px-8 py-8 sm:py-12 bg-surface-container-lowest border-t border-outline-variant/10">
        <div className="flex flex-col gap-6 sm:flex-row sm:justify-between sm:items-center sm:gap-8">
          <div>
            <h5 className="font-[var(--font-headline)] text-2xl sm:text-4xl font-black text-white tracking-tighter mb-2">GRADUATE DIFFERENT.</h5>
            <p className="text-outline text-xs tracking-widest uppercase">Graduation: 22 April 2026 — {daysLeft} days remaining</p>
          </div>
          <button
            onClick={openEditor}
            className="bg-surface-container-high border-2 border-outline-variant/30 px-8 sm:px-12 py-3 sm:py-4 font-[var(--font-headline)] font-black text-xs tracking-widest text-white hover:border-primary transition-all duration-150 uppercase"
          >
            Log Progress
          </button>
        </div>
      </footer>
    </div>
  );
}
