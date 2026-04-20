export type Challenge = {
    id: string;
    title: string;
    subtitle: string;
    type: "steps" | "nutrition" | "training" | "mindset";
    daysLeft: number;
    progress: number;
    participants: number;
    reward: string;
    accent: string;
};

export type LeaderboardEntry = {
    id: string;
    name: string;
    points: number;
    streak: number;
    rank: number;
    trend: string;
};

export const ACTIVE_CHALLENGES: Challenge[] = [
    {
        id: "steps-100k",
        title: "100K крачки",
        subtitle: "Събери 100 000 крачки за 7 дни",
        type: "steps",
        daysLeft: 3,
        progress: 72,
        participants: 842,
        reward: "250 XP + badge",
        accent: "linear-gradient(135deg,#0066FF,#00C2FF)",
    },
    {
        id: "protein-streak",
        title: "Protein Streak",
        subtitle: "Покрий протеина си 5 дни подред",
        type: "nutrition",
        daysLeft: 1,
        progress: 88,
        participants: 516,
        reward: "Ново ниво",
        accent: "linear-gradient(135deg,#C8FF00,#7BDCB5)",
    },
    {
        id: "train-4x",
        title: "Train 4x",
        subtitle: "4 силови тренировки за седмицата",
        type: "training",
        daysLeft: 4,
        progress: 50,
        participants: 391,
        reward: "300 XP",
        accent: "linear-gradient(135deg,#FF8A00,#FF5D73)",
    },
];

export const UPCOMING_CHALLENGES: Challenge[] = [
    {
        id: "hydration-reset",
        title: "Hydration Reset",
        subtitle: "2.5L вода всеки ден",
        type: "mindset",
        daysLeft: 7,
        progress: 0,
        participants: 228,
        reward: "Wellness badge",
        accent: "linear-gradient(135deg,#00C2FF,#74B9FF)",
    },
    {
        id: "meal-prep-week",
        title: "Meal Prep Week",
        subtitle: "Подготви 10 хранения за 5 дни",
        type: "nutrition",
        daysLeft: 5,
        progress: 0,
        participants: 194,
        reward: "Planner pack",
        accent: "linear-gradient(135deg,#6EDC8C,#C8FF00)",
    },
];

export const LEADERBOARD: LeaderboardEntry[] = [
    { id: "u1", name: "Никол", points: 2840, streak: 16, rank: 1, trend: "+220" },
    { id: "u2", name: "Ивайло", points: 2710, streak: 12, rank: 2, trend: "+180" },
    { id: "u3", name: "Теодора", points: 2635, streak: 9, rank: 3, trend: "+165" },
    { id: "u4", name: "Мартин", points: 2410, streak: 11, rank: 8, trend: "+140" },
];

export const CHALLENGE_STATS = {
    liveNow: ACTIVE_CHALLENGES.length,
    participants: "1.7K",
    rewardsUnlocked: 124,
    bestStreak: 16,
};
