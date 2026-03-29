import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Clock, 
  Calendar, 
  BookOpen, 
  Lightbulb, 
  CheckCircle2, 
  Target, 
  ListTodo, 
  ShoppingCart,
  Droplets,
  GraduationCap,
  Timer,
  Video,
  Share2,
  Dumbbell,
  Wallet,
  Menu,
  X
} from 'lucide-react';

import { DAYS, FULL_DAYS, NOTICES, QUOTES, HABITS, GOALS_DATA, TODOS_HOME, TODOS_OUTSIDE, SHOPPING } from './constants';
import { Toaster } from 'sonner';
import Dashboard from './components/Dashboard';
import TodayPlan from './components/TodayPlan';
import WeeklyView from './components/WeeklyView';
import ClassSchedule from './components/ClassSchedule';
import MindfuelWork from './components/MindfuelWork';
import HabitTracker from './components/HabitTracker';
import Goals from './components/Goals';
import Todos from './components/Todos';
import ShoppingList from './components/ShoppingList';
import ExamTracker from './components/ExamTracker';
import Pomodoro from './components/Pomodoro';
import WorkoutLog from './components/WorkoutLog';
import FinanceTracker from './components/FinanceTracker';
import { Exam, WorkoutSession, BodyMeasurement, Goal, Habit, Transaction, Account, Budget, SavingsGoal, Todo, ShoppingItem } from './types';

type Page = 'dashboard' | 'today' | 'weekly' | 'schedule' | 'mindfuel' | 'habits' | 'goals' | 'todos' | 'shopping' | 'exams' | 'pomodoro' | 'workout' | 'finance';

