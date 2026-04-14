export type Recipe = {
    id: number;
    name: string;
    category: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    prepTime: number;   // minutes
    servings: number;
    difficulty: "Лесно" | "Средно" | "Трудно";
    tags: string[];
    gradient: string;
    saved: boolean;
    ingredients: string[];
    steps: string[];
};

export const RECIPES_DATA = {
    user: { initials: "МИ", streak: 14 },
    stats: {
        todayPlanned: 3,
        todayCalories: 1685,
        savedCount: 24,
        avgCalPerRecipe: 418,
    },

    featured: {
        id: 3,
        name: "Сьомга с печени зеленчуци",
        category: "Вечеря",
        calories: 485,
        protein: 42,
        carbs: 28,
        fat: 22,
        fiber: 6,
        prepTime: 25,
        servings: 2,
        difficulty: "Лесно" as const,
        tags: ["висок протеин", "омега-3", "без глутен"],
        gradient: "linear-gradient(135deg,#FF6B35,#FF3D57)",
        saved: true,
        ingredients: [
            "2 филета сьомга (по 180 г)",
            "1 тиквичка, нарязана",
            "1 червен пипер",
            "8 чери домата",
            "2 с.л. зехтин",
            "Розмарин, чесън, сол, черен пипер",
        ],
        steps: [
            "Загрей фурната до 200°C. Наредете зеленчуците в тава с хартия за печене.",
            "Полей с 1 с.л. зехтин, подправи и пече 15 мин.",
            "Постави сьомгата върху зеленчуците, полей с останалия зехтин.",
            "Пече още 10-12 мин. до готовност. Поднеси веднага.",
        ],
    } as Recipe,

    recipes: [
        {
            id: 1, name: "Овесени ядки с ягоди", category: "Закуска",
            calories: 320, protein: 12, carbs: 54, fat: 8, fiber: 7,
            prepTime: 10, servings: 1, difficulty: "Лесно",
            tags: ["бавна енергия", "фибри"], gradient: "linear-gradient(135deg,#0066FF,#7B68EE)",
            saved: true,
            ingredients: ["80 г овесени ядки", "150 г ягоди", "1 ч.л. мед", "200 мл мляко"],
            steps: ["Свари овесените ядки.", "Добави нарязаните ягоди и мед."],
        },
        {
            id: 2, name: "Пилешки гърди с кускус", category: "Обяд",
            calories: 480, protein: 45, carbs: 52, fat: 10, fiber: 4,
            prepTime: 20, servings: 1, difficulty: "Лесно",
            tags: ["висок протеин", "нискомаслено"], gradient: "linear-gradient(135deg,#00B894,#00CEC9)",
            saved: false,
            ingredients: ["200 г пилешки гърди", "100 г кускус", "Зеленчуков бульон", "Билки"],
            steps: ["Залей кускуса с горещ бульон.", "Запържи пилето.", "Смесете."],
        },
        {
            id: 3, name: "Сьомга с печени зеленчуци", category: "Вечеря",
            calories: 485, protein: 42, carbs: 28, fat: 22, fiber: 6,
            prepTime: 25, servings: 2, difficulty: "Лесно",
            tags: ["висок протеин", "омега-3"], gradient: "linear-gradient(135deg,#FF6B35,#FF3D57)",
            saved: true,
            ingredients: ["2 филета сьомга", "1 тиквичка", "Чери домата", "Зехтин"],
            steps: ["Загрей фурната до 200°C.", "Печи зеленчуците 15 мин.", "Добави сьомгата и печи 12 мин."],
        },
        {
            id: 4, name: "Гръцко кисело мляко", category: "Снак",
            calories: 180, protein: 14, carbs: 24, fat: 3, fiber: 2,
            prepTime: 5, servings: 1, difficulty: "Лесно",
            tags: ["пробиотик", "лек снак"], gradient: "linear-gradient(135deg,#C8FF00,#00E676)",
            saved: true,
            ingredients: ["200 г гръцко кисело мляко", "50 г горски плодове", "1 ч.л. мед"],
            steps: ["Изсипи киселото мляко.", "Наредете плодовете отгоре.", "Полей с мед."],
        },
        {
            id: 5, name: "Яйца по флорентински", category: "Закуска",
            calories: 380, protein: 24, carbs: 18, fat: 22, fiber: 3,
            prepTime: 15, servings: 1, difficulty: "Средно",
            tags: ["протеин", "спанак"], gradient: "linear-gradient(135deg,#6C5CE7,#A855F7)",
            saved: false,
            ingredients: ["2 яйца", "100 г спанак", "1 с.л. масло", "Холандски сос"],
            steps: ["Задуши спанака с масло.", "Поширай яйцата.", "Наредете и поднеси."],
        },
        {
            id: 6, name: "Киноа с нахут и авокадо", category: "Обяд",
            calories: 520, protein: 18, carbs: 62, fat: 24, fiber: 10,
            prepTime: 20, servings: 1, difficulty: "Лесно",
            tags: ["веган", "пълно хранене", "фибри"], gradient: "linear-gradient(135deg,#00B894,#55EFC4)",
            saved: true,
            ingredients: ["150 г варена киноа", "100 г нахут", "½ авокадо", "Лимон, кориандър"],
            steps: ["Сготви киноата.", "Смесете с нахута и авокадото.", "Добави лимон и кориандър."],
        },
        {
            id: 7, name: "Пуешки кюфтета с домати", category: "Вечеря",
            calories: 420, protein: 38, carbs: 22, fat: 14, fiber: 4,
            prepTime: 30, servings: 2, difficulty: "Средно",
            tags: ["висок протеин", "нискомаслено"], gradient: "linear-gradient(135deg,#FF7A00,#FFB300)",
            saved: false,
            ingredients: ["400 г кайма пуешко", "1 консерва домати", "Лук, чесън", "Подправки"],
            steps: ["Оформи кюфтетата.", "Запечи в тиган.", "Добави доматите и вари 15 мин."],
        },
        {
            id: 8, name: "Банан-протеинов шейк", category: "Снак",
            calories: 280, protein: 28, carbs: 34, fat: 6, fiber: 3,
            prepTime: 5, servings: 1, difficulty: "Лесно",
            tags: ["след тренировка", "бърза закуска"], gradient: "linear-gradient(135deg,#FFB300,#FF6B35)",
            saved: true,
            ingredients: ["1 банан", "1 мерителна лъжица протеин", "250 мл мляко", "Канела"],
            steps: ["Постави всички съставки в блендер.", "Блендирай 30 секунди."],
        },
        {
            id: 9, name: "Зелена салата с тон", category: "Обяд",
            calories: 340, protein: 32, carbs: 14, fat: 16, fiber: 5,
            prepTime: 10, servings: 1, difficulty: "Лесно",
            tags: ["нисковъглехидратно", "омега-3"], gradient: "linear-gradient(135deg,#00CEC9,#74B9FF)",
            saved: false,
            ingredients: ["100 г тон в собствен сок", "Микс зелена салата", "Чери домата", "Зехтин, лимон"],
            steps: ["Нареди салатата.", "Добави тона.", "Подправи с зехтин и лимон."],
        },
    ] as Recipe[],

    // Weekly meal plan — null = not yet planned
    weekPlan: [
        { day: "Пон", breakfast: "Овесени ядки с ягоди", lunch: "Пилешки гърди", dinner: "Сьомга с зеленчуци", isToday: false },
        { day: "Вт",  breakfast: "Яйца по флорентински", lunch: "Киноа с нахут",    dinner: "Пуешки кюфтета",   isToday: false },
        { day: "Ср",  breakfast: "Овесени ядки с ягоди", lunch: "Зелена салата",    dinner: "Сьомга с зеленчуци", isToday: true  },
        { day: "Чт",  breakfast: "Протеинов шейк",        lunch: "Пилешки гърди",    dinner: "Пуешки кюфтета",   isToday: false },
        { day: "Пт",  breakfast: "Яйца по флорентински", lunch: "Киноа с нахут",    dinner: null,                isToday: false },
        { day: "Съб", breakfast: null,                    lunch: null,               dinner: null,                isToday: false },
        { day: "Нед", breakfast: null,                    lunch: null,               dinner: null,                isToday: false },
    ],

    // Today's nutrition from planned recipes (Ср)
    todayNutrition: {
        calories: { consumed: 1685, target: 2200 },
        protein:  { consumed: 78,   target: 165 },
        carbs:    { consumed: 134,  target: 240 },
        fat:      { consumed: 46,   target: 73 },
    },

    suggestions: [
        { name: "Тиквичена крем супа", reason: "Ниско съдържание на калории, подходяща за вечеря", calories: 180, protein: 5, carbs: 22, fat: 8 },
        { name: "Яйца и авокадо тост", reason: "Бърза закуска с добри мазнини и протеин", calories: 390, protein: 18, carbs: 28, fat: 22 },
        { name: "Ориз с пиле и броколи", reason: "Класическо сити ястие с висок протеин", calories: 510, protein: 48, carbs: 56, fat: 10 },
    ],
};
