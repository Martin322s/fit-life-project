export type WorkoutDay = {
    day: string;
    shortDay: string;
    name: string;
    type: "push" | "pull" | "legs" | "upper" | "lower" | "full" | "cardio" | "rest";
    muscles: string[];
    durationMin: number;
    status: "done" | "today" | "upcoming" | "rest";
};

export type Exercise = {
    id: string;
    name: string;
    sets: number;
    reps: string;
    weight: number | null;
    unit: "кг" | "мин" | "км";
    muscle: string;
    done: boolean;
};

export const TRAINING_DATA = {
    user: { initials: "МИ", streak: 14 },

    activePlan: {
        id: "ppl",
        name: "Push / Pull / Legs",
        shortName: "PPL",
        description: "Класическа 6-дневна програма с фокус върху хипертрофия и прогресивно натоварване.",
        gradient: "linear-gradient(135deg,#6C5CE7,#A855F7)",
        icon: "💪",
        difficulty: "Средно" as const,
        durationWeeks: 12,
        currentWeek: 6,
        daysPerWeek: 6,
        focus: "Хипертрофия",
        tags: ["хипертрофия", "сила", "обем"],
        startDate: "17.03.2026",
        volumeTarget: 15000,
    },

    stats: {
        sessionsThisWeek: 4,
        sessionsTarget: 6,
        volumeThisWeek: 12840,
        streak: 14,
        nextWorkout: "Крака",
        totalSessions: 68,
        avgDurationMin: 62,
        personalRecords: 3,
    },

    weekSchedule: [
        { day: "Понеделник", shortDay: "Пн", name: "Пуш", type: "push" as const,   muscles: ["Гърди", "Рамене", "Трицепс"], durationMin: 65, status: "done"     as const },
        { day: "Вторник",    shortDay: "Вт", name: "Пул",  type: "pull" as const,   muscles: ["Гръб", "Бицепс", "Задни рамена"], durationMin: 60, status: "done" as const },
        { day: "Сряда",      shortDay: "Ср", name: "Крака",type: "legs" as const,   muscles: ["Квадрицепс", "Хамстринг", "Глутеус"], durationMin: 70, status: "done" as const },
        { day: "Четвъртък",  shortDay: "Чт", name: "Пуш", type: "push" as const,   muscles: ["Гърди", "Рамене", "Трицепс"], durationMin: 65, status: "done"     as const },
        { day: "Петък",      shortDay: "Пт", name: "Пул",  type: "pull" as const,   muscles: ["Гръб", "Бицепс"],             durationMin: 60, status: "today"    as const },
        { day: "Събота",     shortDay: "Сб", name: "Крака",type: "legs" as const,   muscles: ["Квадрицепс", "Хамстринг"],    durationMin: 70, status: "upcoming" as const },
        { day: "Неделя",     shortDay: "Нд", name: "Почивка", type: "rest" as const,muscles: [],                             durationMin: 0,  status: "rest"     as const },
    ] as WorkoutDay[],

    todayWorkout: {
        name: "Пул ден Б",
        type: "pull" as const,
        targetDuration: 60,
        exercises: [
            { id: "dl",   name: "Мъртва тяга",           sets: 4, reps: "5",   weight: 120, unit: "кг" as const, muscle: "Гръб",    done: false },
            { id: "row",  name: "Наклонена гребла с щанга", sets: 4, reps: "8",  weight: 80,  unit: "кг" as const, muscle: "Гръб",    done: false },
            { id: "pu",   name: "Набирания",              sets: 4, reps: "6–8", weight: null, unit: "кг" as const, muscle: "Бицепс",  done: false },
            { id: "fcurl",name: "Лицеви кърлове",         sets: 3, reps: "10",  weight: 20,  unit: "кг" as const, muscle: "Бицепс",  done: false },
            { id: "rfrow",name: "Дъмбел ред едноръчен",   sets: 3, reps: "10",  weight: 34,  unit: "кг" as const, muscle: "Гръб",    done: false },
            { id: "face", name: "Face pulls",             sets: 3, reps: "15",  weight: 18,  unit: "кг" as const, muscle: "Рамене",  done: false },
        ] as Exercise[],
    },

    strengthProgress: [
        {
            name: "Клек",
            icon: "🏋️",
            color: "var(--c-electric,#0066FF)",
            current: 115,
            start: 90,
            goal: 140,
            unit: "кг",
            data: [90, 95, 97.5, 100, 102.5, 105, 107.5, 110, 112.5, 112.5, 115, 115],
        },
        {
            name: "Мъртва тяга",
            icon: "⚡",
            color: "#00E676",
            current: 120,
            start: 95,
            goal: 150,
            unit: "кг",
            data: [95, 100, 102.5, 105, 110, 112.5, 115, 117.5, 120, 120, 120, 120],
        },
        {
            name: "Лег преса",
            icon: "🔥",
            color: "#FFB300",
            current: 90,
            start: 70,
            goal: 110,
            unit: "кг",
            data: [70, 72.5, 75, 77.5, 80, 82.5, 85, 85, 87.5, 87.5, 90, 90],
        },
        {
            name: "Военна преса",
            icon: "💥",
            color: "#FF5D73",
            current: 62.5,
            start: 50,
            goal: 80,
            unit: "кг",
            data: [50, 52.5, 55, 55, 57.5, 57.5, 60, 60, 62.5, 62.5, 62.5, 62.5],
        },
    ],

    personalRecords: [
        { exercise: "Клек",         weight: 125, date: "28.03.2026", icon: "🏋️", muscle: "Крака" },
        { exercise: "Мъртва тяга",   weight: 130, date: "04.04.2026", icon: "⚡", muscle: "Гръб" },
        { exercise: "Лег преса",     weight: 95,  date: "07.04.2026", icon: "🔥", muscle: "Гърди" },
        { exercise: "Военна преса",  weight: 65,  date: "01.04.2026", icon: "💥", muscle: "Рамене" },
        { exercise: "Набирания",     weight: 10,  date: "10.04.2026", icon: "💪", muscle: "Гръб" },
    ],

    recentSessions: [
        { date: "14.04", name: "Пуш Б",   durationMin: 67, volumeKg: 3420, exercises: 7 },
        { date: "13.04", name: "Пул А",   durationMin: 58, volumeKg: 2980, exercises: 6 },
        { date: "12.04", name: "Крака А", durationMin: 72, volumeKg: 4200, exercises: 6 },
        { date: "10.04", name: "Пуш А",   durationMin: 63, volumeKg: 3100, exercises: 7 },
        { date: "09.04", name: "Пул Б",   durationMin: 55, volumeKg: 2760, exercises: 6 },
        { date: "08.04", name: "Крака Б", durationMin: 70, volumeKg: 4140, exercises: 5 },
    ],

    availablePlans: [
        {
            id: "ppl",
            name: "Push / Pull / Legs",
            icon: "💪",
            gradient: "linear-gradient(135deg,#6C5CE7,#A855F7)",
            daysPerWeek: 6,
            durationWeeks: 12,
            focus: "Хипертрофия",
            difficulty: "Средно" as const,
            tags: ["обем", "сила"],
            active: true,
        },
        {
            id: "stronglifts",
            name: "StrongLifts 5×5",
            icon: "🏋️",
            gradient: "linear-gradient(135deg,#FF6B35,#FFB300)",
            daysPerWeek: 3,
            durationWeeks: 16,
            focus: "Сила",
            difficulty: "Лесно" as const,
            tags: ["сила", "начинаещи"],
            active: false,
        },
        {
            id: "upper-lower",
            name: "Горе / Долу",
            icon: "⚡",
            gradient: "linear-gradient(135deg,#00B894,#55EFC4)",
            daysPerWeek: 4,
            durationWeeks: 10,
            focus: "Баланс",
            difficulty: "Лесно" as const,
            tags: ["баланс", "функционален"],
            active: false,
        },
        {
            id: "fullbody",
            name: "Full Body",
            icon: "🔥",
            gradient: "linear-gradient(135deg,#FF5D73,#FF9A56)",
            daysPerWeek: 3,
            durationWeeks: 8,
            focus: "Обща форма",
            difficulty: "Лесно" as const,
            tags: ["цяло тяло", "ефективен"],
            active: false,
        },
        {
            id: "arnold",
            name: "Arnold Split",
            icon: "🌟",
            gradient: "linear-gradient(135deg,#0066FF,#00CEC9)",
            daysPerWeek: 6,
            durationWeeks: 12,
            focus: "Обем",
            difficulty: "Трудно" as const,
            tags: ["обем", "напреднали"],
            active: false,
        },
    ] as const,
};
