import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

interface ClassScheduleProps {
  schedule: Record<string, any[]>;
  setSchedule: (s: Record<string, any[]>) => void;
}

export default function ClassSchedule({ schedule, setSchedule }: ClassScheduleProps) {
  const [activeDay, setActiveDay] = useState('Sun');
  const [isAdding, setIsAdding] = useState(false);
  const [newClass, setNewClass] = useState({
    code: '',
    name: '',
    start: '',
    end: '',
    room: '',
    section: '',
    color: '#7c6ff7'
  });

  const classes = schedule[activeDay] || [];

  const handleAdd = () => {
    if (newClass.code && newClass.name && newClass.start && newClass.end) {
      const updated = { ...schedule };
      if (!updated[activeDay]) updated[activeDay] = [];
      updated[activeDay] = [...updated[activeDay], newClass];
      setSchedule(updated);
      setNewClass({
        code: '',
        name: '',
        start: '',
        end: '',
        room: '',
        section: '',
        color: '#7c6ff7'
      });
      setIsAdding(false);
    }
  };

  const removeClass = (index: number) => {
    const updated = { ...schedule };
    updated[activeDay] = updated[activeDay].filter((_, i) => i !== index);
    setSchedule(updated);
  };

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold leading-tight">Class Schedule</h1>
          <p className="text-sm text-text-secondary mt-1">UIU · Spring 2026 · Student ID: 0152330155</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="glass bg-accent/20 border border-accent/30 text-white px-4 py-2 rounded-2xl flex items-center gap-2 text-xs font-black uppercase tracking-widest hover:bg-accent/30 transition-all"
        >
          <Plus size={14} />
          {isAdding ? 'Cancel' : 'Add Class'}
        </button>
      </header>

      {isAdding && (
        <div className="glass bg-white/5 border border-white/10 rounded-[32px] p-6 animate-in slide-in-from-top-4 duration-500 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input 
              type="text" 
              placeholder="Course Code (e.g. ACT 2111)"
              value={newClass.code}
              onChange={e => setNewClass(prev => ({ ...prev, code: e.target.value }))}
              className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white focus:border-accent/50 transition-all"
            />
            <input 
              type="text" 
              placeholder="Course Name"
              value={newClass.name}
              onChange={e => setNewClass(prev => ({ ...prev, name: e.target.value }))}
              className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white focus:border-accent/50 transition-all"
            />
            <input 
              type="text" 
              placeholder="Start Time (e.g. 09:51 AM)"
              value={newClass.start}
              onChange={e => setNewClass(prev => ({ ...prev, start: e.target.value }))}
              className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white focus:border-accent/50 transition-all"
            />
            <input 
              type="text" 
              placeholder="End Time (e.g. 11:10 AM)"
              value={newClass.end}
              onChange={e => setNewClass(prev => ({ ...prev, end: e.target.value }))}
              className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white focus:border-accent/50 transition-all"
            />
            <input 
              type="text" 
              placeholder="Room"
              value={newClass.room}
              onChange={e => setNewClass(prev => ({ ...prev, room: e.target.value }))}
              className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white focus:border-accent/50 transition-all"
            />
            <input 
              type="text" 
              placeholder="Section"
              value={newClass.section}
              onChange={e => setNewClass(prev => ({ ...prev, section: e.target.value }))}
              className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white focus:border-accent/50 transition-all"
            />
          </div>
          <button 
            onClick={handleAdd}
            className="w-full bg-accent text-white font-black uppercase tracking-[0.2em] py-4 rounded-2xl shadow-lg shadow-accent/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            Save Class
          </button>
        </div>
      )}

      <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
          <button
            key={d}
            onClick={() => setActiveDay(d)}
            className={`px-6 py-2.5 rounded-full text-xs font-black transition-all duration-300 border tracking-widest uppercase flex-shrink-0 ${
              activeDay === d 
                ? 'bg-accent border-accent text-white shadow-lg shadow-accent/30 scale-105' 
                : 'glass bg-white/5 border-white/10 text-white/40 hover:border-white/30 hover:text-white/60'
            }`}
          >
            {d === 'Sun' ? 'Sunday' : d === 'Mon' ? 'Monday' : d === 'Tue' ? 'Tuesday' : d === 'Wed' ? 'Wednesday' : d === 'Thu' ? 'Thursday' : d === 'Fri' ? 'Friday' : 'Saturday'}
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
            <button 
              onClick={() => removeClass(i)}
              className="p-2 rounded-lg text-white/0 group-hover:text-danger/40 hover:text-danger hover:bg-danger/10 transition-all"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )) : (
          <div className="glass bg-white/5 border border-white/10 rounded-[40px] text-white/20 text-center py-20 font-black uppercase tracking-[0.3em] italic">No classes scheduled for this day.</div>
        )}
      </div>
    </div>
  );
}
