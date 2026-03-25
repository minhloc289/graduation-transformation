"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  searched?: boolean;
}

function FormattedMessage({ content }: { content: string }) {
  const rendered = useMemo(() => {
    // Split into paragraphs by double newline or single newline
    const paragraphs = content.split(/\n{2,}|\n/).filter(Boolean);

    return paragraphs.map((para, i) => {
      const trimmed = para.trim();

      // Bullet point
      if (trimmed.startsWith("•") || trimmed.startsWith("-") || trimmed.startsWith("*") && !trimmed.startsWith("**")) {
        const text = trimmed.replace(/^[•\-*]\s*/, "");
        return (
          <div key={i} className="flex gap-2 items-start">
            <span className="text-secondary mt-0.5 text-[0.65rem] shrink-0">●</span>
            <span>{renderInline(text)}</span>
          </div>
        );
      }

      // Numbered list
      const numMatch = trimmed.match(/^(\d+)[.)]\s*(.*)/);
      if (numMatch) {
        return (
          <div key={i} className="flex gap-2 items-start">
            <span className="text-secondary font-bold text-[0.7rem] shrink-0 min-w-[1rem] text-right">{numMatch[1]}.</span>
            <span>{renderInline(numMatch[2])}</span>
          </div>
        );
      }

      return <p key={i}>{renderInline(trimmed)}</p>;
    });
  }, [content]);

  return <div className="space-y-1.5">{rendered}</div>;
}

