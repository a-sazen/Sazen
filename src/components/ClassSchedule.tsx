import { useState } from 'react';
import { SCHEDULE } from '../constants';

export default function ClassSchedule() {
  const [activeDay, setActiveDay] = useState('Sun');
  const classes = SCHEDULE[activeDay] || [];

  const allCourses = [
    { code: 'ACT 2111', name: 'Financial & Managerial Accounting', time: '09:51 – 11:10 AM', room: '301', section: 'D', days: 'Sun + Wed', color: '#4a9eff' },
    { code: 'MATH 2107', name: 'Linear Algebra', time: '03:11 – 04:30 PM', room: '708', section: 'BA', days: 'Sun + Wed', color: '#a89af9' },
    { code: 'PHY 2105', name: 'Physics', time: '11:11 – 12:30 PM', room: '406', section: 'P', days: 'Sun + Wed', color: '#3ecf8e' },
    { code: 'PHY 2106', name: 'Physics Laboratory', time: '02:00 – 04:30 PM', room: '510', section: 'D', days: 'Saturday', color: '#f06a50' },
  ];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-extrabold leading-tight">Class Schedule</h1>
        <p className="text-sm text-text-secondary mt-1">UIU · Spring 2026 · Student ID: 0152330155</p>
      </header>

      <div className="flex gap-3">
        {['Sun', 'Wed', 'Sat'].map((d) => (
          <button
            key={d}
            onClick={() => setActiveDay(d)}
            className={`px-6 py-2.5 rounded-full text-xs font-black transition-all duration-300 border tracking-widest uppercase ${
              activeDay === d 
                ? 'bg-accent border-accent text-white shadow-lg shadow-accent/30 scale-105' 
                : 'glass bg-white/5 border-white/10 text-white/40 hover:border-white/30 hover:text-white/60'
            }`}
          >
            {d === 'Sun' ? 'Sunday' : d === 'Wed' ? 'Wednesday' : 'Saturday'}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {classes.length > 0 ? classes.map((c, i) => (
          <div key={i} className="glass bg-white/5 border border-white/10 rounded-[32px] p-6 flex gap-6 items-start border-l-8 hover:bg-white/10 transition-all duration-500 shadow-xl group" style={{ borderLeftColor: c.color }}>
            <div className="bg-white/5 rounded-2xl px-4 py-3 text-center min-w-[100px] border border-white/5 group-hover:border-white/10 transition-all">
              <div className="text-lg font-black tracking-tighter" style={{ color: c.color }}>{c.start.split(' ')[0]}</div>
              <div className="text-[10px] text-white/30 font-black uppercase tracking-widest mt-1">{c.start.split(' ')[1]} – {c.end.split(' ')[1]}</div>
            </div>
            <div className="flex-1">
              <div className="text-lg font-black tracking-tight text-white">{c.name}</div>
              <div className="text-sm text-white/40 font-bold mt-1">{c.code} · Section {c.section}</div>
              <div className="flex gap-3 mt-4">
                <span className="text-[10px] px-3 py-1 rounded-full bg-white/5 text-white/60 border border-white/10 font-black uppercase tracking-widest">📍 Room {c.room}</span>
                <span className="text-[10px] px-3 py-1 rounded-full bg-white/5 text-white/60 border border-white/10 font-black uppercase tracking-widest">Permanent Campus</span>
              </div>
            </div>
          </div>
        )) : (
          <div className="glass bg-white/5 border border-white/10 rounded-[40px] text-white/20 text-center py-20 font-black uppercase tracking-[0.3em] italic">No classes scheduled for this day.</div>
        )}
      </div>

      <section>
        <div className="flex items-center gap-3 mb-6 px-4">
          <div className="w-2.5 h-2.5 rounded-full bg-teal-custom shadow-[0_0_10px_rgba(45,212,191,0.5)]" />
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/40">All Courses</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {allCourses.map((c) => (
            <div key={c.code} className="glass bg-white/5 border border-white/10 rounded-[32px] p-6 flex gap-5 hover:bg-white/10 transition-all duration-500 shadow-xl group">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-2xl flex-shrink-0 shadow-inner transition-transform duration-500 group-hover:scale-110" style={{ backgroundColor: c.color + '20', color: c.color }}>
                {c.code.split(' ')[0][0]}
              </div>
              <div>
                <div className="text-base font-black tracking-tight text-white">{c.name}</div>
                <div className="text-xs text-white/40 font-bold mt-1 uppercase tracking-widest">{c.code} · {c.days}</div>
                <div className="text-xs text-white/30 font-bold mt-1">Time: {c.time} · Room {c.room}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
