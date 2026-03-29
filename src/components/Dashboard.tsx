import React from 'react';
import { motion } from 'motion/react';
import { Lightbulb, CheckCircle2, Droplets, TrendingUp, GraduationCap, Share2, Dumbbell, Video, Target, Wallet } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { MF_TASKS, HABITS, QUOTES, DAYS, CAT_COLORS, getDynamicSchedule } from '../constants';
import { Exam, WorkoutSession, Transaction, Account } from '../types';
import { AlertTriangle } from 'lucide-react';

interface DashboardProps {
  mfDone: number[];
  habitDone: Record<string, Record<string, boolean>>;
  waterCount: number;
  setWaterCount: (count: number) => void;
  toggleMf: (id: number) => void;
  exams: Exam[];
  workoutSessions: WorkoutSession[];
  todoDone: string[];
  transactions: Transaction[];
  accounts: Account[];
  setActivePage: (page: string) => void;
  completedTasks: Record<string, string[]>;
  toggleTask: (dateKey: string, taskId: string) => void;
}

const trendData = [
  { name: 'Mon', score: 65 },
  { name: 'Tue', score: 72 },
  { name: 'Wed', score: 68 },
  { name: 'Thu', score: 85 },
  { name: 'Fri', score: 78 },
  { name: 'Sat', score: 92 },
  { name: 'Sun', score: 88 },
];

