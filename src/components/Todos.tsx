import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Todo } from '../types';

interface TodosProps {
  todos: Todo[];
  todoDone: string[];
  toggleTodo: (id: string) => void;
  addTodo: (todo: Omit<Todo, 'id'>) => void;
  removeTodo: (id: string) => void;
}

export default function Todos({ todos, todoDone, toggleTodo, addTodo, removeTodo }: TodosProps) {
  const [showAdd, setShowAdd] = useState(false);
  const [newTodo, setNewTodo] = useState<Omit<Todo, 'id'>>({ text: '', category: 'home' });

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-5xl font-black leading-tight tracking-tighter bg-gradient-to-br from-white via-white to-white/40 bg-clip-text text-transparent drop-shadow-sm">
            To-Dos & Errands
          </h1>
          <p className="text-sm font-bold text-text-secondary mt-2 tracking-tight flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            Click items to mark done
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative hidden md:block group">
            <input 
              type="text"
              placeholder="Quick add task..."
              className="w-64 glass bg-white/5 border border-white/10 rounded-[24px] pl-6 pr-12 py-3.5 text-xs font-bold text-white focus:border-accent/50 focus:bg-white/10 outline-none transition-all shadow-inner"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.currentTarget.value) {
                  addTodo({ text: e.currentTarget.value, category: 'home' });
                  toast.success('Task added to Home!');
                  e.currentTarget.value = '';
                }
              }}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-text-tertiary group-focus-within:text-accent transition-colors">
              <Plus size={16} />
            </div>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            className="group relative flex items-center gap-3 bg-accent hover:bg-accent-light text-white px-8 py-4 rounded-[24px] font-black transition-all duration-500 shadow-2xl shadow-accent/40 active:scale-95 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <Plus size={20} className="group-hover:rotate-90 transition-transform duration-500" />
            <span className="tracking-tight">Add Task</span>
          </button>
        </div>
      </header>

      {showAdd && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xl z-[100] flex items-center justify-center p-4">
          <div className="glass bg-white/10 border border-white/20 rounded-[40px] p-8 w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-300">
            <h2 className="text-2xl font-black mb-6 tracking-tight">Add New Task</h2>
            <div className="space-y-6">
              <div>
                <label className="text-[11px] font-black text-white/40 uppercase mb-2 block tracking-widest">Task Description</label>
                <input
                  type="text"
                  value={newTodo.text}
                  onChange={e => setNewTodo({ ...newTodo, text: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-sm focus:border-accent outline-none transition-all focus:bg-white/10"
                  placeholder="e.g. Clean the room"
                />
              </div>
              <div>
                <label className="text-[11px] font-black text-white/40 uppercase mb-2 block tracking-widest">Category</label>
                <select
                  value={newTodo.category}
                  onChange={e => setNewTodo({ ...newTodo, category: e.target.value as any })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-sm focus:border-accent outline-none transition-all focus:bg-white/10 appearance-none"
                >
                  <option value="home">🏠 Do at Home</option>
                  <option value="outside">📍 Need to Go Outside</option>
                </select>
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
                    if (newTodo.text) {
                      addTodo(newTodo);
                      setShowAdd(false);
                      setNewTodo({ text: '', category: 'home' });
                      toast.success(`Task added!`);
                    }
                  }}
                  className="flex-1 bg-accent text-white px-4 py-4 rounded-2xl font-bold hover:bg-accent-light transition-all shadow-lg shadow-accent/20"
                >
                  Save Task
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-10">
          <section>
            <h3 className="text-[11px] font-black text-white/30 uppercase tracking-[0.3em] px-4 mb-5 flex items-center gap-2">
              🏠 Do at Home
            </h3>
            <div className="space-y-4">
              {todos.filter(t => t.category === 'home').map((t) => {
                const done = todoDone.includes(t.id);
                return (
                  <div 
                    key={t.id}
                    className={`flex items-center gap-5 p-5 rounded-[32px] border transition-all duration-500 group relative overflow-hidden ${
                      done 
                        ? 'bg-white/5 border-white/5 opacity-40' 
                        : 'glass bg-white/5 border border-white/10 hover:border-white/30 hover:bg-white/10 shadow-xl'
                    }`}
                  >
                    <div className="absolute -top-12 -right-12 w-24 h-24 bg-white/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <div 
                      onClick={() => toggleTodo(t.id)}
                      className="flex items-center gap-5 flex-1 cursor-pointer select-none relative z-10"
                    >
                      <div className={`w-7 h-7 rounded-[12px] border-2 flex items-center justify-center transition-all duration-500 ${
                        done ? 'bg-accent border-accent shadow-lg shadow-accent/30 scale-90' : 'border-white/20 bg-white/5 group-hover:border-white/40'
                      }`}>
                        {done && <svg width="14" height="14" viewBox="0 0 10 10" className="animate-in zoom-in duration-300"><path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                      </div>
                      <div className={`text-base font-bold tracking-tight transition-all duration-300 ${done ? 'line-through text-white/40' : 'text-white'}`}>{t.text}</div>
                    </div>
                    <button
                      onClick={() => removeTodo(t.id)}
                      className="p-3 rounded-2xl text-white/10 hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 relative z-10"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                );
              })}
            </div>
          </section>

          <section>
            <h3 className="text-[11px] font-black text-white/30 uppercase tracking-[0.3em] px-4 mb-5 flex items-center gap-2">
              📍 Need to Go Outside
            </h3>
            <div className="space-y-4">
              {todos.filter(t => t.category === 'outside').map((t) => {
                const done = todoDone.includes(t.id);
                return (
                  <div 
                    key={t.id}
                    className={`flex items-center gap-5 p-5 rounded-[32px] border transition-all duration-500 group relative overflow-hidden ${
                      done 
                        ? 'bg-white/5 border-white/5 opacity-40' 
                        : 'glass bg-white/5 border border-white/10 hover:border-white/30 hover:bg-white/10 shadow-xl'
                    }`}
                  >
                    <div className="absolute -top-12 -right-12 w-24 h-24 bg-white/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <div 
                      onClick={() => toggleTodo(t.id)}
                      className="flex items-center gap-5 flex-1 cursor-pointer select-none relative z-10"
                    >
                      <div className={`w-7 h-7 rounded-[12px] border-2 flex items-center justify-center transition-all duration-500 ${
                        done ? 'bg-accent border-accent shadow-lg shadow-accent/30 scale-90' : 'border-white/20 bg-white/5 group-hover:border-white/40'
                      }`}>
                        {done && <svg width="14" height="14" viewBox="0 0 10 10" className="animate-in zoom-in duration-300"><path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                      </div>
                      <div className={`text-base font-bold tracking-tight transition-all duration-300 ${done ? 'line-through text-white/40' : 'text-white'}`}>{t.text}</div>
                    </div>
                    <button
                      onClick={() => removeTodo(t.id)}
                      className="p-3 rounded-2xl text-white/10 hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 relative z-10"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        <section className="space-y-5">
          <h3 className="text-[11px] font-black text-white/30 uppercase tracking-[0.3em] px-4 flex items-center gap-2">
            📝 Notes to Self
          </h3>
          <div className="glass bg-white/5 border border-white/10 rounded-[40px] p-8 text-base text-white/60 leading-relaxed font-medium italic shadow-2xl">
            These are one-time setup tasks. Once done, your routine will run smoothly. Prioritize room arrangement and diet plan first — they affect your daily energy.
          </div>
        </section>
      </div>
    </div>
  );
}
