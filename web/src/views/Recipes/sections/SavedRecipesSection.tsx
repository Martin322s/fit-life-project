import type { JSX } from "react";
import type { ApiRecipe } from "../../../services/recipesApi";
import { categoryLabel } from "../../../lib/recipeLabels";

type Props = {
    recipes: ApiRecipe[];
    savedIds: string[];
    onOpen: (recipe: ApiRecipe) => void;
    onToggleSave: (recipe: ApiRecipe) => void;
};

export default function SavedRecipesSection({ recipes, savedIds, onOpen, onToggleSave }: Props): JSX.Element {
    const saved = savedIds
        .map((id) => recipes.find((recipe) => recipe.id === id))
        .filter((recipe): recipe is ApiRecipe => recipe != null);

    return (
        <div className="card rc-card" style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "var(--sp-3)" }}>
                <div>
                    <div className="label text-gray">Запазени рецепти</div>
                    <div className="heading-sm" style={{ color: "var(--color-cream)", marginTop: 4 }}>Твоята бърза колекция</div>
                </div>
                <span className="rc-pill" style={{ background: "rgba(255,107,53,0.1)", color: "#FF6B35" }}>♥ {savedIds.length}</span>
            </div>

            {saved.length === 0 ? (
                <div style={{ padding: "var(--sp-4)", borderRadius: "var(--r-lg)", background: "rgba(255,255,255,0.025)", border: "1px solid var(--c-border,rgba(255,255,255,0.06))" }}>
                    <div className="body-sm text-gray">Натисни ♡ върху рецепта, за да я запазиш тук.</div>
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-2)" }}>
                    {saved.slice(0, 6).map((recipe) => (
                        <div key={recipe.id} style={{ display: "flex", alignItems: "center", gap: "var(--sp-3)", padding: "var(--sp-3) var(--sp-4)", borderRadius: "var(--r-lg)", background: "rgba(255,255,255,0.025)", border: "1px solid var(--c-border,rgba(255,255,255,0.06))" }}>
                            <button type="button" onClick={() => onOpen(recipe)} style={{ flex: 1, minWidth: 0, background: "transparent", border: 0, padding: 0, textAlign: "left", cursor: "pointer" }}>
                                <div className="body-sm" style={{ color: "var(--color-cream)", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{recipe.title}</div>
                                <div style={{ display: "flex", gap: "var(--sp-2)", marginTop: 3, flexWrap: "wrap" }}>
                                    <span className="label text-gray">{categoryLabel(recipe.category)}</span>
                                    <span className="label text-gray">·</span>
                                    <span className="label text-gray">{recipe.calories} kcal</span>
                                    <span className="label text-gray">·</span>
                                    <span className="label text-gray">{recipe.prepMinutes} мин.</span>
                                </div>
                            </button>
                            <button type="button" className="btn-ghost btn-sm" onClick={() => onToggleSave(recipe)} style={{ color: "#FF6B35", borderColor: "rgba(255,107,53,0.45)", flexShrink: 0 }}>♥</button>
                        </div>
                    ))}
                </div>
            )}

            {savedIds.length > saved.length && (
                <div className="body-sm text-gray">Някои запазени рецепти не са на текущата страница. Ще се покажат, когато ги заредиш от каталога.</div>
            )}
        </div>
    );
}