export default function Dashboard({ mfDone, habitDone, waterCount, setWaterCount, toggleMf, exams, workoutSessions, todoDone, transactions, accounts, setActivePage, completedTasks, toggleTask }: DashboardProps) {
  const now = new Date();
  const today = DAYS[now.getDay()];
  const dateKey = now.toISOString().split('T')[0];
  const greeting = now.getHours() < 12 ? 'Good morning 👋' : now.getHours() < 17 ? 'Good afternoon ☀️' : 'Good evening 🌙';
  
  const mfC = mfDone.length;
  const mfP = Math.round((mfC / MF_TASKS.length) * 100);
  
  const hKey = dateKey;
  const hDone = Object.values(habitDone[hKey] || {}).filter(Boolean).length;
  const hP = Math.round((hDone / HABITS.length) * 100);

  const wP = Math.round((waterCount / 3) * 100);

  const todayAllBlocks = getDynamicSchedule(now);
  const todayBlocks = todayAllBlocks.slice(0, 7);
  const isExamMode = now >= new Date('2026-04-10');
  
  const dayCompleted = completedTasks[dateKey] || [];
  const productivityScore = todayAllBlocks.length > 0 ? Math.round((dayCompleted.length / todayAllBlocks.length) * 100) : 0;
  
  const trendData = React.useMemo(() => {
    return DAYS.map((day, i) => {
      const targetDate = new Date();
      const diff = i - targetDate.getDay();
      targetDate.setDate(targetDate.getDate() + diff);
      const key = targetDate.toISOString().split('T')[0];
      const dayBlocks = getDynamicSchedule(targetDate);
      const done = completedTasks[key] || [];
      const score = dayBlocks.length > 0 ? Math.round((done.length / dayBlocks.length) * 100) : 0;
      return { name: day, score };
    });
  }, [completedTasks]);

  const [quoteIndex, setQuoteIndex] = React.useState(now.getDay() % QUOTES.length);

  React.useEffect(() => {
    const quoteTimer = setInterval(() => {
      setQuoteIndex(prev => (prev + 1) % QUOTES.length);
    }, 120000); // 2 minutes
    return () => clearInterval(quoteTimer);
  }, []);

  const quote = QUOTES[quoteIndex];

  const nextExam = [...exams]
    .filter(e => new Date(e.date).getTime() > now.getTime())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

  const workoutsThisWeek = workoutSessions.filter(s => {
    const d = new Date(s.date);
    const diff = now.getTime() - d.getTime();
    return diff < 7 * 24 * 60 * 60 * 1000;
  }).length;

  const todaySpend = transactions
    .filter(t => t.type === 'expense' && new Date(t.date).toDateString() === now.toDateString())
    .reduce((sum, t) => sum + t.amount, 0);

  const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);

  const totalTodayTasks = MF_TASKS.length + HABITS.length + 3 + todayAllBlocks.length; 
  const completedTodayTasks = mfC + hDone + waterCount + dayCompleted.length;
  const completionPct = Math.round((completedTodayTasks / totalTodayTasks) * 100);

  const pieData = [
    { name: 'Completed', value: completedTodayTasks, color: '#7c6ff7' },
    { name: 'Remaining', value: Math.max(0, totalTodayTasks - completedTodayTasks), color: 'rgba(255,255,255,0.05)' },
  ];

  return (
    <div className="space-y-6 pb-12">
      <header className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-5xl font-black leading-tight tracking-tighter bg-gradient-to-br from-white via-white to-white/40 bg-clip-text text-transparent drop-shadow-sm">
            Good {greeting}, <span className="text-accent">Sazen</span>
          </h1>
          <p className="text-sm font-bold text-text-secondary mt-2 tracking-tight flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-success animate-pulse shadow-[0_0_10px_rgba(62,207,142,0.6)]" />
            Student ID: 0152330155 · UIU Spring 2026 · Session 261
          </p>
          
          {isExamMode && (
            <div className="mt-4 px-4 py-2 rounded-2xl bg-danger/20 border border-danger/30 text-danger text-[10px] font-black uppercase tracking-widest flex items-center gap-3 w-fit animate-pulse">
              <AlertTriangle size={14} />
              Exam Mode Active — Schedule Optimized
            </div>
          )}
          
          <div className="flex flex-wrap gap-2 mt-6">
            {[
              { label: 'Habits', icon: <CheckCircle2 size={14} />, page: 'habits', color: '#3ecf8e' },
              { label: 'Goals', icon: <Target size={14} />, page: 'goals', color: '#f5a623' },
              { label: 'Finance', icon: <Wallet size={14} />, page: 'finance', color: '#7c6ff7' },
              { label: 'Workout', icon: <Dumbbell size={14} />, page: 'workout', color: '#e865a0' },
              { label: 'To-Do', icon: <Lightbulb size={14} />, page: 'todos', color: '#f06a50' },
              { label: 'Shopping', icon: <Droplets size={14} />, page: 'shopping', color: '#4a9eff' },
            ].map((action) => (
              <button
                key={action.label}
                onClick={() => setActivePage(action.page)}
                className="glass bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 px-4 py-2 rounded-2xl flex items-center gap-2.5 transition-all duration-300 group active:scale-95"
              >
                <div className="group-hover:scale-110 transition-transform" style={{ color: action.color }}>
                  {action.icon}
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-white/80 group-hover:text-white transition-colors">
                  {action.label}
                </span>
              </button>
            ))}
          </div>
        </div>
        
        <div className="relative w-24 h-24 flex items-center justify-center glass rounded-full p-1 shadow-2xl shadow-accent/10 group">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-accent/20 to-teal-custom/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={35}
                outerRadius={45}
                paddingAngle={0}
                dataKey="value"
                stroke="none"
                startAngle={90}
                endAngle={-270}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-base font-black text-white tracking-tighter">{completionPct}%</span>
            <span className="text-[8px] font-black text-text-tertiary uppercase tracking-widest">Done</span>
          </div>
        </div>
      </header>

      {/* Quote Section */}
      <div className="glass bg-white/5 border border-white/10 rounded-[32px] p-6 text-center shadow-xl relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-accent/5 via-transparent to-teal-custom/5 opacity-30 group-hover:opacity-50 transition-opacity duration-1000" />
        <p className="relative z-10 text-base font-medium italic text-white/90 leading-relaxed tracking-tight max-w-2xl mx-auto">"{quote.q}"</p>
        <p className="relative z-10 text-[8px] font-black text-text-tertiary mt-3 uppercase tracking-[0.4em]">— {quote.a}</p>
      </div>

      {/* Quick Stats Grid (Next Exam & Workouts) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={`glass bg-white/5 border border-white/10 rounded-[32px] p-5 transition-all duration-500 hover:bg-white/10 ${
          nextExam && (new Date(nextExam.date).getTime() - now.getTime()) / (1000 * 60 * 60 * 24) < 3
            ? 'border-danger/40 bg-danger/5 animate-pulse-custom' 
            : ''
        }`}>
          <div className="text-[9px] font-black text-text-tertiary uppercase tracking-[0.3em] mb-3 flex items-center gap-2">
            <GraduationCap size={12} className="text-accent" />
            Next Exam
          </div>
          {nextExam ? (
            <div className="flex items-center justify-between">
              <div className="text-xl font-black text-white tracking-tighter truncate drop-shadow-sm">{nextExam.subject}</div>
              <div className={`text-[9px] font-black tracking-[0.2em] uppercase px-2.5 py-1 rounded-full ${
                (new Date(nextExam.date).getTime() - now.getTime()) / (1000 * 60 * 60 * 24) < 3 ? 'bg-danger/20 text-danger' : 'bg-white/5 text-text-tertiary'
              }`}>
                {Math.ceil((new Date(nextExam.date).getTime() - now.getTime()) / (1000 * 60 * 60 * 24))} DAYS LEFT
              </div>
            </div>
          ) : (
            <div className="text-xs text-text-tertiary font-bold">No upcoming exams</div>
          )}
        </div>
        <div className="glass bg-white/5 border border-white/10 rounded-[32px] p-5 transition-all duration-500 hover:bg-white/10">
          <div className="text-[9px] font-black text-text-tertiary uppercase tracking-[0.3em] mb-3 flex items-center gap-2">
            <Dumbbell size={12} className="text-success" />
            Workouts This Week
          </div>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-black text-white tracking-tighter">{workoutsThisWeek}<span className="text-sm text-text-tertiary">/4 Days</span></div>
            <div className="text-[9px] text-text-tertiary font-black uppercase tracking-[0.2em] bg-white/5 px-2.5 py-1 rounded-full">Active Week</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard 
          label="MINDFUEL TASKS" 
          value={`${mfC}/${MF_TASKS.length}`} 
          sub={`${mfC} completed so far`} 
          progress={mfP} 
          color="#7c6ff7" 
          icon={<Lightbulb size={14} />}
        />
        <StatCard 
          label="HABITS TODAY" 
          value={`${hDone}/${HABITS.length}`} 
          sub="Track in Habits page" 
          progress={hP} 
          color="#3ecf8e" 
          icon={<CheckCircle2 size={14} />}
        />
        <div className="glass bg-white/5 border border-white/10 rounded-[32px] p-6 relative overflow-hidden group">
          <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity bg-blue-custom" />
          <div className="text-[9px] text-text-tertiary font-black tracking-[0.3em] uppercase flex items-center gap-2">
            <Droplets size={12} className="text-blue-custom" />
            WATER INTAKE
          </div>
          <div className="text-3xl font-black mt-2 text-white tracking-tighter">
            {waterCount}<span className="text-lg text-text-tertiary">/3</span>
          </div>
          <div className="flex gap-1.5 mt-4">
            {[...Array(3)].map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setWaterCount(i + 1 === waterCount ? i : i + 1);
                }}
                className={`w-5 h-5 rounded-full border transition-all duration-700 active:scale-75 ${
                  i < waterCount 
                    ? 'bg-blue-custom border-blue-custom shadow-[0_0_10px_rgba(74,158,255,0.7)] scale-110' 
                    : 'border-white/10 hover:border-blue-custom/50 bg-white/5'
                }`}
              />
            ))}
          </div>
          <div className="text-[9px] text-text-secondary mt-3 font-bold tracking-tight flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-custom" />
            Goal: 3 glasses (1.5L)
          </div>
        </div>

        <div className="glass bg-white/5 border border-white/10 rounded-[32px] p-6 relative overflow-hidden group col-span-1 md:col-span-3 shadow-xl">
          <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full blur-[120px] opacity-10 group-hover:opacity-20 transition-opacity duration-1000 bg-accent" />
          
          <div className="text-[9px] text-text-tertiary font-black tracking-[0.3em] uppercase flex items-center gap-2">
            <Wallet size={12} className="text-accent" />
            FINANCE SUMMARY
          </div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mt-3 gap-4">
            <div>
              <div className="text-4xl font-black text-white tracking-tighter drop-shadow-xl">৳{totalBalance.toLocaleString()}</div>
              <div className="text-[8px] text-text-tertiary font-black uppercase tracking-[0.2em] mt-0.5">Net Balance</div>
            </div>
            <div className="flex gap-6">
              <div className="text-right">
                <div className="text-xl font-black text-danger tracking-tighter">৳{todaySpend.toLocaleString()}</div>
                <div className="text-[8px] text-text-tertiary font-black uppercase tracking-[0.2em] mt-0.5">Spent Today</div>
              </div>
              <div className="text-right">
                <div className="text-xl font-black text-success tracking-tighter">৳{(totalBalance * 0.1).toLocaleString()}</div>
                <div className="text-[8px] text-text-tertiary font-black uppercase tracking-[0.2em] mt-0.5">Savings Growth</div>
              </div>
            </div>
          </div>
          <div className="mt-6 h-2 w-full bg-white/5 rounded-full overflow-hidden p-[1px] border border-white/5">
            <div className="h-full bg-gradient-to-r from-accent to-danger transition-all duration-1000 rounded-full shadow-[0_0_8px_rgba(124,111,247,0.4)]" style={{ width: `${Math.min((todaySpend / 1000) * 100, 100)}%` }} />
          </div>
          <div className="flex justify-between mt-2">
            <div className="text-[9px] text-text-secondary font-bold tracking-tight">Daily Limit: ৳1,000</div>
            <div className="text-[9px] text-text-secondary font-bold tracking-tight bg-white/5 px-2 py-0.5 rounded-full border border-white/5">{Math.round((todaySpend / 1000) * 100)}% Used</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          <section className="glass bg-white/5 border border-white/10 rounded-[40px] p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <SectionTitle color="#a89af9" title="Today's Quick View" />
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-accent uppercase tracking-widest">{productivityScore}% Score</span>
                <div className="w-12 h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-accent" style={{ width: `${productivityScore}%` }} />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              {todayBlocks.map((b, i) => {
                const isDone = dayCompleted.includes(b.id);
                return (
                  <div 
                    key={i} 
                    onClick={() => toggleTask(dateKey, b.id)}
                    className={`flex items-center gap-4 p-3 rounded-2xl hover:bg-white/5 transition-all duration-300 group border border-transparent hover:border-white/5 cursor-pointer ${isDone ? 'opacity-50' : ''}`}
                  >
                    <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 shadow-lg ${isDone ? 'bg-accent' : ''}`} style={{ backgroundColor: isDone ? undefined : CAT_COLORS[b.cat].dot, boxShadow: isDone ? `0 0 10px #f27d26` : `0 0 10px ${CAT_COLORS[b.cat].dot}60` }} />
                    <div className="text-[9px] text-white font-black min-w-[80px] bg-white/10 px-2 py-1 rounded-lg border border-white/10 tracking-[0.1em] uppercase text-center">{b.t}</div>
                    <div className={`text-sm font-bold text-white tracking-tight truncate group-hover:translate-x-1 transition-transform duration-300 ${isDone ? 'line-through text-white/40' : ''}`}>{b.title}</div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        <section className="space-y-8">
          <div className="glass bg-white/5 border border-white/10 rounded-[40px] p-8 shadow-xl">
            <SectionTitle color="#3ecf8e" title="Achievement Trend" />
            <div className="h-[240px] w-full mt-8">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <defs>
                    <linearGradient id="lineGradient" x1="0" y1="0" x2="100%" y2="0">
                      <stop offset="0%" stopColor="#3ecf8e" />
                      <stop offset="100%" stopColor="#2dd4bf" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 800 }} 
                    dy={10}
                  />
                  <YAxis hide domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', fontSize: '12px' }}
                    itemStyle={{ color: '#3ecf8e', fontWeight: 800 }}
                    cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="url(#lineGradient)" 
                    strokeWidth={5} 
                    dot={{ fill: '#3ecf8e', r: 6, strokeWidth: 0 }}
                    activeDot={{ r: 10, strokeWidth: 4, stroke: 'rgba(62,207,142,0.2)', fill: '#fff' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center gap-3 mt-8 text-[11px] text-success font-black uppercase tracking-[0.2em] bg-success/5 w-fit px-4 py-2 rounded-full border border-success/10">
              <TrendingUp size={14} />
              <span>+12% improvement from last week</span>
            </div>
          </div>

          <div className="glass bg-white/5 border border-white/10 rounded-[40px] p-8 shadow-xl">
            <SectionTitle color="#f06a50" title="Mindfuel Top Tasks" />
            <div className="space-y-4 mt-6">
              {MF_TASKS.slice(0, 4).map((t) => (
                <TaskItem key={t.id} task={t} done={mfDone.includes(t.id)} toggle={() => toggleMf(t.id)} />
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function StatCard({ label, value, sub, progress, color, icon }: any) {
  return (
    <div className="glass bg-white/5 border border-white/10 rounded-[24px] p-4 relative overflow-hidden group transition-all duration-500 hover:bg-white/10 hover:border-white/20 shadow-xl">
      <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full blur-[80px] opacity-10 group-hover:opacity-20 transition-opacity duration-700" style={{ backgroundColor: color }} />
      <div className="text-[8px] text-text-tertiary font-black tracking-[0.3em] uppercase flex items-center gap-2">
        <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform duration-500" style={{ color }}>
          {icon}
        </div>
        {label}
      </div>
      <div className="text-3xl font-black mt-3 tracking-tighter drop-shadow-sm" style={{ color }}>{value}</div>
      <div className="h-1.5 bg-white/5 rounded-full mt-4 overflow-hidden p-[1px] border border-white/5">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="h-full rounded-full shadow-[0_0_8px_rgba(255,255,255,0.2)]" 
          style={{ backgroundColor: color }} 
        />
      </div>
      <div className="text-[9px] text-text-secondary mt-3 font-bold tracking-tight flex items-center gap-2">
        <div className="w-1 h-1 rounded-full" style={{ backgroundColor: color }} />
        {sub}
      </div>
    </div>
  );
}

function SectionTitle({ color, title }: { color: string; title: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-3.5 h-3.5 rounded-full shadow-lg animate-pulse" style={{ backgroundColor: color, boxShadow: `0 0 15px ${color}80` }} />
      <h3 className="text-xs font-black text-white uppercase tracking-[0.3em]">{title}</h3>
    </div>
  );
}

const TaskItem: React.FC<{ task: any; done: boolean; toggle: () => void }> = ({ task, done, toggle }) => {
  return (
    <div 
      onClick={toggle}
      className={`flex items-center gap-5 p-5 rounded-[32px] border transition-all duration-500 cursor-pointer select-none group ${
        done ? 'bg-white/5 border-white/5 opacity-50' : 'bg-white/5 border border-white/10 hover:border-white/30 hover:bg-white/10 shadow-lg'
      }`}
    >
      <div className={`w-7 h-7 rounded-[12px] border-2 flex items-center justify-center transition-all duration-500 ${
        done ? 'bg-success border-success shadow-lg shadow-success/30 scale-90' : 'border-white/20 bg-white/5 group-hover:border-white/40'
      }`}>
        {done && <svg width="14" height="14" viewBox="0 0 10 10" className="animate-in zoom-in duration-300"><path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>}
      </div>
      <div className={`text-base font-bold flex-1 tracking-tight transition-all duration-300 ${done ? 'line-through text-text-tertiary' : 'text-white'}`}>{task.title}</div>
      <div className="text-[10px] text-text-tertiary font-black uppercase tracking-widest bg-white/5 px-3 py-1 rounded-lg border border-white/5">{task.cat}</div>
    </div>
  );
};
