import { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, Plus, Trash2, AlertCircle } from 'lucide-react';
import { Exam } from '../types';

interface ExamTrackerProps {
  exams: Exam[];
  addExam: (exam: Omit<Exam, 'id'>) => void;
  removeExam: (id: string) => void;
}

export default function ExamTracker({ exams, addExam, removeExam }: ExamTrackerProps) {
  const [showForm, setShowForm] = useState(false);
  const [newExam, setNewExam] = useState<Omit<Exam, 'id'>>({
    subject: '',
    type: 'CT',
    date: '',
    color: '#7c6ff7'
  });

  const getDaysLeft = (date: string) => {
    const diff = new Date(date).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const sortedExams = [...exams].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold leading-tight">Exam & CT Countdown</h1>
          <p className="text-sm text-text-secondary mt-1">Track upcoming tests and deadlines</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-accent hover:bg-accent-light text-white px-4 py-2 rounded-xl font-bold transition-all shadow-lg shadow-accent/20"
        >
          <Plus size={18} />
          Add Test
        </button>
      </header>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xl z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass bg-white/10 border border-white/20 rounded-[40px] p-8 w-full max-w-md shadow-2xl"
          >
            <h2 className="text-2xl font-black mb-6 tracking-tight">Add New Exam/CT</h2>
            <div className="space-y-6">
              <div>
                <label className="text-[11px] font-black text-white/40 uppercase mb-2 block tracking-widest">Subject</label>
                <input
                  type="text"
                  value={newExam.subject}
                  onChange={e => setNewExam({ ...newExam, subject: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-sm focus:border-accent outline-none transition-all focus:bg-white/10"
                  placeholder="e.g. Linear Algebra"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-black text-white/40 uppercase mb-2 block tracking-widest">Type</label>
                  <select
                    value={newExam.type}
                    onChange={e => setNewExam({ ...newExam, type: e.target.value as any })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-sm focus:border-accent outline-none transition-all focus:bg-white/10 appearance-none"
                  >
                    <option value="CT">Class Test</option>
                    <option value="Mid">Midterm</option>
                    <option value="Final">Final Exam</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-black text-white/40 uppercase mb-2 block tracking-widest">Date</label>
                  <input
                    type="date"
                    value={newExam.date}
                    onChange={e => setNewExam({ ...newExam, date: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-sm focus:border-accent outline-none transition-all focus:bg-white/10"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-4 rounded-2xl font-bold text-white/60 hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (newExam.subject && newExam.date) {
                      addExam(newExam);
                      setShowForm(false);
                      setNewExam({ subject: '', type: 'CT', date: '', color: '#7c6ff7' });
                    }
                  }}
                  className="flex-1 bg-accent text-white px-4 py-4 rounded-2xl font-bold hover:bg-accent-light transition-all shadow-lg shadow-accent/20"
                >
                  Save Test
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedExams.map(exam => {
          const daysLeft = getDaysLeft(exam.date);
          const isUrgent = daysLeft <= 5;
          
          return (
            <div key={exam.id} className="glass bg-white/5 border border-white/10 rounded-[32px] p-6 relative group overflow-hidden hover:bg-white/10 transition-all duration-500 shadow-xl">
              <div className="absolute top-0 left-0 w-2 h-full opacity-60" style={{ backgroundColor: exam.color }} />
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-1">{exam.type}</div>
                  <h3 className="text-xl font-black tracking-tight text-white">{exam.subject}</h3>
                </div>
                <button
                  onClick={() => removeExam(exam.id)}
                  className="p-2.5 rounded-xl text-white/20 hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              
              <div className="flex items-end justify-between">
                <div className="flex items-center gap-2 text-white/40">
                  <Calendar size={14} />
                  <span className="text-xs font-bold">{new Date(exam.date).toLocaleDateString()}</span>
                </div>
                <div className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                  isUrgent ? 'bg-destructive/20 text-destructive shadow-[0_0_15px_rgba(239,68,68,0.3)]' : 'bg-success/20 text-success shadow-[0_0_15px_rgba(34,197,94,0.3)]'
                }`}>
                  {isUrgent && <AlertCircle size={12} />}
                  {daysLeft < 0 ? 'Passed' : daysLeft === 0 ? 'Today' : `${daysLeft} days left`}
                </div>
              </div>

              {isUrgent && daysLeft >= 0 && (
                <div className="mt-6 p-4 bg-destructive/10 border border-destructive/20 rounded-2xl text-[11px] text-destructive font-black leading-tight uppercase tracking-wider">
                  ⚠️ Study time increased! Add extra 30min for {exam.subject} review today.
                </div>
              )}
            </div>
          );
        })}

        {exams.length === 0 && (
          <div className="col-span-full py-24 text-center glass bg-white/5 border-2 border-dashed border-white/10 rounded-[40px] shadow-2xl">
            <Calendar className="mx-auto text-white/10 mb-6" size={64} />
            <p className="text-white/20 font-black uppercase tracking-[0.3em]">No exams scheduled yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
