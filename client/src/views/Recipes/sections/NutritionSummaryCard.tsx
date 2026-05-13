import type { JSX } from "react";
import { RECIPES_DATA } from "./recipesData";

export default function NutritionSummaryCard(): JSX.Element {
    const n = RECIPES_DATA.todayNutrition;
    const rows = [
        { label: "Калории",        consumed: n.calories.consumed, target: n.calories.target, unit: "kcal", color: "var(--c-electric,#0066FF)" },
        { label: "Протеин",        consumed: n.protein.consumed,  target: n.protein.target,  unit: "г",    color: "var(--c-electric,#0066FF)" },
        { label: "Въглехидрати",   consumed: n.carbs.consumed,    target: n.carbs.target,    unit: "г",    color: "var(--c-acid,#C8FF00)" },
        { label: "Мазнини",        consumed: n.fat.consumed,      target: n.fat.target,      unit: "г",    color: "#FFB300" },
    ];

    const calPct = Math.round((n.calories.consumed / n.calories.target) * 100);
    const remaining = n.calories.target - n.calories.consumed;

    return (
        <div className="card rc-card" style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "var(--sp-3)" }}>
                <div>
                    <div className="label text-gray">Хранене за днес</div>
                    <div className="heading-sm" style={{ color: "var(--color-cream)", marginTop: 4 }}>От планираните рецепти</div>
                </div>
                <span className="rc-pill" style={{ background: "rgba(0,102,255,0.1)", color: "var(--c-electric,#0066FF)" }}>{calPct}%</span>
            </div>

            {/* Calories big display */}
            <div style={{ textAlign: "center", padding: "var(--sp-4)", borderRadius: "var(--r-lg)", background: "rgba(255,255,255,0.025)", border: "1px solid var(--c-border,rgba(255,255,255,0.06))" }}>
                <div className="label text-gray">Изядени от план</div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "2.2rem", fontWeight: 900, color: "var(--color-cream)", lineHeight: 1, margin: "8px 0 4px" }}>{n.calories.consumed}</div>
                <div className="label text-gray">от {n.calories.target} kcal дневна цел</div>
                <div style={{ height: 6, borderRadius: "var(--r-full)", background: "rgba(255,255,255,0.06)", margin: "12px 0 6px" }}>
                    <div style={{ width: `${Math.min(calPct, 100)}%`, height: "100%", borderRadius: "var(--r-full)", background: "linear-gradient(90deg,#0066FF,var(--c-acid,#C8FF00))" }} />
                </div>
                <div className="label" style={{ color: remaining > 0 ? "#00E676" : "var(--c-error,#FF3D57)" }}>
                    {remaining > 0 ? `Остават ${remaining} kcal` : `Надвишен с ${Math.abs(remaining)} kcal`}
                </div>
            </div>

            {/* Macro rows */}
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-3)" }}>
                {rows.slice(1).map((row) => {
                    const pct = Math.min((row.consumed / row.target) * 100, 100);
                    return (
                        <div key={row.label}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                                <span className="body-sm" style={{ color: "var(--color-cream)", fontWeight: 600 }}>{row.label}</span>
                                <span className="body-sm text-gray">{row.consumed} / {row.target} {row.unit}</span>
                            </div>
                            <div style={{ height: 6, borderRadius: "var(--r-full)", background: "rgba(255,255,255,0.06)" }}>
                                <div style={{ width: `${pct}%`, height: "100%", borderRadius: "var(--r-full)", background: row.color }} />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Suggestions teaser */}
            <div style={{ borderTop: "1px solid var(--c-border,rgba(255,255,255,0.06))", paddingTop: "var(--sp-3)" }}>
                <div className="label text-gray" style={{ marginBottom: "var(--sp-2)" }}>Умни предложения</div>
                {RECIPES_DATA.suggestions.slice(0, 2).map((s) => (
                    <div key={s.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "var(--sp-3)", padding: "var(--sp-2) var(--sp-3)", borderRadius: "var(--r-md)", background: "rgba(255,255,255,0.02)", marginBottom: 6 }}>
                        <div style={{ minWidth: 0 }}>
                            <div className="body-sm" style={{ color: "var(--color-cream)", fontWeight: 600 }}>{s.name}</div>
                            <div className="label text-gray" style={{ marginTop: 2 }}>{s.calories} kcal · {s.protein}г П</div>
                        </div>
                        <button type="button" className="btn-ghost btn-sm" style={{ flexShrink: 0, fontSize: "0.72rem" }}>+ Добави</button>
                    </div>
                ))}
            </div>
        </div>
    );
}