function renderInline(text: string): React.ReactNode[] {
  // Handle **bold** markdown
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className="text-white font-semibold">{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}

const SUGGESTED_PROMPTS = [
  { text: "Face debloat tips", icon: "face_retouching_natural", color: "text-secondary", bg: "bg-secondary/8", border: "border-secondary/15 hover:border-secondary/40" },
  { text: "What should I eat?", icon: "restaurant", color: "text-amber-400", bg: "bg-amber-400/8", border: "border-amber-400/15 hover:border-amber-400/40" },
  { text: "Am I on track?", icon: "trending_up", color: "text-sky-400", bg: "bg-sky-400/8", border: "border-sky-400/15 hover:border-sky-400/40" },
  { text: "Bloat triggers", icon: "block", color: "text-tertiary-fixed", bg: "bg-tertiary-fixed/8", border: "border-tertiary-fixed/15 hover:border-tertiary-fixed/40" },
];

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMsg: ChatMessage = { role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          history: messages,
        }),
      });
      const data = await res.json();
      if (data.response) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.response, searched: data.searched },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Signal interrupted. Retry." },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Connection lost. Retry transmission." },
      ]);
    } finally {
      setLoading(false);
    }
  }, [messages]);

  // ── COLLAPSED: Floating bubble ────────────────────────────────
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-[80] w-14 h-14 bg-secondary hover:bg-secondary-fixed-dim rounded-full flex items-center justify-center shadow-lg shadow-secondary/20 transition-all duration-200 hover:scale-105 active:scale-95 group"
        aria-label="Open chat"
      >
        {/* Ping ring */}
        <span className="absolute inset-0 rounded-full bg-secondary/30 animate-ping opacity-40" />
        <span
          className="material-symbols-outlined text-black text-2xl relative z-10"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          chat
        </span>
      </button>
    );
  }

  // ── EXPANDED: Chat panel ──────────────────────────────────────
  return (
    <div className="fixed bottom-6 right-4 sm:right-6 z-[80] w-[calc(100vw-2rem)] sm:w-[380px] h-[520px] flex flex-col bg-surface-container-high rounded-xl border border-outline-variant/30 shadow-2xl shadow-black/60 overflow-hidden">
      {/* Scan-line overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.015] z-10"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(74,225,118,0.2) 2px, rgba(74,225,118,0.2) 4px)",
        }}
      />

      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="relative flex items-center justify-between px-4 py-3 border-b border-outline-variant/20 bg-surface-container-highest/50 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 bg-gradient-to-br from-secondary to-secondary-fixed-dim p-[2px]">
            <div className="w-full h-full rounded-full bg-surface-container-highest flex items-center justify-center">
              <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
                {/* Dumbbell icon — clean, minimal */}
                <rect x="2" y="7" width="4" height="6" rx="1" fill="#4ae176"/>
                <rect x="14" y="7" width="4" height="6" rx="1" fill="#4ae176"/>
                <rect x="6" y="9" width="8" height="2" rx="0.5" fill="#4ae176" fillOpacity="0.7"/>
                {/* AI sparkle */}
                <path d="M16 3l.7 1.3L18 5l-1.3.7L16 7l-.7-1.3L14 5l1.3-.7z" fill="#4ae176" fillOpacity="0.8"/>
              </svg>
            </div>
          </div>
          <div>
            <h3 className="font-[var(--font-headline)] text-sm font-black text-white uppercase tracking-tight leading-none">
              Tactical Advisor
            </h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 bg-secondary rounded-full animate-pulse" />
              <span className="text-[0.55rem] font-bold text-secondary/50 uppercase tracking-[0.25em]">
                Grind AI
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="w-7 h-7 flex items-center justify-center text-neutral-500 hover:text-white hover:bg-white/5 rounded transition-colors"
          aria-label="Close chat"
        >
          <span className="material-symbols-outlined text-lg">close</span>
        </button>
      </div>

      {/* ── Messages ───────────────────────────────────────────── */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-0 chat-scroll"
      >
        {messages.length === 0 && !loading ? (
          /* Empty state — welcome + suggested prompts */
          <div className="flex flex-col h-full">
            {/* Welcome message */}
            <div className="flex justify-start mb-4">
              <div className="max-w-[85%] bg-surface-container-lowest border border-outline-variant/15 rounded-2xl rounded-bl-sm px-3.5 py-2.5">
                <p className="text-[0.8rem] leading-relaxed text-white/80">
                  What do you need, soldier? Pick a topic or ask me anything about your cut.
                </p>
              </div>
            </div>

            {/* Suggested prompts — pushed to bottom */}
            <div className="mt-auto">
              <p className="text-[0.55rem] font-bold text-neutral-600 uppercase tracking-[0.25em] mb-2.5 px-1">
                Quick briefs
              </p>
              <div className="grid grid-cols-2 gap-2">
                {SUGGESTED_PROMPTS.map((prompt) => (
                  <button
                    key={prompt.text}
                    onClick={() => sendMessage(prompt.text)}
                    className={`flex items-center gap-2.5 px-3 py-3 ${prompt.bg} border ${prompt.border} rounded-lg text-left transition-all duration-150 hover:scale-[1.02] active:scale-[0.98]`}
                  >
                    <span
                      className={`material-symbols-outlined text-lg ${prompt.color}`}
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      {prompt.icon}
                    </span>
                    <span className="text-xs font-semibold text-white/70">
                      {prompt.text}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] px-3.5 py-2.5 text-[0.8rem] leading-relaxed ${
                    msg.role === "user"
                      ? "bg-secondary/10 border border-secondary/20 rounded-2xl rounded-br-sm text-white/90"
                      : "bg-surface-container-lowest border border-outline-variant/15 rounded-2xl rounded-bl-sm text-white/80"
                  }`}
                >
                  {msg.role === "assistant" ? <FormattedMessage content={msg.content} /> : msg.content}
                  {msg.searched && (
                    <div className="flex items-center gap-1 mt-1.5 pt-1.5 border-t border-outline-variant/10">
                      <span className="material-symbols-outlined text-[0.65rem] text-sky-400/60">travel_explore</span>
                      <span className="text-[0.55rem] text-sky-400/50 font-medium">Web search used</span>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-surface-container-lowest border border-outline-variant/15 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1">
                  <span
                    className="w-1.5 h-1.5 bg-secondary/50 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms", animationDuration: "1s" }}
                  />
                  <span
                    className="w-1.5 h-1.5 bg-secondary/50 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms", animationDuration: "1s" }}
                  />
                  <span
                    className="w-1.5 h-1.5 bg-secondary/50 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms", animationDuration: "1s" }}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Input ──────────────────────────────────────────────── */}
      <div className="shrink-0 border-t border-outline-variant/20 bg-surface-container-high px-3 py-2.5 flex items-center gap-2">
        <input
          ref={inputRef as React.RefObject<HTMLInputElement>}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !loading) {
              e.preventDefault();
              sendMessage(input);
            }
          }}
          disabled={loading}
          placeholder="Ask your coach..."
          className="flex-1 bg-transparent text-sm text-white/90 placeholder:text-neutral-600 outline-none py-1.5 disabled:opacity-40 min-w-0"
        />
        <button
          onClick={() => sendMessage(input)}
          disabled={loading || !input.trim()}
          className="w-8 h-8 flex items-center justify-center text-secondary hover:text-secondary-fixed-dim disabled:text-neutral-600 disabled:cursor-not-allowed transition-colors shrink-0"
          aria-label="Send message"
        >
          <span
            className="material-symbols-outlined text-xl"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            send
          </span>
        </button>
      </div>
    </div>
  );
}
