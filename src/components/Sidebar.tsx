"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const navItems = [
  { href: "/", icon: "dashboard", label: "Dashboard" },
  { href: "/daily", icon: "calendar_today", label: "Daily" },
  { href: "/progress", icon: "insights", label: "Progress" },
  { href: "/plan", icon: "event_note", label: "Plan" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [mindset, setMindset] = useState<"SOFT" | "BALANCED" | "AGGRESSIVE">(
    "AGGRESSIVE"
  );
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

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
          MONOLITH
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
        <div className="mb-12">
          <h1 className="text-3xl font-black tracking-tighter text-white font-[var(--font-headline)] uppercase">
            MONOLITH
          </h1>
          <p className="text-[0.65rem] font-bold tracking-[0.2em] text-neutral-500 mt-1 uppercase">
            DAY 12 / 30
          </p>
        </div>

        <nav className="flex flex-col gap-2 flex-grow">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-4 px-4 py-3 transition-all duration-150 ${
                  isActive
                    ? "text-white bg-neutral-800"
                    : "text-neutral-500 hover:bg-neutral-800 hover:text-white"
                }`}
              >
                <span className="material-symbols-outlined text-xl">
                  {item.icon}
                </span>
                <span className="font-[var(--font-headline)] uppercase font-bold tracking-tight text-[0.75rem]">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-8 flex flex-col gap-6">
          <div className="bg-surface-container-lowest p-3 rounded-lg">
            <p className="text-[0.6rem] font-bold text-neutral-500 mb-2 tracking-widest uppercase">
              MINDSET MODE
            </p>
            <div className="flex gap-1 bg-black p-1 rounded">
              {(["SOFT", "BALANCED", "AGGRESSIVE"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setMindset(mode)}
                  className={`flex-1 text-[0.6rem] py-1 font-bold ${
                    mindset === mode
                      ? mode === "AGGRESSIVE"
                        ? "text-white bg-tertiary-fixed"
                        : "text-white bg-neutral-700"
                      : "text-neutral-500"
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <Link
              href="#"
              className="flex items-center gap-4 text-neutral-500 px-4 py-2 hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined text-lg">settings</span>
              <span className="text-[0.7rem] font-bold uppercase">Settings</span>
            </Link>
            <Link
              href="#"
              className="flex items-center gap-4 text-neutral-500 px-4 py-2 hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined text-lg">help</span>
              <span className="text-[0.7rem] font-bold uppercase">Support</span>
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
