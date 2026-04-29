export const activeDiet = {
  name: 'Кетогенна диета',
  type: 'Ниско-въглехидратна',
  startDate: '01.03.2026',
  daysRemaining: 21,
  compliance: 84,
  weightLost: 4.2,
  macroTargets: { protein: 35, fat: 60, carbs: 5 },
  macroActual: { protein: 33, fat: 58, carbs: 9 },
};

export const foodGuide = {
  allowed: ['Месо и риба', 'Яйца', 'Масла и мазнини', 'Зеленчуци (без нишесте)', 'Ядки и семена', 'Млечни продукти (с мазнини)'],
  avoid: ['Захар и сладкиши', 'Хляб и тестени', 'Ориз и зърнени', 'Картофи', 'Плодове (повечето)', 'Бобови'],
};

export const availableDiets = [
  { id: '1', name: 'Кетогенна диета', type: 'Ниско-въглехидратна', difficulty: 'Средна', active: true },
  { id: '2', name: 'Средиземноморска', type: 'Балансирана', difficulty: 'Лесна', active: false },
  { id: '3', name: 'Периодично гладуване', type: '16:8', difficulty: 'Средна', active: false },
  { id: '4', name: 'Нисковъглехидратна', type: 'LCHF', difficulty: 'Лесна', active: false },
  { id: '5', name: 'Зонална диета', type: '40-30-30', difficulty: 'Трудна', active: false },
];

export const mealIdeas = [
  { meal: 'Закуска', idea: 'Яйца с бекон и авокадо', kcal: 480 },
  { meal: 'Обяд', idea: 'Пилешка салата с маслини', kcal: 420 },
  { meal: 'Снак', idea: 'Шепа бадеми', kcal: 180 },
  { meal: 'Вечеря', idea: 'Сьомга с аспержи и масло', kcal: 520 },
];
