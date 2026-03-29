import { MF_TASKS } from '../constants';

interface MindfuelWorkProps {
  mfDone: number[];
  toggleMf: (id: number) => void;
}

export default function MindfuelWork({ mfDone, toggleMf }: MindfuelWorkProps) {
  const doneCount = mfDone.length;
  const totalCount = MF_TASKS.length;
  const pct = Math.round((doneCount / totalCount) * 100);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-extrabold leading-tight">Mindfuel Work</h1>
        <p className="text-sm text-text-secondary mt-1">Evening work sessions · 5:00 PM – 9:00 PM</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass bg-white/5 border border-white/10 rounded-[32px] p-6 relative overflow-hidden group hover:bg-white/10 transition-all duration-500 shadow-xl">
          <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full opacity-[0.05] bg-accent blur-2xl group-hover:scale-150 transition-transform duration-700" />
          <div className="text-[11px] text-white/40 font-black tracking-[0.2em] uppercase">Tasks Done</div>
          <div className="text-4xl font-black mt-2 text-accent-light tracking-tighter">{doneCount}</div>
          <div className="text-xs text-white/30 mt-3 font-bold">of {totalCount} total</div>
        </div>
        <div className="glass bg-white/5 border border-white/10 rounded-[32px] p-6 relative overflow-hidden group hover:bg-white/10 transition-all duration-500 shadow-xl">
          <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full opacity-[0.05] bg-danger blur-2xl group-hover:scale-150 transition-transform duration-700" />
          <div className="text-[11px] text-white/40 font-black tracking-[0.2em] uppercase">In Progress</div>
          <div className="text-4xl font-black mt-2 text-danger tracking-tighter">{totalCount - doneCount}</div>
          <div className="text-xs text-white/30 mt-3 font-bold">active tasks</div>
        </div>
        <div className="glass bg-white/5 border border-white/10 rounded-[32px] p-6 relative overflow-hidden group hover:bg-white/10 transition-all duration-500 shadow-xl">
          <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full opacity-[0.05] bg-success blur-2xl group-hover:scale-150 transition-transform duration-700" />
          <div className="text-[11px] text-white/40 font-black tracking-[0.2em] uppercase">Progress</div>
          <div className="text-4xl font-black mt-2 text-success tracking-tighter">{pct}%</div>
          <div className="h-2 bg-white/5 rounded-full mt-4 overflow-hidden">
            <div className="h-full bg-success rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(34,197,94,0.5)]" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>

      <section>
        <div className="flex items-center gap-3 mb-6 px-4">
          <div className="w-2.5 h-2.5 rounded-full bg-accent-light shadow-[0_0_10px_rgba(147,197,253,0.5)]" />
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/40">All Tasks — Click to toggle</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {MF_TASKS.map((t) => (
            <div 
              key={t.id}
              onClick={() => toggleMf(t.id)}
              className={`flex items-center gap-4 p-4 rounded-[24px] border transition-all duration-300 cursor-pointer select-none group ${
                mfDone.includes(t.id) 
                  ? 'bg-white/5 border-white/5 opacity-40' 
                  : 'glass bg-white/5 border border-white/10 hover:border-white/30 hover:bg-white/10 shadow-lg'
              }`}
            >
              <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${
                mfDone.includes(t.id) ? 'bg-success border-success scale-90' : 'border-white/20 group-hover:border-white/40'
              }`}>
                {mfDone.includes(t.id) && <svg width="12" height="12" viewBox="0 0 10 10" className="animate-in zoom-in duration-300"><path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              </div>
              <div className={`text-base font-bold tracking-tight flex-1 ${mfDone.includes(t.id) ? 'line-through text-white/40' : 'text-white'}`}>{t.id}. {t.title}</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-white/20 group-hover:text-white/40 transition-colors">{t.cat}</div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center gap-3 mb-6 px-4">
          <div className="w-2.5 h-2.5 rounded-full bg-teal-custom shadow-[0_0_10px_rgba(45,212,191,0.5)]" />
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/40">Also in work block</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass bg-white/5 border border-white/10 rounded-[32px] p-8 text-base text-white/60 leading-relaxed font-medium italic shadow-2xl">
            🎬 <b className="text-white not-italic">Video Editing</b> — Learn & practice editing style<br />
            📹 <b className="text-white not-italic">Food Page Posts</b> — 3 per week (create + upload)<br />
            🎥 <b className="text-white not-italic">Personal Reel</b> — 1 per week (shoot + edit)<br />
            📺 <b className="text-white not-italic">Informative Video</b> — Watch 1 daily + take notes
          </div>
          <div className="glass bg-white/5 border border-white/10 rounded-[32px] p-8 text-base text-white/60 leading-relaxed font-medium italic shadow-2xl">
            🗣️ <b className="text-white not-italic">Voice & Talking Practice</b> — Daily 30 min<br />
            📝 <b className="text-white not-italic">Session: 5–9 PM</b> — Dedicated work block<br />
            ☕ <b className="text-white not-italic">No distractions</b> — Social media max 1hr/day<br />
            📊 <b className="text-white not-italic">Review weekly</b> — Friday planning session
          </div>
        </div>
      </section>
    </div>
  );
}
