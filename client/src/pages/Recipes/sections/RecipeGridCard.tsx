import { useState } from "react";
import type { JSX } from "react";
import { RECIPES_DATA, type Recipe } from "./recipesData";

const CATEGORIES = ["Всички", "Закуска", "Обяд", "Вечеря", "Снак"];

const DIFFICULTY_COLOR: Record<string, string> = {
    "Лесно": "#00E676",
    "Средно": "#FFB300",
    "Трудно": "var(--c-error,#FF3D57)",
};

function RecipeCard({ recipe, onAdd }: { recipe: Recipe; onAdd: (r: Recipe) => void }): JSX.Element {
    const [added, setAdded] = useState(false);

    function handleAdd() {
        setAdded(true);
        onAdd(recipe);
        setTimeout(() => setAdded(false), 2000);
    }

    return (
        <div className="card rc-recipe-card" style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
            {/* Color band */}
            <div style={{ height: 8, background: recipe.gradient, borderRadius: "var(--r-lg) var(--r-lg) 0 0", marginTop: -20, marginLeft: -20, marginRight: -20, marginBottom: "var(--sp-3)", width: "calc(100% + 40px)" }} />

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "var(--sp-2)", marginBottom: "var(--sp-2)" }}>
                <div style={{ minWidth: 0 }}>
                    <div className="body-sm" style={{ color: "var(--color-cream)", fontWeight: 700, lineHeight: 1.3 }}>{recipe.name}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--sp-2)", marginTop: 4, flexWrap: "wrap" }}>
                        <span className="label text-gray">⏱ {recipe.prepTime} мин.</span>
                        <span className="label" style={{ color: DIFFICULTY_COLOR[recipe.difficulty] }}>● {recipe.difficulty}</span>
                    </div>
                </div>
                {recipe.saved && <span style={{ fontSize: "0.9rem", flexShrink: 0 }}>♥</span>}
            </div>

            {/* Calories + macros pills */}
            <div style={{ display: "flex", alignItems: "center", gap: "var(--sp-2)", flexWrap: "wrap", marginBottom: "var(--sp-3)" }}>
                <span style={{ fontFamily: "var(--font-display)", fontSize: "1.15rem", fontWeight: 800, color: "var(--color-cream)" }}>{recipe.calories}</span>
                <span className="label text-gray">kcal</span>
                <span className="label" style={{ color: "var(--c-electric,#0066FF)", background: "rgba(0,102,255,0.08)", padding: "2px 7px", borderRadius: "var(--r-full)" }}>{recipe.protein}г П</span>
                <span className="label" style={{ color: "var(--c-acid,#C8FF00)", background: "rgba(200,255,0,0.06)", padding: "2px 7px", borderRadius: "var(--r-full)" }}>{recipe.carbs}г В</span>
                <span className="label" style={{ color: "#FFB300", background: "rgba(255,179,0,0.08)", padding: "2px 7px", borderRadius: "var(--r-full)" }}>{recipe.fat}г М</span>
            </div>

            {/* Tags */}
            <div style={{ display: "flex", gap: "var(--sp-2)", flexWrap: "wrap", flex: 1, alignContent: "flex-start", marginBottom: "var(--sp-3)" }}>
                {recipe.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="label" style={{ color: "rgba(255,255,255,0.35)", background: "rgba(255,255,255,0.04)", padding: "2px 7px", borderRadius: "var(--r-full)" }}>{tag}</span>
                ))}
            </div>

            <button
                type="button"
                onClick={handleAdd}
                className={added ? "btn-ghost btn-sm" : "btn-ghost btn-sm"}
                style={{ marginTop: "auto", color: added ? "#00E676" : undefined, borderColor: added ? "#00E676" : undefined }}
            >
                {added ? "✓ Добавено" : "+ Добави към плана"}
            </button>
        </div>
    );
}

export default function RecipeGridCard(): JSX.Element {
    const [activeCategory, setActiveCategory] = useState("Всички");
    const [addedId, setAddedId] = useState<number | null>(null);

    const filtered = activeCategory === "Всички"
        ? RECIPES_DATA.recipes
        : RECIPES_DATA.recipes.filter((r) => r.category === activeCategory);

    return (
        <div className="card rc-card" style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "var(--sp-3)", flexWrap: "wrap" }}>
                <div>
                    <div className="label text-gray">Библиотека с рецепти</div>
                    <div className="heading-sm" style={{ color: "var(--color-cream)", marginTop: 4 }}>
                        {filtered.length} рецепти{activeCategory !== "Всички" ? ` · ${activeCategory}` : ""}
                    </div>
                </div>
                {addedId && (
                    <span className="rc-pill" style={{ background: "rgba(0,230,118,0.08)", color: "#00E676" }}>✓ Добавено към плана</span>
                )}
            </div>

            {/* Category filter */}
            <div style={{ display: "flex", gap: "var(--sp-2)", flexWrap: "wrap" }}>
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat}
                        type="button"
                        onClick={() => setActiveCategory(cat)}
                        style={{
                            padding: "6px 14px", borderRadius: "var(--r-full)", fontSize: "0.8rem", fontWeight: 700,
                            cursor: "pointer", border: "1px solid", transition: "all 0.15s",
                            background: activeCategory === cat ? "rgba(0,102,255,0.15)" : "transparent",
                            borderColor: activeCategory === cat ? "var(--c-electric,#0066FF)" : "rgba(255,255,255,0.1)",
                            color: activeCategory === cat ? "var(--c-electric,#0066FF)" : "rgba(255,255,255,0.45)",
                        }}
                    >{cat}</button>
                ))}
            </div>

            {/* Grid */}
            <div className="rc-recipe-grid">
                {filtered.map((recipe) => (
                    <RecipeCard
                        key={recipe.id}
                        recipe={recipe}
                        onAdd={(r) => setAddedId(r.id)}
                    />
                ))}
            </div>
        </div>
    );
}
