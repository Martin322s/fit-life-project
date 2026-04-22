import { useState } from "react";
import type { JSX, ReactNode } from "react";
import { Link } from "react-router-dom";
import FaqHero from "./sections/FaqHero";
import FaqSidebar from "./sections/FaqSidebar";
import FaqContent from "./sections/FaqContent";

type Category = {
    id: string;
    icon: string;
    label: string;
};

type FaqEntry = {
    id: string;
    category: string;
    question: string;
    answer: ReactNode;
};

type FaqSectionMeta = {
    id: string;
    icon: string;
    label: string;
};

const CATEGORIES: Category[] = [
    { id: "all", icon: "🔍", label: "Всички" },
    { id: "start", icon: "🚀", label: "Начало" },
    { id: "account", icon: "👤", label: "Профил" },
    { id: "weight", icon: "⚖️", label: "Тегло" },
    { id: "calories", icon: "🔥", label: "Калории" },
    { id: "recipes", icon: "🥗", label: "Рецепти" },
    { id: "privacy", icon: "🔒", label: "Поверителност" },
    { id: "technical", icon: "⚙️", label: "Техническо" },
];

const SECTIONS: FaqSectionMeta[] = [
    { id: "start", icon: "🚀", label: "Начало" },
    { id: "account", icon: "👤", label: "Профил и акаунт" },
    { id: "weight", icon: "⚖️", label: "Проследяване на тегло" },
    { id: "calories", icon: "🔥", label: "Калории и калкулатори" },
    { id: "recipes", icon: "🥗", label: "Рецепти и продукти" },
    { id: "privacy", icon: "🔒", label: "Поверителност и данни" },
    { id: "technical", icon: "⚙️", label: "Техническо" },
];

