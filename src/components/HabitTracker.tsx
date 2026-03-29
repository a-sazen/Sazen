import { useState } from 'react';
import { Plus, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { Habit } from '../types';

interface HabitTrackerProps {
  habits: Habit[];
  habitDone: Record<string, Record<string, boolean>>;
  toggleHabit: (habitName: string, date: string) => void;
  addHabit: (habit: Habit) => void;
  removeHabit: (habitName: string) => void;
}

export default function HabitTracker({ habits, habitDone, toggleHabit, addHabit, removeHabit }: HabitTrackerProps) {
  const [showAdd, setShowAdd] = useState(false);
  const [newHabit, setNewHabit] = useState<Habit>({ name: '', icon: '✨', target: 7 });

  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  
  const dates: Date[] = [];
  for (let i = 1; i <= daysInMonth; i++) {
    dates.push(new Date(currentYear, currentMonth, i));
  }

  const formatDate = (d: Date) => d.toISOString().split('T')[0];

  const calcStreak = (habitName: string) => {
    let streak = 0;
    const checkDate = new Date();
    while (streak < 365) { // Safety break
      const dateStr = formatDate(checkDate);
      if (habitDone[dateStr] && habitDone[dateStr][habitName]) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  };

  const getMonthlyStats = (habitName: string) => {
    const completed = dates.filter(d => habitDone[formatDate(d)]?.[habitName]).length;
    const percent = Math.round((completed / daysInMonth) * 100);
    return { completed, percent };
  };

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-5xl font-black leading-tight tracking-tighter bg-gradient-to-br from-white via-white to-white/40 bg-clip-text text-transparent drop-shadow-sm">
            Habit Tracker
          </h1>
          <p className="text-sm font-bold text-text-secondary mt-2 tracking-tight flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            Consistency is key · Monthly progress
          </p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="glass bg-accent hover:bg-accent-light text-white px-8 py-4 rounded-[24px] font-black transition-all duration-300 shadow-lg shadow-accent/30 active:scale-95 flex items-center gap-3"
        >
          <Plus size={20} />
          <span className="tracking-tight uppercase text-xs">Add Habit</span>
        </button>
      </header>

      {showAdd && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xl z-[100] flex items-center justify-center p-4">
          <div className="glass bg-white/10 border border-white/20 rounded-[40px] p-8 w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-300">
            <h2 className="text-2xl font-black mb-6 tracking-tight">Add New Habit</h2>
            <div className="space-y-6">
              <div>
                <label className="text-[11px] font-black text-white/40 uppercase mb-2 block tracking-widest">Habit Name</label>
                <input
                  type="text"
                  value={newHabit.name}
                  onChange={e => setNewHabit({ ...newHabit, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-sm focus:border-accent outline-none transition-all focus:bg-white/10"
                  placeholder="e.g. Read 10 pages"
                />
              </div>
              <div>
                <label className="text-[11px] font-black text-white/40 uppercase mb-2 block tracking-widest">Icon (Emoji)</label>
                <input
                  type="text"
                  value={newHabit.icon}
                  onChange={e => setNewHabit({ ...newHabit, icon: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-sm focus:border-accent outline-none transition-all focus:bg-white/10"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowAdd(false)}
                  className="flex-1 px-4 py-4 rounded-2xl font-bold text-white/60 hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (newHabit.name) {
                      addHabit(newHabit);
                      setShowAdd(false);
                      setNewHabit({ name: '', icon: '✨', target: 7 });
                      toast.success(`Habit "${newHabit.name}" added!`);
                    }
                  }}
                  className="flex-1 bg-accent text-white px-4 py-4 rounded-2xl font-bold hover:bg-accent-light transition-all shadow-lg shadow-accent/20"
                >
                  Save Habit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {habits.map((h) => (
          <div key={h.name} className="glass bg-white/5 border border-white/10 rounded-[40px] p-10 group transition-all duration-700 hover:bg-white/10 hover:border-white/20 shadow-xl relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-accent/10 blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            
            <div className="flex items-center justify-between mb-10 relative z-10">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center text-5xl border border-white/10 shadow-inner group-hover:scale-110 group-hover:rotate-3 transition-all duration-700">
                  {h.icon}
                </div>
                <div>
                  <h3 className="text-3xl font-black leading-tight tracking-tighter text-white drop-shadow-sm">{h.name}</h3>
                  <div className="flex items-center gap-6 mt-3">
                    <div className="text-[10px] text-warning font-black uppercase tracking-[0.3em] flex items-center gap-2 bg-warning/5 px-3 py-1.5 rounded-full border border-warning/10">
                      <span className="w-2 h-2 rounded-full bg-warning animate-pulse" />
                      {calcStreak(h.name)} DAY STREAK
                    </div>
                    <div className="text-[10px] text-accent font-black uppercase tracking-[0.3em] flex items-center gap-2 bg-accent/5 px-3 py-1.5 rounded-full border border-accent/10">
                      <span className="w-2 h-2 rounded-full bg-accent" />
                      {getMonthlyStats(h.name).percent}% THIS MONTH
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => toggleHabit(h.name, formatDate(today))}
                  className={`px-8 py-3.5 rounded-[24px] text-xs font-black transition-all duration-500 border uppercase tracking-[0.2em] shadow-xl active:scale-95 ${
                    habitDone[formatDate(today)]?.[h.name]
                      ? 'bg-success text-white border-success shadow-success/30'
                      : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10 hover:border-white/30'
                  }`}
                >
                  {habitDone[formatDate(today)]?.[h.name] ? 'Completed' : 'Mark Done'}
                </button>
                <button
                  onClick={() => removeHabit(h.name)}
                  className="p-3.5 rounded-2xl text-white/20 hover:text-danger hover:bg-danger/10 transition-all duration-300 hover:scale-110"
                >
                  <Trash2 size={22} />
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-6 relative z-10">
              <div className="flex justify-between items-end text-[11px] font-black text-text-tertiary uppercase tracking-[0.3em] mb-2">
                <span className="bg-white/5 px-4 py-1.5 rounded-full border border-white/5">{today.toLocaleDateString([], { month: 'long', year: 'numeric' })}</span>
                <div className="flex items-center gap-8">
                  <span className="bg-white/5 px-4 py-1.5 rounded-full border border-white/5">{getMonthlyStats(h.name).completed} / {daysInMonth} Days</span>
                  <span className="text-white/80 bg-success/10 px-4 py-1.5 rounded-full border border-success/20">{getMonthlyStats(h.name).percent}%</span>
                </div>
              </div>
              
              <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden mb-6 p-[2px] border border-white/5">
                <div 
                  className="h-full bg-gradient-to-r from-success/60 to-success transition-all duration-1000 ease-out rounded-full shadow-[0_0_20px_rgba(62,207,142,0.5)]" 
                  style={{ width: `${getMonthlyStats(h.name).percent}%` }}
                />
              </div>

              <div className="grid grid-cols-7 sm:grid-cols-10 md:grid-cols-15 lg:grid-cols-31 gap-3">
                {dates.map((date, i) => {
                  const dateStr = formatDate(date);
                  const isDone = habitDone[dateStr]?.[h.name];
                  const isToday = dateStr === formatDate(today);
                  
                  return (
                    <button
                      key={dateStr}
                      onClick={() => toggleHabit(h.name, dateStr)}
                      title={`${date.toLocaleDateString()}: ${isDone ? 'Done' : 'Not Done'}`}
                      className={`w-5 h-5 rounded-[6px] transition-all duration-500 relative ${
                        isDone 
                          ? 'bg-success shadow-[0_0_15px_rgba(62,207,142,0.6)] scale-125 z-10' 
                          : 'bg-white/5 border border-white/10 hover:border-white/40 hover:bg-white/10 hover:scale-110'
                      } ${isToday ? 'ring-2 ring-accent ring-offset-4 ring-offset-transparent' : ''}`}
                    >
                      {isToday && <div className="absolute -top-1.5 -right-1.5 w-2.5 h-2.5 bg-accent rounded-full border-2 border-bg shadow-lg" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ))}

        {habits.length === 0 && (
          <div className="py-24 text-center glass bg-white/5 border border-white/10 border-dashed rounded-[40px]">
            <p className="text-white/30 font-black uppercase tracking-widest">No habits tracked yet. Start small!</p>
          </div>
        )}
      </div>
    </div>
  );
}
