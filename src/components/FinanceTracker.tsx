import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, Wallet, TrendingUp, TrendingDown, DollarSign, Calendar, ArrowUpRight, ArrowDownRight, X, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Transaction, Account, Budget, SavingsGoal } from '../types';

interface FinanceTrackerProps {
  transactions: Transaction[];
  addTransaction: (t: Omit<Transaction, 'id'>) => void;
  removeTransaction: (id: string) => void;
  accounts: Account[];
  setAccounts: React.Dispatch<React.SetStateAction<Account[]>>;
  budgets: Budget[];
  setBudgets: React.Dispatch<React.SetStateAction<Budget[]>>;
  savingsGoals: SavingsGoal[];
  setSavingsGoals: React.Dispatch<React.SetStateAction<SavingsGoal[]>>;
}

const CATEGORIES = [
  { name: 'Food', icon: '🍔', color: '#FF6B6B', type: 'expense' },
  { name: 'Transport', icon: '🚗', color: '#4DABF7', type: 'expense' },
  { name: 'Uni', icon: '🎓', color: '#7C6FF7', type: 'expense' },
  { name: 'Entertainment', icon: '🍿', color: '#F06A50', type: 'expense' },
  { name: 'Personal', icon: '✨', color: '#E865A0', type: 'expense' },
  { name: 'Salary', icon: '💰', color: '#3ecf8e', type: 'income' },
  { name: 'Freelance', icon: '💻', color: '#4a9eff', type: 'income' },
  { name: 'Gift', icon: '🎁', color: '#f59e0b', type: 'income' },
  { name: 'Other', icon: '📦', color: '#9090A8', type: 'both' },
];

type Tab = 'transactions' | 'accounts' | 'budgets' | 'savings';

