import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

interface MindfuelWorkProps {
  title: string;
  tasks: any[];
  doneIds: number[];
  toggleTask: (id: number) => void;
  addTask: (task: { title: string; cat: string }) => void;
  removeTask: (id: number) => void;
}

export default function MindfuelWork({ title, tasks, doneIds, toggleTask, addTask, removeTask }: MindfuelWorkProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', cat: '' });

  const doneCount = doneIds.length;
  const totalCount = tasks.length;
  const pct = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  const handleAdd = () => {
    if (newTask.title && newTask.cat) {
      addTask(newTask);
      setNewTask({ title: '', cat: '' });
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold leading-tight">{title}</h1>
          <p className="text-sm text-text-secondary mt-1">Evening work sessions · 5:00 PM – 9:00 PM</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="glass bg-accent/20 border border-accent/30 text-white px-4 py-2 rounded-2xl flex items-center gap-2 text-xs font-black uppercase tracking-widest hover:bg-accent/30 transition-all"
        >
          <Plus size={14} />
          {isAdding ? 'Cancel' : 'Add Task'}
        </button>
      </header>

      {isAdding && (
        <div className="glass bg-white/5 border border-white/10 rounded-[32px] p-6 animate-in slide-in-from-top-4 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-text-tertiary uppercase tracking-widest ml-2">Task Title</label>
              <input 
                type="text" 
                value={newTask.title}
                onChange={e => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                placeholder="What needs to be done?"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-accent/50 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-text-tertiary uppercase tracking-widest ml-2">Category</label>
              <input 
                type="text" 
                value={newTask.cat}
                onChange={e => setNewTask(prev => ({ ...prev, cat: e.target.value }))}
                placeholder="e.g. Marketing, Creative"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-accent/50 transition-all"
              />
            </div>
          </div>
          <button 
            onClick={handleAdd}
            className="w-full mt-6 bg-accent text-white font-black uppercase tracking-[0.2em] py-4 rounded-2xl shadow-lg shadow-accent/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            Save Task
          </button>
        </div>
      )}

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
          <div className="text-4xl font-black mt-2 text-danger tracking-tighter">{Math.max(0, totalCount - doneCount)}</div>
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
          {tasks.map((t) => (
            <div 
              key={t.id}
              className={`flex items-center gap-4 p-4 rounded-[24px] border transition-all duration-300 group ${
                doneIds.includes(t.id) 
                  ? 'bg-white/5 border-white/5 opacity-40' 
                  : 'glass bg-white/5 border border-white/10 hover:border-white/30 hover:bg-white/10 shadow-lg'
              }`}
            >
              <div 
                onClick={() => toggleTask(t.id)}
                className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300 cursor-pointer ${
                  doneIds.includes(t.id) ? 'bg-success border-success scale-90' : 'border-white/20 group-hover:border-white/40'
                }`}
              >
                {doneIds.includes(t.id) && <svg width="12" height="12" viewBox="0 0 10 10" className="animate-in zoom-in duration-300"><path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              </div>
              <div 
                onClick={() => toggleTask(t.id)}
                className={`text-base font-bold tracking-tight flex-1 cursor-pointer ${doneIds.includes(t.id) ? 'line-through text-text-tertiary' : 'text-text-primary'}`}
              >
                {t.title}
              </div>
              <div className="flex items-center gap-3">
                <div className="text-[10px] font-black uppercase tracking-widest text-text-tertiary group-hover:text-text-secondary transition-colors">{t.cat}</div>
                <button 
                  onClick={() => removeTask(t.id)}
                  className="p-2 rounded-lg text-white/0 group-hover:text-danger/40 hover:text-danger hover:bg-danger/10 transition-all"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
