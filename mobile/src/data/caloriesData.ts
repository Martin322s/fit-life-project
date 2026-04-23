import type { Macro } from '@/src/types';

export const budget = {
  target: 2200,
  eaten: 1840,
  burned: 320,
  tdee: 2420,
  get net() { return this.eaten - this.burned; },
  get remaining() { return this.target - this.eaten + this.burned; },
  get pct() { return Math.min(100, Math.round((this.eaten / this.target) * 100)); },
};

export const macros: Macro[] = [
  { label: 'Протеин', consumed: 142, target: 180, color: '#4f8ef7', unit: 'г' },
  { label: 'Въглехидрати', consumed: 210, target: 250, color: '#22c55e', unit: 'г' },
  { label: 'Мазнини', consumed: 58, target: 70, color: '#f59e0b', unit: 'г' },
];

export const meals = [
  {
    type: 'breakfast',
    label: 'Закуска',
    items: [
      { id: '1', name: 'Овесена каша с плодове', calories: 380, protein: 12, carbs: 68, fat: 6 },
      { id: '2', name: 'Протеинов шейк', calories: 180, protein: 30, carbs: 8, fat: 2 },
    ],
  },
  {
    type: 'lunch',
    label: 'Обяд',
    items: [
      { id: '3', name: 'Пилешко с ориз и зеленчуци', calories: 620, protein: 52, carbs: 70, fat: 12 },
    ],
  },
  {
    type: 'snack',
    label: 'Снак',
    items: [
      { id: '4', name: 'Гръцко кисело мляко', calories: 150, protein: 15, carbs: 8, fat: 4 },
      { id: '5', name: 'Ябълка', calories: 80, protein: 0, carbs: 21, fat: 0 },
    ],
  },
  {
    type: 'dinner',
    label: 'Вечеря',
    items: [
      { id: '6', name: 'Сьомга с зеленчуци', calories: 490, protein: 42, carbs: 20, fat: 22 },
    ],
  },
];

export const quality = [
  { label: 'Фибри', value: 22, target: 30, unit: 'г', color: '#22c55e' },
  { label: 'Захари', value: 38, target: 50, unit: 'г', color: '#f59e0b' },
  { label: 'Натрий', value: 1800, target: 2300, unit: 'мг', color: '#ef4444' },
];
