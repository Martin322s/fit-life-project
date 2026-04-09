import type { JSX } from "react";
import { CALORIES_DATA } from "./caloriesData";

export default function MealFlowCard(): JSX.Element {
    const totalPlanned = CALORIES_DATA.meals.reduce((sum, meal) => sum + meal.target, 0);
    return (
        <div className="card cal-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--sp-4)", gap: "var(--sp-3)" }}>
                <div>
                    <div className="label text-gray">Разбивка по хранения</div>
                    <div className="heading-sm" style={{ color: "var(--color-cream)", marginTop: 2 }}>Къде отиват калориите през деня</div>
                </div>
                <span className="label" style={{ color: "var(--c-electric,#0066FF)" }}>{totalPlanned} kcal планирани</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-2)" }}>
                {CALORIES_DATA.meals.map((meal) => {
                    const pct = meal.target === 0 ? 0 : meal.calories / meal.target;
                    const isPlanned = meal.status === "planned";
                    return (
                        <div key={meal.label} style={{ borderRadius: "var(--r-lg)", padding: "var(--sp-4)", background: isPlanned ? "rgba(200,255,0,0.04)" : "rgba(255,255,255,0.025)", border: `1px solid ${isPlanned ? "rgba(200,255,0,0.12)" : "var(--c-border,rgba(255,255,255,0.06))"}` }}>
                            <div style={{ display: "flex", justifyContent: "space-between", gap: "var(--sp-3)", alignItems: "flex-start", marginBottom: "var(--sp-2)" }}>
                                <div style={{ minWidth: 0 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "var(--sp-2)", flexWrap: "wrap" }}>
                                        <span className="body-sm" style={{ color: "var(--color-cream)", fontWeight: 700 }}>{meal.label}</span>
                                        <span className="label text-gray">{meal.time}</span>
                                        {isPlanned && <span className="cal-pill" style={{ background: "rgba(200,255,0,0.08)", color: "var(--c-acid,#C8FF00)" }}>Планирано</span>}
                                    </div>
                                    <div className="body-sm text-gray" style={{ marginTop: 4 }}>{meal.foods}</div>
                                </div>
                                <div style={{ textAlign: "right", flexShrink: 0 }}>
                                    <div style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 800, color: "var(--color-cream)" }}>
                                        {meal.calories || meal.target}
                                        <span className="label text-gray" style={{ marginLeft: 4 }}>{isPlanned ? "цел" : "kcal"}</span>
                                    </div>
                                    <div className="label text-gray">{meal.calories} / {meal.target}</div>
                                </div>
                            </div>
                            <div style={{ height: 7, borderRadius: "var(--r-full)", background: "rgba(255,255,255,0.06)", marginBottom: "var(--sp-3)" }}>
                                <div style={{ width: `${Math.min(pct, 1) * 100}%`, height: "100%", borderRadius: "var(--r-full)", background: isPlanned ? "var(--c-acid,#C8FF00)" : "var(--c-electric,#0066FF)" }} />
                            </div>
                            <div style={{ display: "flex", gap: "var(--sp-2)", flexWrap: "wrap" }}>
                                <span className="label" style={{ color: "var(--c-electric,#0066FF)", background: "rgba(0,102,255,0.1)", padding: "3px 8px", borderRadius: "var(--r-full)" }}>{meal.protein} г протеин</span>
                                <span className="label" style={{ color: "var(--c-acid,#C8FF00)", background: "rgba(200,255,0,0.08)", padding: "3px 8px", borderRadius: "var(--r-full)" }}>{meal.carbs} г въгл.</span>
                                <span className="label" style={{ color: "#FFB300", background: "rgba(255,179,0,0.1)", padding: "3px 8px", borderRadius: "var(--r-full)" }}>{meal.fat} г мазнини</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
