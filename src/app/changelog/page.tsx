export default function ChangelogPage() {
  const releases = [
    {
      version: "v2.5.0",
      date: "MAR 25, 2026",
      title: "YOUR PERSONAL COACH",
      features: [
        "Chat with your AI tactical advisor — ask about workouts, nutrition, or debloating tips",
        "Get real-time answers with web search — the advisor finds the latest fitness science for you",
        "Coaching adapts to your current progress and goals",
      ],
    },
    {
      version: "v2.4.0",
      date: "MAR 24, 2026",
      title: "THE FULL GRIND EXPERIENCE",
      features: [
        "Dashboard — see your daily checklist, streak, weight, body fat, and mission status at a glance",
        "Daily Log — execute tasks one by one, track your energy, and see today's training focus",
        "Progress — watch your weight drop on the chart, count down to graduation, and log your lifts",
        "Plan Strategy — browse the 30-day calendar, plan your meals for each day, and follow the debloat protocol",
        "Your profile with photo, university info, and live stats (current weight → target → days left)",
        "Streak break alerts — if you miss a day, you'll hear about it",
        "Face debloat video tutorial embedded right in the dashboard",
      ],
    },
    {
      version: "v2.3.0",
      date: "MAR 24, 2026",
      title: "LOOKS BETTER ON EVERY SCREEN",
      features: [
        "Works on your phone — sidebar becomes a slide-out menu on mobile",
        "Everything scales and adjusts from phone to tablet to desktop",
        "New aggressive design — dark theme, bold fonts, military tactical feel",
        "Motivational quotes that rotate automatically on the Daily page",
      ],
    },
    {
      version: "v2.2.0",
      date: "MAR 24, 2026",
      title: "PLAN YOUR MEALS & TRAINING",
      features: [
        "30-day calendar — tap any date to see or edit that day's meal plan",
        "Plan what to eat for breakfast, lunch, dinner, and snacks — different for each day",
        "Weekly training rotation — tap to switch between Upper, Lower, Cardio, or Rest for any day",
        "What to Drink guide — water, lemon water, coconut water, green tea recommendations",
        "Milestone tracker — see which milestones you've hit (Day 7 bloat loss, Day 14 fat loss, etc.)",
        "5 Rules of Engagement and 6-step Face Debloat Protocol to follow daily",
      ],
    },
    {
      version: "v2.1.0",
      date: "MAR 24, 2026",
      title: "TRACK YOUR PROGRESS",
      features: [
        "Weight chart — see your weight trend over time with labeled data points",
        "Graduation countdown — live timer showing days, hours, minutes until April 22",
        "Body fat ring — visual tracker showing your body fat percentage and change",
        "Strength matrix — log your bench, squat, dumbbell, machine, and cardio numbers",
        "Consistency heatmap — see which days you completed all tasks",
      ],
    },
    {
      version: "v2.0.0",
      date: "MAR 24, 2026",
      title: "YOUR DATA SAVES NOW",
      features: [
        "Everything you do is saved — check off tasks, log weight, edit meals, it all persists",
        "Come back tomorrow and your streak continues where you left off",
        "Your training schedule, energy level, and meal plans are remembered",
        "New day? Your 8 daily tasks are automatically created each morning",
      ],
    },
    {
      version: "v1.0.0",
      date: "MAR 23, 2026",
      title: "THE BEGINNING",
      features: [
        "4 pages created: Dashboard, Daily, Progress, Plan",
        "Dark theme designed to keep you focused",
        "Built specifically for Duy's 30-day graduation transformation",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-surface-container-lowest">
      {/* Header */}
      <header className="flex justify-between items-center w-full px-4 sm:px-8 py-4 sm:py-6 bg-[#0e0e0e]/60 backdrop-blur-xl sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 bg-secondary"></div>
          <span className="font-[var(--font-headline)] font-bold uppercase tracking-tight text-white text-lg sm:text-xl">
            CHANGELOG
          </span>
        </div>
        <span className="text-xs font-bold text-neutral-500 uppercase tracking-[0.3em]">
          {releases.length} RELEASES
        </span>
      </header>

      <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
        {/* Hero */}
        <section className="mb-10 sm:mb-14">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black font-[var(--font-headline)] leading-[0.9] tracking-tighter uppercase text-white mb-4">
            WHAT&apos;S NEW <br /> IN GRIND.
          </h2>
          <p className="text-sm text-neutral-400 font-bold uppercase tracking-wider max-w-lg">
            Every update, every feature, every improvement — built to push Duy closer to graduation day.
          </p>
        </section>

        {/* Releases */}
        <div className="space-y-5">
          {releases.map((release, ri) => {
            const isLatest = ri === 0;

            if (isLatest) {
              return (
                <div key={release.version} className="bg-surface-container rounded-xl overflow-hidden border border-secondary/20 p-6 sm:p-8">
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className="inline-flex items-center gap-1.5 bg-secondary px-3 py-1 text-sm font-black text-on-secondary uppercase tracking-wider rounded-full">
                      <span className="w-2 h-2 bg-on-secondary rounded-full animate-pulse" />
                      LATEST
                    </span>
                    <span className="font-mono text-sm font-bold text-secondary">{release.version}</span>
                    <span className="text-sm text-neutral-500 font-bold uppercase tracking-wider">{release.date}</span>
                  </div>

                  <h3 className="font-[var(--font-headline)] text-3xl sm:text-4xl font-black text-white uppercase tracking-tight mb-6">
                    {release.title}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {release.features.map((feature, fi) => (
                      <div key={fi} className="flex gap-3 items-start bg-secondary/[0.05] p-3 rounded-lg border border-secondary/10">
                        <span className="material-symbols-outlined text-secondary text-lg shrink-0 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
                        <p className="text-sm text-neutral-200 leading-relaxed">{feature}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }

            return (
              <div key={release.version} className="bg-surface-container rounded-lg p-5 sm:p-6 border-l-2 border-secondary/20 hover:border-secondary/40 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-bold text-secondary bg-secondary/10 px-2 py-0.5 rounded">{release.version}</span>
                    <h3 className="font-[var(--font-headline)] text-lg sm:text-xl font-black text-white uppercase tracking-tight">
                      {release.title}
                    </h3>
                  </div>
                  <span className="text-xs text-neutral-500 font-bold uppercase tracking-widest sm:ml-auto shrink-0">{release.date}</span>
                </div>

                <div className="space-y-1.5">
                  {release.features.map((feature, fi) => (
                    <div key={fi} className="flex gap-2.5 items-start">
                      <span className="text-secondary text-sm mt-0.5 shrink-0">+</span>
                      <p className="text-sm text-neutral-300 leading-relaxed">{feature}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-14 pt-6 border-t border-outline-variant/20 text-center">
          <p className="text-sm text-neutral-500 font-bold italic">
            Built with fire by Minh Loc — for Duy&apos;s graduation transformation.
          </p>
        </div>
      </div>
    </div>
  );
}
