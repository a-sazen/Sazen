import { Category, TimeBlock, ClassSession, MindfuelTask, Habit, Goal, Quote } from './types';

export const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const FULL_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
export const UNI_DAYS = ['Sun', 'Wed', 'Sat'];

export const CAT_COLORS: Record<Category, { dot: string; bg: string; border: string }> = {
  study: { bg: 'rgba(62,207,142,0.08)', border: 'rgba(62,207,142,0.2)', dot: '#3ecf8e' },
  work: { bg: 'rgba(124,111,247,0.08)', border: 'rgba(124,111,247,0.2)', dot: '#a89af9' },
  class: { bg: 'rgba(74,158,255,0.08)', border: 'rgba(74,158,255,0.25)', dot: '#4a9eff' },
  health: { bg: 'rgba(240,106,80,0.08)', border: 'rgba(240,106,80,0.2)', dot: '#f06a50' },
  personal: { bg: 'rgba(245,166,35,0.1)', border: 'rgba(245,166,35,0.3)', dot: '#f5a623' },
  rest: { bg: 'rgba(90,90,114,0.12)', border: 'rgba(90,90,114,0.2)', dot: '#5a5a72' },
  morning: { bg: 'rgba(245,166,35,0.1)', border: 'rgba(245,166,35,0.3)', dot: '#f5a623' },
  namaz: { bg: 'rgba(245,166,35,0.08)', border: 'rgba(245,166,35,0.2)', dot: '#f5a623' },
  eat: { bg: 'rgba(232,101,160,0.08)', border: 'rgba(232,101,160,0.2)', dot: '#e865a0' },
  leisure: { bg: 'rgba(45,212,191,0.08)', border: 'rgba(45,212,191,0.2)', dot: '#2dd4bf' },
  sleep: { bg: 'rgba(90,90,114,0.12)', border: 'rgba(90,90,114,0.2)', dot: '#5a5a72' },
  workout: { bg: 'rgba(240,106,80,0.08)', border: 'rgba(240,106,80,0.2)', dot: '#f06a50' },
};

export const getDynamicSchedule = (date: Date): TimeBlock[] => {
  const day = date.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
  const isExamMode = date >= new Date('2026-04-10');
  const isNightBeforeClass = day === 6 || day === 2; // Sat or Tue
  
  const schedule: TimeBlock[] = [];

  // 1. Morning Routine (Fixed)
  schedule.push(
    { id: 'm1', t: '08:00–08:15', title: 'Wake up + Make Bed', cat: 'personal' },
    { id: 'm2', t: '08:15–08:30', title: 'Affirmation & Gratitude', cat: 'personal' },
    { id: 'm3', t: '08:30–08:45', title: 'Freshen up', cat: 'personal' },
    { id: 'm4', t: '08:45–09:00', title: 'Breakfast', cat: 'personal' }
  );

  if (day === 6) { // SATURDAY (Lab Day)
    schedule.push(
      { id: 's1', t: '09:00–10:00', title: 'Watch 2 productive videos + notes', cat: 'study' },
      { id: 's2', t: '10:00–12:00', title: 'Study Physics Lab', cat: 'study' },
      { id: 's3', t: '12:40–14:00', title: 'Leave for university', cat: 'class' },
      { id: 's4', t: '14:00–16:30', title: 'Physics Lab class', cat: 'class' },
      { id: 's5', t: '16:30–18:00', title: 'Return home', cat: 'rest' }
    );
  } else if (day === 0 || day === 3) { // SUNDAY & WEDNESDAY (Class Days)
    schedule.push(
      { id: 'c1', t: '09:00–09:51', title: 'Leave for university', cat: 'class' },
      { id: 'c2', t: '09:51–11:10', title: 'Financial & Managerial Accounting', cat: 'class' },
      { id: 'c3', t: '11:11–12:30', title: 'Physics', cat: 'class' },
      { id: 'c4', t: '12:30–13:00', title: 'Rest / Light Revision', cat: 'study' },
      { id: 'c5', t: '13:00–14:00', title: 'Lunch', cat: 'health' },
      { id: 'c6', t: '14:00–15:11', title: 'Rest / Light Revision', cat: 'study' },
      { id: 'c7', t: '15:11–16:30', title: 'Linear Algebra', cat: 'class' },
      { id: 'c8', t: '16:30–18:00', title: 'Return home', cat: 'rest' }
    );
  } else { // FREE DAYS (Mon, Tue, Thu, Fri)
    schedule.push(
      { id: 'f1', t: '09:00–10:00', title: 'Watch 2 productive videos + notes', cat: 'study' },
      { id: 'f2', t: '10:00–13:00', title: 'Work (MindfuelBD)', cat: 'work' },
      { id: 'f3', t: '13:00–15:00', title: 'Lunch + Rest', cat: 'rest' },
      { id: 'f4', t: '15:00–17:00', title: 'Study', cat: 'study' },
      { id: 'f5', t: '17:00–18:00', title: 'Workout', cat: 'health' }
    );
  }

  // Evening (Fixed)
  schedule.push(
    { id: 'e1', t: '18:00–18:30', title: 'Shower', cat: 'health' },
    { id: 'e2', t: '18:30–19:00', title: 'Rest', cat: 'rest' }
  );

  // Night Logic
  if (day === 0 || day === 3) { // Night of Class Days
    schedule.push(
      { id: 'n1', t: '19:00–22:00', title: 'Work (MindfuelBD)', cat: 'work' },
      { id: 'n2', t: '22:00–23:00', title: 'Light revision / note organization', cat: 'study' },
      { id: 'n3', t: '23:00–00:00', title: 'Relaxation', cat: 'rest' }
    );
  } else if (isNightBeforeClass) { // Saturday & Tuesday Night
    schedule.push(
      { id: 'n4', t: '19:00–21:00', title: 'Work (MindfuelBD)', cat: 'work' },
      { id: 'n5', t: '21:00–22:00', title: 'Study revision (High Priority)', cat: 'study' },
      { id: 'n6', t: '22:00–00:00', title: 'Optional relaxation', cat: 'rest' }
    );
  } else { // Other Nights (Mon, Thu, Fri)
    schedule.push(
      { id: 'n7', t: '19:00–22:00', title: 'Work (MindfuelBD)', cat: 'work' },
      { id: 'n8', t: '22:00–00:00', title: 'Optional entertainment', cat: 'rest' }
    );
  }

  // Sleep Prep
  schedule.push(
    { id: 's1', t: '00:00–00:30', title: 'Sleep preparation', cat: 'personal' },
    { id: 's2', t: '00:30–08:00', title: 'Sleep', cat: 'rest' }
  );

  // EXAM MODE OVERRIDES
  if (isExamMode) {
    return schedule.map(block => {
      // Reduce entertainment/leisure
      if (block.title.toLowerCase().includes('entertainment') || block.title.toLowerCase().includes('relaxation')) {
        if (isNightBeforeClass && block.t.startsWith('22:00')) {
          return { ...block, title: 'Deep Study / Revision', cat: 'study' };
        }
        if (!isNightBeforeClass && block.t.startsWith('22:00')) {
          return { ...block, title: 'Deep Study (Exam Mode)', cat: 'study', t: '22:00–23:30' };
        }
      }
      // Extend revision on before class days
      if (isNightBeforeClass && block.title.includes('Study revision')) {
        return { ...block, t: '21:00–22:30', title: 'Intense Revision (Exam Mode)' };
      }
      return block;
    });
  }

  return schedule;
};

