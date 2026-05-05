import type { JSX } from "react";
import type { ApiRecipe } from "../../../services/recipesApi";
import { categoryLabel, DIFFICULTY_COLOR, difficultyLabel } from "../../../lib/recipeLabels";

type Props = {
    recipe: ApiRecipe | null;
    isLoading: boolean;
    onOpen: (recipe: ApiRecipe) => void;
};

export default function FeaturedRecipeCard({ recipe, isLoading, onOpen }: Props): JSX.Element {
    if (isLoading) {
        return (
            <div className="card rc-card" style={{ minHeight: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span className="body-sm text-gray">Зареждане на рецепта...</span>
            </div>
        );
    }

    if (!recipe) {
        return (
            <div className="card rc-card" style={{ minHeight: 300, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
                <span className="body-sm text-gray">Няма рецепта за показване.</span>
            </div>
        );
    }

    const totalKcal = recipe.protein * 4 + recipe.carbs * 4 + recipe.fat * 9 || 1;
    const macros = [
        { label: "Протеин", value: recipe.protein, kcal: recipe.protein * 4, color: "var(--c-electric,#0066FF)" },
        { label: "Въглехидрати", value: recipe.carbs, kcal: recipe.carbs * 4, color: "var(--c-acid,#C8FF00)" },
        { label: "Мазнини", value: recipe.fat, kcal: recipe.fat * 9, color: "#FFB300" },
    ];

    return (
        <div className="card rc-card" style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
            <div style={{ borderRadius: "var(--r-lg)", background: "linear-gradient(135deg,rgba(0,102,255,0.75),rgba(200,255,0,0.45))", padding: "var(--sp-5)", position: "relative", overflow: "hidden", minHeight: 120, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.25)" }} />
                <div style={{ position: "relative" }}>
                    <div style={{ display: "flex", gap: "var(--sp-2)", flexWrap: "wrap", marginBottom: 8 }}>
                        <span className="rc-pill" style={{ background: "rgba(255,255,255,0.2)", color: "#fff" }}>{categoryLabel(recipe.category)}</span>
                        <span className="rc-pill" style={{ background: "rgba(255,255,255,0.15)", color: "#fff" }}>⏱ {recipe.prepMinutes} мин.</span>
                        <span className="rc-pill" style={{ background: "rgba(255,255,255,0.15)", color: DIFFICULTY_COLOR[recipe.difficulty] }}>{difficultyLabel(recipe.difficulty)}</span>
                    </div>
                    <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 900, color: "#fff", margin: 0, lineHeight: 1.2 }}>{recipe.title}</h2>
                    <div style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.82rem", marginTop: 4 }}>{recipe.calories} kcal · {recipe.description}</div>
                </div>
            </div>

            <div className="rc-featured-inner">
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-3)" }}>
                    <div>
                        <div className="label text-gray" style={{ marginBottom: "var(--sp-2)" }}>Продукти</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                            {recipe.ingredients.slice(0, 4).map((ing) => (
                                <div key={ing} style={{ display: "flex", alignItems: "flex-start", gap: "var(--sp-2)" }}>
                                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--c-electric,#0066FF)", marginTop: 6, flexShrink: 0 }} />
                                    <span className="body-sm" style={{ color: "var(--color-cream)" }}>{ing}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <button type="button" className="btn-ghost btn-sm" onClick={() => onOpen(recipe)} style={{ alignSelf: "flex-start" }}>Виж детайли</button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-3)" }}>
                    <div className="label text-gray">Хранителна стойност</div>
                    <div style={{ display: "flex", height: 10, borderRadius: "var(--r-full)", overflow: "hidden", gap: 2 }}>
                        {macros.map((m) => <div key={m.label} style={{ width: `${(m.kcal / totalKcal) * 100}%`, background: m.color }} />)}
                    </div>
                    {macros.map((m) => (
                        <div key={m.label}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                                <span className="body-sm" style={{ color: "var(--color-cream)", fontWeight: 600 }}>{m.label}</span>
                                <span className="body-sm text-gray">{m.value} г</span>
                            </div>
                            <div style={{ height: 6, borderRadius: "var(--r-full)", background: "rgba(255,255,255,0.06)" }}>
                                <div style={{ width: `${(m.kcal / totalKcal) * 100}%`, height: "100%", borderRadius: "var(--r-full)", background: m.color }} />
                            </div>
                        </div>
                    ))}
                    <button type="button" className="btn-primary" onClick={() => onOpen(recipe)} style={{ marginTop: "auto" }}>Отвори рецептата</button>
                </div>
            </div>
        </div>
    );
}
