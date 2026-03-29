import { useState } from 'react';
import { motion } from 'motion/react';
import { Dumbbell, Plus, Trash2, ChevronRight, History, Target, CheckCircle2, TrendingUp, TrendingDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { WorkoutSession, BodyMeasurement } from '../types';

interface WorkoutLogProps {
  sessions: WorkoutSession[];
  addSession: (session: Omit<WorkoutSession, 'id'>) => void;
  removeSession: (id: string) => void;
  measurements: BodyMeasurement[];
  addMeasurement: (measurement: Omit<BodyMeasurement, 'id'>) => void;
  removeMeasurement: (id: string) => void;
}

export default function WorkoutLog({ sessions, addSession, removeSession, measurements, addMeasurement, removeMeasurement }: WorkoutLogProps) {
  const [activeTab, setActiveTab] = useState<'sessions' | 'measurements' | 'routine' | 'improvement'>('routine');
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);
  
  const todayDay = new Date().getDay();
  const isUpperDay = todayDay === 1 || todayDay === 4; // Mon, Thu
  const isLowerDay = todayDay === 2 || todayDay === 5; // Tue, Fri
  const [showForm, setShowForm] = useState(false);
  const [showMeasureForm, setShowMeasureForm] = useState(false);
  const [newSession, setNewSession] = useState<Omit<WorkoutSession, 'id'>>({
    date: new Date().toISOString().split('T')[0],
    exercises: [{ name: '', sets: [{ reps: 0, weight: 0 }] }]
  });

  const [newMeasure, setNewMeasure] = useState<Omit<BodyMeasurement, 'id'>>({
    date: new Date().toISOString().split('T')[0],
    weight: 0,
    chest: 0,
    waist: 0,
    biceps: 0,
    thighs: 0,
    bodyFat: 0
  });

  const addExercise = () => {
    setNewSession({
      ...newSession,
      exercises: [...newSession.exercises, { name: '', sets: [{ reps: 0, weight: 0 }] }]
    });
  };

  const addSet = (exerciseIndex: number) => {
    const updatedExercises = [...newSession.exercises];
    updatedExercises[exerciseIndex].sets.push({ reps: 0, weight: 0 });
    setNewSession({ ...newSession, exercises: updatedExercises });
  };

  const handleExerciseChange = (index: number, name: string) => {
    const updatedExercises = [...newSession.exercises];
    updatedExercises[index].name = name;
    setNewSession({ ...newSession, exercises: updatedExercises });
  };

  const handleSetChange = (exerciseIndex: number, setIndex: number, field: 'reps' | 'weight', value: number) => {
    const updatedExercises = [...newSession.exercises];
    updatedExercises[exerciseIndex].sets[setIndex][field] = value;
    setNewSession({ ...newSession, exercises: updatedExercises });
  };

  const getSuggestion = (exerciseName: string) => {
    if (!exerciseName.trim()) return null;
    const pastSessions = [...sessions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    for (const session of pastSessions) {
      const exercise = session.exercises.find(ex => ex.name.toLowerCase() === exerciseName.toLowerCase());
      if (exercise) {
        const lastSet = exercise.sets[exercise.sets.length - 1];
        return {
          reps: lastSet.reps + 2,
          weight: lastSet.weight,
          lastReps: lastSet.reps,
          lastWeight: lastSet.weight
        };
      }
    }
    return null;
  };

  return (
    <div className="space-y-10">
      <header className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-5xl font-black leading-tight tracking-tighter bg-gradient-to-br from-white via-white to-white/40 bg-clip-text text-transparent drop-shadow-sm">
            Workout & Body
          </h1>
          <p className="text-sm font-bold text-text-secondary mt-2 tracking-tight flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            Track exercises and body measurements
          </p>
        </div>
        <div className="flex gap-4">
          {activeTab === 'sessions' ? (
            <button
              onClick={() => setShowForm(true)}
              className="glass bg-accent hover:bg-accent-light text-white px-8 py-4 rounded-[24px] font-black transition-all duration-300 shadow-lg shadow-accent/30 active:scale-95 flex items-center gap-3"
            >
              <Plus size={20} />
              <span className="tracking-tight uppercase text-xs">Log Session</span>
            </button>
          ) : (
            <button
              onClick={() => setShowMeasureForm(true)}
              className="glass bg-teal-custom hover:bg-teal-custom/80 text-white px-8 py-4 rounded-[24px] font-black transition-all duration-300 shadow-lg shadow-teal-custom/30 active:scale-95 flex items-center gap-3"
            >
              <Plus size={20} />
              <span className="tracking-tight uppercase text-xs">Log Measurement</span>
            </button>
          )}
        </div>
      </header>

      <div className="flex gap-10 border-b border-white/5 px-4">
        <button
          onClick={() => setActiveTab('routine')}
          className={`pb-5 text-[11px] font-black uppercase tracking-[0.3em] transition-all relative ${
            activeTab === 'routine' ? 'text-accent' : 'text-white/30 hover:text-white'
          }`}
        >
          Routine
          {activeTab === 'routine' && (
            <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-accent rounded-full shadow-[0_0_15px_rgba(242,125,38,0.6)]" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('sessions')}
          className={`pb-5 text-[11px] font-black uppercase tracking-[0.3em] transition-all relative ${
            activeTab === 'sessions' ? 'text-accent' : 'text-white/30 hover:text-white'
          }`}
        >
          History
          {activeTab === 'sessions' && (
            <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-accent rounded-full shadow-[0_0_15px_rgba(242,125,38,0.6)]" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('measurements')}
          className={`pb-5 text-[11px] font-black uppercase tracking-[0.3em] transition-all relative ${
            activeTab === 'measurements' ? 'text-teal-custom' : 'text-white/30 hover:text-white'
          }`}
        >
          Body Measurements
          {activeTab === 'measurements' && (
            <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-teal-custom rounded-full shadow-[0_0_15px_rgba(20,184,166,0.6)]" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('improvement')}
          className={`pb-5 text-[11px] font-black uppercase tracking-[0.3em] transition-all relative ${
            activeTab === 'improvement' ? 'text-blue-custom' : 'text-white/30 hover:text-white'
          }`}
        >
          Improvement
          {activeTab === 'improvement' && (
            <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-blue-custom rounded-full shadow-[0_0_15px_rgba(74,158,255,0.6)]" />
          )}
        </button>
      </div>

      {activeTab === 'sessions' ? (
        <div className="space-y-8">
          {sessions.map(session => (
            <div key={session.id} className="glass bg-white/5 border border-white/10 rounded-[48px] p-10 group relative hover:bg-white/10 transition-all duration-700 shadow-2xl overflow-hidden">
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-accent/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              <div className="flex justify-between items-start mb-10 relative z-10">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-[24px] bg-accent/10 flex items-center justify-center text-accent shadow-inner group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                    <History size={32} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white tracking-tight">Workout Session</h3>
                    <div className="text-[11px] text-white/40 font-black uppercase tracking-[0.3em] mt-2 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent/40" />
                      {new Date(session.date).toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => removeSession(session.id)}
                  className="p-4 text-white/10 hover:text-danger hover:bg-danger/10 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-[20px]"
                >
                  <Trash2 size={20} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
                {session.exercises.map((ex, i) => (
                  <div key={i} className="glass bg-white/5 border border-white/5 rounded-[32px] p-8 hover:bg-white/10 transition-all duration-500 group/ex">
                    <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-4 flex items-center gap-2">
                      <Target size={14} className="text-accent group-hover/ex:scale-125 transition-transform" />
                      Exercise {i + 1}
                    </div>
                    <h4 className="text-xl font-black text-white mb-6 tracking-tight">{ex.name}</h4>
                    <div className="space-y-4">
                      {ex.sets.map((set, si) => (
                        <div key={si} className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest text-white/40 bg-white/5 px-4 py-3 rounded-[16px] border border-white/5 group-hover/ex:border-white/10 transition-colors">
                          <span className="text-[10px] text-white/20">Set {si + 1}</span>
                          <span className="text-white flex items-center gap-2">
                            <span className="text-accent">{set.reps}</span> <span className="text-[9px] text-white/20">reps</span> 
                            <span className="w-1 h-1 rounded-full bg-white/10" />
                            <span className="text-accent">{set.weight}</span> <span className="text-[9px] text-white/20">kg</span>
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {sessions.length === 0 && (
            <div className="py-24 text-center glass bg-white/5 border-2 border-dashed border-white/10 rounded-[48px]">
              <Dumbbell className="mx-auto text-white/10 mb-6 animate-pulse" size={64} />
              <p className="text-white/30 font-black uppercase tracking-[0.2em] text-sm">No workout sessions logged yet</p>
            </div>
          )}
        </div>
      ) : activeTab === 'measurements' ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {measurements.map(m => (
              <div key={m.id} className="glass bg-white/5 border border-white/10 rounded-[40px] p-8 group relative hover:bg-white/10 transition-all duration-500 shadow-2xl">
                <div className="flex justify-between items-start mb-6">
                  <div className="text-sm font-black text-white uppercase tracking-widest">
                    {new Date(m.date).toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })}
                  </div>
                  <button
                    onClick={() => removeMeasurement(m.id)}
                    className="p-2 text-white/20 hover:text-destructive opacity-0 group-hover:opacity-100 transition-all hover:bg-destructive/10 rounded-xl"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-y-6 gap-x-6">
                  {m.weight && (
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                      <div className="text-[9px] text-white/30 font-black uppercase tracking-widest mb-1">Weight</div>
                      <div className="text-lg font-black text-teal-custom">{m.weight} <span className="text-xs text-white/20">kg</span></div>
                    </div>
                  )}
                  {m.waist && (
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                      <div className="text-[9px] text-white/30 font-black uppercase tracking-widest mb-1">Waist</div>
                      <div className="text-lg font-black text-white">{m.waist} <span className="text-xs text-white/20">cm</span></div>
                    </div>
                  )}
                  {m.chest && (
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                      <div className="text-[9px] text-white/30 font-black uppercase tracking-widest mb-1">Chest</div>
                      <div className="text-lg font-black text-white">{m.chest} <span className="text-xs text-white/20">cm</span></div>
                    </div>
                  )}
                  {m.biceps && (
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                      <div className="text-[9px] text-white/30 font-black uppercase tracking-widest mb-1">Biceps</div>
                      <div className="text-lg font-black text-white">{m.biceps} <span className="text-xs text-white/20">cm</span></div>
                    </div>
                  )}
                  {m.thighs && (
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                      <div className="text-[9px] text-white/30 font-black uppercase tracking-widest mb-1">Thighs</div>
                      <div className="text-lg font-black text-white">{m.thighs} <span className="text-xs text-white/20">cm</span></div>
                    </div>
                  )}
                  {m.bodyFat && (
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                      <div className="text-[9px] text-white/30 font-black uppercase tracking-widest mb-1">Body Fat</div>
                      <div className="text-lg font-black text-white">{m.bodyFat}<span className="text-xs text-white/20">%</span></div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {measurements.length === 0 && (
            <div className="py-24 text-center glass bg-white/5 border-2 border-dashed border-white/10 rounded-[48px]">
              <p className="text-white/30 font-black uppercase tracking-[0.2em] text-sm">No measurements logged yet</p>
            </div>
          )}
        </div>
      ) : activeTab === 'routine' ? (
        <div className="space-y-10">
          <div className="glass bg-accent/10 border border-accent/20 rounded-[32px] p-8 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 rounded-2xl bg-accent/20 flex items-center justify-center text-accent shadow-lg shadow-accent/20">
                <Dumbbell size={28} />
              </div>
              <div>
                <div className="text-[10px] font-black text-accent uppercase tracking-[0.3em] mb-1">Today's Focus</div>
                <h3 className="text-2xl font-black text-white tracking-tight">
                  {['Mon', 'Thu'].includes(new Date().toLocaleDateString('en-US', { weekday: 'short' })) ? 'Upper Body' : 
                   ['Tue', 'Fri'].includes(new Date().toLocaleDateString('en-US', { weekday: 'short' })) ? 'Lower + Core' : 
                   'Active Recovery / Rest'}
                </h3>
              </div>
            </div>
            {completedExercises.length > 0 && (
              <button 
                onClick={() => {
                  const todayWorkout = ['Mon', 'Thu'].includes(new Date().toLocaleDateString('en-US', { weekday: 'short' })) ? 'Upper Body' : 'Lower + Core';
                  const exercises = todayWorkout === 'Upper Body' ? [
                    { name: 'Push-up', sets: [{ reps: 4, weight: 0 }, { reps: 4, weight: 0 }, { reps: 4, weight: 0 }] },
                    { name: 'DB curl', sets: [{ reps: 5, weight: 5 }, { reps: 5, weight: 5 }, { reps: 5, weight: 5 }] },
                    { name: 'DB overhead press', sets: [{ reps: 5, weight: 5 }, { reps: 5, weight: 5 }, { reps: 5, weight: 5 }] },
                    { name: 'DB row', sets: [{ reps: 5, weight: 5 }, { reps: 5, weight: 5 }, { reps: 5, weight: 5 }] },
                  ] : [
                    { name: 'Squat', sets: [{ reps: 8, weight: 0 }, { reps: 8, weight: 0 }, { reps: 8, weight: 0 }] },
                    { name: 'Plank', sets: [{ reps: 20, weight: 0 }, { reps: 20, weight: 0 }, { reps: 20, weight: 0 }] },
                  ];
                  
                  addSession({
                    date: new Date().toISOString().split('T')[0],
                    exercises: exercises.filter(ex => completedExercises.includes(ex.name))
                  });
                  setCompletedExercises([]);
                  setActiveTab('sessions');
                }}
                className="glass bg-success text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-success/80 transition-all shadow-lg shadow-success/20"
              >
                Finish & Log Session
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className={`glass bg-white/5 border rounded-[48px] p-10 space-y-8 transition-all duration-500 ${isUpperDay ? 'border-accent/40 bg-accent/5 ring-1 ring-accent/20' : 'border-white/10'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
                    <Dumbbell size={24} />
                  </div>
                  <h3 className="text-2xl font-black text-white tracking-tight">Upper Body</h3>
                </div>
                {isUpperDay && (
                  <div className="bg-accent text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest animate-pulse shadow-lg shadow-accent/20">
                    Due Today
                  </div>
                )}
              </div>
              <div className="space-y-4">
                {[
                  { name: 'Push-up', sets: '3 sets × 4 reps', sub: 'Build to 10 reps over months' },
                  { name: 'DB curl', sets: '3 sets × 5 reps' },
                  { name: 'DB overhead press', sets: '3 sets × 5 reps' },
                  { name: 'DB row', sets: '3 sets × 5 reps', sub: 'Each side' },
                  { name: 'Wrist curl', sets: '3 sets × 10 reps', sub: 'Each hand' },
                  { name: 'Reverse wrist curl', sets: '2 sets × 10 reps', sub: 'Each hand' },
                  { name: 'Wall press (isometric)', sets: '3 sets × 10 sec hold' },
                ].map((ex, i) => (
                  <div 
                    key={i} 
                    onClick={() => setCompletedExercises(prev => prev.includes(ex.name) ? prev.filter(e => e !== ex.name) : [...prev, ex.name])}
                    className={`flex justify-between items-center p-4 rounded-2xl border transition-all cursor-pointer group ${
                      completedExercises.includes(ex.name) ? 'bg-success/10 border-success/40' : 'bg-white/5 border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                        completedExercises.includes(ex.name) ? 'bg-success border-success' : 'border-white/10'
                      }`}>
                        {completedExercises.includes(ex.name) && <CheckCircle2 size={14} className="text-white" />}
                      </div>
                      <div>
                        <div className={`text-sm font-bold transition-all ${completedExercises.includes(ex.name) ? 'text-success line-through opacity-60' : 'text-white'}`}>{ex.name}</div>
                        {ex.sub && <div className="text-[10px] text-text-tertiary font-black uppercase tracking-widest">{ex.sub}</div>}
                      </div>
                    </div>
                    <div className={`text-xs font-black uppercase tracking-widest ${completedExercises.includes(ex.name) ? 'text-success/40' : 'text-accent'}`}>{ex.sets}</div>
                  </div>
                ))}
              </div>
              <div className="p-4 rounded-2xl bg-accent/5 border border-accent/20 text-[11px] font-bold text-accent/80 italic">
                Schedule: Monday & Thursday
              </div>
            </div>

            <div className={`glass bg-white/5 border rounded-[48px] p-10 space-y-8 transition-all duration-500 ${isLowerDay ? 'border-teal-custom/40 bg-teal-custom/5 ring-1 ring-teal-custom/20' : 'border-white/10'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-teal-custom/10 flex items-center justify-center text-teal-custom">
                    <Target size={24} />
                  </div>
                  <h3 className="text-2xl font-black text-white tracking-tight">Lower + Core</h3>
                </div>
                {isLowerDay && (
                  <div className="bg-teal-custom text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest animate-pulse shadow-lg shadow-teal-custom/20">
                    Due Today
                  </div>
                )}
              </div>
              <div className="space-y-4">
                {[
                  { name: 'Squat', sets: '3 sets × 8 reps' },
                  { name: 'Goblet squat (5kg)', sets: '2 sets × 6 reps' },
                  { name: 'Reverse lunge', sets: '3 sets × 5 reps', sub: 'Each leg' },
                  { name: 'Hip thrust', sets: '3 sets × 10 reps' },
                  { name: 'Plank', sets: '3 sets × 20 sec' },
                  { name: 'Crunch', sets: '3 sets × 8 reps' },
                  { name: 'Leg raise', sets: '3 sets × 6 reps' },
                  { name: 'Mountain climbers', sets: '3 sets × 15 sec' },
                ].map((ex, i) => (
                  <div 
                    key={i} 
                    onClick={() => setCompletedExercises(prev => prev.includes(ex.name) ? prev.filter(e => e !== ex.name) : [...prev, ex.name])}
                    className={`flex justify-between items-center p-4 rounded-2xl border transition-all cursor-pointer group ${
                      completedExercises.includes(ex.name) ? 'bg-success/10 border-success/40' : 'bg-white/5 border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                        completedExercises.includes(ex.name) ? 'bg-success border-success' : 'border-white/10'
                      }`}>
                        {completedExercises.includes(ex.name) && <CheckCircle2 size={14} className="text-white" />}
                      </div>
                      <div>
                        <div className={`text-sm font-bold transition-all ${completedExercises.includes(ex.name) ? 'text-success line-through opacity-60' : 'text-white'}`}>{ex.name}</div>
                        {ex.sub && <div className="text-[10px] text-text-tertiary font-black uppercase tracking-widest">{ex.sub}</div>}
                      </div>
                    </div>
                    <div className={`text-xs font-black uppercase tracking-widest ${completedExercises.includes(ex.name) ? 'text-success/40' : 'text-teal-custom'}`}>{ex.sets}</div>
                  </div>
                ))}
              </div>
              <div className="p-4 rounded-2xl bg-teal-custom/5 border border-teal-custom/20 text-[11px] font-bold text-teal-custom/80 italic">
                Schedule: Tuesday & Friday
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-10">
          <div className="glass bg-white/5 border border-white/10 rounded-[48px] p-10 shadow-xl">
            <h3 className="text-2xl font-black text-white tracking-tight mb-10">Body Measurement Trends</h3>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={measurements.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 800 }} 
                    tickFormatter={(date) => new Date(date).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    dy={10}
                  />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', fontSize: '12px' }}
                    itemStyle={{ fontWeight: 800 }}
                    cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2 }}
                  />
                  <Line type="monotone" dataKey="weight" name="Weight (kg)" stroke="#14b8a6" strokeWidth={4} dot={{ fill: '#14b8a6', r: 4 }} />
                  <Line type="monotone" dataKey="chest" name="Chest (cm)" stroke="#7c6ff7" strokeWidth={3} dot={{ fill: '#7c6ff7', r: 4 }} />
                  <Line type="monotone" dataKey="waist" name="Waist (cm)" stroke="#f5a623" strokeWidth={3} dot={{ fill: '#f5a623', r: 4 }} />
                  <Line type="monotone" dataKey="biceps" name="Biceps (cm)" stroke="#e865a0" strokeWidth={3} dot={{ fill: '#e865a0', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {measurements.length > 1 && (() => {
              const latest = measurements[measurements.length - 1];
              const first = measurements[0];
              return (
                <>
                  <ImprovementCard label="Weight" current={latest.weight} initial={first.weight} unit="kg" color="#14b8a6" />
                  <ImprovementCard label="Chest" current={latest.chest} initial={first.chest} unit="cm" color="#7c6ff7" />
                  <ImprovementCard label="Waist" current={latest.waist} initial={first.waist} unit="cm" color="#f5a623" />
                  <ImprovementCard label="Biceps" current={latest.biceps} initial={first.biceps} unit="cm" color="#e865a0" />
                </>
              );
            })()}
          </div>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            className="glass bg-white/10 border border-white/20 rounded-[48px] p-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative"
          >
            <div className="flex justify-between items-center mb-10">
              <div>
                <h2 className="text-3xl font-black text-white tracking-tight">Log Workout</h2>
                <p className="text-sm font-black uppercase tracking-widest text-white/30 mt-2">Record your exercises and sets</p>
              </div>
              <button onClick={() => setShowForm(false)} className="w-12 h-12 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-2xl text-white/40 hover:text-white transition-all">
                <Plus size={28} className="rotate-45" />
              </button>
            </div>

            <div className="space-y-10">
              <div>
                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-3 block px-2">Session Date</label>
                <input
                  type="date"
                  value={newSession.date}
                  onChange={e => setNewSession({ ...newSession, date: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:border-accent outline-none font-black uppercase tracking-widest transition-all"
                />
              </div>

              <div className="space-y-8">
                {newSession.exercises.map((ex, i) => (
                  <div key={i} className="bg-white/5 border border-white/10 rounded-[32px] p-8 space-y-6 relative group/ex">
                    <div className="flex items-center justify-between">
                      <div className="text-[10px] font-black text-accent uppercase tracking-[0.4em]">Exercise {i + 1}</div>
                      {newSession.exercises.length > 1 && (
                        <button
                          onClick={() => {
                            const updated = [...newSession.exercises];
                            updated.splice(i, 1);
                            setNewSession({ ...newSession, exercises: updated });
                          }}
                          className="text-white/20 hover:text-destructive transition-all p-2 hover:bg-destructive/10 rounded-lg"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                    
                    <div className="space-y-6">
                      <div className="relative">
                        <input
                          placeholder="Exercise Name (e.g., Bench Press)"
                          value={ex.name}
                          onChange={e => handleExerciseChange(i, e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:border-accent outline-none font-black tracking-tight transition-all placeholder:text-white/10"
                        />
                        {getSuggestion(ex.name) && (
                          <div className="mt-4 p-5 glass bg-accent/5 border border-accent/20 rounded-2xl flex items-center gap-4 animate-in slide-in-from-top-2 duration-300">
                            <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center text-accent shadow-lg shadow-accent/20">
                              <Target size={20} />
                            </div>
                            <div className="text-[11px]">
                              <span className="text-white/30 font-black uppercase tracking-widest">Progressive Overload:</span>
                              <div className="font-black text-accent mt-1 text-sm tracking-tight">
                                Try {getSuggestion(ex.name)?.reps} reps @ {getSuggestion(ex.name)?.weight}kg
                                <span className="text-white/20 font-medium ml-3">
                                  (Last: {getSuggestion(ex.name)?.lastReps} @ {getSuggestion(ex.name)?.lastWeight}kg)
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="space-y-3">
                        {ex.sets.map((set, si) => (
                          <div key={si} className="flex items-center gap-4 animate-in fade-in slide-in-from-left-2 duration-300">
                            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xs font-black text-white/30">
                              {si + 1}
                            </div>
                            <div className="flex-1 grid grid-cols-2 gap-4">
                              <div className="relative">
                                <input
                                  type="number"
                                  placeholder="Reps"
                                  value={set.reps || ''}
                                  onChange={e => handleSetChange(i, si, 'reps', parseInt(e.target.value) || 0)}
                                  className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-xs text-white focus:border-accent outline-none font-black transition-all"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-black text-white/20 uppercase tracking-widest">Reps</span>
                              </div>
                              <div className="relative">
                                <input
                                  type="number"
                                  placeholder="Weight"
                                  value={set.weight || ''}
                                  onChange={e => handleSetChange(i, si, 'weight', parseFloat(e.target.value) || 0)}
                                  className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-xs text-white focus:border-accent outline-none font-black transition-all"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-black text-white/20 uppercase tracking-widest">Kg</span>
                              </div>
                            </div>
                            {ex.sets.length > 1 && (
                              <button
                                onClick={() => {
                                  const updated = [...newSession.exercises];
                                  updated[i].sets.splice(si, 1);
                                  setNewSession({ ...newSession, exercises: updated });
                                }}
                                className="p-3 text-white/20 hover:text-destructive transition-all hover:bg-destructive/10 rounded-xl"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          onClick={() => addSet(i)}
                          className="w-full py-3 border border-dashed border-white/10 rounded-xl text-[10px] font-black text-white/20 hover:border-accent hover:text-accent transition-all uppercase tracking-[0.3em] mt-2"
                        >
                          + Add Set
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={addExercise}
                className="w-full py-6 border-2 border-dashed border-white/10 rounded-[32px] text-sm font-black text-white/30 hover:border-accent hover:text-accent transition-all flex items-center justify-center gap-3 uppercase tracking-widest"
              >
                <Plus size={20} />
                Add Exercise
              </button>

              <div className="flex gap-6 pt-6">
                <button
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-5 rounded-2xl font-black uppercase tracking-widest text-xs text-white/40 hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    addSession(newSession);
                    setShowForm(false);
                    setNewSession({
                      date: new Date().toISOString().split('T')[0],
                      exercises: [{ name: '', sets: [{ reps: 0, weight: 0 }] }]
                    });
                  }}
                  className="flex-1 bg-accent text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-accent-light transition-all shadow-xl shadow-accent/20"
                >
                  Save Session
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {showMeasureForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            className="glass bg-white/10 border border-white/20 rounded-[48px] p-10 w-full max-w-md shadow-2xl relative"
          >
            <div className="flex justify-between items-center mb-10">
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight">Body Stats</h2>
                <p className="text-sm font-black uppercase tracking-widest text-white/30 mt-2">Track your physical progress</p>
              </div>
              <button onClick={() => setShowMeasureForm(false)} className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-xl text-white/40 hover:text-white transition-all">
                <Plus size={24} className="rotate-45" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-2 block px-2">Date</label>
                <input
                  type="date"
                  value={newMeasure.date}
                  onChange={e => setNewMeasure({ ...newMeasure, date: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:border-teal-custom outline-none font-black uppercase tracking-widest transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-2 block px-2">Weight (kg)</label>
                  <input
                    type="number"
                    value={newMeasure.weight}
                    onChange={e => setNewMeasure({ ...newMeasure, weight: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:border-teal-custom outline-none font-black transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-2 block px-2">Body Fat (%)</label>
                  <input
                    type="number"
                    value={newMeasure.bodyFat}
                    onChange={e => setNewMeasure({ ...newMeasure, bodyFat: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:border-teal-custom outline-none font-black transition-all"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-2 block px-2">Chest (cm)</label>
                  <input
                    type="number"
                    value={newMeasure.chest}
                    onChange={e => setNewMeasure({ ...newMeasure, chest: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:border-teal-custom outline-none font-black transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-2 block px-2">Waist (cm)</label>
                  <input
                    type="number"
                    value={newMeasure.waist}
                    onChange={e => setNewMeasure({ ...newMeasure, waist: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:border-teal-custom outline-none font-black transition-all"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-2 block px-2">Biceps (cm)</label>
                  <input
                    type="number"
                    value={newMeasure.biceps}
                    onChange={e => setNewMeasure({ ...newMeasure, biceps: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:border-teal-custom outline-none font-black transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-2 block px-2">Thighs (cm)</label>
                  <input
                    type="number"
                    value={newMeasure.thighs}
                    onChange={e => setNewMeasure({ ...newMeasure, thighs: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:border-teal-custom outline-none font-black transition-all"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <button
                  onClick={() => setShowMeasureForm(false)}
                  className="flex-1 py-4 rounded-2xl font-black uppercase tracking-widest text-xs text-white/40 hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    addMeasurement(newMeasure);
                    setShowMeasureForm(false);
                    setNewMeasure({ date: new Date().toISOString().split('T')[0], weight: 0, chest: 0, waist: 0, biceps: 0, thighs: 0, bodyFat: 0 });
                  }}
                  className="flex-1 bg-teal-custom text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-teal-custom/80 transition-all shadow-xl shadow-teal-custom/20"
                >
                  Save Stats
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

function ImprovementCard({ label, current, initial, unit, color }: { label: string; current: number; initial: number; unit: string; color: string }) {
  const diff = current - initial;
  const isGood = label === 'Weight' ? diff < 0 : diff > 0; // Weight loss is usually goal, muscle gain for others
  
  return (
    <div className="glass bg-white/5 border border-white/10 rounded-[32px] p-6">
      <div className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-4">{label} Progress</div>
      <div className="flex items-end justify-between">
        <div>
          <div className="text-3xl font-black text-white tracking-tighter">{current} <span className="text-sm text-white/20">{unit}</span></div>
          <div className="text-[10px] font-bold text-white/40 mt-1">Initial: {initial}{unit}</div>
        </div>
        <div className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
          diff === 0 ? 'bg-white/5 text-white/40' : isGood ? 'bg-success/20 text-success' : 'bg-danger/20 text-danger'
        }`}>
          {diff > 0 ? <TrendingUp size={12} /> : diff < 0 ? <TrendingDown size={12} /> : null}
          {Math.abs(diff).toFixed(1)}{unit}
        </div>
      </div>
    </div>
  );
}
