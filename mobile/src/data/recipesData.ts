export type Recipe = {
  id: string;
  name: string;
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  categoryLabel: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  time: string;
  servings: number;
  saved: boolean;
};

export const recipes: Recipe[] = [
  { id: '1', name: 'Овесена каша с плодове', category: 'breakfast', categoryLabel: 'Закуска', calories: 380, protein: 12, carbs: 68, fat: 6, time: '10 мин', servings: 1, saved: true },
  { id: '2', name: 'Протеинов омлет', category: 'breakfast', categoryLabel: 'Закуска', calories: 320, protein: 28, carbs: 4, fat: 18, time: '15 мин', servings: 1, saved: false },
  { id: '3', name: 'Пилешка салата', category: 'lunch', categoryLabel: 'Обяд', calories: 420, protein: 40, carbs: 12, fat: 18, time: '20 мин', servings: 2, saved: true },
  { id: '4', name: 'Сьомга с зеленчуци', category: 'dinner', categoryLabel: 'Вечеря', calories: 490, protein: 42, carbs: 20, fat: 22, time: '30 мин', servings: 2, saved: true },
  { id: '5', name: 'Кафяв ориз с пиле', category: 'lunch', categoryLabel: 'Обяд', calories: 580, protein: 48, carbs: 65, fat: 10, time: '35 мин', servings: 2, saved: false },
  { id: '6', name: 'Гръцко кисело мляко', category: 'snack', categoryLabel: 'Снак', calories: 150, protein: 15, carbs: 8, fat: 4, time: '2 мин', servings: 1, saved: false },
  { id: '7', name: 'Телешки стек с броколи', category: 'dinner', categoryLabel: 'Вечеря', calories: 620, protein: 55, carbs: 15, fat: 32, time: '25 мин', servings: 2, saved: true },
  { id: '8', name: 'Бананов смути', category: 'snack', categoryLabel: 'Снак', calories: 220, protein: 8, carbs: 42, fat: 2, time: '5 мин', servings: 1, saved: false },
  { id: '9', name: 'Боб яхния', category: 'lunch', categoryLabel: 'Обяд', calories: 390, protein: 22, carbs: 58, fat: 6, time: '40 мин', servings: 3, saved: false },
];

export const weeklyPlan: Record<string, string | null> = {
  'Понеделник': 'Овесена каша с плодове',
  'Вторник': 'Пилешка салата',
  'Сряда': 'Сьомга с зеленчуци',
  'Четвъртък': null,
  'Петък': 'Кафяв ориз с пиле',
  'Събота': 'Телешки стек с броколи',
  'Неделя': null,
};
