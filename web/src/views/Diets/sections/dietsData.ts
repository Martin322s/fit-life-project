export type DietPlan = {
    id: string;
    name: string;
    nameLong: string;
    description: string;
    gradient: string;
    icon: string;
    difficulty: "Лесно" | "Средно" | "Трудно";
    durationWeeks: number;
    calorieTarget: number;
    macroSplit: { carbs: number; protein: number; fat: number };
    tags: string[];
    expectedResults: string;
    active: boolean;
};

export const DIETS_DATA = {
    user: { initials: "МИ", streak: 28 },

    activeDiet: {
        id: "mediterranean",
        name: "Средиземноморска",
        nameLong: "Средиземноморска диета",
        description: "Богата на риба, зехтин, зеленчуци и пълнозърнести храни. Научно доказана за сърдечно-съдово здраве и дълголетие.",
        gradient: "linear-gradient(135deg,#0066FF,#00CEC9)",
        icon: "🫒",
        difficulty: "Лесно" as const,
        durationWeeks: 12,
        calorieTarget: 2000,
        macroSplit: { carbs: 45, protein: 25, fat: 30 },
        tags: ["сърдечно здраве", "дълголетие", "противовъзпалителна"],
        expectedResults: "−0.5 кг/сед. · подобрен холестерол · повече енергия",
        active: true,
        startDate: "17.03.2026",
        daysOnPlan: 28,
        compliancePct: 82,
        calorieDeficit: 420,
        currentWeight: 84.2,
        startWeight: 85.9,
    },

    macroTargets: {
        calories:  { target: 2000, actual: 1840, unit: "kcal" },
        protein:   { target: 125,  actual: 142,  unit: "г" },
        carbs:     { target: 225,  actual: 198,  unit: "г" },
        fat:       { target: 67,   actual: 61,   unit: "г" },
        fiber:     { target: 30,   actual: 26,   unit: "г" },
        omega3:    { target: 2.5,  actual: 2.1,  unit: "г" },
    },

    foodGuide: {
        allowed: [
            { food: "Риба и морски дарове",  freq: "2–3 пъти/сед.",  icon: "🐟" },
            { food: "Зехтин Extra Virgin",   freq: "Всеки ден",      icon: "🫒" },
            { food: "Зеленчуци и листни",    freq: "Всеки ден",      icon: "🥗" },
            { food: "Бобови (нахут, леща)",  freq: "3–4 пъти/сед.",  icon: "🫘" },
            { food: "Пълнозърнести храни",   freq: "Всеки ден",      icon: "🌾" },
            { food: "Ядки и семена",         freq: "Шепа/ден",       icon: "🥜" },
            { food: "Пресни плодове",        freq: "2–3 порции/ден", icon: "🍎" },
        ],
        limited: [
            { food: "Червено месо",          freq: "1–2 пъти/сед.",  icon: "🥩" },
            { food: "Млечни продукти",       freq: "Умерено",        icon: "🧀" },
            { food: "Яйца",                  freq: "До 4/сед.",      icon: "🥚" },
            { food: "Птиче месо",            freq: "2 пъти/сед.",    icon: "🍗" },
        ],
        avoid: [
            { food: "Преработени храни",     reason: "Транс-мазнини, консерванти",  icon: "🚫" },
            { food: "Рафинирана захар",      reason: "Повишава възпалението",       icon: "🍬" },
            { food: "Газирани напитки",      reason: "Празни калории, захар",       icon: "🥤" },
            { food: "Бели рафинирани зърна", reason: "Висок ГИ, малко фибри",      icon: "🍞" },
        ],
    },

    calendarData: [
        1, 1, 0.5, 1, 1, 0, 1,
        1, 1, 1, 0.5, 1, 1, 0,
        1, 0.5, 1, 1, 1, 0, 1,
        0.5, 1, 1, 0, 1, 1, 1,
        1, 1, 1,
    ],

    insights: [
        {
            title: "Сърдечно-съдово здраве",
            text: "Клинични проучвания показват 30% намален риск от сърдечен удар при хора следващи тази диета над 5 години.",
            color: "#FF5D73",
            icon: "❤️",
        },
        {
            title: "Противовъзпалително действие",
            text: "Омега-3 от риба и полифенолите в зехтина намаляват системното възпаление — ключов фактор за теглото.",
            color: "#00E676",
            icon: "🛡️",
        },
        {
            title: "Дълголетие и мозъчна функция",
            text: "Проучвания върху популациите в Средиземноморието свързват диетата с по-ниска честота на деменция.",
            color: "#74B9FF",
            icon: "🧠",
        },
        {
            title: "Устойчива загуба на тегло",
            text: "За разлика от рестриктивни диети, средиземноморската осигурява ситост и е устойчива дългосрочно.",
            color: "var(--c-acid,#C8FF00)",
            icon: "⚖️",
        },
    ],

    mealIdeas: [
        {
            meal: "Закуска",
            icon: "🌅",
            name: "Тост с авокадо и поширано яйце",
            calories: 380, protein: 16, carbs: 32, fat: 22,
            prepTime: 10,
            tip: "Поръси с люспи червен пипер и лимонов сок.",
        },
        {
            meal: "Обяд",
            icon: "☀️",
            name: "Гръцка салата с пилешко и фета",
            calories: 420, protein: 38, carbs: 18, fat: 24,
            prepTime: 15,
            tip: "Добави каламата маслини за автентичен вкус и здравословни мазнини.",
        },
        {
            meal: "Вечеря",
            icon: "🌙",
            name: "Запечена сьомга с чери домати",
            calories: 485, protein: 42, carbs: 16, fat: 28,
            prepTime: 25,
            tip: "Полей с качествен зехтин след изваждане от фурната.",
        },
        {
            meal: "Снак",
            icon: "🕒",
            name: "Хумус с пресни зеленчуци",
            calories: 180, protein: 7, carbs: 22, fat: 8,
            prepTime: 5,
            tip: "Домашният хумус съдържа по-малко консерванти и е по-вкусен.",
        },
    ],

    availableDiets: [
        {
            id: "mediterranean",
            name: "Средиземноморска",
            icon: "🫒",
            gradient: "linear-gradient(135deg,#0066FF,#00CEC9)",
            calorieTarget: 2000,
            macroSplit: { carbs: 45, protein: 25, fat: 30 },
            tags: ["сърдечно здраве", "устойчива"],
            difficulty: "Лесно" as const,
            active: true,
        },
        {
            id: "keto",
            name: "Кетогенна",
            icon: "🥑",
            gradient: "linear-gradient(135deg,#FF6B35,#FFB300)",
            calorieTarget: 1800,
            macroSplit: { carbs: 5, protein: 25, fat: 70 },
            tags: ["бърза загуба", "кетоза"],
            difficulty: "Трудно" as const,
            active: false,
        },
        {
            id: "if16",
            name: "Интермитентно 16:8",
            icon: "⏰",
            gradient: "linear-gradient(135deg,#6C5CE7,#A855F7)",
            calorieTarget: 1900,
            macroSplit: { carbs: 40, protein: 30, fat: 30 },
            tags: ["прозорец за хранене", "гъвкава"],
            difficulty: "Средно" as const,
            active: false,
        },
        {
            id: "highprotein",
            name: "Протеинова",
            icon: "💪",
            gradient: "linear-gradient(135deg,#00B894,#55EFC4)",
            calorieTarget: 2100,
            macroSplit: { carbs: 30, protein: 40, fat: 30 },
            tags: ["мускулна маса", "ситост"],
            difficulty: "Средно" as const,
            active: false,
        },
        {
            id: "plantbased",
            name: "Растителна",
            icon: "🌱",
            gradient: "linear-gradient(135deg,#00E676,#C8FF00)",
            calorieTarget: 1950,
            macroSplit: { carbs: 55, protein: 20, fat: 25 },
            tags: ["веган", "фибри", "екологична"],
            difficulty: "Средно" as const,
            active: false,
        },
    ] as const,
};
