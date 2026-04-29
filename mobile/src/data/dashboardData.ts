import type { Macro } from '@/src/types';

export const user = {
  name: 'Мартин Иванов',
  initials: 'МИ',
  plan: 'Pro',
  streak: 7,
};

export const calories = {
  target: 2200,
  eaten: 1840,
  burned: 320,
  get remaining() { return this.target - this.eaten + this.burned; },
};

export const macros: Macro[] = [
  { label: 'Протеин', consumed: 142, target: 180, color: '#4f8ef7', unit: 'г' },
  { label: 'Въглехидрати', consumed: 210, target: 250, color: '#22c55e', unit: 'г' },
  { label: 'Мазнини', consumed: 58, target: 70, color: '#f59e0b', unit: 'г' },
];

export const water = { glasses: 5, target: 8 };

export const steps = { current: 7240, target: 10000 };

export const todayMeals = [
  { id: '1', type: 'Закуска', name: 'Овесена каша с плодове', calories: 380 },
  { id: '2', type: 'Обяд', name: 'Пилешко с ориз и зеленчуци', calories: 620 },
  { id: '3', type: 'Снак', name: 'Гръцко кисело мляко', calories: 150 },
  { id: '4', type: 'Вечеря', name: 'Сьомга с зеленчуци', calories: 490 },
];

export const weeklyWeight = [
  { day: 'Пн', weight: 78.4 },
  { day: 'Вт', weight: 78.2 },
  { day: 'Ср', weight: 78.0 },
  { day: 'Чт', weight: 77.9 },
  { day: 'Пт', weight: 77.7 },
  { day: 'Сб', weight: 77.5 },
  { day: 'Нд', weight: 77.3 },
];
