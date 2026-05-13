export type NutritionPer100 = {
    calories: number;
    protein: number;
    carbs: number;
    sugar: number;
    fat: number;
    saturated: number;
    fiber: number;
    sodium: number;
};

export type Product = {
    id: string;
    name: string;
    brand: string;
    category: string;
    servingG: number;
    per100: NutritionPer100;
    tags: string[];
    icon: string;
    favorite: boolean;
    barcode?: string;
};

export const CATEGORIES = [
    { key: "all",         label: "Всички",         icon: "🔍" },
    { key: "supplement",  label: "Добавки",         icon: "💊" },
    { key: "protein",     label: "Протеини",        icon: "💪" },
    { key: "dairy",       label: "Млечни",          icon: "🥛" },
    { key: "grain",       label: "Зърнени",         icon: "🌾" },
    { key: "meat",        label: "Месо & Риба",     icon: "🥩" },
    { key: "vegetable",   label: "Зеленчуци",       icon: "🥦" },
    { key: "fruit",       label: "Плодове",         icon: "🍎" },
    { key: "fat",         label: "Здравословни мазнини", icon: "🥑" },
    { key: "drink",       label: "Напитки",         icon: "🧃" },
];

export const PRODUCTS: Product[] = [
    // ── Supplements ────────────────────────────────────────────────────────────
    {
        id: "whey-protein-isolate",
        name: "Суроватъчен протеин изолат",
        brand: "Optimum Nutrition",
        category: "supplement",
        servingG: 30,
        per100: { calories: 370, protein: 90, carbs: 3, sugar: 1, fat: 2, saturated: 0.5, fiber: 0, sodium: 150 },
        tags: ["висок протеин", "след тренировка", "бързо усвояване", "нискомаслено"],
        icon: "💪",
        favorite: true,
    },
    {
        id: "creatine-monohydrate",
        name: "Креатин монохидрат",
        brand: "MyProtein",
        category: "supplement",
        servingG: 5,
        per100: { calories: 0, protein: 0, carbs: 0, sugar: 0, fat: 0, saturated: 0, fiber: 0, sodium: 0 },
        tags: ["сила", "мускулна маса", "производителност"],
        icon: "⚡",
        favorite: false,
    },
    {
        id: "l-carnitine",
        name: "L-Карнитин течен 1500 мг",
        brand: "Scitec Nutrition",
        category: "supplement",
        servingG: 25,
        per100: { calories: 12, protein: 0, carbs: 2.8, sugar: 2.8, fat: 0, saturated: 0, fiber: 0, sodium: 10 },
        tags: ["изгаряне на мазнини", "енергия", "без захар"],
        icon: "🔥",
        favorite: false,
    },
    {
        id: "omega3-fish-oil",
        name: "Омега-3 рибено масло 1000 мг",
        brand: "Now Foods",
        category: "supplement",
        servingG: 1.2,
        per100: { calories: 833, protein: 0, carbs: 0, sugar: 0, fat: 100, saturated: 25, fiber: 0, sodium: 0 },
        tags: ["омега-3", "EPA/DHA", "сърдечно-съдово здраве", "противовъзпалително"],
        icon: "🐟",
        favorite: true,
    },
    {
        id: "multivitamin",
        name: "Мултивитаминен комплекс",
        brand: "Solgar",
        category: "supplement",
        servingG: 2,
        per100: { calories: 100, protein: 5, carbs: 20, sugar: 0, fat: 1, saturated: 0, fiber: 0, sodium: 50 },
        tags: ["витамини", "минерали", "имунна система", "ежедневна доза"],
        icon: "💊",
        favorite: false,
    },
    {
        id: "electrolyte-mix",
        name: "Електролитна смес за хидратация",
        brand: "Nuun",
        category: "supplement",
        servingG: 5.5,
        per100: { calories: 18, protein: 0, carbs: 4, sugar: 0, fat: 0, saturated: 0, fiber: 0, sodium: 600 },
        tags: ["хидратация", "натрий", "калий", "магнезий", "без захар"],
        icon: "💧",
        favorite: false,
    },
    {
        id: "casein-protein",
        name: "Казеинов протеин шоколад",
        brand: "Optimum Nutrition",
        category: "supplement",
        servingG: 34,
        per100: { calories: 350, protein: 76, carbs: 12, sugar: 8, fat: 4, saturated: 2, fiber: 1, sodium: 400 },
        tags: ["бавно усвояване", "преди сън", "мускулна защита"],
        icon: "🌙",
        favorite: false,
    },
    {
        id: "bcaa",
        name: "BCAA аминокиселини 2:1:1",
        brand: "Dymatize",
        category: "supplement",
        servingG: 7,
        per100: { calories: 57, protein: 86, carbs: 0, sugar: 0, fat: 0, saturated: 0, fiber: 0, sodium: 57 },
        tags: ["аминокиселини", "по време на тренировка", "мускулно възстановяване"],
        icon: "⚗️",
        favorite: false,
    },

    // ── Whole-food proteins ────────────────────────────────────────────────────
    {
        id: "chicken-breast",
        name: "Пилешко гърди (сурово)",
        brand: "Пресни продукти",
        category: "protein",
        servingG: 150,
        per100: { calories: 165, protein: 31, carbs: 0, sugar: 0, fat: 3.6, saturated: 1, fiber: 0, sodium: 74 },
        tags: ["висок протеин", "нискомаслено", "без глутен", "meal prep"],
        icon: "🍗",
        favorite: true,
    },
    {
        id: "salmon",
        name: "Атлантическа сьомга (филе)",
        brand: "Пресни продукти",
        category: "meat",
        servingG: 180,
        per100: { calories: 208, protein: 20, carbs: 0, sugar: 0, fat: 13, saturated: 3.1, fiber: 0, sodium: 59 },
        tags: ["омега-3", "висок протеин", "без глутен", "витамин D"],
        icon: "🐟",
        favorite: false,
    },
    {
        id: "egg",
        name: "Яйце (цяло, варено)",
        brand: "Пресни продукти",
        category: "protein",
        servingG: 60,
        per100: { calories: 155, protein: 13, carbs: 1.1, sugar: 1.1, fat: 11, saturated: 3.3, fiber: 0, sodium: 124 },
        tags: ["пълноценен протеин", "витамин B12", "холин"],
        icon: "🥚",
        favorite: true,
    },
    {
        id: "tuna-can",
        name: "Риба тон в собствен сос",
        brand: "Bonduelle",
        category: "meat",
        servingG: 100,
        per100: { calories: 103, protein: 24, carbs: 0, sugar: 0, fat: 0.9, saturated: 0.3, fiber: 0, sodium: 350 },
        tags: ["висок протеин", "нискомаслено", "омега-3", "бърза закуска"],
        icon: "🥫",
        favorite: true,
    },

    // ── Dairy ──────────────────────────────────────────────────────────────────
    {
        id: "greek-yogurt",
        name: "Гръцко кисело мляко 0%",
        brand: "Olympus",
        category: "dairy",
        servingG: 200,
        per100: { calories: 57, protein: 10, carbs: 4, sugar: 4, fat: 0.2, saturated: 0.1, fiber: 0, sodium: 46 },
        tags: ["висок протеин", "нискомаслено", "пробиотик", "казеин"],
        icon: "🥛",
        favorite: true,
    },
    {
        id: "cottage-cheese",
        name: "Извара нискомаслена 2%",
        brand: "Ела",
        category: "dairy",
        servingG: 150,
        per100: { calories: 72, protein: 12, carbs: 3.4, sugar: 3.4, fat: 1, saturated: 0.6, fiber: 0, sodium: 321 },
        tags: ["висок протеин", "нискомаслено", "казеин", "кето-приятен"],
        icon: "🧀",
        favorite: false,
    },

    // ── Grains ─────────────────────────────────────────────────────────────────
    {
        id: "oats",
        name: "Овесени ядки (едрозърнести)",
        brand: "Quaker",
        category: "grain",
        servingG: 80,
        per100: { calories: 379, protein: 13, carbs: 67, sugar: 1, fat: 6.9, saturated: 1.2, fiber: 10, sodium: 2 },
        tags: ["фибри", "бавни въглехидрати", "веган", "без захар"],
        icon: "🌾",
        favorite: true,
    },
    {
        id: "brown-rice",
        name: "Кафяв ориз (варен)",
        brand: "Panda",
        category: "grain",
        servingG: 200,
        per100: { calories: 111, protein: 2.6, carbs: 23, sugar: 0.4, fat: 0.9, saturated: 0.2, fiber: 1.8, sodium: 5 },
        tags: ["бавни въглехидрати", "фибри", "веган", "без глутен"],
        icon: "🍚",
        favorite: false,
    },
    {
        id: "quinoa",
        name: "Киноа (варена)",
        brand: "Organic Village",
        category: "grain",
        servingG: 180,
        per100: { calories: 120, protein: 4.4, carbs: 22, sugar: 0.9, fat: 1.9, saturated: 0.2, fiber: 2.8, sodium: 7 },
        tags: ["пълни протеини", "без глутен", "веган", "всички аминокиселини"],
        icon: "🌿",
        favorite: false,
    },

    // ── Vegetables ─────────────────────────────────────────────────────────────
    {
        id: "broccoli",
        name: "Броколи (пресен)",
        brand: "Пресни продукти",
        category: "vegetable",
        servingG: 150,
        per100: { calories: 34, protein: 2.8, carbs: 7, sugar: 1.7, fat: 0.4, saturated: 0.1, fiber: 2.6, sodium: 33 },
        tags: ["нискокалорично", "витамин C", "антиоксиданти", "веган"],
        icon: "🥦",
        favorite: false,
    },
    {
        id: "sweet-potato",
        name: "Сладък картоф (варен)",
        brand: "Пресни продукти",
        category: "vegetable",
        servingG: 200,
        per100: { calories: 86, protein: 1.6, carbs: 20, sugar: 4.2, fat: 0.1, saturated: 0, fiber: 3, sodium: 27 },
        tags: ["бета-каротин", "фибри", "веган", "сложни въглехидрати"],
        icon: "🍠",
        favorite: false,
    },
    {
        id: "spinach",
        name: "Спанак (пресен)",
        brand: "Пресни продукти",
        category: "vegetable",
        servingG: 100,
        per100: { calories: 23, protein: 2.9, carbs: 3.6, sugar: 0.4, fat: 0.4, saturated: 0.1, fiber: 2.2, sodium: 79 },
        tags: ["желязо", "витамин K", "нискокалорично", "веган"],
        icon: "🌱",
        favorite: false,
    },

    // ── Fruits ─────────────────────────────────────────────────────────────────
    {
        id: "banana",
        name: "Банан (зрял)",
        brand: "Пресни продукти",
        category: "fruit",
        servingG: 120,
        per100: { calories: 89, protein: 1.1, carbs: 23, sugar: 12, fat: 0.3, saturated: 0.1, fiber: 2.6, sodium: 1 },
        tags: ["бързи въглехидрати", "калий", "преди тренировка", "веган"],
        icon: "🍌",
        favorite: false,
    },
    {
        id: "blueberries",
        name: "Боровинки (пресни/замразени)",
        brand: "Пресни продукти",
        category: "fruit",
        servingG: 100,
        per100: { calories: 57, protein: 0.7, carbs: 14, sugar: 10, fat: 0.3, saturated: 0, fiber: 2.4, sodium: 1 },
        tags: ["антиоксиданти", "ниско GI", "витамин C", "веган"],
        icon: "🫐",
        favorite: true,
    },

    // ── Healthy fats ───────────────────────────────────────────────────────────
    {
        id: "avocado",
        name: "Авокадо (зряло)",
        brand: "Пресни продукти",
        category: "fat",
        servingG: 100,
        per100: { calories: 160, protein: 2, carbs: 9, sugar: 0.7, fat: 15, saturated: 2.1, fiber: 7, sodium: 7 },
        tags: ["здравословни мазнини", "фибри", "калий", "веган"],
        icon: "🥑",
        favorite: false,
    },
    {
        id: "almonds",
        name: "Бадеми (сурови)",
        brand: "Seeberger",
        category: "fat",
        servingG: 30,
        per100: { calories: 579, protein: 21, carbs: 22, sugar: 4.4, fat: 50, saturated: 3.8, fiber: 12, sodium: 1 },
        tags: ["здравословни мазнини", "магнезий", "витамин E", "веган"],
        icon: "🥜",
        favorite: false,
    },
    {
        id: "olive-oil",
        name: "Зехтин Extra Virgin",
        brand: "Borges",
        category: "fat",
        servingG: 15,
        per100: { calories: 884, protein: 0, carbs: 0, sugar: 0, fat: 100, saturated: 14, fiber: 0, sodium: 2 },
        tags: ["мononенаситени мазнини", "антиоксиданти", "средиземноморска диета", "веган"],
        icon: "🫒",
        favorite: true,
    },
    {
        id: "peanut-butter",
        name: "Фъстъчено масло (натурално)",
        brand: "Meridian",
        category: "fat",
        servingG: 32,
        per100: { calories: 598, protein: 26, carbs: 13, sugar: 5, fat: 51, saturated: 10, fiber: 5, sodium: 8 },
        tags: ["протеин", "здравословни мазнини", "без добавена захар"],
        icon: "🥜",
        favorite: false,
    },

    // ── Drinks ─────────────────────────────────────────────────────────────────
    {
        id: "green-tea",
        name: "Зелен чай (запарка)",
        brand: "Sencha",
        category: "drink",
        servingG: 250,
        per100: { calories: 1, protein: 0, carbs: 0.2, sugar: 0, fat: 0, saturated: 0, fiber: 0, sodium: 0 },
        tags: ["антиоксиданти", "метаболизъм", "L-теанин", "без захар"],
        icon: "🍵",
        favorite: false,
    },
    {
        id: "protein-shake-ready",
        name: "Ready-to-Drink протеин шейк",
        brand: "Arla Protein",
        category: "drink",
        servingG: 250,
        per100: { calories: 57, protein: 10, carbs: 4.5, sugar: 3.8, fat: 0.7, saturated: 0.3, fiber: 0, sodium: 80 },
        tags: ["висок протеин", "след тренировка", "удобен", "без глутен"],
        icon: "🥤",
        favorite: false,
    },
];

export const PRODUCTS_STATS = {
    totalProducts: 3420,
    categories: CATEGORIES.length - 1,
    scannedToday: 4,
    favorites: PRODUCTS.filter((p) => p.favorite).length,
    recentlyViewed: ["chicken-breast", "greek-yogurt", "oats", "whey-protein-isolate"],
};