const FAQ_ITEMS: FaqEntry[] = [
    {
        id: "start-1",
        category: "start",
        question: "Безплатен ли е FitLife?",
        answer: (
            <p>
                Да — FitLife е напълно безплатен за основно ползване. Можеш да проследяваш теглото
                си, да използваш калкулаторите и да разглеждаш рецептите без никаква такса. В бъдеще
                планираме премиум функции, но базовите инструменти ще останат безплатни завинаги.
            </p>
        ),
    },
    {
        id: "start-2",
        category: "start",
        question: "Как да се регистрирам?",
        answer: (
            <>
                <p>Регистрацията е бърза и проста:</p>
                <ol
                    style={{
                        listStyle: "decimal",
                        paddingLeft: 20,
                        marginTop: 8,
                        display: "flex",
                        flexDirection: "column",
                        gap: 6,
                    }}
                >
                    <li>Кликни на „Регистрирай се" горе вдясно</li>
                    <li>Въведи имейл адрес и парола</li>
                    <li>Потвърди имейл адреса си</li>
                    <li>Попълни профила си (ръст, тегло, цел)</li>
                </ol>
                <p style={{ marginTop: 12 }}>Целият процес отнема под 2 минути.</p>
            </>
        ),
    },
    {
        id: "start-3",
        category: "start",
        question: "Нужно ли е да сваля приложение?",
        answer: (
            <p>
                Не — FitLife работи директно в браузъра на телефон, таблет или компютър. Не е нужно
                да инсталираш нищо. Сайтът е оптимизиран за мобилни устройства и работи отлично на
                iOS и Android.
            </p>
        ),
    },

    {
        id: "account-1",
        category: "account",
        question: "Какви данни трябва да въведа в профила си?",
        answer: (
            <>
                <p>За точни изчисления е нужно да въведеш:</p>
                <ul
                    style={{
                        listStyle: "disc",
                        paddingLeft: 20,
                        marginTop: 8,
                        display: "flex",
                        flexDirection: "column",
                        gap: 4,
                    }}
                >
                    <li>
                        <strong>Ръст</strong> — в сантиметри
                    </li>
                    <li>
                        <strong>Текущо тегло</strong> — в килограми
                    </li>
                    <li>
                        <strong>Възраст</strong> — в години
                    </li>
                    <li>
                        <strong>Пол</strong> — влияе на формулата за BMR
                    </li>
                    <li>
                        <strong>Цел</strong> — отслабване, поддържане или качване на маса
                    </li>
                    <li>
                        <strong>Ниво на активност</strong> — заседнал, умерено активен, активен
                    </li>
                </ul>
                <p style={{ marginTop: 12 }}>
                    Тези данни могат да се актуализират по всяко време от страницата „Профил".
                </p>
            </>
        ),
    },
    {
        id: "account-2",
        category: "account",
        question: "Мога ли да изтрия акаунта си?",
        answer: (
            <p>
                Да. Можеш да изтриеш акаунта си по всяко време от Настройки → „Изтрий акаунт". При
                изтриване всички данни — история на теглото, профилни данни и персонализации — се
                изтриват безвъзвратно в рамките на 30 дни.
            </p>
        ),
    },
    {
        id: "account-3",
        category: "account",
        question: "Забравих паролата си. Какво да правя?",
        answer: (
            <p>
                Кликни „Забравена парола" на страницата за вход. Въведи имейл адреса, с който си
                регистриран, и ще получиш линк за нулиране на паролата. Линкът е валиден 2 часа.
                Провери и папката „Спам" ако не получиш имейл.
            </p>
        ),
    },

    {
        id: "weight-1",
        category: "weight",
        question: "Колко често трябва да записвам теглото си?",
        answer: (
            <p>
                Препоръчваме ежедневно измерване — сутрин, след тоалет и преди закуска, за максимална
                точност. Теглото варира с 1-2 кг ден за ден поради вода и храна, затова FitLife
                показва 7-дневна средна стойност, която е по-представителна от отделните измервания.
            </p>
        ),
    },
    {
        id: "weight-2",
        category: "weight",
        question: "Как се изчислява BMI?",
        answer: (
            <>
                <p>BMI (Body Mass Index) се изчислява по стандартната формула:</p>
                <div
                    style={{
                        background: "var(--color-navy-light)",
                        borderRadius: "var(--radius-md)",
                        padding: "var(--space-md)",
                        margin: "12px 0",
                        fontFamily: "var(--font-display)",
                        fontSize: "1rem",
                        textAlign: "center",
                        color: "var(--color-mustard)",
                    }}
                >
                    BMI = тегло (кг) ÷ ръст² (м)
                </div>
                <p>Категории:</p>
                <ul
                    style={{
                        listStyle: "none",
                        padding: 0,
                        marginTop: 8,
                        display: "flex",
                        flexDirection: "column",
                        gap: 4,
                    }}
                >
                    <li style={{ display: "flex", gap: 8, fontSize: "0.875rem" }}>
                        <span style={{ color: "var(--color-gray-light)", minWidth: 80 }}>Под 18.5</span>
                        — Поднормено тегло
                    </li>
                    <li style={{ display: "flex", gap: 8, fontSize: "0.875rem" }}>
                        <span style={{ color: "var(--color-success)", minWidth: 80 }}>18.5 – 24.9</span>
                        — Нормално тегло
                    </li>
                    <li style={{ display: "flex", gap: 8, fontSize: "0.875rem" }}>
                        <span style={{ color: "var(--color-warning)", minWidth: 80 }}>25.0 – 29.9</span>
                        — Наднормено тегло
                    </li>
                    <li style={{ display: "flex", gap: 8, fontSize: "0.875rem" }}>
                        <span style={{ color: "var(--color-error)", minWidth: 80 }}>Над 30</span>—
                        Затлъстяване
                    </li>
                </ul>
                <p style={{ marginTop: 12, fontSize: "0.8rem", color: "var(--color-gray)" }}>
                    Забележка: BMI не отчита мускулна маса. Спортисти може да имат висок BMI без реален
                    здравен риск.
                </p>
            </>
        ),
    },
    {
        id: "weight-3",
        category: "weight",
        question: "Мога ли да редактирам или изтрия запис?",
        answer: (
            <p>
                Да. В страницата „Проследяване на тегло" → раздел „История" можеш да редактираш или
                изтриеш всеки запис. Промените се отразяват незабавно в графиките.
            </p>
        ),
    },

    {
        id: "calories-1",
        category: "calories",
        question: "Как се изчислява дневната норма калории?",
        answer: (
            <>
                <p>
                    FitLife използва формулата <strong>Mifflin-St Jeor</strong> за BMR (базален
                    метаболизъм), след което прилага коефициент на активност за TDEE (обща дневна
                    енергийна нужда):
                </p>
                <div
                    style={{
                        background: "var(--color-navy-light)",
                        borderRadius: "var(--radius-md)",
                        padding: "var(--space-md)",
                        margin: "12px 0",
                        fontSize: "0.85rem",
                        color: "var(--color-gray-light)",
                        lineHeight: 1.8,
                    }}
                >
                    <div>
                        <strong style={{ color: "var(--color-cream)" }}>Мъже:</strong> BMR = (10 × кг) +
                        (6.25 × см) – (5 × години) + 5
                    </div>
                    <div>
                        <strong style={{ color: "var(--color-cream)" }}>Жени:</strong> BMR = (10 × кг) +
                        (6.25 × см) – (5 × години) – 161
                    </div>
                </div>
                <p>TDEE = BMR × коефициент на активност (1.2 до 1.9)</p>
                <p style={{ marginTop: 8 }}>
                    При цел „отслабване" се прилага дефицит от 300–500 kcal/ден.
                </p>
            </>
        ),
    },
    {
        id: "calories-2",
        category: "calories",
        question: "Какво е макро разпределение и защо е важно?",
        answer: (
            <>
                <p>Макронутриентите са трите основни групи хранителни вещества:</p>
                <ul
                    style={{
                        listStyle: "none",
                        padding: 0,
                        marginTop: 8,
                        display: "flex",
                        flexDirection: "column",
                        gap: 8,
                    }}
                >
                    <li
                        style={{
                            display: "flex",
                            gap: 8,
                            alignItems: "flex-start",
                            fontSize: "0.875rem",
                        }}
                    >
                        <span
                            style={{
                                background: "rgba(200,168,50,0.2)",
                                borderRadius: 4,
                                padding: "2px 8px",
                                color: "var(--color-mustard)",
                                fontWeight: 700,
                                fontSize: "0.75rem",
                                flexShrink: 0,
                                marginTop: 1,
                            }}
                        >
                            Белтъчини
                        </span>
                        Градивен елемент на мускулите. Препоръчително: 1.6–2.2 г/кг телесно тегло.
                    </li>
                    <li
                        style={{
                            display: "flex",
                            gap: 8,
                            alignItems: "flex-start",
                            fontSize: "0.875rem",
                        }}
                    >
                        <span
                            style={{
                                background: "rgba(74,92,47,0.2)",
                                borderRadius: 4,
                                padding: "2px 8px",
                                color: "var(--color-olive-light)",
                                fontWeight: 700,
                                fontSize: "0.75rem",
                                flexShrink: 0,
                                marginTop: 1,
                            }}
                        >
                            Мазнини
                        </span>
                        Хормонален баланс и усвояване на витамини. Препоръчително: 25–35% от калориите.
                    </li>
                    <li
                        style={{
                            display: "flex",
                            gap: 8,
                            alignItems: "flex-start",
                            fontSize: "0.875rem",
                        }}
                    >
                        <span
                            style={{
                                background: "rgba(255,255,255,0.08)",
                                borderRadius: 4,
                                padding: "2px 8px",
                                color: "var(--color-gray-light)",
                                fontWeight: 700,
                                fontSize: "0.75rem",
                                flexShrink: 0,
                                marginTop: 1,
                            }}
                        >
                            Въглехидрати
                        </span>
                        Основен енергиен източник. Останалите калории след белтъчини и мазнини.
                    </li>
                </ul>
            </>
        ),
    },

    {
        id: "recipes-1",
        category: "recipes",
        question: "Откъде идват рецептите?",
        answer: (
            <p>
                Всички рецепти са създадени и верифицирани от нашия диетолог Николета Василева.
                Хранителните стойности са изчислени на база стандартни USDA данни и са проверени ръчно.
                Нови рецепти се добавят всеки месец.
            </p>
        ),
    },
    {
        id: "recipes-2",
        category: "recipes",
        question: "Мога ли да добавям свои рецепти?",
        answer: (
            <p>
                Функцията за персонални рецепти е в нашия roadmap за следващата версия (v2.1). Засега
                можеш да търсиш в базата с продукти за да намериш хранителните стойности на конкретни
                съставки. Следи <Link to="/contact">нашия Newsletter</Link> за обновления.
            </p>
        ),
    },

    {
        id: "privacy-1",
        category: "privacy",
        question: "Как се съхраняват и защитават личните ми данни?",
        answer: (
            <p>
                Данните ти се съхраняват на криптирани сървъри в ЕС, в съответствие с изискванията на
                GDPR. Паролите се хешират с bcrypt. Никога не продаваме или споделяме лични данни с
                трети страни. Прочети пълната ни{" "}
                <Link to="/privacy">Политика за поверителност</Link>.
            </p>
        ),
    },
    {
        id: "privacy-2",
        category: "privacy",
        question: "Мога ли да изтегля данните си?",
        answer: (
            <p>
                Да. В съответствие с GDPR имаш право на достъп до всички данни, свързани с тебе.
                Можеш да поискаш пълен export от Настройки → „Изтегли данните ми". Данните се изпращат
                на имейл в JSON и CSV формат в рамките на 48 часа.
            </p>
        ),
    },

    {
        id: "technical-1",
        category: "technical",
        question: "Кои браузъри се поддържат?",
        answer: (
            <p>
                FitLife работи в Chrome, Firefox, Safari и Edge (последните 2 версии). За най-добро
                мобилно изживяване препоръчваме Safari на iOS и Chrome на Android.
            </p>
        ),
    },
    {
        id: "technical-2",
        category: "technical",
        question: "Не получих имейл за потвърждение. Какво да правя?",
        answer: (
            <>
                <ol
                    style={{
                        listStyle: "decimal",
                        paddingLeft: 20,
                        display: "flex",
                        flexDirection: "column",
                        gap: 6,
                        fontSize: "0.875rem",
                    }}
                >
                    <li>Провери папката „Спам" или „Промоции"</li>
                    <li>Изчакай 5 минути и опресни пощата</li>
                    <li>Провери дали имейл адресът е въведен правилно</li>
                    <li>Влез и поискай нов имейл за потвърждение</li>
                </ol>
                <p style={{ marginTop: 12 }}>
                    Ако проблемът продължава —{" "}
                    <Link to="/contact">свържи се с нас</Link> и ще решим ситуацията.
                </p>
            </>
        ),
    },
];

function Faq(): JSX.Element {
    const [activeCategory, setActiveCategory] = useState("all");
    const [openItemId, setOpenItemId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const handleToggle = (id: string) => {
        setOpenItemId((current) => (current === id ? null : id));
    };

    return (
        <>
            <FaqHero searchQuery={searchQuery} onSearchChange={setSearchQuery} />
            <div className="container">
                <div className="faq-layout">
                    <FaqSidebar
                        categories={CATEGORIES}
                        activeCategory={activeCategory}
                        onCategoryChange={setActiveCategory}
                    />
                    <FaqContent
                        sections={SECTIONS}
                        faqItems={FAQ_ITEMS}
                        activeCategory={activeCategory}
                        openItemId={openItemId}
                        onToggle={handleToggle}
                        searchQuery={searchQuery}
                    />
                </div>
            </div>
        </>
    );
}

export default Faq;
