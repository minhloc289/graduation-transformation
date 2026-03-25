"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { getDayNumber, getTodayString, PROGRAM_DAYS } from "@/lib/supabase";

const navItems = [
  { href: "/", icon: "dashboard", label: "Dashboard" },
  { href: "/daily", icon: "calendar_today", label: "Daily" },
  { href: "/progress", icon: "insights", label: "Progress" },
  { href: "/plan", icon: "event_note", label: "Plan" },
  { href: "/changelog", icon: "history", label: "Changelog" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const todayStr = useMemo(() => getTodayString(), []);
  const dayNum = useMemo(() => getDayNumber(todayStr), [todayStr]);

  // Lock body scroll when mobile sidebar is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      {/* Mobile top bar */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-[#131313]/95 backdrop-blur-xl border-b border-neutral-800 flex items-center justify-between px-5 z-[60] lg:hidden">
        <h1 className="text-xl font-black tracking-tighter text-white font-[var(--font-headline)] uppercase">
          GRIND
        </h1>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="w-10 h-10 flex items-center justify-center text-white hover:bg-neutral-800 transition-colors"
          aria-label="Toggle menu"
        >
          <span className="material-symbols-outlined text-2xl">
            {mobileOpen ? "close" : "menu"}
          </span>
        </button>
      </div>

      {/* Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[65] lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          h-screen w-64 fixed left-0 top-0 border-r border-neutral-800 bg-[#131313] flex flex-col py-8 px-4 z-[70]
          transition-transform duration-300 ease-out
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        <div className="mb-10">
          <h1 className="text-4xl font-black tracking-tighter text-white font-[var(--font-headline)] uppercase">
            GRIND
          </h1>
          <p className="text-xs font-bold tracking-[0.2em] text-neutral-400 mt-2 uppercase">
            DAY {dayNum.toString().padStart(2, "0")} / {PROGRAM_DAYS}
          </p>
          <p className="text-xs font-bold tracking-[0.15em] text-tertiary-fixed mt-1 uppercase">
            GRADUATION: 22 APR 2026
          </p>
        </div>

        <nav className="flex flex-col gap-1 flex-grow">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-lg transition-all duration-150 ${
                  isActive
                    ? "text-white bg-neutral-800"
                    : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
                }`}
              >
                <span className="material-symbols-outlined text-xl">
                  {item.icon}
                </span>
                <span className="font-[var(--font-headline)] uppercase font-bold tracking-tight text-sm">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-6 flex flex-col gap-4">
          {/* Competitor profile */}
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 shrink-0 overflow-hidden rounded-full border-2 border-tertiary-fixed/40">
              <Image src="/competitor.jpg" alt="Duy" width={40} height={40} className="w-full h-full object-cover object-top" />
            </div>
            <div>
              <p className="text-sm font-bold text-white uppercase tracking-wider">BUI MAI ANH DUY</p>
              <p className="text-xs text-neutral-500 uppercase tracking-wider">Competitor</p>
            </div>
          </div>

          {/* Mindset — always aggressive */}
          <div className="bg-tertiary-fixed/10 border border-tertiary-fixed/20 px-4 py-2.5 rounded-lg flex items-center gap-2.5">
            <span className="material-symbols-outlined text-tertiary-fixed text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
            <span className="text-xs font-black text-tertiary-fixed uppercase tracking-widest">AGGRESSIVE MODE</span>
          </div>
        </div>
      </aside>
    </>
  );
}
