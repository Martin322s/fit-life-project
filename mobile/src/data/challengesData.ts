export const activeChallenges = [
  {
    id: '1',
    name: '30-дневно ходене',
    desc: '10 000 стъпки на ден в продължение на 30 дни',
    icon: '👟',
    progress: 18,
    total: 30,
    reward: '500 т.',
    daysLeft: 12,
  },
  {
    id: '2',
    name: 'Хидратация 8/8',
    desc: '8 чаши вода на ден в продължение на 8 седмици',
    icon: '💧',
    progress: 34,
    total: 56,
    reward: '750 т.',
    daysLeft: 22,
  },
];

export const upcomingChallenges = [
  {
    id: '3',
    name: '100 клека предизвикателство',
    desc: 'Завърши 100 клека дневно за 21 дни',
    icon: '🏋️',
    startDate: '01.05.2026',
    reward: '1000 т.',
    participants: 234,
  },
  {
    id: '4',
    name: 'Без захар – 14 дни',
    desc: 'Пълно избягване на добавена захар',
    icon: '🚫',
    startDate: '15.05.2026',
    reward: '800 т.',
    participants: 189,
  },
  {
    id: '5',
    name: 'Летен пресс',
    desc: 'Редуциране на телесни мазнини с 3% за 60 дни',
    icon: '☀️',
    startDate: '01.06.2026',
    reward: '2000 т.',
    participants: 512,
  },
];

export const leaderboard = [
  { rank: 1, name: 'Ива Петрова', points: 4820, avatar: 'ИП' },
  { rank: 2, name: 'Георги Димитров', points: 4610, avatar: 'ГД' },
  { rank: 3, name: 'Мария Стоянова', points: 4390, avatar: 'МС' },
  { rank: 4, name: 'Мартин Иванов', points: 3750, avatar: 'МИ', isMe: true },
  { rank: 5, name: 'Николай Тодоров', points: 3480, avatar: 'НТ' },
  { rank: 6, name: 'Христина Колева', points: 3210, avatar: 'ХК' },
];
