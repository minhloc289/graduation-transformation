"use client";

import { useState, useMemo } from "react";

const MESSAGES = [
  "YOU BROKE THE CHAIN. Your face won't debloat with excuses. Get back on it TODAY.",
  "STREAK LOST. Every missed day is a day Duy stays the same. Fix it NOW.",
  "YOU HAD MOMENTUM. You threw it away. The only way out is THROUGH. Start again.",
  "MISSED A DAY? Your jawline doesn't care about your reasons. EXECUTE.",
  "THE STREAK IS DEAD. But you're not. Rebuild it. One task at a time.",
];

interface StreakBreakBannerProps {
  streakDays: string[];
  streakCount: number;
  loaded: boolean;
}

export default function StreakBreakBanner({ streakDays, streakCount, loaded }: StreakBreakBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  const missedCount = streakDays.filter((s) => s === "missed").length;
  const hasMissed = missedCount > 0;

  const message = useMemo(() => {
    if (!hasMissed) return "";
    // Pick based on missed count for variety
    return MESSAGES[missedCount % MESSAGES.length];
  }, [hasMissed, missedCount]);

  if (!loaded || !hasMissed || dismissed) return null;

  return (
    <div className="relative bg-tertiary-fixed/90 backdrop-blur-sm rounded-lg overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-tertiary-fixed to-tertiary-fixed-dim opacity-50" />
      <div className="relative flex items-start gap-3 sm:gap-4 p-4 sm:p-5">
        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/10 flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-white text-lg sm:text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
            local_fire_department
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[0.6rem] sm:text-[0.65rem] font-black text-white/60 uppercase tracking-widest">
              STREAK BROKEN — {missedCount} DAY{missedCount > 1 ? "S" : ""} MISSED
            </span>
          </div>
          <p className="text-xs sm:text-sm font-bold text-white uppercase tracking-wide leading-relaxed">
            {message}
          </p>
          {streakCount > 0 && (
            <p className="text-[0.6rem] text-white/50 uppercase tracking-wider mt-1.5">
              Current streak: {streakCount} day{streakCount > 1 ? "s" : ""}. Don&apos;t break it again.
            </p>
          )}
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-white/40 hover:text-white transition-colors shrink-0"
        >
          <span className="material-symbols-outlined text-lg">close</span>
        </button>
      </div>
    </div>
  );
}
