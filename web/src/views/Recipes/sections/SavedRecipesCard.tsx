import type { JSX } from "react";
import { RECIPES_DATA } from "./recipesData";

export default function SavedRecipesCard(): JSX.Element {
    const saved = RECIPES_DATA.recipes.filter((r) => r.saved);

    return (
        <div className="card rc-card" style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "var(--sp-3)" }}>
                <div>
                    <div className="label text-gray">Запазени рецепти</div>
                    <div className="heading-sm" style={{ color: "var(--color-cream)", marginTop: 4 }}>Бързи фаворити</div>
                </div>
                <span className="rc-pill" style={{ background: "rgba(255,107,53,0.1)", color: "#FF6B35" }}>♥ {RECIPES_DATA.stats.savedCount}</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-2)" }}>
                {saved.map((recipe) => (
                    <div key={recipe.id} style={{ display: "flex", alignItems: "center", gap: "var(--sp-3)", padding: "var(--sp-3) var(--sp-4)", borderRadius: "var(--r-lg)", background: "rgba(255,255,255,0.025)", border: "1px solid var(--c-border,rgba(255,255,255,0.06))" }}>
                        {/* Color dot */}
                        <div style={{ width: 10, height: 10, borderRadius: "50%", background: recipe.gradient, flexShrink: 0 }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div className="body-sm" style={{ color: "var(--color-cream)", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{recipe.name}</div>
                            <div style={{ display: "flex", gap: "var(--sp-2)", marginTop: 3, flexWrap: "wrap" }}>
                                <span className="label text-gray">{recipe.category}</span>
                                <span className="label text-gray">·</span>
                                <span className="label text-gray">{recipe.calories} kcal</span>
                                <span className="label text-gray">·</span>
                                <span className="label text-gray">⏱ {recipe.prepTime} мин.</span>
                            </div>
                        </div>
                        <div style={{ display: "flex", gap: "var(--sp-2)", flexShrink: 0 }}>
                            <span className="label" style={{ color: "var(--c-electric,#0066FF)", background: "rgba(0,102,255,0.08)", padding: "2px 7px", borderRadius: "var(--r-full)" }}>{recipe.protein}г П</span>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ borderTop: "1px solid var(--c-border,rgba(255,255,255,0.06))", paddingTop: "var(--sp-3)" }}>
                <div className="label text-gray" style={{ marginBottom: "var(--sp-2)" }}>Препоръчани за теб</div>
                {RECIPES_DATA.suggestions.map((s) => (
                    <div key={s.name} style={{ padding: "var(--sp-3) var(--sp-4)", borderRadius: "var(--r-lg)", background: "linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015))", border: "1px solid var(--c-border,rgba(255,255,255,0.06))", marginBottom: 6 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", gap: "var(--sp-3)", alignItems: "flex-start" }}>
                            <div>
                                <div className="body-sm" style={{ color: "var(--color-cream)", fontWeight: 600 }}>{s.name}</div>
                                <div className="body-sm text-gray" style={{ marginTop: 4 }}>{s.reason}</div>
                            </div>
                            <div style={{ textAlign: "right", flexShrink: 0 }}>
                                <div className="label" style={{ color: "var(--c-acid,#C8FF00)" }}>{s.calories} kcal</div>
                                <div className="label text-gray">{s.protein}г протеин</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