export const NOTICES = [
  "💡 Add extra 30min study before any CT or exam — mark it in your routine immediately!",
  "💧 Drink a glass of water every time you complete a task block.",
  "📱 Set your phone to grayscale during study/work sessions to reduce urge to scroll.",
  "🌙 Avoid eating after 10pm — it affects sleep quality.",
  "🎯 Review Mindfuel progress every Friday and plan the next week's tasks.",
  "📚 Study MATH 2107 (Linear Algebra) daily — it's the most practice-heavy course.",
  "🏃 Workout before lunch — cortisol is highest in the early afternoon, ideal for training.",
  "🗣️ Record your voice practice sessions — listening back accelerates improvement.",
  "🍱 Meal prep on Friday so eating well on class days is effortless.",
  "🎬 Batch-create food page content on Tuesday — shoot 3 posts in one session.",
  "🏷️ Check Nilkhet book list before going — make a specific list to save time.",
  "💤 Sleep by 12:00 AM on class days — commute + classes drain energy more than expected.",
  "📓 Keep a notebook for informative video notes — physical note-taking boosts retention.",
];

export const SCHEDULE: Record<string, ClassSession[]> = {
  Sun: [
    { code: 'ACT 2111', name: 'Financial & Managerial Accounting', start: '09:51 AM', end: '11:10 AM', room: '301', section: 'D', color: '#4a9eff' },
    { code: 'PHY 2105', name: 'Physics', start: '11:11 AM', end: '12:30 PM', room: '406', section: 'P', color: '#3ecf8e' },
    { code: 'MATH 2107', name: 'Linear Algebra', start: '03:11 PM', end: '04:30 PM', room: '708', section: 'BA', color: '#a89af9' },
  ],
  Wed: [
    { code: 'ACT 2111', name: 'Financial & Managerial Accounting', start: '09:51 AM', end: '11:10 AM', room: '301', section: 'D', color: '#4a9eff' },
    { code: 'PHY 2105', name: 'Physics', start: '11:11 AM', end: '12:30 PM', room: '406', section: 'P', color: '#3ecf8e' },
    { code: 'MATH 2107', name: 'Linear Algebra', start: '03:11 PM', end: '04:30 PM', room: '708', section: 'BA', color: '#a89af9' },
  ],
  Sat: [
    { code: 'PHY 2106', name: 'Physics Laboratory', start: '02:00 PM', end: '04:30 PM', room: '510', section: 'D', color: '#f06a50' },
  ]
};

