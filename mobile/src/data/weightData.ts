export const stats = {
  current: 77.3,
  goal: 72.0,
  start: 85.0,
  get totalLost() { return +(this.start - this.current).toFixed(1); },
  get remaining() { return +(this.current - this.goal).toFixed(1); },
  bmi: 23.8,
  height: 180,
};

export const recentEntries = [
  { id: '1', date: '21.04.2026', weight: 77.3, change: -0.2 },
  { id: '2', date: '20.04.2026', weight: 77.5, change: -0.2 },
  { id: '3', date: '19.04.2026', weight: 77.7, change: -0.2 },
  { id: '4', date: '18.04.2026', weight: 77.9, change: -0.1 },
  { id: '5', date: '17.04.2026', weight: 78.0, change: -0.2 },
  { id: '6', date: '16.04.2026', weight: 78.2, change: -0.2 },
  { id: '7', date: '15.04.2026', weight: 78.4, change: -0.3 },
];

export const chartData = [
  { label: '1 Мар', value: 82.1 },
  { label: '8 Мар', value: 81.0 },
  { label: '15 Мар', value: 80.2 },
  { label: '22 Мар', value: 79.5 },
  { label: '1 Апр', value: 79.0 },
  { label: '8 Апр', value: 78.4 },
  { label: '15 Апр', value: 78.0 },
  { label: 'Днес', value: 77.3 },
];

export const measurements = [
  { label: 'Талия', value: 82, unit: 'см' },
  { label: 'Гърди', value: 96, unit: 'см' },
  { label: 'Бедра', value: 98, unit: 'см' },
  { label: 'Бицепс', value: 34, unit: 'см' },
];