export default function FinanceTracker({ 
  transactions, addTransaction, removeTransaction,
  accounts, setAccounts,
  budgets, setBudgets,
  savingsGoals, setSavingsGoals
}: FinanceTrackerProps) {
  const [activeTab, setActiveTab] = useState<Tab>('transactions');
  const [showAdd, setShowAdd] = useState(false);
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [showAddBudget, setShowAddBudget] = useState(false);
  const [showAddGoal, setShowAddGoal] = useState(false);

  // Transaction Form State
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0].name);
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [accountId, setAccountId] = useState(accounts[0]?.id || '');
  const [transactionDate, setTransactionDate] = useState(new Date().toISOString().split('T')[0]);
  const [transactionTime, setTransactionTime] = useState(new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }));

  React.useEffect(() => {
    if (!accountId && accounts.length > 0) {
      setAccountId(accounts[0].id);
    }
  }, [accounts, accountId]);

  // Account Form State
  const [accName, setAccName] = useState('');
  const [accType, setAccType] = useState<Account['type']>('cash');
  const [accBalance, setAccBalance] = useState('');

  // Budget Form State
  const [budCat, setBudCat] = useState(CATEGORIES[0].name);
  const [budLimit, setBudLimit] = useState('');

  // Goal Form State
  const [goalName, setGoalName] = useState('');
  const [goalTarget, setGoalTarget] = useState('');
  const [goalIcon, setGoalIcon] = useState('🎯');

  const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  
  const weeklyData = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const data = days.map(day => ({ name: day, amount: 0 }));
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    startOfWeek.setHours(0, 0, 0, 0);

    transactions.filter(t => t.type === 'expense').forEach(e => {
      const d = new Date(e.date);
      if (d >= startOfWeek) {
        data[d.getDay()].amount += e.amount;
      }
    });
    return data;
  }, [transactions]);

  const groupedTransactions = useMemo(() => {
    const groups: Record<string, Transaction[]> = {};
    [...transactions].reverse().forEach(t => {
      const date = new Date(t.date).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
      const today = new Date().toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
      const label = date === today ? 'Today' : date;
      if (!groups[label]) groups[label] = [];
      groups[label].push(t);
    });
    return groups;
  }, [transactions]);

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      toast.error('Please enter a description');
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    if (!accountId) {
      toast.error('Please select an account');
      return;
    }
    const val = parseFloat(amount);
    
    // Combine date and time
    const [year, month, day] = transactionDate.split('-').map(Number);
    const [hours, minutes] = transactionTime.split(':').map(Number);
    const combinedDate = new Date(year, month - 1, day, hours, minutes);
    
    addTransaction({
      title,
      amount: val,
      category,
      type,
      accountId,
      date: combinedDate.toISOString()
    });
    
    // Update account balance
    setAccounts(prev => prev.map(a => 
      a.id === accountId 
        ? { ...a, balance: type === 'income' ? a.balance + val : a.balance - val }
        : a
    ));

    toast.success(`${type === 'income' ? 'Added' : 'Subtracted'} ৳${val.toLocaleString()} ${type === 'income' ? 'to' : 'from'} ${accounts.find(a => a.id === accountId)?.name}`);

    setTitle('');
    setAmount('');
    setShowAdd(false);
  };

  const handleAddAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accName || !accBalance) return;
    const newAcc: Account = {
      id: Math.random().toString(36).substr(2, 9),
      name: accName,
      type: accType,
      balance: parseFloat(accBalance),
      color: accType === 'cash' ? '#3ecf8e' : accType === 'bank' ? '#4a9eff' : '#e2136e'
    };
    setAccounts(prev => [...prev, newAcc]);
    setAccName('');
    setAccBalance('');
    setShowAddAccount(false);
  };

  const handleAddBudget = (e: React.FormEvent) => {
    e.preventDefault();
    if (!budLimit) return;
    const newBud: Budget = {
      id: Math.random().toString(36).substr(2, 9),
      category: budCat,
      limit: parseFloat(budLimit),
      period: 'monthly'
    };
    setBudgets(prev => [...prev, newBud]);
    setBudLimit('');
    setShowAddBudget(false);
  };

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalName || !goalTarget) return;
    const newGoal: SavingsGoal = {
      id: Math.random().toString(36).substr(2, 9),
      name: goalName,
      targetAmount: parseFloat(goalTarget),
      currentAmount: 0,
      icon: goalIcon
    };
    setSavingsGoals(prev => [...prev, newGoal]);
    setGoalName('');
    setGoalTarget('');
    setShowAddGoal(false);
  };

  const handleRemoveTransaction = (id: string) => {
    const t = transactions.find(t => t.id === id);
    if (t) {
      setAccounts(prev => prev.map(a => 
        a.id === t.accountId 
          ? { ...a, balance: t.type === 'income' ? a.balance - t.amount : a.balance + t.amount }
          : a
      ));
    }
    removeTransaction(id);
  };

  const getCategoryIcon = (name: string) => CATEGORIES.find(c => c.name === name)?.icon || '💰';
  const getCategoryColor = (name: string) => CATEGORIES.find(c => c.name === name)?.color || '#7c6ff7';

  const filteredCategories = CATEGORIES.filter(c => c.type === type || c.type === 'both');

  return (
    <div className="space-y-10 pb-20">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-black leading-tight tracking-tighter bg-gradient-to-br from-text-primary to-text-primary/60 bg-clip-text text-transparent">
            Finance
          </h1>
          <p className="text-sm font-bold text-text-secondary mt-1 tracking-tight">Track your daily flow</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => {
              if (activeTab === 'transactions') setShowAdd(true);
              if (activeTab === 'accounts') setShowAddAccount(true);
              if (activeTab === 'budgets') setShowAddBudget(true);
              if (activeTab === 'savings') setShowAddGoal(true);
            }}
            className="w-14 h-14 rounded-full bg-accent text-white flex items-center justify-center shadow-xl shadow-accent/30 hover:scale-110 active:scale-95 transition-all duration-300 glass border-white/20 group"
          >
            <Plus size={28} className="group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex gap-2 p-1.5 glass rounded-[24px] bg-white/5 w-fit mb-10">
        {(['transactions', 'accounts', 'budgets', 'savings'] as Tab[]).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2.5 rounded-2xl text-[10px] font-black transition-all duration-300 tracking-[0.2em] uppercase ${
              activeTab === tab 
                ? 'bg-white/10 text-white shadow-lg border border-white/10 scale-105' 
                : 'text-text-secondary hover:bg-white/5 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'transactions' && (
        <>
          {/* Hero Summary Card */}
          <div className="glass bg-white/5 border border-white/10 rounded-[40px] p-10 relative overflow-hidden group shadow-2xl">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-accent/20 blur-[120px] opacity-20 group-hover:opacity-30 transition-opacity duration-700" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-teal-custom/10 blur-[120px] opacity-10 group-hover:opacity-20 transition-opacity duration-700" />
            
            <div className="relative z-10">
              <div className="text-[11px] font-black text-text-tertiary uppercase tracking-[0.4em] mb-4">Net Balance</div>
              <div className="flex items-baseline gap-2">
                <span className="text-7xl font-black tracking-tighter text-white drop-shadow-2xl">৳{totalBalance.toLocaleString()}</span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-12">
                <div className="glass bg-white/5 border border-white/10 rounded-[32px] p-8 shadow-xl hover:bg-white/10 transition-all duration-500">
                  <div className="flex items-center gap-2 text-[10px] font-black text-text-tertiary uppercase tracking-widest mb-3">
                    <div className="w-6 h-6 rounded-lg bg-success/20 flex items-center justify-center">
                      <ArrowDownRight size={14} className="text-success" />
                    </div>
                    Income
                  </div>
                  <div className="text-3xl font-black text-success tracking-tighter">৳{totalIncome.toLocaleString()}</div>
                </div>
                <div className="glass bg-white/5 border border-white/10 rounded-[32px] p-8 shadow-xl hover:bg-white/10 transition-all duration-500">
                  <div className="flex items-center gap-2 text-[10px] font-black text-text-tertiary uppercase tracking-widest mb-3">
                    <div className="w-6 h-6 rounded-lg bg-danger/20 flex items-center justify-center">
                      <ArrowUpRight size={14} className="text-danger" />
                    </div>
                    Expense
                  </div>
                  <div className="text-3xl font-black text-danger tracking-tighter">৳{totalExpense.toLocaleString()}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Stylized Chart */}
          <div className="glass bg-white/5 border border-white/10 rounded-[40px] p-8 relative overflow-hidden group shadow-xl">
            <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity bg-accent" />
            <div className="flex items-center justify-between mb-10 px-2">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-accent shadow-[0_0_12px_rgba(124,111,247,0.6)]" />
                <h3 className="text-xs font-black text-white uppercase tracking-[0.2em]">Spending Trend</h3>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-black text-success bg-success/10 px-4 py-1.5 rounded-full border border-success/20 tracking-widest">
                <TrendingUp size={12} />
                STABLE
              </div>
            </div>
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyData}>
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7c6ff7" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#7c6ff7" stopOpacity={0}/>
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
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', fontSize: '12px' }}
                    itemStyle={{ color: '#7c6ff7', fontWeight: 800 }}
                    cursor={{ stroke: '#7c6ff7', strokeWidth: 1, strokeDasharray: '4 4' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#7c6ff7" 
                    strokeWidth={4} 
                    fillOpacity={1} 
                    fill="url(#colorAmount)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Transactions List */}
          <div className="space-y-8">
            <h3 className="text-xs font-black text-text-tertiary uppercase tracking-[0.3em] px-4">Transactions</h3>
            <div className="space-y-10">
              {Object.entries(groupedTransactions).map(([date, items]) => (
                <div key={date} className="space-y-4">
                  <div className="text-[11px] font-black text-white/40 uppercase tracking-[0.2em] px-4 flex items-center gap-2">
                    <Calendar size={12} />
                    {date}
                  </div>
                  <div className="space-y-3">
                    {(items as Transaction[]).map((t) => (
                      <motion.div 
                        layout
                        key={t.id} 
                        className="glass bg-white/5 border border-white/10 rounded-[24px] p-5 flex items-center justify-between group hover:border-white/20 hover:bg-white/10 transition-all duration-300 shadow-lg"
                      >
                        <div className="flex items-center gap-5">
                          <div 
                            className="w-14 h-14 rounded-[20px] flex items-center justify-center text-3xl shadow-inner"
                            style={{ backgroundColor: `${getCategoryColor(t.category)}15`, border: `1px solid ${getCategoryColor(t.category)}20` }}
                          >
                            {getCategoryIcon(t.category)}
                          </div>
                          <div>
                            <div className="font-black text-base text-white tracking-tight">{t.title}</div>
                            <div className="text-[10px] font-black text-text-tertiary uppercase mt-1 tracking-widest">
                              {new Date(t.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {t.category} • {accounts.find(a => a.id === t.accountId)?.name}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className={`text-xl font-black tracking-tighter ${t.type === 'income' ? 'text-success' : 'text-white'}`}>
                            {t.type === 'income' ? '+' : '-'}৳{t.amount.toLocaleString()}
                          </div>
                          <button 
                            onClick={() => handleRemoveTransaction(t.id)}
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-text-tertiary hover:text-danger hover:bg-danger/10 opacity-0 group-hover:opacity-100 transition-all duration-300"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
              {transactions.length === 0 && (
                <div className="py-24 text-center glass border-2 border-dashed border-white/10 rounded-[40px]">
                  <Wallet className="mx-auto text-text-tertiary mb-6 opacity-20" size={64} />
                  <p className="text-text-tertiary font-black uppercase tracking-widest">No transactions yet. Tap + to start.</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {activeTab === 'accounts' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {accounts.map(acc => (
            <div key={acc.id} className="liquid-card relative overflow-hidden group">
              <div className="absolute -top-12 -right-12 w-48 h-48 opacity-[0.1] group-hover:opacity-[0.2] transition-opacity blur-3xl" style={{ backgroundColor: acc.color }} />
              <div className="flex justify-between items-start mb-8">
                <div>
                  <div className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.2em] mb-2">{acc.type}</div>
                  <h3 className="text-2xl font-black text-white tracking-tighter">{acc.name}</h3>
                </div>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg" style={{ backgroundColor: `${acc.color}15`, color: acc.color, border: `1px solid ${acc.color}20` }}>
                  <Wallet size={24} />
                </div>
              </div>
              <div className="flex items-end justify-between">
                <div className="text-4xl font-black text-white tracking-tighter">৳{acc.balance.toLocaleString()}</div>
                <button 
                  onClick={() => {
                    setAccountId(acc.id);
                    setType('income');
                    setCategory('Salary');
                    setShowAdd(true);
                  }}
                  className="glass bg-accent hover:bg-accent-light text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-300 shadow-lg shadow-accent/30 active:scale-95 flex items-center gap-2"
                >
                  <Plus size={14} />
                  Add Money
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'budgets' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {budgets.map(bud => {
            const spent = transactions
              .filter(t => t.category === bud.category && t.type === 'expense')
              .reduce((sum, t) => sum + t.amount, 0);
            const pct = Math.min((spent / bud.limit) * 100, 100);
            return (
              <div key={bud.id} className="liquid-card group">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-[20px] bg-white/5 flex items-center justify-center text-3xl shadow-inner border border-white/10">
                      {getCategoryIcon(bud.category)}
                    </div>
                    <div>
                      <h3 className="font-black text-white tracking-tight">{bud.category}</h3>
                      <div className="text-[10px] text-text-tertiary font-black uppercase tracking-widest">{bud.period}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-black text-white tracking-tighter">৳{spent.toLocaleString()} / ৳{bud.limit.toLocaleString()}</div>
                    <div className={`text-[10px] font-black uppercase tracking-widest mt-1 ${pct > 90 ? 'text-danger' : 'text-text-tertiary'}`}>
                      {Math.round(pct)}% Used
                    </div>
                  </div>
                </div>
                <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden p-[2px] border border-white/5">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(255,255,255,0.1)] ${pct > 90 ? 'bg-danger' : pct > 70 ? 'bg-warning' : 'bg-accent'}`} 
                    style={{ width: `${pct}%` }} 
                  />
                </div>
              </div>
            );
          })}
          {budgets.length === 0 && (
            <div className="py-24 text-center glass border-2 border-dashed border-white/10 rounded-[40px] col-span-full">
              <p className="text-text-tertiary font-black uppercase tracking-widest">No budgets set. Tap + to add one.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'savings' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {savingsGoals.map(goal => {
            const pct = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
            return (
              <div key={goal.id} className="liquid-card group relative overflow-hidden">
                <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity bg-accent" />
                <div className="flex justify-between items-start mb-8">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-[24px] bg-accent/10 flex items-center justify-center text-4xl shadow-inner border border-accent/20">
                      {goal.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-white tracking-tighter">{goal.name}</h3>
                      <div className="text-[10px] text-text-tertiary font-black uppercase tracking-widest">Savings Goal</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-black text-accent tracking-tighter">{Math.round(pct)}%</div>
                  </div>
                </div>
                
                <div className="space-y-3 mb-8">
                  <div className="flex justify-between text-[11px] font-black uppercase tracking-[0.2em] text-text-tertiary">
                    <span>৳{goal.currentAmount.toLocaleString()}</span>
                    <span>৳{goal.targetAmount.toLocaleString()}</span>
                  </div>
                  <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden p-[2px] border border-white/5">
                    <div className="h-full bg-accent rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(124,111,247,0.4)]" style={{ width: `${pct}%` }} />
                  </div>
                </div>

                <div className="flex gap-3">
                  {[100, 500, 1000].map(amt => (
                    <button
                      key={amt}
                      onClick={() => setSavingsGoals(prev => prev.map(g => g.id === goal.id ? { ...g, currentAmount: g.currentAmount + amt } : g))}
                      className="flex-1 py-3 glass bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 hover:border-accent/50 transition-all duration-300"
                    >
                      +৳{amt}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
          {savingsGoals.length === 0 && (
            <div className="py-24 text-center glass border-2 border-dashed border-white/10 rounded-[40px] col-span-full">
              <p className="text-text-tertiary font-black uppercase tracking-widest">No savings goals. Tap + to start saving.</p>
            </div>
          )}
        </div>
      )}

      {/* Add Transaction Modal */}
      <AnimatePresence>
        {showAdd && (
          <div className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAdd(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ y: '100%', scale: 0.95, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: '100%', scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-md glass bg-white/10 border border-white/20 rounded-[32px] p-8 shadow-2xl overflow-y-auto max-h-[90vh] custom-scrollbar"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black tracking-tighter text-white">New Transaction</h2>
                <button onClick={() => setShowAdd(false)} className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 text-text-tertiary hover:text-white hover:bg-white/10 transition-all active:scale-90">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleAddTransaction} className="space-y-6">
                <div className="flex gap-2 p-1 glass rounded-[20px] bg-white/5">
                  <button
                    type="button"
                    onClick={() => setType('expense')}
                    className={`flex-1 py-3 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all duration-300 ${
                      type === 'expense' ? 'bg-danger text-white shadow-lg shadow-danger/20 scale-105' : 'text-text-tertiary hover:text-white'
                    }`}
                  >
                    Expense
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('income')}
                    className={`flex-1 py-3 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all duration-300 ${
                      type === 'income' ? 'bg-success text-white shadow-lg shadow-success/20 scale-105' : 'text-text-tertiary hover:text-white'
                    }`}
                  >
                    Income
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em] px-2">Amount</label>
                  <div className="relative group">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-2xl font-black text-text-tertiary group-focus-within:text-accent transition-colors">৳</span>
                    <input 
                      autoFocus
                      type="number" 
                      value={amount}
                      onChange={e => setAmount(e.target.value)}
                      placeholder="0"
                      className="w-full glass bg-white/5 border border-white/10 rounded-[20px] pl-12 pr-6 py-4 text-3xl font-black text-white focus:border-accent/50 focus:bg-white/10 outline-none transition-all shadow-inner tracking-tighter"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em] px-2">Description</label>
                  <input 
                    type="text" 
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="What's this for?"
                    className="w-full glass bg-white/5 border border-white/10 rounded-[20px] px-5 py-3.5 text-sm font-bold text-white focus:border-accent/50 focus:bg-white/10 outline-none transition-all shadow-inner"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em] px-2">Date</label>
                    <input 
                      type="date" 
                      value={transactionDate}
                      onChange={e => setTransactionDate(e.target.value)}
                      className="w-full glass bg-white/5 border border-white/10 rounded-[20px] px-5 py-3.5 text-xs font-bold text-white focus:border-accent/50 focus:bg-white/10 outline-none transition-all shadow-inner"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em] px-2">Time</label>
                    <input 
                      type="time" 
                      value={transactionTime}
                      onChange={e => setTransactionTime(e.target.value)}
                      className="w-full glass bg-white/5 border border-white/10 rounded-[20px] px-5 py-3.5 text-xs font-bold text-white focus:border-accent/50 focus:bg-white/10 outline-none transition-all shadow-inner"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em] px-2">Account</label>
                  <div className="relative">
                    <select 
                      value={accountId}
                      onChange={e => setAccountId(e.target.value)}
                      className="w-full glass bg-white/5 border border-white/10 rounded-[20px] px-5 py-3.5 text-xs font-bold text-white focus:border-accent/50 focus:bg-white/10 outline-none transition-all appearance-none shadow-inner"
                    >
                      {accounts.map(a => (
                        <option key={a.id} value={a.id} className="bg-[#1a1a1a] text-white">{a.name} (৳{a.balance.toLocaleString()})</option>
                      ))}
                    </select>
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-text-tertiary">
                      <ChevronDown size={16} />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em] px-2">Category</label>
                  <div className="grid grid-cols-3 gap-2">
                    {filteredCategories.map(c => (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => setCategory(c.name)}
                        className={`flex flex-col items-center gap-1.5 p-3 rounded-[20px] border transition-all duration-300 ${
                          category === c.name 
                            ? 'bg-accent/20 border-accent text-accent shadow-lg shadow-accent/20 scale-105' 
                            : 'glass bg-white/5 border-white/10 text-text-tertiary hover:border-white/30 hover:text-white'
                        }`}
                      >
                        <span className="text-xl">{c.icon}</span>
                        <span className="text-[9px] font-black uppercase tracking-widest">{c.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <button 
                  type="submit"
                  className={`w-full text-white font-black py-4 rounded-[24px] text-lg shadow-2xl transition-all duration-300 mt-4 hover:scale-[1.02] active:scale-95 ${
                    type === 'income' ? 'bg-success shadow-success/30' : 'bg-accent shadow-accent/30'
                  }`}
                >
                  Save Transaction
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Account Modal */}
      <AnimatePresence>
        {showAddAccount && (
          <div className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddAccount(false)} className="absolute inset-0 bg-black/60 backdrop-blur-md" />
            <motion.div initial={{ y: '100%', scale: 0.95 }} animate={{ y: 0, scale: 1 }} exit={{ y: '100%', scale: 0.95 }} className="relative w-full max-w-md glass bg-white/10 border border-white/20 rounded-[40px] p-10 shadow-2xl">
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-3xl font-black tracking-tighter text-white">New Account</h2>
                <button onClick={() => setShowAddAccount(false)} className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white/5 text-text-tertiary hover:text-white hover:bg-white/10 transition-all"><X size={24} /></button>
              </div>
              <form onSubmit={handleAddAccount} className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-text-tertiary uppercase tracking-[0.3em] px-2">Account Name</label>
                  <input type="text" value={accName} onChange={e => setAccName(e.target.value)} placeholder="e.g. City Bank" className="w-full glass bg-white/5 border border-white/10 rounded-[24px] px-6 py-5 text-base font-bold text-white focus:border-accent outline-none transition-all shadow-inner" />
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-text-tertiary uppercase tracking-[0.3em] px-2">Initial Balance</label>
                  <input type="number" value={accBalance} onChange={e => setAccBalance(e.target.value)} placeholder="0" className="w-full glass bg-white/5 border border-white/10 rounded-[24px] px-6 py-5 text-base font-bold text-white focus:border-accent outline-none transition-all shadow-inner" />
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-text-tertiary uppercase tracking-[0.3em] px-2">Type</label>
                  <div className="grid grid-cols-2 gap-3">
                    {(['cash', 'bank', 'mobile', 'card'] as Account['type'][]).map(t => (
                      <button key={t} type="button" onClick={() => setAccType(t)} className={`py-4 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${accType === t ? 'bg-accent/20 border-accent text-accent shadow-lg shadow-accent/20 scale-105' : 'glass bg-white/5 border-white/10 text-text-tertiary hover:border-white/30 hover:text-white'}`}>{t}</button>
                    ))}
                  </div>
                </div>
                <button type="submit" className="w-full bg-accent text-white font-black py-6 rounded-[24px] text-xl shadow-2xl shadow-accent/30 hover:scale-[1.02] active:scale-95 transition-all duration-300 mt-6">Create Account</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Budget Modal */}
      <AnimatePresence>
        {showAddBudget && (
          <div className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddBudget(false)} className="absolute inset-0 bg-black/60 backdrop-blur-md" />
            <motion.div initial={{ y: '100%', scale: 0.95 }} animate={{ y: 0, scale: 1 }} exit={{ y: '100%', scale: 0.95 }} className="relative w-full max-w-md glass bg-white/10 border border-white/20 rounded-[40px] p-10 shadow-2xl">
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-3xl font-black tracking-tighter text-white">New Budget</h2>
                <button onClick={() => setShowAddBudget(false)} className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white/5 text-text-tertiary hover:text-white hover:bg-white/10 transition-all"><X size={24} /></button>
              </div>
              <form onSubmit={handleAddBudget} className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-text-tertiary uppercase tracking-[0.3em] px-2">Category</label>
                  <div className="relative">
                    <select value={budCat} onChange={e => setBudCat(e.target.value)} className="w-full glass bg-white/5 border border-white/10 rounded-[24px] px-6 py-5 text-sm font-bold text-white focus:border-accent outline-none transition-all appearance-none shadow-inner">
                      {CATEGORIES.filter(c => c.type === 'expense' || c.type === 'both').map(c => (
                        <option key={c.name} value={c.name} className="bg-bg-primary">{c.icon} {c.name}</option>
                      ))}
                    </select>
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-text-tertiary">
                      <ChevronDown size={18} />
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-text-tertiary uppercase tracking-[0.3em] px-2">Monthly Limit</label>
                  <input type="number" value={budLimit} onChange={e => setBudLimit(e.target.value)} placeholder="0" className="w-full glass bg-white/5 border border-white/10 rounded-[24px] px-6 py-5 text-base font-bold text-white focus:border-accent outline-none transition-all shadow-inner" />
                </div>
                <button type="submit" className="w-full bg-accent text-white font-black py-6 rounded-[24px] text-xl shadow-2xl shadow-accent/30 hover:scale-[1.02] active:scale-95 transition-all duration-300 mt-6">Set Budget</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Goal Modal */}
      <AnimatePresence>
        {showAddGoal && (
          <div className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddGoal(false)} className="absolute inset-0 bg-black/60 backdrop-blur-md" />
            <motion.div initial={{ y: '100%', scale: 0.95 }} animate={{ y: 0, scale: 1 }} exit={{ y: '100%', scale: 0.95 }} className="relative w-full max-w-md glass bg-white/10 border border-white/20 rounded-[40px] p-10 shadow-2xl">
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-3xl font-black tracking-tighter text-white">New Savings Goal</h2>
                <button onClick={() => setShowAddGoal(false)} className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white/5 text-text-tertiary hover:text-white hover:bg-white/10 transition-all"><X size={24} /></button>
              </div>
              <form onSubmit={handleAddGoal} className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-text-tertiary uppercase tracking-[0.3em] px-2">Goal Name</label>
                  <input type="text" value={goalName} onChange={e => setGoalName(e.target.value)} placeholder="e.g. New iPhone" className="w-full glass bg-white/5 border border-white/10 rounded-[24px] px-6 py-5 text-base font-bold text-white focus:border-accent outline-none transition-all shadow-inner" />
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-text-tertiary uppercase tracking-[0.3em] px-2">Target Amount</label>
                  <input type="number" value={goalTarget} onChange={e => setGoalTarget(e.target.value)} placeholder="0" className="w-full glass bg-white/5 border border-white/10 rounded-[24px] px-6 py-5 text-base font-bold text-white focus:border-accent outline-none transition-all shadow-inner" />
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-text-tertiary uppercase tracking-[0.3em] px-2">Icon</label>
                  <div className="flex gap-3">
                    {['🎯', '🏠', '🚗', '✈️', '💻', '📱'].map(i => (
                      <button key={i} type="button" onClick={() => setGoalIcon(i)} className={`w-14 h-14 rounded-2xl border text-2xl flex items-center justify-center transition-all duration-300 ${goalIcon === i ? 'bg-accent/20 border-accent scale-110 shadow-lg shadow-accent/20' : 'glass bg-white/5 border-white/10 hover:border-white/30'}`}>{i}</button>
                    ))}
                  </div>
                </div>
                <button type="submit" className="w-full bg-accent text-white font-black py-6 rounded-[24px] text-xl shadow-2xl shadow-accent/30 hover:scale-[1.02] active:scale-95 transition-all duration-300 mt-6">Start Saving</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
