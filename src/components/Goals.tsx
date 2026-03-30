import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Goal } from '../types';

const overallTrend = [
  { name: 'Week 1', score: 10 },
  { name: 'Week 2', score: 15 },
  { name: 'Week 3', score: 22 },
  { name: 'Week 4', score: 28 },
  { name: 'Week 5', score: 35 },
  { name: 'Week 6', score: 42 },
];

const categoryTrends: Record<string, any[]> = {
  academic: [
    { name: 'W1', val: 5 }, { name: 'W2', val: 8 }, { name: 'W3', val: 12 }, { name: 'W4', val: 15 }, { name: 'W5', val: 18 }, { name: 'W6', val: 20 }
  ],
  health: [
    { name: 'W1', val: 20 }, { name: 'W2', val: 25 }, { name: 'W3', val: 30 }, { name: 'W4', val: 35 }, { name: 'W5', val: 40 }, { name: 'W6', val: 45 }
  ],
  content: [
    { name: 'W1', val: 2 }, { name: 'W2', val: 4 }, { name: 'W3', val: 5 }, { name: 'W4', val: 8 }, { name: 'W5', val: 10 }, { name: 'W6', val: 12 }
  ],
};

interface GoalsProps {
  goals: Goal[];
  addGoal: (goal: Omit<Goal, 'id'>) => void;
  removeGoal: (id: string) => void;
  updateGoalPct: (id: string, pct: number) => void;
}

