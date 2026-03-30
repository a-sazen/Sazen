import { DAYS, UNI_DAYS, CAT_COLORS, getDynamicSchedule } from '../constants';

export default function WeeklyView() {
  const todayIdx = new Date().getDay();

  const getTargetDate = (dayIndex: number) => {
    const today = new Date();
    const diff = dayIndex - today.getDay();
    const target = new Date(today);
    target.setDate(today.getDate() + diff);
    return target;
  };

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-4xl font-black tracking-tight leading-tight text-text-primary">Weekly Overview</h1>
        <p className="text-sm font-black uppercase tracking-[0.2em] text-text-tertiary mt-2">Spring 2026 · Session 261</p>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {DAYS.map((d, i) => {
          const isUni = UNI_DAYS.includes(d);
          const isToday = i === todayIdx;
          const targetDate = getTargetDate(i);
          const blocks = getDynamicSchedule(targetDate);
          const byCat: Record<string, number> = {};
          blocks.forEach(b => {
            byCat[b.cat] = (byCat[b.cat] || 0) + 1;
          });

          return (
            <div 
              key={d} 
              className={`glass p-4 min-h-[160px] flex flex-col transition-all duration-500 hover:scale-[1.02] group relative overflow-hidden ${
                isToday 
                  ? 'bg-accent/20 border-accent/50 ring-2 ring-accent/30 shadow-[0_0_30px_rgba(124,111,247,0.3)]' 
                  : isUni ? 'bg-blue-custom/5 border-blue-custom/20' : 'bg-white/5 border-white/10'
              }`}
            >
              {isToday && (
                <div className="absolute top-0 right-0 w-16 h-16 bg-accent/20 blur-2xl rounded-full -mr-8 -mt-8 animate-pulse" />
              )}
              <div className={`text-[11px] font-black uppercase tracking-widest mb-4 flex items-center gap-2 ${isToday ? 'text-accent' : isUni ? 'text-blue-custom' : 'text-text-tertiary'}`}>
                {d}
                {isToday && (
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
                )}
              </div>
              
              <div className="flex flex-col gap-2">
                {Object.entries(byCat).slice(0, 4).map(([cat, count]) => {
                  const colors = CAT_COLORS[cat as any] || CAT_COLORS.personal;
                  return (
                    <span 
                      key={cat} 
                      className="text-[9px] px-2 py-1 rounded-lg border truncate font-black uppercase tracking-tighter shadow-sm"
                      style={{ backgroundColor: `${colors.bg}20`, color: colors.dot, borderColor: `${colors.border}40` }}
                    >
                      {cat} ×{count}
                    </span>
                  );
                })}
                {isUni && (
                  <span className="text-[9px] px-2 py-1 rounded-lg border bg-blue-custom/10 text-blue-custom border-blue-custom/20 font-black uppercase tracking-tighter">
                    🎓 Class Day
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section>
          <div className="flex items-center gap-3 mb-6 px-2">
            <div className="w-2 h-2 rounded-full bg-blue-custom shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/40">Class Days</h3>
          </div>
          <div className="glass bg-white/5 border border-white/10 rounded-[32px] p-8 text-sm leading-loose text-white/60 shadow-2xl group hover:bg-white/10 transition-all duration-500">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/5">
              <b className="text-white font-black tracking-tight">Sunday & Wednesday</b>
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-custom">ACT 2111, PHY 2105, MATH 2107</span>
            </div>
            <div className="flex items-center justify-between">
              <b className="text-white font-black tracking-tight">Saturday</b>
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-custom">PHY 2106 (Lab)</span>
            </div>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-6 px-2">
            <div className="w-2 h-2 rounded-full bg-success shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/40">Weekly Targets</h3>
          </div>
          <div className="glass bg-white/5 border border-white/10 rounded-[32px] p-8 text-sm leading-loose text-white/60 shadow-2xl group hover:bg-white/10 transition-all duration-500">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                <div className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1">Study</div>
                <div className="text-xl font-black text-white">5 <span className="text-xs text-white/30">/ week</span></div>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                <div className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1">Workout</div>
                <div className="text-xl font-black text-white">4 <span className="text-xs text-white/30">/ week</span></div>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                <div className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1">Food Page</div>
                <div className="text-xl font-black text-white">3 <span className="text-xs text-white/30">/ week</span></div>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                <div className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1">Personal Reels</div>
                <div className="text-xl font-black text-white">1 <span className="text-xs text-white/30">/ week</span></div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
