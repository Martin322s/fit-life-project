import type { JSX } from "react";
import type { ApiRecipe } from "../../../services/recipesApi";
import { categoryLabel, DIFFICULTY_COLOR, difficultyLabel } from "../../../lib/recipeLabels";

type Props = {
    recipes: ApiRecipe[];
    isLoading: boolean;
    total: number;
    page: number;
    totalPages: number;
    search: string;
    savedIds: string[];
    onSearch: (value: string) => void;
    onPage: (value: number) => void;
    onOpen: (recipe: ApiRecipe) => void;
    onToggleSave: (recipe: ApiRecipe) => void;
};

function RecipeCard({
    recipe,
    isSaved,
    onOpen,
    onToggleSave,
}: {
    recipe: ApiRecipe;
    isSaved: boolean;
    onOpen: (recipe: ApiRecipe) => void;
    onToggleSave: (recipe: ApiRecipe) => void;
}): JSX.Element {
    return (
        <div className="card rc-recipe-card" style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <div style={{ height: 8, background: "linear-gradient(90deg,var(--c-electric,#0066FF),var(--c-acid,#C8FF00))", borderRadius: "var(--r-lg) var(--r-lg) 0 0", marginTop: -20, marginLeft: -20, marginRight: -20, marginBottom: "var(--sp-3)", width: "calc(100% + 40px)" }} />

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "var(--sp-2)", marginBottom: "var(--sp-2)" }}>
                <button type="button" onClick={() => onOpen(recipe)} style={{ minWidth: 0, background: "transparent", border: 0, padding: 0, textAlign: "left", cursor: "pointer" }}>
                    <div className="body-sm" style={{ color: "var(--color-cream)", fontWeight: 700, lineHeight: 1.3 }}>{recipe.title}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--sp-2)", marginTop: 4, flexWrap: "wrap" }}>
                        <span className="label text-gray">⏱ {recipe.prepMinutes} мин.</span>
                        <span className="label" style={{ color: DIFFICULTY_COLOR[recipe.difficulty] }}>● {difficultyLabel(recipe.difficulty)}</span>
                    </div>
                </button>
                <button
                    type="button"
                    className="btn-ghost btn-sm"
                    onClick={() => onToggleSave(recipe)}
                    style={{ flexShrink: 0, color: isSaved ? "#FF6B35" : undefined, borderColor: isSaved ? "rgba(255,107,53,0.45)" : undefined }}
                    aria-label={isSaved ? "Премахни от запазени" : "Запази рецепта"}
                >
                    {isSaved ? "♥" : "♡"}
                </button>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "var(--sp-2)", flexWrap: "wrap", marginBottom: "var(--sp-3)" }}>
                <span style={{ fontFamily: "var(--font-display)", fontSize: "1.15rem", fontWeight: 800, color: "var(--color-cream)" }}>{recipe.calories}</span>
                <span className="label text-gray">kcal</span>
                <span className="label" style={{ color: "var(--c-electric,#0066FF)", background: "rgba(0,102,255,0.08)", padding: "2px 7px", borderRadius: "var(--r-full)" }}>{recipe.protein}г П</span>
                <span className="label" style={{ color: "var(--c-acid,#C8FF00)", background: "rgba(200,255,0,0.06)", padding: "2px 7px", borderRadius: "var(--r-full)" }}>{recipe.carbs}г В</span>
                <span className="label" style={{ color: "#FFB300", background: "rgba(255,179,0,0.08)", padding: "2px 7px", borderRadius: "var(--r-full)" }}>{recipe.fat}г М</span>
            </div>

            <div style={{ display: "flex", gap: "var(--sp-2)", flexWrap: "wrap", marginBottom: "var(--sp-3)" }}>
                <span className="rc-pill" style={{ background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.55)" }}>{categoryLabel(recipe.category)}</span>
                {isSaved && <span className="rc-pill" style={{ background: "rgba(255,107,53,0.1)", color: "#FF6B35" }}>Запазена</span>}
            </div>

            <div className="body-sm text-gray" style={{ flex: 1, marginBottom: "var(--sp-3)" }}>{recipe.description}</div>
            <button type="button" className="btn-ghost btn-sm" onClick={() => onOpen(recipe)} style={{ marginTop: "auto", alignSelf: "flex-start" }}>Детайли</button>
        </div>
    );
}

function pageNumbers(page: number, totalPages: number): number[] {
    const start = Math.max(1, page - 2);
    const end = Math.min(totalPages, start + 4);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

export default function RecipeGridCard({ recipes, isLoading, total, page, totalPages, search, savedIds, onSearch, onPage, onOpen, onToggleSave }: Props): JSX.Element {
    return (
        <div className="card rc-card" style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "var(--sp-3)", flexWrap: "wrap" }}>
                <div>
                    <div className="label text-gray">Библиотека с рецепти</div>
                    <div className="heading-sm" style={{ color: "var(--color-cream)", marginTop: 4 }}>{total} рецепти</div>
                </div>
                <div className="body-sm text-gray">Страница {page} / {totalPages}</div>
            </div>

            <input
                value={search}
                onChange={(e) => onSearch(e.target.value)}
                placeholder="Търси по име или описание..."
                style={{ width: "100%", padding: "10px 14px", borderRadius: "var(--r-lg)", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "var(--color-cream)", outline: "none", boxSizing: "border-box" }}
            />

            {isLoading && <div className="body-sm text-gray" style={{ padding: "var(--sp-6)", textAlign: "center" }}>Зареждане на рецепти...</div>}
            {!isLoading && recipes.length === 0 && <div className="body-sm text-gray" style={{ padding: "var(--sp-6)", textAlign: "center" }}>Няма рецепти по това търсене.</div>}

            {!isLoading && recipes.length > 0 && (
                <div className="rc-recipe-grid">
                    {recipes.map((recipe) => (
                        <RecipeCard
                            key={recipe.id}
                            recipe={recipe}
                            isSaved={savedIds.includes(recipe.id)}
                            onOpen={onOpen}
                            onToggleSave={onToggleSave}
                        />
                    ))}
                </div>
            )}

            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "var(--sp-2)", flexWrap: "wrap" }}>
                <button type="button" className="btn-ghost btn-sm" disabled={page <= 1} onClick={() => onPage(page - 1)}>Назад</button>
                {pageNumbers(page, totalPages).map((n) => (
                    <button key={n} type="button" className={n === page ? "btn-primary btn-sm" : "btn-ghost btn-sm"} onClick={() => onPage(n)}>{n}</button>
                ))}
                <button type="button" className="btn-ghost btn-sm" disabled={page >= totalPages} onClick={() => onPage(page + 1)}>Напред</button>
            </div>
        </div>
    );
}
