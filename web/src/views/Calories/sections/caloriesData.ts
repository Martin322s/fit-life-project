export const CALORIES_DATA = {
    user: { firstName: "Мартин", initials: "МИ", streak: 14 },
    budget: { target: 2200, eaten: 1840, burned: 320, plannedDinner: 520, tdee: 2420, weeklyAverage: 2115, weeklyTargetAverage: 2200 },
    macros: [
        { label: "Протеин", consumed: 142, target: 165, kcalPerGram: 4, color: "var(--c-electric,#0066FF)" },
        { label: "Въглехидрати", consumed: 198, target: 240, kcalPerGram: 4, color: "var(--c-acid,#C8FF00)" },
        { label: "Мазнини", consumed: 61, target: 73, kcalPerGram: 9, color: "#FFB300" },
    ],
    quality: [
        { label: "Фибри", consumed: 28, target: 32, unit: "г", color: "#00E676", note: "Още 4 г и затваряш деня отлично." },
        { label: "Захари", consumed: 42, target: 55, unit: "г", color: "#FF7A00", note: "В добър диапазон за ден с тренировка." },
        { label: "Натрий", consumed: 1950, target: 2300, unit: "мг", color: "#74B9FF", note: "Под лимита, но близо до вечерята." },
        { label: "Наситени мазнини", consumed: 16, target: 20, unit: "г", color: "#FF5D73", note: "Остава буфер за вечерното хранене." },
    ],
    meals: [
        { label: "Закуска", time: "08:15", calories: 380, target: 450, protein: 12, carbs: 68, fat: 8, foods: "Овесени ядки, банан, мед", status: "logged" },
        { label: "Обяд", time: "13:00", calories: 620, target: 700, protein: 52, carbs: 74, fat: 14, foods: "Пилешки гърди, ориз, зеленчуци", status: "logged" },
        { label: "Следобедна закуска", time: "16:30", calories: 180, target: 250, protein: 5, carbs: 22, fat: 12, foods: "Ябълка, ядки", status: "logged" },
        { label: "Вечеря", time: "20:00", calories: 0, target: 600, protein: 0, carbs: 0, fat: 0, foods: "Още не е записана", status: "planned" },
    ],
    weekly: [
        { day: "Пон", eaten: 2140, target: 2200, burned: 290 },
        { day: "Вт", eaten: 2280, target: 2200, burned: 310 },
        { day: "Ср", eaten: 2060, target: 2200, burned: 260 },
        { day: "Чт", eaten: 2190, target: 2200, burned: 410 },
        { day: "Пт", eaten: 1980, target: 2200, burned: 350 },
        { day: "Съб", eaten: 2315, target: 2200, burned: 280 },
        { day: "Днес", eaten: 1840, target: 2200, burned: 320 },
    ],
    sources: [
        { label: "Чисти цели храни", calories: 1185, pct: 64, color: "var(--c-acid,#C8FF00)" },
        { label: "Рецепти / домашно", calories: 405, pct: 22, color: "var(--c-electric,#0066FF)" },
        { label: "Снакс", calories: 150, pct: 8, color: "#FFB300" },
        { label: "Напитки", calories: 100, pct: 6, color: "#74B9FF" },
    ],
    topFoods: [
        { name: "Пилешки гърди", calories: 330, protein: 62, tag: "най-силен протеин" },
        { name: "Овесени ядки", calories: 240, protein: 9, tag: "бавна енергия" },
        { name: "Ориз басмати", calories: 210, protein: 4, tag: "преди тренировка" },
        { name: "Ябълка + ядки", calories: 180, protein: 5, tag: "удобен снак" },
    ],
    timing: [
        { hour: "08:00", label: "Закуска", kcal: 380 },
        { hour: "13:00", label: "Обяд", kcal: 620 },
        { hour: "16:30", label: "Снак", kcal: 180 },
        { hour: "20:00", label: "Планирана вечеря", kcal: 520 },
    ],
    suggestions: [
        { title: "Вечеря с висок протеин", text: "Сьомга, картофи и салата ще затворят калориите почти идеално и ще качат протеина над 95%." },
        { title: "Фибрен бустер", text: "Добави 1 купа зелена салата или 150 г броколи към вечерята и ще покриеш фибрите." },
        { title: "Буферът е здрав", text: "След планираната вечеря остават около 160 kcal, което пази деня в контрол." },
    ],
    habits: [
        { label: "Хидратация", value: "5 / 8 чаши", note: "Още 750 мл до края на деня." },
        { label: "Стъпки", value: "7 240 / 10 000", note: "Разходка след вечеря ще помогне и на апетита." },
        { label: "Серия", value: "14 дни", note: "Стабилно логване без пропуск." },
    ],
};
