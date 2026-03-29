export type Category = 'study' | 'work' | 'class' | 'health' | 'personal' | 'rest' | 'morning' | 'namaz' | 'eat' | 'leisure' | 'sleep' | 'workout';

export interface TimeBlock {
  id: string;
  t: string;
  title: string;
  sub?: string;
  cat: Category;
  isCompleted?: boolean;
}

export interface ClassSession {
  code: string;
  name: string;
  start: string;
  end: string;
  room: string;
  section: string;
  color: string;
}

export interface MindfuelTask {
  id: number;
  title: string;
  cat: string;
}

export interface Habit {
  name: string;
  icon: string;
  target: number;
}

export interface Goal {
  id?: string;
  icon: string;
  name: string;
  target: string;
  pct: number;
  category?: 'academic' | 'health' | 'content';
}

export interface Exam {
  id: string;
  subject: string;
  type: 'CT' | 'Final' | 'Mid';
  date: string; // ISO format
  color: string;
}

export interface WorkoutSession {
  id: string;
  date: string;
  exercises: {
    name: string;
    sets: { reps: number; weight: number }[];
  }[];
}

export interface BodyMeasurement {
  id: string;
  date: string;
  weight?: number;
  chest?: number;
  waist?: number;
  biceps?: number;
  thighs?: number;
  bodyFat?: number;
}

export interface Quote {
  q: string;
  a: string;
}

export interface Todo {
  id: string;
  text: string;
  category: 'home' | 'outside';
}

export interface ShoppingItem {
  id: string;
  name: string;
  category: string;
}

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  date: string;
  category: string;
  type: 'expense' | 'income';
  accountId: string;
}

export interface Account {
  id: string;
  name: string;
  type: 'cash' | 'bank' | 'mobile' | 'card';
  balance: number;
  color: string;
}

export interface Budget {
  id: string;
  category: string;
  limit: number;
  period: 'monthly' | 'weekly';
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
  icon: string;
}
