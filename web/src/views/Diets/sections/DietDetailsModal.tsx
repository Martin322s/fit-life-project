import { useMemo, useState } from "react";
import type { JSX } from "react";
import type { ApiDiet } from "../../../services/dietsApi";
import { DIET_DIFFICULTY_COLOR, dietCategoryLabel, dietDifficultyLabel, dietGoalLabel } from "../../../lib/dietLabels";

type Props = {
    diet: ApiDiet;
    isAdmin: boolean;
    onClose: () => void;
    onDelete: (id: string) => void;
};

type MealKey = "breakfast" | "lunch" | "dinner" | "snack";

type MealRecipe = {
    title: string;
    kcal: number;
    protein: number;
    carbs: number;
    fat: number;
    time: number;
    note: string;
    ingredients: string[];
    steps: string[];
};

const MEALS: { key: MealKey; label: string }[] = [
    { key: "breakfast", label: "Закуска" },
    { key: "lunch", label: "Обяд" },
    { key: "dinner", label: "Вечеря" },
    { key: "snack", label: "Снак" },
];

const MEAL_LABELS: Record<MealKey, string> = {
    breakfast: "закуска",
    lunch: "обяд",
    dinner: "вечеря",
    snack: "снак",
};

function makeRecipe(
    title: string,
    kcal: number,
    protein: number,
    carbs: number,
    fat: number,
    time: number,
    note: string,
    ingredients: string[],
    steps: string[],
): MealRecipe {
    return { title, kcal, protein, carbs, fat, time, note, ingredients, steps };
}

