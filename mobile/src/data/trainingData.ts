export const stats = {
  sessionsThisWeek: 3,
  totalVolume: '12 400 кг',
  streak: 7,
  totalSessions: 48,
};

export const activePlan = {
  name: 'Пълен обем – 5 дни',
  type: 'Хипертрофия',
  level: 'Напреднал',
  sessionsPerWeek: 5,
  currentWeek: 6,
  totalWeeks: 12,
};

export const weekSchedule = [
  { day: 'Пн', focus: 'Гърди + Трицепс', done: true },
  { day: 'Вт', focus: 'Гръб + Бицепс', done: true },
  { day: 'Ср', focus: 'Почивка', done: true, rest: true },
  { day: 'Чт', focus: 'Рамене', done: false, isToday: true },
  { day: 'Пт', focus: 'Крака', done: false },
  { day: 'Сб', focus: 'Корем + Кардио', done: false },
  { day: 'Нд', focus: 'Почивка', done: false, rest: true },
];

export const todayExercises = [
  { id: '1', name: 'Военна преса', sets: 4, reps: '8-10', weight: 60, done: false },
  { id: '2', name: 'Странични повдигания', sets: 3, reps: '12-15', weight: 14, done: false },
  { id: '3', name: 'Предни повдигания', sets: 3, reps: '12-15', weight: 12, done: false },
  { id: '4', name: 'Повдигания с кабел', sets: 3, reps: '15', weight: 10, done: false },
  { id: '5', name: 'Лицеви опори за рамене', sets: 3, reps: '10-12', weight: 0, done: false },
];

export const personalRecords = [
  { exercise: 'Клек', record: '120 кг × 5', date: '08.04.2026' },
  { exercise: 'Мъртва тяга', record: '145 кг × 3', date: '15.03.2026' },
  { exercise: 'Лежанка', record: '100 кг × 5', date: '01.04.2026' },
  { exercise: 'Военна преса', record: '70 кг × 5', date: '10.04.2026' },
];
