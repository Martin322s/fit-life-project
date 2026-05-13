import type { JSX } from "react";
import type { ApiRecipe } from "../../../services/recipesApi";
import { categoryLabel, DIFFICULTY_COLOR, difficultyLabel } from "../../../lib/recipeLabels";

type Props = {
    recipe: ApiRecipe;
    isAdmin: boolean;
    isSaved: boolean;
    onClose: () => void;
    onDelete: (id: string) => void;
    onToggleSave: (recipe: ApiRecipe) => void;
};

export default function RecipeDetailsModal({ recipe, isAdmin, isSaved, onClose, onDelete, onToggleSave }: Props): JSX.Element {
    return (
        <div style={{ position: "fixed", inset: 0, zIndex: 400, display: "flex", alignItems: "center", justifyContent: "center", padding: "var(--sp-4)", background: "rgba(0,0,0,0.72)", backdropFilter: "blur(6px)" }} onClick={onClose}>
            <div style={{ width: "100%", maxWidth: 760, maxHeight: "90vh", overflowY: "auto", background: "var(--c-surface-1,#0E1318)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "var(--r-xl,20px)", padding: "var(--sp-6)", display: "flex", flexDirection: "column", gap: "var(--sp-4)" }} onClick={(e) => e.stopPropagation()}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "var(--sp-3)" }}>
                    <div>
                        <div style={{ display: "flex", gap: "var(--sp-2)", flexWrap: "wrap", marginBottom: 8 }}>
                            <span className="rc-pill" style={{ background: "rgba(0,102,255,0.1)", color: "var(--c-electric,#0066FF)" }}>{categoryLabel(recipe.category)}</span>
                            <span className="rc-pill" style={{ background: "rgba(255,255,255,0.05)", color: DIFFICULTY_COLOR[recipe.difficulty] }}>{difficultyLabel(recipe.difficulty)}</span>
                            <span className="rc-pill" style={{ background: "rgba(255,255,255,0.05)", color: "var(--color-cream)" }}>{recipe.prepMinutes} мин.</span>
                        </div>
                        <div className="heading-sm" style={{ color: "var(--color-cream)" }}>{recipe.title}</div>
                        <div className="body-sm text-gray" style={{ marginTop: 6 }}>{recipe.description}</div>
                    </div>
                    <button type="button" onClick={onClose} style={{ background: "rgba(255,255,255,0.06)", border: "none", borderRadius: "50%", width: 32, height: 32, cursor: "pointer", color: "var(--color-cream)", fontSize: "1.1rem", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(4,minmax(0,1fr))", gap: "var(--sp-3)" }}>
                    {[
                        ["Калории", `${recipe.calories} kcal`],
                        ["Протеин", `${recipe.protein} г`],
                        ["Въглехидрати", `${recipe.carbs} г`],
                        ["Мазнини", `${recipe.fat} г`],
                    ].map(([label, value]) => (
                        <div key={label} style={{ padding: "var(--sp-3)", borderRadius: "var(--r-lg)", background: "rgba(255,255,255,0.025)", border: "1px solid var(--c-border,rgba(255,255,255,0.06))", textAlign: "center" }}>
                            <div className="label text-gray">{label}</div>
                            <div style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 800, color: "var(--color-cream)", marginTop: 4 }}>{value}</div>
                        </div>
                    ))}
                </div>

                <div className="rc-featured-inner">
                    <div>
                        <div className="label text-gray" style={{ marginBottom: "var(--sp-2)" }}>Продукти</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            {recipe.ingredients.map((item) => <div key={item} className="body-sm" style={{ color: "var(--color-cream)" }}>• {item}</div>)}
                        </div>
                    </div>
                    <div>
                        <div className="label text-gray" style={{ marginBottom: "var(--sp-2)" }}>Приготвяне</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                            {recipe.instructions.map((step, index) => <div key={step} className="body-sm" style={{ color: "var(--color-cream)" }}>{index + 1}. {step}</div>)}
                        </div>
                    </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", gap: "var(--sp-3)", flexWrap: "wrap" }}>
                    <div className="body-sm text-gray">Добавяне към храненията ще бъде свързано в следващ етап.</div>
                    <div style={{ display: "flex", gap: "var(--sp-2)", flexWrap: "wrap" }}>
                        <button type="button" className="btn-ghost btn-sm" onClick={() => onToggleSave(recipe)} style={{ color: isSaved ? "#FF6B35" : undefined, borderColor: isSaved ? "rgba(255,107,53,0.45)" : undefined }}>
                            {isSaved ? "♥ Запазена" : "♡ Запази"}
                        </button>
                        {isAdmin && <button type="button" className="btn-ghost btn-sm" onClick={() => onDelete(recipe.id)} style={{ color: "var(--c-error,#FF3D57)" }}>Изтрий</button>}
                    </div>
                </div>
            </div>
        </div>
    );
}
