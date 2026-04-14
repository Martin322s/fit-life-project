import type { JSX } from "react";
import { RECIPES_DATA } from "./recipesData";

const DIFFICULTY_COLOR: Record<string, string> = {
    "Лесно": "#00E676",
    "Средно": "#FFB300",
    "Трудно": "var(--c-error,#FF3D57)",
};

export default function FeaturedRecipeCard({ onAddToLog }: { onAddToLog: () => void }): JSX.Element {
    const r = RECIPES_DATA.featured;
    const totalKcal = r.protein * 4 + r.carbs * 4 + r.fat * 9;
    const macros = [
        { label: "Протеин", value: r.protein, kcal: r.protein * 4, color: "var(--c-electric,#0066FF)" },
        { label: "Въглехидрати", value: r.carbs, kcal: r.carbs * 4, color: "var(--c-acid,#C8FF00)" },
        { label: "Мазнини", value: r.fat, kcal: r.fat * 9, color: "#FFB300" },
    ];

    return (
        <div className="card rc-card" style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
            {/* Hero band */}
            <div style={{ borderRadius: "var(--r-lg)", background: r.gradient, padding: "var(--sp-5)", position: "relative", overflow: "hidden", minHeight: 120, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.25)" }} />
                <div style={{ position: "relative" }}>
                    <div style={{ display: "flex", gap: "var(--sp-2)", flexWrap: "wrap", marginBottom: 8 }}>
                        <span className="rc-pill" style={{ background: "rgba(255,255,255,0.2)", color: "#fff" }}>{r.category}</span>
                        <span className="rc-pill" style={{ background: "rgba(255,255,255,0.15)", color: "#fff" }}>⏱ {r.prepTime} мин.</span>
                        <span className="rc-pill" style={{ background: "rgba(255,255,255,0.15)", color: DIFFICULTY_COLOR[r.difficulty] }}>{r.difficulty}</span>
                        {r.saved && <span className="rc-pill" style={{ background: "rgba(255,255,255,0.15)", color: "#fff" }}>♥ Запазено</span>}
                    </div>
                    <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 900, color: "#fff", margin: 0, lineHeight: 1.2 }}>{r.name}</h2>
                    <div style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.8rem", marginTop: 4 }}>{r.servings} порции · {r.calories} kcal / порция</div>
                </div>
            </div>

            <div className="rc-featured-inner">
                {/* Left: ingredients + steps */}
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-3)" }}>
                    <div>
                        <div className="label text-gray" style={{ marginBottom: "var(--sp-2)" }}>Продукти</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                            {r.ingredients.map((ing) => (
                                <div key={ing} style={{ display: "flex", alignItems: "flex-start", gap: "var(--sp-2)" }}>
                                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--c-electric,#0066FF)", marginTop: 6, flexShrink: 0 }} />
                                    <span className="body-sm" style={{ color: "var(--color-cream)" }}>{ing}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <div className="label text-gray" style={{ marginBottom: "var(--sp-2)" }}>Приготвяне</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            {r.steps.map((step, i) => (
                                <div key={i} style={{ display: "flex", gap: "var(--sp-3)", alignItems: "flex-start" }}>
                                    <div style={{ width: 20, height: 20, borderRadius: "50%", background: "rgba(0,102,255,0.12)", color: "var(--c-electric,#0066FF)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", fontWeight: 800, flexShrink: 0, marginTop: 1 }}>{i + 1}</div>
                                    <span className="body-sm" style={{ color: "var(--color-cream)" }}>{step}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div style={{ display: "flex", gap: "var(--sp-2)", flexWrap: "wrap" }}>
                        {r.tags.map((tag) => (
                            <span key={tag} className="rc-pill" style={{ background: "rgba(0,102,255,0.08)", color: "var(--c-electric,#0066FF)" }}>{tag}</span>
                        ))}
                    </div>
                </div>

                {/* Right: nutrition */}
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-3)" }}>
                    <div className="label text-gray">Хранителна стойност / порция</div>
                    {/* Macro bar */}
                    <div style={{ display: "flex", height: 10, borderRadius: "var(--r-full)", overflow: "hidden", gap: 2 }}>
                        {macros.map((m) => (
                            <div key={m.label} style={{ width: `${(m.kcal / totalKcal) * 100}%`, background: m.color }} />
                        ))}
                    </div>
                    {/* Macro rows */}
                    {macros.map((m) => (
                        <div key={m.label}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                                <span className="body-sm" style={{ color: "var(--color-cream)", fontWeight: 600 }}>{m.label}</span>
                                <span className="body-sm text-gray">{m.value} г</span>
                            </div>
                            <div style={{ height: 6, borderRadius: "var(--r-full)", background: "rgba(255,255,255,0.06)" }}>
                                <div style={{ width: `${(m.kcal / totalKcal) * 100}%`, height: "100%", borderRadius: "var(--r-full)", background: m.color }} />
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                                <span className="label text-gray">{m.kcal} kcal</span>
                                <span className="label" style={{ color: m.color }}>{Math.round((m.kcal / totalKcal) * 100)}%</span>
                            </div>
                        </div>
                    ))}
                    {/* Extra stats */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--sp-2)" }}>
                        {[
                            { label: "Калории", value: `${r.calories} kcal`, color: "var(--color-cream)" },
                            { label: "Фибри", value: `${r.fiber} г`, color: "#00E676" },
                        ].map((s) => (
                            <div key={s.label} style={{ textAlign: "center", padding: "var(--sp-3)", borderRadius: "var(--r-lg)", background: "rgba(255,255,255,0.025)", border: "1px solid var(--c-border,rgba(255,255,255,0.06))" }}>
                                <div className="label text-gray">{s.label}</div>
                                <div style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 800, color: s.color, marginTop: 4 }}>{s.value}</div>
                            </div>
                        ))}
                    </div>
                    <button type="button" className="btn-primary" onClick={onAddToLog} style={{ marginTop: "auto" }}>
                        + Добави към дневника
                    </button>
                </div>
            </div>
        </div>
    );
}
