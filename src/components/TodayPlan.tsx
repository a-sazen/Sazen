import { useState, useEffect } from 'react';
import { DAYS, FULL_DAYS, CAT_COLORS, getDynamicSchedule } from '../constants';
import { CheckCircle2, Circle, AlertTriangle, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TodayPlanProps {
  completedTasks: Record<string, string[]>;
  toggleTask: (dateKey: string, taskId: string) => void;
}

export default function TodayPlan({ completedTasks, toggleTask }: TodayPlanProps) {
  const [selectedDayIndex, setSelectedDayIndex] = useState(new Date().getDay());

  const getTargetDate = (dayIndex: number) => {
    const today = new Date();
    const diff = dayIndex - today.getDay();
    const target = new Date(today);
    target.setDate(today.getDate() + diff);
    return target;
  };

  const selectedDate = getTargetDate(selectedDayIndex);
  const dateKey = selectedDate.toISOString().split('T')[0];
  const blocks = getDynamicSchedule(selectedDate);
  const isExamMode = selectedDate >= new Date('2026-04-10');
  
  const dayCompleted = completedTasks[dateKey] || [];
  const productivityScore = blocks.length > 0 ? Math.round((dayCompleted.length / blocks.length) * 100) : 0;

  const now = new Date();
  const nowMin = now.getHours() * 60 + now.getMinutes();

  return (
    <div className="space-y-10 pb-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-black leading-tight tracking-tighter bg-gradient-to-br from-white to-white/60 bg-clip-text text-transparent">
              Daily Schedule
            </h1>
            {isExamMode && (
              <div className="px-3 py-1 rounded-full bg-danger/20 border border-danger/30 text-danger text-[10px] font-black uppercase tracking-widest flex items-center gap-2 animate-pulse">
                <AlertTriangle size={12} />
                Exam Mode Active
              </div>
            )}
          </div>
          <p className="text-sm font-bold text-text-secondary tracking-tight">
            {FULL_DAYS[selectedDayIndex]} — {selectedDate.toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div className="glass bg-white/5 border border-white/10 rounded-3xl p-4 flex items-center gap-6">
          <div className="flex flex-col items-center">
            <div className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Productivity</div>
            <div className="text-2xl font-black text-accent">{productivityScore}%</div>
          </div>
          <div className="w-px h-10 bg-white/10" />
          <div className="flex flex-col items-center">
            <div className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Tasks</div>
            <div className="text-2xl font-black text-white">{dayCompleted.length}/{blocks.length}</div>
          </div>
        </div>
      </header>

      <div className="flex flex-wrap gap-2 p-2 glass rounded-[24px] bg-white/5 w-fit border border-white/10">
        {DAYS.map((d, i) => {
          const isToday = i === new Date().getDay();
          const isActive = i === selectedDayIndex;
          return (
            <button
              key={d}
              onClick={() => setSelectedDayIndex(i)}
              className={`px-5 py-2 rounded-2xl text-[10px] font-black transition-all duration-300 tracking-widest uppercase ${
                isActive 
                  ? 'bg-accent text-white shadow-lg shadow-accent/20 scale-105' 
                  : 'text-text-secondary hover:bg-white/5 hover:text-white'
              }`}
            >
              {d}{isToday && ' · today'}
            </button>
          );
        })}
      </div>

      <div className="relative pl-10">
        <div className="absolute left-[9px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-accent/40 via-white/10 to-transparent rounded-full" />
        
        <div className="space-y-6">
          <AnimatePresence mode="popLayout">
            {blocks.map((b, i) => {
              const colors = CAT_COLORS[b.cat] || CAT_COLORS.personal;
              const startStr = b.t.split('–')[0];
              const [sh, sm] = startStr.split(':').map(x => parseInt(x) || 0);
              const blockMin = sh * 60 + sm;
              
              const isPast = blockMin < nowMin && selectedDayIndex === new Date().getDay();
              const isCurrent = !isPast && blockMin <= nowMin + 60 && selectedDayIndex === new Date().getDay();
              const isDone = dayCompleted.includes(b.id);
              
              return (
                <motion.div 
                  layout
                  key={b.id} 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex gap-6 relative group"
                >
                  <div 
                    className={`absolute -left-[31px] top-2 w-4 h-4 rounded-full border-4 border-bg z-10 transition-all duration-500 shadow-lg ${
                      isDone ? 'bg-accent border-accent' : isPast ? 'opacity-100 scale-90' : isCurrent ? 'animate-pulse-custom scale-110' : 'opacity-40 scale-75'
                    }`}
                    style={{ 
                      backgroundColor: isDone ? undefined : colors.dot, 
                      boxShadow: isDone ? `0 0 15px #f27d26` : `0 0 15px ${colors.dot}60` 
                    }}
                  />
                  
                  <div 
                    onClick={() => toggleTask(dateKey, b.id)}
                    className={`flex-1 glass bg-white/5 border border-white/10 rounded-[32px] p-6 transition-all duration-500 cursor-pointer group hover:bg-white/10 ${
                      isCurrent ? 'border-accent/40 bg-accent/5 ring-1 ring-accent/20 shadow-2xl shadow-accent/10' : 'border-white/5'
                    } ${isDone ? 'opacity-60 grayscale-[0.5]' : ''}`}
                    style={{ 
                      backgroundColor: isCurrent ? undefined : (isDone ? 'rgba(255,255,255,0.02)' : `${colors.dot}10`),
                      borderColor: isCurrent ? undefined : (isDone ? 'rgba(255,255,255,0.05)' : `${colors.dot}20`)
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-3">
                        <div className="inline-flex items-center px-3 py-1 rounded-lg bg-white/10 text-[10px] text-white font-black tracking-[0.2em] border border-white/10 uppercase">
                          {b.t}
                        </div>
                        <div className={`text-lg font-black text-white tracking-tighter transition-all ${isDone ? 'line-through text-white/40' : 'group-hover:translate-x-1'}`}>
                          {b.title}
                        </div>
                        {b.sub && <div className="text-sm text-text-secondary font-bold tracking-tight">{b.sub}</div>}
                        
                        <div className="flex items-center gap-3">
                          <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-white/5 text-white/40 border border-white/5">
                            {b.cat}
                          </span>
                          {isCurrent && !isDone && (
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-accent animate-ping" />
                              <span className="text-[10px] font-black text-accent uppercase tracking-widest">Active Now</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className={`p-3 rounded-2xl transition-all duration-300 ${isDone ? 'bg-accent text-white' : 'bg-white/5 text-white/20 group-hover:text-white/40'}`}>
                        {isDone ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
