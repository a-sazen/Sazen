import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Maximize2, Minimize2, Volume2, VolumeX, BookOpen, History as HistoryIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SessionLog {
  subject: string;
  duration: number;
  timestamp: string;
}

export default function Pomodoro() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [subject, setSubject] = useState('General Study');
  const [sessions, setSessions] = useState<SessionLog[]>(() => 
    JSON.parse(localStorage.getItem('pomodoro_sessions') || '[]')
  );

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimerComplete();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  useEffect(() => {
    localStorage.setItem('pomodoro_sessions', JSON.stringify(sessions));
  }, [sessions]);

  const handleTimerComplete = () => {
    setIsActive(false);
    if (!isBreak) {
      const newSession = {
        subject,
        duration: 25,
        timestamp: new Date().toISOString()
      };
      setSessions([newSession, ...sessions]);
    }
    setIsBreak(!isBreak);
    setTimeLeft(isBreak ? 25 * 60 : 5 * 60);
  };

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(isBreak ? 5 * 60 : 25 * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = 1 - (timeLeft / (isBreak ? 5 * 60 : 25 * 60));
  const subjects = ['General Study', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'ICT'];

  return (
    <div className={`min-h-full transition-all duration-700 ${isFocusMode ? 'fixed inset-0 z-[200] bg-black flex items-center justify-center p-8' : 'space-y-8'}`}>
      {!isFocusMode && (
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold leading-tight">Pomodoro Timer</h1>
            <p className="text-sm text-text-secondary mt-1">Focus blocks for deep work</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-3 glass bg-white/5 border border-white/10 rounded-xl text-white/40 hover:text-accent transition-all"
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            <button
              onClick={() => setIsFocusMode(true)}
              className="flex items-center gap-2 bg-accent hover:bg-accent-light text-white px-4 py-2 rounded-xl font-bold transition-all shadow-lg shadow-accent/20"
            >
              <Maximize2 size={18} />
              Focus Mode
            </button>
          </div>
        </header>
      )}

      <div className={`relative flex flex-col items-center ${isFocusMode ? 'w-full max-w-2xl' : ''}`}>
        {isFocusMode && (
          <button
            onClick={() => setIsFocusMode(false)}
            className="absolute top-0 right-0 p-4 text-white/40 hover:text-white transition-all"
          >
            <Minimize2 size={32} />
          </button>
        )}

        <div className="relative w-80 h-80 md:w-96 md:h-96 flex items-center justify-center">
          {/* Progress Ring */}
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle
              cx="50%"
              cy="50%"
              r="48%"
              className="fill-none stroke-white/5 stroke-[8]"
            />
            <motion.circle
              cx="50%"
              cy="50%"
              r="48%"
              className={`fill-none stroke-[8] ${isBreak ? 'stroke-success' : 'stroke-accent'}`}
              strokeDasharray="100 100"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: progress }}
              transition={{ duration: 0.5, ease: "linear" }}
              strokeLinecap="round"
            />
          </svg>

          {/* Ticking Pulse */}
          <AnimatePresence>
            {isActive && (
              <motion.div
                key={timeLeft}
                initial={{ scale: 1, opacity: 0.2 }}
                animate={{ scale: 1.1, opacity: 0 }}
                exit={{ opacity: 0 }}
                className={`absolute inset-0 rounded-full border-4 ${isBreak ? 'border-success' : 'border-accent'}`}
              />
            )}
          </AnimatePresence>

          <div className="text-center z-10">
            <div className={`text-[11px] font-black uppercase tracking-[0.4em] mb-4 ${isBreak ? 'text-success' : 'text-accent'}`}>
              {isBreak ? 'Break Time' : 'Focus Session'}
            </div>
            <div className={`text-8xl md:text-9xl font-black tabular-nums tracking-tighter ${isFocusMode ? 'text-white' : 'text-white shadow-2xl'}`}>
              {formatTime(timeLeft)}
            </div>
            {isFocusMode && (
              <div className="mt-6 text-2xl font-black text-white/40 flex items-center justify-center gap-3 tracking-tight">
                <BookOpen size={24} />
                {subject}
              </div>
            )}
          </div>
        </div>

        <div className="mt-16 flex items-center gap-8">
          <button
            onClick={resetTimer}
            className={`p-5 rounded-2xl border transition-all duration-300 ${isFocusMode ? 'bg-white/5 border-white/10 text-white/40 hover:text-white' : 'glass bg-white/5 border-white/10 text-white/40 hover:text-accent hover:bg-white/10'}`}
          >
            <RotateCcw size={28} />
          </button>
          
          <button
            onClick={toggleTimer}
            className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl hover:scale-110 active:scale-95 ${
              isActive 
                ? 'glass bg-white/10 text-white border border-white/20' 
                : (isBreak ? 'bg-success text-white shadow-success/40' : 'bg-accent text-white shadow-accent/40')
            }`}
          >
            {isActive ? <Pause size={40} fill="currentColor" /> : <Play size={40} fill="currentColor" className="ml-1" />}
          </button>

          <div className="relative group">
            <button
              className={`p-5 rounded-2xl border transition-all duration-300 ${isFocusMode ? 'bg-white/5 border-white/10 text-white/40 hover:text-white' : 'glass bg-white/5 border-white/10 text-white/40 hover:text-accent hover:bg-white/10'}`}
            >
              <BookOpen size={28} />
            </button>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-6 hidden group-hover:block w-56 glass bg-white/10 border border-white/20 rounded-[32px] shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
              {subjects.map(s => (
                <button
                  key={s}
                  onClick={() => setSubject(s)}
                  className={`w-full text-left px-6 py-4 text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all ${subject === s ? 'text-accent' : 'text-white/40'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {!isFocusMode && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.3em] text-white/30 px-4">
              <HistoryIcon size={16} />
              Recent Sessions
            </div>
            <div className="space-y-3">
              {sessions.slice(0, 5).map((session, i) => (
                <div key={i} className="flex items-center justify-between p-5 glass bg-white/5 border border-white/10 rounded-[24px] hover:bg-white/10 transition-all duration-300 group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent shadow-inner group-hover:scale-110 transition-transform">
                      <BookOpen size={18} />
                    </div>
                    <div>
                      <div className="text-base font-bold text-white tracking-tight">{session.subject}</div>
                      <div className="text-[10px] text-white/30 font-black uppercase tracking-widest mt-1">
                        {new Date(session.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm font-black text-accent tracking-widest">+{session.duration}m</div>
                </div>
              ))}
              {sessions.length === 0 && (
                <div className="p-12 text-center glass bg-white/5 border-2 border-dashed border-white/10 rounded-[32px] text-white/20 text-sm font-black uppercase tracking-[0.2em] italic">
                  No sessions logged yet
                </div>
              )}
            </div>
          </div>

          <div className="glass bg-white/5 border border-white/10 rounded-[40px] p-8 shadow-2xl relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
            <h3 className="text-xl font-black mb-8 tracking-tight text-white">Focus Stats</h3>
            <div className="space-y-8">
              <div>
                <div className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-2">Total Focus Time</div>
                <div className="text-4xl font-black text-accent tracking-tighter">
                  {Math.round(sessions.reduce((acc, s) => acc + s.duration, 0) / 60 * 10) / 10}h
                </div>
              </div>
              <div>
                <div className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-2">Sessions Completed</div>
                <div className="text-4xl font-black text-white tracking-tighter">
                  {sessions.length}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