export const MF_TASKS: MindfuelTask[] = [
  { id: 1, title: 'Script for PR campaign', cat: 'Marketing' },
  { id: 2, title: 'Select PR influencers', cat: 'Marketing' },
  { id: 3, title: 'In-house content pipeline', cat: 'Content' },
  { id: 4, title: 'Video editing style fix', cat: 'Creative' },
  { id: 5, title: 'Parcel + thank you card design', cat: 'Design' },
  { id: 6, title: 'Muesli/Granola recipe finalize', cat: 'Product' },
  { id: 7, title: 'Ad structure fixing', cat: 'Marketing' },
  { id: 9, title: 'Content idea generation', cat: 'Content' },
  { id: 10, title: 'Peanut butter inventory software', cat: 'Tech' },
];

export const PERSONAL_TASKS: MindfuelTask[] = [
  { id: 1, title: 'Video Editing — Learn & practice editing style', cat: 'Creative' },
  { id: 2, title: '📹 Food Page Posts — 3 per week (create + upload)', cat: 'Content' },
  { id: 3, title: '🎥 Personal Reel — 1 per week (shoot + edit)', cat: 'Content' },
  { id: 4, title: '📺 Informative Video — Watch 1 daily + take notes', cat: 'Learning' },
  { id: 5, title: '🗣️ Voice & Talking Practice — Daily 30 min', cat: 'Skill' },
  { id: 6, title: '📝 Session: 5–9 PM — Dedicated work block', cat: 'Focus' },
  { id: 7, title: '☕ No distractions — Social media max 1hr/day', cat: 'Discipline' },
  { id: 8, title: '📊 Review weekly — Friday planning session', cat: 'Planning' },
];

export const HABITS: Habit[] = [
  { name: 'Drink 3L water', icon: '💧', target: 7 },
  { name: 'Morning affirmations', icon: '✨', target: 7 },
  { name: 'Study (all subjects)', icon: '📚', target: 7 },
  { name: 'Workout', icon: '💪', target: 4 },
  { name: 'Voice practice', icon: '🗣️', target: 7 },
  { name: 'Informative video', icon: '📺', target: 7 },
  { name: 'Social media <1hr', icon: '📵', target: 7 },
  { name: 'Good food / no junk', icon: '🥗', target: 7 },
  { name: 'Sleep by 12:00 AM', icon: '🌙', target: 7 },
];

export const TODOS_HOME = ['Arrange and clean room', 'SIM management', 'Make daily routine', 'Make weekly routine', 'Plan workout routine', 'Make diet plan', 'Create work plan'];
export const TODOS_OUTSIDE = ['Nilkhet — books and pads', 'Fix the speaker', 'Feature phone fix', 'iPhone battery change'];

export const SHOPPING: Record<string, string[]> = {
  'Furniture & Study': ['Good chair', 'File folder', 'Pen holder', 'Pencil box'],
  'Personal Care': ['Comb (chiruni)', 'Cosmetics organizer', 'Clothes'],
  'Home & Cleaning': ['Glass cleaner', 'Water bottle'],
  'Devices': ['Feature phone'],
};

export const GOALS_DATA: Record<string, Goal[]> = {
  academic: [
    { icon: '📖', name: 'Complete ACT 2111', target: 'Pass with A', pct: 20 },
    { icon: '📐', name: 'Master Linear Algebra', target: 'Daily practice + A grade', pct: 15 },
    { icon: '⚗️', name: 'Physics + Lab', target: 'Strong lab performance', pct: 20 },
  ],
  health: [
    { icon: '💪', name: 'Workout consistency', target: '4x per week · all semester', pct: 35 },
    { icon: '💧', name: 'Hydration habit', target: '3L daily without fail', pct: 50 },
    { icon: '😴', name: 'Sleep discipline', target: '12:00 AM–08:00 AM every night', pct: 40 },
  ],
  content: [
    { icon: '🧠', name: 'Mindfuel brand growth', target: 'Complete all tasks', pct: 0 },
    { icon: '📸', name: 'Food page posts', target: '3 posts/week · consistent', pct: 10 },
    { icon: '🎥', name: 'Personal reel', target: '1 reel/week', pct: 5 },
    { icon: '🗣️', name: 'Voice & communication', target: 'Daily practice', pct: 20 },
  ]
};

export const QUOTES: Quote[] = [
  { q: "Discipline is choosing between what you want now and what you want most.", a: "Abraham Lincoln" },
  { q: "Success is the sum of small efforts repeated day in and day out.", a: "Robert Collier" },
  { q: "You don't have to be great to start, but you have to start to be great.", a: "Zig Ziglar" },
  { q: "The secret of getting ahead is getting started.", a: "Mark Twain" },
  { q: "Do what you have to do until you can do what you want to do.", a: "Oprah Winfrey" },
  { q: "The harder you work for something, the greater you'll feel when you achieve it.", a: "Unknown" },
  { q: "Push yourself, because no one else is going to do it for you.", a: "Unknown" },
];