function recipesForMeal(diet: ApiDiet, meal: MealKey): MealRecipe[] {
    const lowCarb = diet.category === "low-carb";
    const vegetarian = diet.category === "vegetarian";
    const highProtein = diet.category === "high-protein" || diet.category === "muscle-gain";

    if (meal === "breakfast") {
        if (lowCarb) {
            return [
                makeRecipe("Яйца със спанак и сирене", 360, 27, 8, 24, 12, "Нисковъглехидратна закуска с добра ситост.", ["2 яйца", "шепа спанак", "40 г сирене", "1 ч.л. зехтин"], ["Загрей тигана.", "Задуши спанака за кратко.", "Добави яйцата и сиренето.", "Сервирай топло."]),
                makeRecipe("Кисело мляко с орехи", 330, 22, 14, 20, 4, "Бърз вариант без готвене.", ["250 г цедено кисело мляко", "20 г орехи", "канела", "няколко малини"], ["Сложи млякото в купа.", "Добави орехите и плода.", "Поръси с канела."]),
            ];
        }
        if (vegetarian) {
            return [
                makeRecipe("Овес с кисело мляко и плод", 410, 24, 55, 10, 7, "Фибри и плавна енергия.", ["50 г овес", "200 г кисело мляко", "100 г плод", "10 г семена"], ["Смеси овеса и млякото.", "Добави плода.", "Остави 5 минути да омекне."]),
                makeRecipe("Чиа пудинг с ябълка", 360, 18, 42, 14, 6, "Подготвя се от вечерта.", ["25 г чиа", "180 мл мляко", "1 ябълка", "канела"], ["Смеси чиа и мляко.", "Охлади поне 2 часа.", "Добави ябълка и канела."]),
            ];
        }
        return [
            makeRecipe(highProtein ? "Скир купа с овес и ягоди" : "Пълнозърнест тост с яйце", highProtein ? 420 : 390, highProtein ? 38 : 24, highProtein ? 42 : 34, highProtein ? 8 : 16, highProtein ? 8 : 10, highProtein ? "Висок протеин още от сутринта." : "Бърза балансирана закуска.", highProtein ? ["250 г скир", "40 г овес", "100 г ягоди", "10 г мед"] : ["2 филии пълнозърнест хляб", "1 яйце", "домати", "малко авокадо"], highProtein ? ["Сложи скира в купа.", "Добави овес и ягоди.", "Завърши с малко мед."] : ["Препечи хляба.", "Сготви яйцето.", "Добави зеленчуците и сервирай."]),
            makeRecipe("Омлет с пуешко и гъби", 390, 35, 10, 22, 14, "Добра ситост и лесно следене.", ["2 яйца", "80 г пуешко филе", "гъби", "магданоз"], ["Нарежи гъбите.", "Запечи пуешкото.", "Добави яйцата и готви до готовност."]),
        ];
    }

    if (meal === "lunch") {
        if (vegetarian) {
            return [
                makeRecipe("Леща със салата и сирене", 560, 30, 72, 16, 30, "Силен растителен обяд.", ["250 г сварена леща", "салата", "50 г сирене", "зехтин"], ["Затопли лещата.", "Приготви салатата.", "Добави сирене и зехтин."]),
                makeRecipe("Киноа с нахут и таханов сос", 590, 25, 78, 19, 25, "Балансиран обяд без месо.", ["150 г киноа", "120 г нахут", "зеленчуци", "таханов сос"], ["Свари киноата.", "Добави нахута и зеленчуците.", "Полей със соса."]),
            ];
        }
        return [
            makeRecipe(lowCarb ? "Салата с пилешко и авокадо" : "Пилешка купа с булгур", lowCarb ? 520 : 580, lowCarb ? 42 : 42, lowCarb ? 18 : 62, lowCarb ? 30 : 14, lowCarb ? 18 : 28, lowCarb ? "Много обем, малко въглехидрати." : "Лесно се носи в кутия.", lowCarb ? ["150 г пилешко", "зелена салата", "1/2 авокадо", "лимон"] : ["150 г пилешко", "160 г булгур", "зеленчуци", "кисело-млечен сос"], ["Сготви протеина.", "Подготви гарнитурата.", "Сглоби купата и овкуси."]),
            makeRecipe("Салата с риба тон и боб", 520, 39, 48, 15, 12, "Без готвене, с добри макроси.", ["1 консерва риба тон", "120 г боб", "домати", "магданоз"], ["Отцеди рибата и боба.", "Нарежи зеленчуците.", "Смеси и овкуси."]),
        ];
    }

    if (meal === "dinner") {
        if (vegetarian) {
            return [
                makeRecipe("Тофу с ориз и броколи", 520, 31, 60, 16, 24, "Леко и богато на протеин.", ["150 г тофу", "150 г ориз", "броколи", "соев сос"], ["Запечи тофуто.", "Свари ориза.", "Добави броколите и соса."]),
                makeRecipe("Омлет със сирене и домати", 430, 29, 16, 27, 15, "Бърза вечеря без месо.", ["3 яйца", "50 г сирене", "домати", "босилек"], ["Разбий яйцата.", "Добави сирене.", "Сервирай с домати."]),
            ];
        }
        return [
            makeRecipe(lowCarb ? "Треска с краставична салата" : "Риба със зеленчуци и картоф", lowCarb ? 390 : 500, lowCarb ? 38 : 38, lowCarb ? 12 : 46, lowCarb ? 18 : 14, lowCarb ? 20 : 25, lowCarb ? "Лека вечеря с чист протеин." : "Лека вечеря с достатъчно обем.", lowCarb ? ["180 г треска", "краставица", "кисело мляко", "копър"] : ["180 г риба", "200 г картоф", "зеленчуци", "лимон"], ["Овкуси протеина.", "Изпечи или задуши.", "Добави салата и сервирай."]),
            makeRecipe("Пуешко със зеленчуково рагу", 540, 43, 38, 20, 30, "Подходящо за подготовка напред.", ["160 г пуешко", "тиквички", "чушки", "доматен сос"], ["Запечи пуешкото.", "Добави зеленчуците.", "Остави да къкри 10 минути."]),
        ];
    }

    return [
        makeRecipe(highProtein ? "Протеинов крем с какао" : "Кисело мляко с орехи", highProtein ? 260 : 260, highProtein ? 30 : 18, highProtein ? 18 : 18, highProtein ? 6 : 16, highProtein ? 6 : 4, highProtein ? "Сладък снак с висок протеин." : "Малко, но засищащо.", highProtein ? ["200 г скир", "1 доза протеин", "какао", "малко мляко"] : ["200 г кисело мляко", "20 г орехи", "канела", "малко плод"], ["Смеси продуктите.", "Охлади за кратко.", "Сервирай."]),
        makeRecipe(lowCarb ? "Сирене с чери домати" : "Мини сандвич с пуешко", lowCarb ? 210 : 290, lowCarb ? 14 : 22, lowCarb ? 8 : 32, lowCarb ? 15 : 8, lowCarb ? 4 : 6, lowCarb ? "Солен снак без захар." : "Добър вариант преди тренировка.", lowCarb ? ["60 г сирене", "чери домати", "риган"] : ["пълнозърнеста филия", "80 г пуешко", "краставица", "горчица"], lowCarb ? ["Нарежи продуктите.", "Овкуси и сервирай."] : ["Сглоби сандвича.", "Добави зеленчуци.", "Сервирай веднага."]),
    ];
}

