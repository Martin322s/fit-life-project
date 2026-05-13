import type { JSX } from "react";
import { DIETS_DATA } from "./dietsData";

export default function MealIdeasCard(): JSX.Element {
    const ideas = DIETS_DATA.mealIdeas;

    return (
        <div className="card dt-card" style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
            <div>
                <div className="label text-gray">Идеи за хранения</div>
                <div className="heading-sm" style={{ color: "var(--color-cream)", marginTop: 4 }}>Препоръчани рецепти за днес</div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-3)" }}>
                {ideas.map((idea) => (
                    <div key={idea.meal} style={{ padding: "var(--sp-4)", borderRadius: "var(--r-lg)", background: "rgba(255,255,255,0.025)", border: "1px solid var(--c-border,rgba(255,255,255,0.06))", display: "flex", flexDirection: "column", gap: "var(--sp-2)" }}>
                        {/* Meal label + prep time */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "var(--sp-2)" }}>
                                <span style={{ fontSize: "1rem" }}>{idea.icon}</span>
                                <span className="label" style={{ color: "rgba(255,255,255,0.5)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", fontSize: "0.65rem" }}>{idea.meal}</span>
                            </div>
                            <span className="label text-gray" style={{ fontSize: "0.65rem" }}>⏱ {idea.prepTime} мин.</span>
                        </div>

                        {/* Name */}
                        <div className="body-sm" style={{ color: "var(--color-cream)", fontWeight: 700 }}>{idea.name}</div>

                        {/* Macro pills */}
                        <div style={{ display: "flex", gap: "var(--sp-2)", flexWrap: "wrap" }}>
                            <span className="dt-pill" style={{ background: "rgba(0,102,255,0.08)", color: "var(--c-electric,#0066FF)", fontSize: "0.65rem" }}>{idea.calories} kcal</span>
                            <span className="dt-pill" style={{ background: "rgba(0,102,255,0.06)", color: "var(--c-electric,#0066FF)", fontSize: "0.65rem" }}>Б {idea.protein}г</span>
                            <span className="dt-pill" style={{ background: "rgba(200,255,0,0.06)", color: "var(--c-acid,#C8FF00)", fontSize: "0.65rem" }}>В {idea.carbs}г</span>
                            <span className="dt-pill" style={{ background: "rgba(255,179,0,0.06)", color: "#FFB300", fontSize: "0.65rem" }}>М {idea.fat}г</span>
                        </div>

                        {/* Tip */}
                        <div className="label text-gray" style={{ fontSize: "0.7rem", lineHeight: 1.5, borderLeft: "2px solid rgba(0,102,255,0.3)", paddingLeft: 8 }}>
                            💡 {idea.tip}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