export default function App() {
  const [activePage, setActivePage] = useState<Page>('dashboard');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [waterCount, setWaterCount] = useState(() => parseInt(localStorage.getItem('water_count') || '0'));
  const [mfDone, setMfDone] = useState<number[]>(() => JSON.parse(localStorage.getItem('mf_done') || '[]'));
  const [habitDone, setHabitDone] = useState<Record<string, Record<string, boolean>>>(() => JSON.parse(localStorage.getItem('habit_done') || '{}'));
  const [todoDone, setTodoDone] = useState<string[]>(() => JSON.parse(localStorage.getItem('todo_done') || '[]'));
  const [shopDone, setShopDone] = useState<string[]>(() => JSON.parse(localStorage.getItem('shop_done') || '[]'));
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  // New State
  const [habits, setHabits] = useState<Habit[]>(() => JSON.parse(localStorage.getItem('habits') || JSON.stringify(HABITS)));
  const [goals, setGoals] = useState<Goal[]>(() => {
    const saved = localStorage.getItem('goals');
    if (saved) return JSON.parse(saved);
    const initial: Goal[] = [];
    Object.entries(GOALS_DATA).forEach(([cat, items]) => {
      items.forEach((g, i) => initial.push({ ...g, id: `${cat}-${i}`, category: cat as any }));
    });
    return initial;
  });
  const [exams, setExams] = useState<Exam[]>(() => JSON.parse(localStorage.getItem('exams') || '[]'));
  const [workoutSessions, setWorkoutSessions] = useState<WorkoutSession[]>(() => JSON.parse(localStorage.getItem('workout_sessions') || '[]'));
  const [transactions, setTransactions] = useState<Transaction[]>(() => JSON.parse(localStorage.getItem('transactions') || '[]'));
  const [accounts, setAccounts] = useState<Account[]>(() => {
    const saved = localStorage.getItem('accounts');
    if (saved) return JSON.parse(saved);
    return [
      { id: '1', name: 'Cash', type: 'cash', balance: 0, color: '#3ecf8e' },
      { id: '2', name: 'Bank', type: 'bank', balance: 0, color: '#4a9eff' },
      { id: '3', name: 'bKash', type: 'mobile', balance: 0, color: '#e2136e' }
    ];
  });
  const [budgets, setBudgets] = useState<Budget[]>(() => JSON.parse(localStorage.getItem('budgets') || '[]'));
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>(() => JSON.parse(localStorage.getItem('savings_goals') || '[]'));
  const [bodyMeasurements, setBodyMeasurements] = useState<BodyMeasurement[]>(() => JSON.parse(localStorage.getItem('body_measurements') || '[]'));
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem('todos');
    if (saved) return JSON.parse(saved);
    const initial: Todo[] = [];
    TODOS_HOME.forEach((t, i) => initial.push({ id: `h${i}`, text: t, category: 'home' }));
    TODOS_OUTSIDE.forEach((t, i) => initial.push({ id: `o${i}`, text: t, category: 'outside' }));
    return initial;
  });
  const [shoppingItems, setShoppingItems] = useState<ShoppingItem[]>(() => {
    const saved = localStorage.getItem('shopping_items');
    if (saved) return JSON.parse(saved);
    const initial: ShoppingItem[] = [];
    Object.entries(SHOPPING).forEach(([cat, items]) => {
      items.forEach((item, i) => initial.push({ id: `${cat}${item}${i}`, name: item, category: cat }));
    });
    return initial;
  });
  const [completedTasks, setCompletedTasks] = useState<Record<string, string[]>>(() => {
    const saved = localStorage.getItem('completed_tasks');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('water_count', waterCount.toString());
    localStorage.setItem('mf_done', JSON.stringify(mfDone));
    localStorage.setItem('habit_done', JSON.stringify(habitDone));
    localStorage.setItem('todo_done', JSON.stringify(todoDone));
    localStorage.setItem('shop_done', JSON.stringify(shopDone));
    localStorage.setItem('habits', JSON.stringify(habits));
    localStorage.setItem('goals', JSON.stringify(goals));
    localStorage.setItem('exams', JSON.stringify(exams));
    localStorage.setItem('workout_sessions', JSON.stringify(workoutSessions));
    localStorage.setItem('transactions', JSON.stringify(transactions));
    localStorage.setItem('accounts', JSON.stringify(accounts));
    localStorage.setItem('budgets', JSON.stringify(budgets));
    localStorage.setItem('savings_goals', JSON.stringify(savingsGoals));
    localStorage.setItem('body_measurements', JSON.stringify(bodyMeasurements));
    localStorage.setItem('todos', JSON.stringify(todos));
    localStorage.setItem('shopping_items', JSON.stringify(shoppingItems));
    localStorage.setItem('completed_tasks', JSON.stringify(completedTasks));
  }, [waterCount, mfDone, habitDone, todoDone, shopDone, habits, goals, exams, workoutSessions, transactions, accounts, budgets, savingsGoals, bodyMeasurements, todos, shoppingItems, completedTasks]);

  const toggleWater = (i: number) => {
    setWaterCount(prev => i < prev ? i : i + 1);
  };

  const toggleTask = (dateKey: string, taskId: string) => {
    setCompletedTasks(prev => {
      const current = prev[dateKey] || [];
      const next = current.includes(taskId) 
        ? current.filter(id => id !== taskId)
        : [...current, taskId];
      return { ...prev, [dateKey]: next };
    });
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, section: 'Main' },
    { id: 'today', label: "Today's Plan", icon: Clock, section: 'Main' },
    { id: 'weekly', label: 'Weekly View', icon: Calendar, section: 'Main' },
    { id: 'schedule', label: 'Class Schedule', icon: BookOpen, section: 'Main' },
    { id: 'exams', label: 'Exam Tracker', icon: GraduationCap, section: 'Academic' },
    { id: 'pomodoro', label: 'Study Timer', icon: Timer, section: 'Academic' },
    { id: 'mindfuel', label: 'Mindfuel Work', icon: Lightbulb, section: 'Work & Goals' },
    { id: 'habits', label: 'Habit Tracker', icon: CheckCircle2, section: 'Life' },
    { id: 'goals', label: 'Goals', icon: Target, section: 'Life' },
    { id: 'workout', label: 'Workout Log', icon: Dumbbell, section: 'Life' },
    { id: 'todos', label: 'To-Dos & Errands', icon: ListTodo, section: 'Life' },
    { id: 'shopping', label: 'Shopping List', icon: ShoppingCart, section: 'Life' },
    { id: 'finance', label: 'Finance Tracker', icon: Wallet, section: 'Life' },
  ];

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard': return <Dashboard 
        mfDone={mfDone} 
        habitDone={habitDone} 
        waterCount={waterCount} 
        setWaterCount={setWaterCount}
        toggleMf={(id) => setMfDone(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])}
        exams={exams}
        workoutSessions={workoutSessions}
        todoDone={todoDone}
        transactions={transactions}
        accounts={accounts}
        setActivePage={setActivePage}
        completedTasks={completedTasks}
        toggleTask={toggleTask}
      />;
      case 'today': return <TodayPlan 
        completedTasks={completedTasks} 
        toggleTask={toggleTask} 
      />;
      case 'weekly': return <WeeklyView />;
      case 'schedule': return <ClassSchedule />;
      case 'exams': return <ExamTracker exams={exams} addExam={e => setExams(prev => [...prev, { ...e, id: Math.random().toString(36).substr(2, 9) }])} removeExam={id => setExams(prev => prev.filter(e => e.id !== id))} />;
      case 'pomodoro': return <Pomodoro />;
      case 'mindfuel': return <MindfuelWork mfDone={mfDone} toggleMf={(id) => setMfDone(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])} />;
      case 'habits': return <HabitTracker habits={habits} habitDone={habitDone} toggleHabit={(hn, date) => setHabitDone(prev => {
        const newHabits = { ...prev };
        if (!newHabits[date]) newHabits[date] = {};
        newHabits[date][hn] = !newHabits[date][hn];
        return newHabits;
      })} addHabit={h => setHabits(prev => [...prev, h])} removeHabit={hn => setHabits(prev => prev.filter(h => h.name !== hn))} />;
      case 'goals': return <Goals goals={goals} addGoal={g => setGoals(prev => [...prev, { ...g, id: Math.random().toString(36).substr(2, 9) }])} removeGoal={id => setGoals(prev => prev.filter(g => g.id !== id))} updateGoalPct={(id, pct) => setGoals(prev => prev.map(g => g.id === id ? { ...g, pct } : g))} />;
      case 'workout': return <WorkoutLog 
        sessions={workoutSessions} 
        addSession={s => setWorkoutSessions(prev => [...prev, { ...s, id: Math.random().toString(36).substr(2, 9) }])} 
        removeSession={id => setWorkoutSessions(prev => prev.filter(s => s.id !== id))}
        measurements={bodyMeasurements}
        addMeasurement={m => setBodyMeasurements(prev => [...prev, { ...m, id: Math.random().toString(36).substr(2, 9) }])}
        removeMeasurement={id => setBodyMeasurements(prev => prev.filter(m => m.id !== id))}
      />;
      case 'finance': return <FinanceTracker 
        transactions={transactions} 
        addTransaction={t => setTransactions(prev => [...prev, { ...t, id: Math.random().toString(36).substr(2, 9) }])} 
        removeTransaction={id => setTransactions(prev => prev.filter(t => t.id !== id))}
        accounts={accounts}
        setAccounts={setAccounts}
        budgets={budgets}
        setBudgets={setBudgets}
        savingsGoals={savingsGoals}
        setSavingsGoals={setSavingsGoals}
      />;
      case 'todos': return <Todos 
        todos={todos} 
        todoDone={todoDone} 
        toggleTodo={(id) => setTodoDone(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])} 
        addTodo={t => setTodos(prev => [...prev, { ...t, id: Math.random().toString(36).substr(2, 9) }])}
        removeTodo={id => setTodos(prev => prev.filter(t => t.id !== id))}
      />;
      case 'shopping': return <ShoppingList 
        items={shoppingItems} 
        shopDone={shopDone} 
        toggleShop={(id) => setShopDone(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])} 
        addItem={item => setShoppingItems(prev => [...prev, { ...item, id: Math.random().toString(36).substr(2, 9) }])}
        removeItem={id => setShoppingItems(prev => prev.filter(i => i.id !== id))}
      />;
      default: return <Dashboard 
        mfDone={mfDone} 
        habitDone={habitDone} 
        waterCount={waterCount} 
        setWaterCount={setWaterCount}
        toggleMf={(id) => setMfDone(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])}
        exams={exams}
        workoutSessions={workoutSessions}
        todoDone={todoDone}
        transactions={transactions}
        accounts={accounts}
        setActivePage={setActivePage}
        completedTasks={completedTasks}
        toggleTask={toggleTask}
      />;
    }
  };

  return (
    <div className="flex min-h-screen bg-bg text-text-primary liquid-mesh relative">
      <Toaster position="top-right" richColors theme="dark" />
      
      {/* Mobile Toggle */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 glass-dark border-b border-white/5 flex items-center justify-between px-6 z-[60]">
        <div className="font-display text-xl font-black bg-gradient-to-br from-accent-light to-teal-custom bg-clip-text text-transparent tracking-tighter">
          MyFlow
        </div>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-xl bg-white/5 border border-white/10 text-white active:scale-90 transition-transform"
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[55]"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-[56] w-64 glass-dark border-r border-white/5 flex flex-col transition-all duration-500 
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-8 border-b border-white/5">
          <div className="font-display text-2xl font-black bg-gradient-to-br from-accent-light to-teal-custom bg-clip-text text-transparent tracking-tighter">
            MyFlow
          </div>
          <div className="text-[10px] font-bold text-text-tertiary uppercase tracking-[0.3em] mt-1">Daily OS</div>
        </div>
        
        <div className="p-6 border-b border-white/5">
          <div className="font-display text-3xl font-black text-white tracking-tighter">
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
          </div>
          <div className="text-[11px] font-bold text-text-tertiary uppercase tracking-widest mt-1">
            {FULL_DAYS[currentTime.getDay()]}, {currentTime.getDate()} {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][currentTime.getMonth()]}
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-8 custom-scrollbar">
          {['Main', 'Academic', 'Work & Goals', 'Life'].map(section => (
            <div key={section} className="space-y-2">
              <div className="px-4 text-[10px] font-black text-text-tertiary uppercase tracking-[0.2em] mb-4">{section}</div>
              <div className="space-y-1">
                {navItems.filter(item => item.section === section).map(item => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActivePage(item.id as Page);
                      setIsSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-4 px-5 py-4 rounded-[24px] transition-all duration-500 group relative overflow-hidden ${
                      activePage === item.id 
                        ? 'glass bg-accent/20 border-accent/30 text-white shadow-xl shadow-accent/20' 
                        : 'text-white/30 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {activePage === item.id && (
                      <motion.div 
                        layoutId="sidebar-active"
                        className="absolute inset-0 bg-gradient-to-r from-accent/20 via-accent/10 to-transparent"
                      />
                    )}
                    <item.icon size={20} className={`relative z-10 transition-all duration-500 ${activePage === item.id ? 'text-accent scale-110' : 'group-hover:scale-110 group-hover:rotate-3'}`} />
                    <span className={`relative z-10 text-sm font-black tracking-tight transition-all duration-500 ${activePage === item.id ? 'translate-x-1' : ''}`}>{item.label}</span>
                    {activePage === item.id && (
                      <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-accent animate-pulse shadow-[0_0_10px_rgba(124,111,247,0.8)]" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <div className="glass bg-white/5 rounded-[24px] p-4">
            <div className="text-[10px] text-text-tertiary font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
              <Droplets size={10} className="text-blue-custom" />
              Hydration
            </div>
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => toggleWater(i)}
                  className={`w-4 h-4 rounded-full border border-white/10 transition-all duration-500 ${
                    i < waterCount ? 'bg-blue-custom border-blue-custom shadow-[0_0_12px_rgba(74,158,255,0.6)]' : 'bg-white/5'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 flex-1 min-h-screen relative pt-16 lg:pt-0">
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePage}
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            >
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Floating Daily Tip */}
        <div className="fixed bottom-6 right-6 z-50 w-64 group">
          <div className="glass bg-black/60 border border-white/10 rounded-[24px] p-4 shadow-2xl backdrop-blur-xl transition-all duration-500 hover:bg-black/80 hover:border-accent/40">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                <span className="text-[9px] font-black text-accent uppercase tracking-[0.2em]">Daily Tip</span>
              </div>
              <button 
                onClick={() => setCurrentTipIndex(prev => (prev + 1) % NOTICES.length)}
                className="text-[8px] font-black text-white/40 hover:text-white uppercase tracking-widest transition-colors"
              >
                Next
              </button>
            </div>
            <p className="text-[11px] font-bold text-white/90 leading-relaxed tracking-tight">
              {NOTICES[currentTipIndex]}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
