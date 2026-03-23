export default function ProgressPage() {
  const consistencyDays = [
    ...Array(4).fill("done"),
    "missed",
    ...Array(7).fill("done"),
    "current",
    ...Array(15).fill("future"),
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* TopAppBar */}
      <header className="flex justify-between items-center w-full px-4 sm:px-8 py-4 sm:py-6 bg-[#0e0e0e]/60 backdrop-blur-xl sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-secondary rounded-full animate-pulse"></span>
          <span className="text-white font-[var(--font-headline)] font-bold uppercase tracking-tight text-xs sm:text-sm">
            MINDSET: AGGRESSIVE
          </span>
        </div>
        <div className="flex items-center gap-4 sm:gap-6">
          <span className="material-symbols-outlined text-[#919191] hover:text-white cursor-pointer transition-colors duration-150">
            notifications
          </span>
          <span className="material-symbols-outlined text-[#919191] hover:text-white cursor-pointer transition-colors duration-150">
            settings
          </span>
        </div>
      </header>

      {/* Hero */}
      <section className="px-4 sm:px-8 pt-8 sm:pt-12 pb-6 sm:pb-8">
        <h2 className="font-[var(--font-headline)] text-[3rem] sm:text-[5rem] md:text-[8rem] font-extrabold leading-[0.85] tracking-tighter uppercase text-white mb-3 sm:mb-4">
          DATA DOES NOT <span className="block">LIE</span>
        </h2>
        <p className="font-[var(--font-headline)] text-outline text-sm sm:text-lg tracking-widest uppercase mb-8 sm:mb-12">
          Performance metrics log // System Version 4.2.0
        </p>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-1">
          {[
            {
              label: "NET LOSS",
              value: "-10.8",
              unit: "LB",
              icon: "trending_down",
              iconText: "TRENDING NEGATIVE (OPTIMAL)",
              color: "text-secondary",
              border: "border-secondary",
            },
            {
              label: "STREAK",
              value: "12",
              unit: "DAYS",
              icon: "bolt",
              iconText: "MOMENTUM MAINTAINED",
              color: "text-primary",
              border: "border-primary",
            },
            {
              label: "ADHERENCE",
              value: "94.2",
              unit: "%",
              icon: "check_circle",
              iconText: "HIGH COMPLIANCE",
              color: "text-secondary",
              border: "border-secondary",
            },
          ].map((card) => (
            <div
              key={card.label}
              className={`bg-surface-container-low p-6 sm:p-8 flex flex-col justify-between min-h-[160px] sm:aspect-video border-l-4 ${card.border}`}
            >
              <span className="font-[var(--font-headline)] text-outline text-xs tracking-widest uppercase">
                {card.label}
              </span>
              <h3 className="font-[var(--font-headline)] text-4xl sm:text-6xl font-black text-white">
                {card.value}{" "}
                <span className="text-xl sm:text-2xl text-outline">{card.unit}</span>
              </h3>
              <div className={`flex items-center gap-2 ${card.color}`}>
                <span className="material-symbols-outlined text-sm">
                  {card.icon}
                </span>
                <span className="text-[0.6rem] sm:text-[0.65rem] font-bold tracking-widest uppercase">
                  {card.iconText}
                </span>
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
              <h4 className="font-[var(--font-headline)] text-xl sm:text-2xl font-black text-white uppercase tracking-tighter">
                Weight Progression
              </h4>
              <p className="text-outline text-xs tracking-widest uppercase">
                30-Day Analysis Period
              </p>
            </div>
            <div className="sm:text-right">
              <span className="block font-[var(--font-headline)] text-2xl sm:text-3xl font-black text-white">
                184.2
              </span>
              <span className="text-outline text-[0.6rem] tracking-widest uppercase">
                CURRENT LB
              </span>
            </div>
          </div>
          <div className="h-40 sm:h-64 w-full relative">
            <div className="absolute inset-0 flex items-end opacity-20">
              <div className="w-full h-full border-b border-l border-outline-variant/30"></div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-secondary/10 to-transparent graph-line"></div>
            <svg
              className="absolute inset-0 w-full h-full overflow-visible"
              preserveAspectRatio="none"
              viewBox="0 0 1000 250"
            >
              <polyline
                fill="none"
                points="0,200 100,180 200,160 300,150 400,120 500,100 600,90 700,80 800,60 900,50 1000,40"
                stroke="white"
                strokeWidth="3"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
            <div className="absolute left-0 bottom-10 w-2 h-2 bg-white rounded-full"></div>
            <div className="absolute right-0 top-8 w-3 h-3 bg-secondary rounded-full ring-4 ring-secondary/20 shadow-[0_0_15px_#4ae176]"></div>
          </div>
          <div className="mt-6 sm:mt-8 grid grid-cols-3 sm:grid-cols-6 gap-2 text-[0.6rem] text-outline font-bold tracking-widest uppercase">
            <span>DAY 01</span>
            <span className="hidden sm:block">DAY 06</span>
            <span>DAY 12</span>
            <span className="hidden sm:block">DAY 18</span>
            <span className="hidden sm:block">DAY 24</span>
            <span>DAY 30</span>
          </div>
        </div>

        {/* Heatmap */}
        <div className="lg:col-span-4 bg-surface-container-high p-5 sm:p-8 flex flex-col justify-between">
          <div>
            <h4 className="font-[var(--font-headline)] text-xl sm:text-2xl font-black text-white uppercase tracking-tighter mb-1">
              Consistency
            </h4>
            <p className="text-outline text-xs tracking-widest uppercase mb-6 sm:mb-8">
              Daily Protocol Execution
            </p>
            <div className="grid grid-cols-7 gap-1">
              {consistencyDays.map((status, i) => (
                <div
                  key={i}
                  className={`aspect-square ${
                    status === "done"
                      ? "bg-secondary-container"
                      : status === "missed"
                      ? "bg-tertiary-fixed-dim"
                      : status === "current"
                      ? "bg-primary border-4 border-white animate-pulse"
                      : "bg-surface-container-lowest"
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-outline-variant/20">
            <div className="flex justify-between items-center">
              <span className="text-[0.65rem] text-outline font-bold tracking-widest uppercase">
                PROTOCOL COMPLIANCE
              </span>
              <span className="text-secondary font-black text-xl font-[var(--font-headline)] underline underline-offset-4">
                92%
              </span>
            </div>
          </div>
        </div>

        {/* Strength Matrix */}
        <div className="lg:col-span-5 bg-surface-container-low p-5 sm:p-8">
          <h4 className="font-[var(--font-headline)] text-xl sm:text-2xl font-black text-white uppercase tracking-tighter mb-6 sm:mb-8">
            Strength Matrix
          </h4>
          <div className="space-y-3 sm:space-y-4">
            {[
              { name: "Bench Press", old: "225 LB", current: "240 LB" },
              { name: "Squat", old: "315 LB", current: "335 LB" },
              { name: "Deadlift", old: "405 LB", current: "425 LB" },
            ].map((lift) => (
              <div
                key={lift.name}
                className="flex justify-between items-center p-3 sm:p-4 bg-surface-container-highest/30 rounded-lg"
              >
                <span className="font-[var(--font-headline)] font-bold text-xs sm:text-sm text-white tracking-tight uppercase">
                  {lift.name}
                </span>
                <div className="flex items-center gap-3 sm:gap-6">
                  <span className="text-outline text-xs line-through">
                    {lift.old}
                  </span>
                  <span className="text-secondary font-black text-base sm:text-lg">
                    {lift.current}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Body Fat */}
        <div className="lg:col-span-3 bg-surface-container-lowest p-5 sm:p-8 flex flex-col justify-between border-2 border-outline-variant/10">
          <h4 className="font-[var(--font-headline)] text-xl sm:text-2xl font-black text-white uppercase tracking-tighter mb-4">
            Body Fat %
          </h4>
          <div className="relative py-8 sm:py-12 flex justify-center items-center">
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-[10px] sm:border-[12px] border-surface-container-high relative flex items-center justify-center">
              <div className="absolute inset-[-10px] sm:inset-[-12px] rounded-full border-[10px] sm:border-[12px] border-secondary border-t-transparent border-r-transparent rotate-45"></div>
              <div className="text-center">
                <span className="block font-[var(--font-headline)] text-3xl sm:text-4xl font-black text-white">
                  14.8
                </span>
                <span className="text-outline text-[0.6rem] tracking-widest uppercase">
                  PERCENT
                </span>
              </div>
            </div>
          </div>
          <div className="flex justify-between text-[0.6rem] sm:text-[0.65rem] font-bold tracking-widest uppercase border-t border-outline-variant/20 pt-4 sm:pt-6">
            <span className="text-outline">START: 16%</span>
            <span className="text-secondary">DELTA: -1.2%</span>
          </div>
        </div>

        {/* Visual Log */}
        <div className="lg:col-span-4 bg-surface-container-high overflow-hidden group">
          <div className="p-5 sm:p-8">
            <h4 className="font-[var(--font-headline)] text-xl sm:text-2xl font-black text-white uppercase tracking-tighter mb-1">
              Visual Log
            </h4>
            <p className="text-outline text-xs tracking-widest uppercase mb-4 sm:mb-6">
              Physique Delta: 12 Days
            </p>
          </div>
          <div className="flex h-full min-h-[250px] sm:min-h-[300px]">
            <div className="flex-1 relative group overflow-hidden">
              <img
                className="absolute inset-0 w-full h-full object-cover grayscale opacity-50 transition-all duration-500 group-hover:grayscale-0 group-hover:opacity-100"
                alt="Day 1 physique"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBSHYJFbuorD6A0KBc9Pqy7EPUdbXEsT4KAjPm8ad20qPlQa8JixRad6XvnANeWaon-cqbuOaQEgbtezEU8lcOtBR8CBbLbDumDWiAbnNb2uqSygIzL6QpznCC9nDM3JNIY1luLHU7N51lZ2ZnxFn_1EkZtt0lixaqdy9yjHydj0xAC5L5PxuMdVtUyacArILQfeBkAxlrR7wtF6Dp6LyVqrKNRJ63nijaWeXd4j35fMEJmKJjfb6a7rKEjIiQ7G351BqtpSvPPMA"
              />
              <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 bg-black/80 px-3 sm:px-4 py-2">
                <span className="font-[var(--font-headline)] text-[0.65rem] sm:text-xs font-black text-white uppercase tracking-[0.15em] sm:tracking-[0.2em]">
                  DAY 01
                </span>
              </div>
            </div>
            <div className="w-[2px] bg-primary z-10"></div>
            <div className="flex-1 relative group overflow-hidden">
              <img
                className="absolute inset-0 w-full h-full object-cover grayscale opacity-50 transition-all duration-500 group-hover:grayscale-0 group-hover:opacity-100"
                alt="Day 12 physique"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCm3dSgJmVrgNFaZH3hOpWnAAj_RSmvxQvuF-qdppvgoDEOQWxgJNFyamqVEiIS-GBHkqsuaQqXWqLJ_cqQckVXOl5m9sE5XNtC-ST-xIMQP6mKXUnh-XJm6pouGd-IXRI0bgtKqKLOsW4Zuj3u6wRx_ukipd1K9Us1Cld73RlV9lmY1PAje3j-DKlWOkYuFKprVrZfc8AvKs_NJTEonHMfYNzMRecwfPBMplTe5cV_idfiENl3qKjo9fXqdJ_GUNm07Tdlk9tLGw"
              />
              <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 bg-secondary px-3 sm:px-4 py-2">
                <span className="font-[var(--font-headline)] text-[0.65rem] sm:text-xs font-black text-black uppercase tracking-[0.15em] sm:tracking-[0.2em]">
                  DAY 12
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto px-4 sm:px-8 py-8 sm:py-12 bg-surface-container-lowest border-t border-outline-variant/10">
        <div className="flex flex-col gap-6 sm:flex-row sm:justify-between sm:items-center sm:gap-8">
          <div>
            <h5 className="font-[var(--font-headline)] text-2xl sm:text-4xl font-black text-white tracking-tighter mb-2">
              NEVER SURRENDER.
            </h5>
            <p className="text-outline text-xs tracking-widest uppercase">
              Next biometric sync in 14:22:05
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button className="bg-surface-container-high border-2 border-outline-variant/30 px-8 sm:px-12 py-3 sm:py-4 font-[var(--font-headline)] font-black text-xs tracking-widest text-white hover:border-primary transition-all duration-150 uppercase">
              Download Log
            </button>
            <button className="bg-primary px-8 sm:px-12 py-3 sm:py-4 font-[var(--font-headline)] font-black text-xs tracking-widest text-on-primary hover:bg-black hover:text-white transition-all duration-150 uppercase">
              Sync Devices
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