export default function DietDetailsModal({ diet, isAdmin, onClose, onDelete }: Props): JSX.Element {
    const [activeMeal, setActiveMeal] = useState<MealKey>("breakfast");
    const [selectedTitle, setSelectedTitle] = useState("");
    const activeRecipes = useMemo(() => recipesForMeal(diet, activeMeal), [diet, activeMeal]);
    const selectedRecipe = activeRecipes.find((recipe) => recipe.title === selectedTitle) ?? activeRecipes[0];

    return (
        <div style={{ position: "fixed", inset: 0, zIndex: 400, display: "flex", alignItems: "center", justifyContent: "center", padding: "var(--sp-4)", background: "rgba(0,0,0,0.72)", backdropFilter: "blur(6px)" }} onClick={onClose}>
            <div style={{ width: "100%", maxWidth: 880, maxHeight: "90vh", overflowY: "auto", background: "var(--c-surface-1,#0E1318)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "var(--r-xl,20px)", padding: "var(--sp-6)", display: "flex", flexDirection: "column", gap: "var(--sp-4)" }} onClick={(e) => e.stopPropagation()}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "var(--sp-3)" }}>
                    <div>
                        <div style={{ display: "flex", gap: "var(--sp-2)", flexWrap: "wrap", marginBottom: 8 }}>
                            <span className="dt-pill" style={{ background: "rgba(0,102,255,0.1)", color: "var(--c-electric,#0066FF)" }}>{dietCategoryLabel(diet.category)}</span>
                            <span className="dt-pill" style={{ background: "rgba(255,255,255,0.05)", color: DIET_DIFFICULTY_COLOR[diet.difficulty] }}>{dietDifficultyLabel(diet.difficulty)}</span>
                            <span className="dt-pill" style={{ background: "rgba(200,255,0,0.08)", color: "var(--c-acid,#C8FF00)" }}>{dietGoalLabel(diet.goalType)}</span>
                        </div>
                        <div className="heading-sm" style={{ color: "var(--color-cream)" }}>{diet.title}</div>
                        <div className="body-sm text-gray" style={{ marginTop: 6 }}>{diet.description}</div>
                    </div>
                    <button type="button" onClick={onClose} style={{ background: "rgba(255,255,255,0.06)", border: "none", borderRadius: "50%", width: 32, height: 32, cursor: "pointer", color: "var(--color-cream)", fontSize: "1.1rem", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(4,minmax(0,1fr))", gap: "var(--sp-3)" }}>
                    {[
                        ["Калории", `${diet.caloriesPerDay} kcal`],
                        ["Протеин", `${diet.proteinTarget} г`],
                        ["Въглехидрати", `${diet.carbsTarget} г`],
                        ["Мазнини", `${diet.fatTarget} г`],
                    ].map(([label, value]) => (
                        <div key={label} style={{ padding: "var(--sp-3)", borderRadius: "var(--r-lg)", background: "rgba(255,255,255,0.025)", border: "1px solid var(--c-border,rgba(255,255,255,0.06))", textAlign: "center" }}>
                            <div className="label text-gray">{label}</div>
                            <div style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 800, color: "var(--color-cream)", marginTop: 4 }}>{value}</div>
                        </div>
                    ))}
                </div>

                <div className="dt-active-inner">
                    <div>
                        <div className="label text-gray" style={{ marginBottom: "var(--sp-2)" }}>Правила</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            {diet.rules.map((item) => <div key={item} className="body-sm" style={{ color: "var(--color-cream)" }}>• {item}</div>)}
                        </div>
                    </div>
                    <div>
                        <div className="label text-gray" style={{ marginBottom: "var(--sp-2)" }}>Примерно дневно меню</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            {diet.sampleMenu.map((item) => <div key={item} className="body-sm" style={{ color: "var(--color-cream)" }}>• {item}</div>)}
                        </div>
                    </div>
                </div>

                <div style={{ padding: "var(--sp-4)", borderRadius: "var(--r-lg)", background: "rgba(255,255,255,0.025)", border: "1px solid var(--c-border,rgba(255,255,255,0.06))", display: "flex", flexDirection: "column", gap: "var(--sp-3)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "var(--sp-3)", flexWrap: "wrap" }}>
                        <div>
                            <div className="label text-gray">Примерни рецепти за храненията</div>
                            <div className="heading-sm" style={{ color: "var(--color-cream)", marginTop: 4 }}>Избери хранене и рецепта</div>
                        </div>
                        <span className="dt-pill" style={{ background: "rgba(0,102,255,0.08)", color: "var(--c-electric,#0066FF)" }}>идеи, не дневник</span>
                    </div>

                    <div style={{ display: "flex", gap: "var(--sp-2)", flexWrap: "wrap" }}>
                        {MEALS.map((meal) => (
                            <button key={meal.key} type="button" onClick={() => { setActiveMeal(meal.key); setSelectedTitle(""); }} style={{ padding: "7px 14px", borderRadius: "var(--r-full)", fontSize: "0.8rem", fontWeight: 800, cursor: "pointer", border: "1px solid", background: activeMeal === meal.key ? "rgba(0,102,255,0.15)" : "transparent", borderColor: activeMeal === meal.key ? "var(--c-electric,#0066FF)" : "rgba(255,255,255,0.1)", color: activeMeal === meal.key ? "var(--c-electric,#0066FF)" : "rgba(255,255,255,0.48)" }}>
                                {meal.label}
                            </button>
                        ))}
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--sp-3)" }}>
                        {activeRecipes.map((recipe) => (
                            <button key={recipe.title} type="button" onClick={() => setSelectedTitle(recipe.title)} style={{ padding: "var(--sp-3)", borderRadius: "var(--r-lg)", background: selectedRecipe.title === recipe.title ? "rgba(0,102,255,0.08)" : "rgba(255,255,255,0.025)", border: `1px solid ${selectedRecipe.title === recipe.title ? "rgba(0,102,255,0.35)" : "var(--c-border,rgba(255,255,255,0.06))"}`, textAlign: "left", cursor: "pointer" }}>
                                <div style={{ color: "var(--color-cream)", fontWeight: 800 }}>{recipe.title}</div>
                                <div className="body-sm text-gray" style={{ marginTop: 5 }}>{recipe.note}</div>
                                <div style={{ display: "flex", gap: "var(--sp-2)", flexWrap: "wrap", marginTop: "var(--sp-3)" }}>
                                    <span className="dt-pill" style={{ background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.62)" }}>{recipe.kcal} kcal</span>
                                    <span className="dt-pill" style={{ background: "rgba(0,102,255,0.08)", color: "var(--c-electric,#0066FF)" }}>{recipe.protein} г протеин</span>
                                    <span className="dt-pill" style={{ background: "rgba(200,255,0,0.08)", color: "var(--c-acid,#C8FF00)" }}>{recipe.time} мин.</span>
                                </div>
                            </button>
                        ))}
                    </div>

                    <div style={{ borderRadius: "var(--r-lg)", background: "linear-gradient(180deg,rgba(255,255,255,0.035),rgba(255,255,255,0.015))", border: "1px solid var(--c-border,rgba(255,255,255,0.06))", padding: "var(--sp-4)", display: "flex", flexDirection: "column", gap: "var(--sp-3)" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "var(--sp-3)", flexWrap: "wrap" }}>
                            <div>
                                <div className="label text-gray">Детайли за рецептата</div>
                                <div style={{ color: "var(--color-cream)", fontWeight: 900, marginTop: 4 }}>{selectedRecipe.title}</div>
                                <div className="body-sm text-gray" style={{ marginTop: 4 }}>Подходяща за {MEAL_LABELS[activeMeal]} в рамките на този план.</div>
                            </div>
                            <div style={{ display: "flex", gap: "var(--sp-2)", flexWrap: "wrap" }}>
                                <span className="dt-pill" style={{ background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.65)" }}>{selectedRecipe.kcal} kcal</span>
                                <span className="dt-pill" style={{ background: "rgba(0,102,255,0.08)", color: "var(--c-electric,#0066FF)" }}>{selectedRecipe.protein} г П</span>
                                <span className="dt-pill" style={{ background: "rgba(200,255,0,0.08)", color: "var(--c-acid,#C8FF00)" }}>{selectedRecipe.carbs} г В</span>
                                <span className="dt-pill" style={{ background: "rgba(255,179,0,0.08)", color: "#FFB300" }}>{selectedRecipe.fat} г М</span>
                            </div>
                        </div>

                        <div className="dt-active-inner">
                            <div>
                                <div className="label text-gray" style={{ marginBottom: "var(--sp-2)" }}>Продукти</div>
                                <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                                    {selectedRecipe.ingredients.map((ingredient) => <div key={ingredient} className="body-sm" style={{ color: "var(--color-cream)" }}>• {ingredient}</div>)}
                                </div>
                            </div>
                            <div>
                                <div className="label text-gray" style={{ marginBottom: "var(--sp-2)" }}>Приготвяне</div>
                                <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                                    {selectedRecipe.steps.map((step, index) => <div key={step} className="body-sm" style={{ color: "var(--color-cream)" }}>{index + 1}. {step}</div>)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="dt-active-inner">
                    <div>
                        <div className="label text-gray" style={{ marginBottom: "var(--sp-2)" }}>Подходяща за</div>
                        {diet.suitableFor.map((item) => <div key={item} className="body-sm text-gray" style={{ marginBottom: 6 }}>• {item}</div>)}
                    </div>
                    <div>
                        <div className="label text-gray" style={{ marginBottom: "var(--sp-2)" }}>Не е подходяща за</div>
                        {diet.notSuitableFor.map((item) => <div key={item} className="body-sm text-gray" style={{ marginBottom: 6 }}>• {item}</div>)}
                    </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", gap: "var(--sp-3)", flexWrap: "wrap" }}>
                    <div className="body-sm text-gray">Стартиране и проследяване на диета ще бъде добавено в следващ етап.</div>
                    {isAdmin && <button type="button" className="btn-ghost btn-sm" onClick={() => onDelete(diet.id)} style={{ color: "var(--c-error,#FF3D57)" }}>Изтрий</button>}
                </div>
            </div>
        </div>
    );
}