export default function Goals({ goals, addGoal, removeGoal, updateGoalPct }: GoalsProps) {
  const [showAdd, setShowAdd] = useState(false);
  const [newGoal, setNewGoal] = useState<Omit<Goal, 'id'>>({
    name: '',
    icon: '🎯',
    target: '',
    pct: 0,
    category: 'academic'
  });

  const categories = ['academic', 'health', 'content'] as const;

  const overallPct = Math.round(goals.reduce((acc, g) => acc + g.pct, 0) / (goals.length || 1));

  return (
    <div className="space-y-10">
      <header className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-4xl font-black leading-tight tracking-tighter bg-gradient-to-br from-text-primary via-text-primary to-text-primary/40 bg-clip-text text-transparent drop-shadow-sm">
            Goals & Progress
          </h1>
          <p className="text-sm font-bold text-text-secondary mt-2 tracking-tight flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            Spring 2026 targets · Achievement tracking
          </p>
        </div>
        <div className="flex items-center gap-8">
          <button
            onClick={() => setShowAdd(true)}
            className="glass bg-accent hover:bg-accent-light text-white px-8 py-4 rounded-[24px] font-black transition-all duration-300 shadow-lg shadow-accent/30 active:scale-95 flex items-center gap-3"
          >
            <Plus size={20} />
            <span className="tracking-tight uppercase text-xs">Add Goal</span>
          </button>
          <div className="text-right glass bg-white/5 px-6 py-3 rounded-[24px] border border-white/10 shadow-xl">
            <div className="text-[10px] text-text-tertiary font-black uppercase tracking-[0.3em] mb-1">Overall Completion</div>
            <div className="text-3xl font-black text-accent drop-shadow-sm tracking-tighter">{overallPct}%</div>
          </div>
        </div>
      </header>

      {showAdd && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xl z-[100] flex items-center justify-center p-4">
          <div className="glass bg-white/10 border border-white/20 rounded-[40px] p-8 w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-300">
            <h2 className="text-2xl font-black mb-6 tracking-tight">Set New Goal</h2>
            <div className="space-y-6">
              <div>
                <label className="text-[11px] font-black text-white/40 uppercase mb-2 block tracking-widest">Goal Name</label>
                <input
                  type="text"
                  value={newGoal.name}
                  onChange={e => setNewGoal({ ...newGoal, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-sm focus:border-accent outline-none transition-all focus:bg-white/10"
                  placeholder="e.g. Master React"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-black text-white/40 uppercase mb-2 block tracking-widest">Category</label>
                  <select
                    value={newGoal.category}
                    onChange={e => setNewGoal({ ...newGoal, category: e.target.value as any })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-sm focus:border-accent outline-none transition-all focus:bg-white/10 appearance-none"
                  >
                    <option value="academic">Academic</option>
                    <option value="health">Health</option>
                    <option value="content">Content</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-black text-white/40 uppercase mb-2 block tracking-widest">Icon</label>
                  <input
                    type="text"
                    value={newGoal.icon}
                    onChange={e => setNewGoal({ ...newGoal, icon: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-sm focus:border-accent outline-none transition-all focus:bg-white/10"
                  />
                </div>
              </div>
              <div>
                <label className="text-[11px] font-black text-white/40 uppercase mb-2 block tracking-widest">Target Description</label>
                <input
                  type="text"
                  value={newGoal.target}
                  onChange={e => setNewGoal({ ...newGoal, target: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-sm focus:border-accent outline-none transition-all focus:bg-white/10"
                  placeholder="e.g. Complete 5 courses"
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
                    if (newGoal.name) {
                      addGoal(newGoal);
                      setShowAdd(false);
                      setNewGoal({ name: '', icon: '🎯', target: '', pct: 0, category: 'academic' });
                      toast.success(`Goal "${newGoal.name}" added!`);
                    }
                  }}
                  className="flex-1 bg-accent text-white px-4 py-4 rounded-2xl font-bold hover:bg-accent-light transition-all shadow-lg shadow-accent/20"
                >
                  Save Goal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <section className="glass bg-white/5 border border-white/10 rounded-[40px] p-8 shadow-2xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-lg font-black uppercase tracking-widest">Overall Achievement Trend</h3>
            <p className="text-xs text-white/40 mt-1 font-medium">Progress across all categories over the last 6 weeks</p>
          </div>
          <div className="flex items-center gap-2 text-success font-black text-sm bg-success/10 px-4 py-2 rounded-full border border-success/20">
            <TrendingUp size={16} />
            <span>+8% this week</span>
          </div>
        </div>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={overallTrend}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-accent)" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="var(--color-accent)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 900, letterSpacing: '0.1em' }} 
              />
              <YAxis hide domain={[0, 100]} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(21,22,25,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', backdropFilter: 'blur(10px)', fontSize: '12px' }}
                itemStyle={{ color: 'var(--color-accent)', fontWeight: 900 }}
              />
              <Area 
                type="monotone" 
                dataKey="score" 
                stroke="var(--color-accent)" 
                strokeWidth={4} 
                fillOpacity={1} 
                fill="url(#colorScore)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {categories.map(cat => (
          <section key={cat} className="space-y-8">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full shadow-[0_0_10px_currentColor] ${cat === 'academic' ? 'text-accent bg-accent' : cat === 'health' ? 'text-success bg-success' : 'text-warning bg-warning'}`} />
                <h3 className="text-sm font-black uppercase tracking-[0.2em]">{cat}</h3>
              </div>
              <div className="h-[40px] w-[100px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={categoryTrends[cat]}>
                    <Line 
                      type="monotone" 
                      dataKey="val" 
                      stroke={cat === 'academic' ? 'var(--color-accent)' : cat === 'health' ? 'var(--color-success)' : 'var(--color-warning)'} 
                      strokeWidth={3} 
                      dot={false} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="space-y-5">
              {goals.filter(g => g.category === cat).map((g) => (
                <div key={g.id} className="glass bg-white/5 border border-white/10 rounded-[32px] p-6 group relative transition-all duration-700 hover:bg-white/10 hover:border-white/20 shadow-xl overflow-hidden">
                  <div className="absolute -top-16 -right-16 w-32 h-32 bg-white/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  
                  <div className="flex items-center gap-5 relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-3xl flex-shrink-0 border border-white/10 group-hover:scale-110 group-hover:rotate-6 transition-all duration-700">
                      {g.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-base font-black truncate tracking-tight text-white drop-shadow-sm">{g.name}</div>
                      <div className="text-[10px] text-text-tertiary mt-1.5 truncate font-black uppercase tracking-[0.2em] bg-white/5 px-3 py-1 rounded-full border border-white/5 w-fit">{g.target}</div>
                    </div>
                    <div className="text-xl font-black text-accent tracking-tighter drop-shadow-sm">{g.pct}%</div>
                  </div>
                  <div className="h-2.5 bg-white/5 rounded-full mt-6 overflow-hidden relative border border-white/5 p-[1px]">
                    <div className="h-full bg-gradient-to-r from-accent/60 to-accent rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(124,111,247,0.5)]" style={{ width: `${g.pct}%` }} />
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={g.pct}
                      onChange={e => updateGoalPct(g.id, parseInt(e.target.value))}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                  <button
                    onClick={() => removeGoal(g.id)}
                    className="absolute top-4 right-4 p-2.5 text-white/10 hover:text-danger opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-xl hover:bg-danger/10 hover:scale-110"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
