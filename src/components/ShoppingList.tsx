import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { ShoppingItem } from '../types';

interface ShoppingListProps {
  items: ShoppingItem[];
  shopDone: string[];
  toggleShop: (id: string) => void;
  addItem: (item: Omit<ShoppingItem, 'id'>) => void;
  removeItem: (id: string) => void;
}

export default function ShoppingList({ items, shopDone, toggleShop, addItem, removeItem }: ShoppingListProps) {
  const [showAdd, setShowAdd] = useState(false);
  const [newItem, setNewItem] = useState<Omit<ShoppingItem, 'id'>>({ name: '', category: 'Furniture & Study' });

  const categories = Array.from(new Set(items.map(i => i.category)));

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-5xl font-black leading-tight tracking-tighter bg-gradient-to-br from-white via-white to-white/40 bg-clip-text text-transparent drop-shadow-sm">
            Shopping List
          </h1>
          <p className="text-sm font-bold text-text-secondary mt-2 tracking-tight flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            Click to mark as bought
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative hidden md:block group">
            <input 
              type="text"
              placeholder="Quick add item..."
              className="w-64 glass bg-white/5 border border-white/10 rounded-[24px] pl-6 pr-12 py-3.5 text-xs font-bold text-white focus:border-accent/50 focus:bg-white/10 outline-none transition-all shadow-inner"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.currentTarget.value) {
                  addItem({ name: e.currentTarget.value, category: 'Furniture & Study' });
                  toast.success(`"${e.currentTarget.value}" added to Furniture & Study!`);
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
            <span className="tracking-tight">Add Item</span>
          </button>
        </div>
      </header>

      {showAdd && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xl z-[100] flex items-center justify-center p-4">
          <div className="glass bg-white/10 border border-white/20 rounded-[40px] p-8 w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-300">
            <h2 className="text-2xl font-black mb-6 tracking-tight">Add New Item</h2>
            <div className="space-y-6">
              <div>
                <label className="text-[11px] font-black text-white/40 uppercase mb-2 block tracking-widest">Item Name</label>
                <input
                  type="text"
                  value={newItem.name}
                  onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-sm focus:border-accent outline-none transition-all focus:bg-white/10"
                  placeholder="e.g. New Notebook"
                />
              </div>
              <div>
                <label className="text-[11px] font-black text-white/40 uppercase mb-2 block tracking-widest">Category</label>
                <input
                  type="text"
                  list="shopping-categories"
                  value={newItem.category}
                  onChange={e => setNewItem({ ...newItem, category: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-sm focus:border-accent outline-none transition-all focus:bg-white/10"
                  placeholder="Select or type category"
                />
                <datalist id="shopping-categories">
                  {categories.map(c => <option key={c} value={c} />)}
                </datalist>
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
                    if (newItem.name && newItem.category) {
                      addItem(newItem);
                      setShowAdd(false);
                      setNewItem({ name: '', category: 'Furniture & Study' });
                      toast.success(`Item "${newItem.name}" added!`);
                    }
                  }}
                  className="flex-1 bg-accent text-white px-4 py-4 rounded-2xl font-bold hover:bg-accent-light transition-all shadow-lg shadow-accent/20"
                >
                  Save Item
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {categories.map(cat => (
          <div key={cat} className="space-y-5">
            <h3 className="text-[11px] font-black text-white/30 uppercase tracking-[0.3em] px-4">
              {cat}
            </h3>
            <div className="space-y-3">
              {items.filter(i => i.category === cat).map((item) => {
                const bought = shopDone.includes(item.id);
                return (
                  <div 
                    key={item.id}
                    className={`flex items-center gap-5 p-5 rounded-[32px] border transition-all duration-500 group relative overflow-hidden ${
                      bought 
                        ? 'bg-white/5 border-white/5 opacity-40' 
                        : 'glass bg-white/5 border border-white/10 hover:border-white/30 hover:bg-white/10 shadow-xl'
                    }`}
                  >
                    <div className="absolute -top-12 -right-12 w-24 h-24 bg-white/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <div 
                      onClick={() => toggleShop(item.id)}
                      className="flex items-center gap-5 flex-1 cursor-pointer select-none relative z-10"
                    >
                      <div className={`w-7 h-7 rounded-[12px] border-2 flex items-center justify-center transition-all duration-500 ${
                        bought ? 'bg-success border-success shadow-lg shadow-success/30 scale-90' : 'border-white/20 bg-white/5 group-hover:border-white/40'
                      }`}>
                        {bought && <svg width="14" height="14" viewBox="0 0 10 10" className="animate-in zoom-in duration-300"><path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                      </div>
                      <div className={`text-base font-bold tracking-tight transition-all duration-300 ${bought ? 'line-through text-white/40' : 'text-white'}`}>{item.name}</div>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-3 rounded-2xl text-white/10 hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 relative z-10"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
