export type StoreCategory = {
    key: string;
    label: string;
    icon: string;
};

export type StoreItem = {
    id: string;
    name: string;
    brand: string;
    category: string;
    price: number;
    oldPrice?: number;
    badge?: string;
    icon: string;
    rating: number;
    reviews: number;
    inStock: boolean;
    delivery: string;
};

export const STORE_CATEGORIES: StoreCategory[] = [
    { key: "all", label: "Всички", icon: "🛍️" },
    { key: "supplements", label: "Добавки", icon: "💪" },
    { key: "food", label: "Храни", icon: "🥗" },
    { key: "accessories", label: "Аксесоари", icon: "🎒" },
    { key: "recovery", label: "Възстановяване", icon: "🧘" },
];

export const STORE_ITEMS: StoreItem[] = [
    {
        id: "impact-whey",
        name: "Impact Whey Protein",
        brand: "MyProtein",
        category: "supplements",
        price: 54.90,
        oldPrice: 64.90,
        badge: "-15%",
        icon: "🥤",
        rating: 4.8,
        reviews: 312,
        inStock: true,
        delivery: "Доставка утре",
    },
    {
        id: "creatine-monohydrate",
        name: "Creatine Monohydrate",
        brand: "Optimum Nutrition",
        category: "supplements",
        price: 39.90,
        icon: "⚡",
        rating: 4.9,
        reviews: 201,
        inStock: true,
        delivery: "Доставка утре",
    },
    {
        id: "protein-bar-box",
        name: "Protein Bar Box",
        brand: "Barebells",
        category: "food",
        price: 28.50,
        oldPrice: 32.00,
        badge: "Топ",
        icon: "🍫",
        rating: 4.7,
        reviews: 154,
        inStock: true,
        delivery: "2-3 дни",
    },
    {
        id: "shaker-pro",
        name: "Shaker Pro 700ml",
        brand: "FitLife Gear",
        category: "accessories",
        price: 14.90,
        icon: "🥤",
        rating: 4.6,
        reviews: 88,
        inStock: true,
        delivery: "Доставка утре",
    },
    {
        id: "lifting-straps",
        name: "Lifting Straps",
        brand: "GymBeam",
        category: "accessories",
        price: 19.90,
        icon: "🏋️",
        rating: 4.5,
        reviews: 67,
        inStock: false,
        delivery: "Изчерпан",
    },
    {
        id: "foam-roller",
        name: "Foam Roller",
        brand: "Trigger Point",
        category: "recovery",
        price: 34.90,
        badge: "Ново",
        icon: "🌀",
        rating: 4.8,
        reviews: 96,
        inStock: true,
        delivery: "2-3 дни",
    },
    {
        id: "electrolyte-tabs",
        name: "Electrolyte Tabs",
        brand: "SIS",
        category: "recovery",
        price: 22.90,
        icon: "💧",
        rating: 4.7,
        reviews: 143,
        inStock: true,
        delivery: "Доставка утре",
    },
    {
        id: "peanut-butter",
        name: "Natural Peanut Butter",
        brand: "Bio Balance",
        category: "food",
        price: 11.90,
        icon: "🥜",
        rating: 4.6,
        reviews: 119,
        inStock: true,
        delivery: "2-3 дни",
    },
];

export const FEATURED_BUNDLES = [
    {
        id: "muscle-stack",
        title: "Muscle Stack",
        subtitle: "Протеин + креатин + shaker",
        discount: "Спестяваш 22 лв",
        price: "89.90 лв",
        gradient: "linear-gradient(135deg,#0066FF 0%,#00C2FF 100%)",
        bullets: ["За сила и възстановяване", "Безплатна доставка", "Избрано от треньор"],
    },
    {
        id: "recovery-pack",
        title: "Recovery Pack",
        subtitle: "Електролити + foam roller",
        discount: "Подарък mini towel",
        price: "49.90 лв",
        gradient: "linear-gradient(135deg,#7BDCB5 0%,#C8FF00 100%)",
        bullets: ["След тежки тренировки", "Наличен в 3 варианта", "Подходящ за пътуване"],
    },
];

export const STORE_STATS = {
    activeDeals: 18,
    fastDelivery: "24ч",
    topBrands: 42,
    avgRating: "4.8/5",
};
