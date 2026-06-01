import type { JSX } from "react";
import { DIETS_DATA } from "./dietsData";

const DIFF_COLOR: Record<string, string> = {
    "Лесно": "#00E676",
    "Средно": "#FFB300",
    "Трудно": "var(--c-error,#FF3D57)",
};

export default function AvailableDietsCard({ onSwitch }: { onSwitch: () => void }): JSX.Element {
    return (
        <div className="card dt-card" style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "var(--sp-3)" }}>
                <div>
                    <div className="label text-gray">Налични диетни планове</div>
                    <div className="heading-sm" style={{ color: "var(--color-cream)", marginTop: 4 }}>Избери план подходящ за твоите цели</div>
                </div>
                <span className="dt-pill" style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.4)" }}>{DIETS_DATA.availableDiets.length} плана</span>
            </div>

            <div className="dt-diets-grid">
                {DIETS_DATA.availableDiets.map((diet) => (
                    <div key={diet.id} style={{ borderRadius: "var(--r-lg)", overflow: "hidden", border: `1px solid ${diet.active ? "var(--c-electric,#0066FF)" : "var(--c-border,rgba(255,255,255,0.06))"}`, background: diet.active ? "rgba(0,102,255,0.05)" : "rgba(255,255,255,0.015)", display: "flex", flexDirection: "column" }}>
                        {/* Color band */}
                        <div style={{ height: 6, background: diet.gradient }} />
                        <div style={{ padding: "var(--sp-4)", flex: 1, display: "flex", flexDirection: "column", gap: "var(--sp-3)" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "var(--sp-2)" }}>
                                    <span style={{ fontSize: "1.3rem" }}>{diet.icon}</span>
                                    <div>
                                        <div className="body-sm" style={{ color: "var(--color-cream)", fontWeight: 700 }}>{diet.name}</div>
                                        <div className="label" style={{ color: DIFF_COLOR[diet.difficulty], marginTop: 2 }}>{diet.difficulty}</div>
                                    </div>
                                </div>
                                {diet.active && (
                                    <span className="dt-pill" style={{ background: "rgba(0,102,255,0.12)", color: "var(--c-electric,#0066FF)", fontSize: "0.62rem" }}>✓ Активна</span>
                                )}
                            </div>

                            {/* Macro split mini bar */}
                            <div>
                                <div style={{ display: "flex", height: 5, borderRadius: "var(--r-full)", overflow: "hidden", gap: 1, marginBottom: 4 }}>
                                    <div style={{ width: `${diet.macroSplit.carbs}%`,   background: "var(--c-acid,#C8FF00)", opacity: 0.7 }} />
                                    <div style={{ width: `${diet.macroSplit.protein}%`, background: "var(--c-electric,#0066FF)", opacity: 0.7 }} />
                                    <div style={{ width: `${diet.macroSplit.fat}%`,     background: "#FFB300", opacity: 0.7 }} />
                                </div>
                                <div className="label text-gray" style={{ fontSize: "0.65rem" }}>
                                    В{diet.macroSplit.carbs}% · П{diet.macroSplit.protein}% · М{diet.macroSplit.fat}% · {diet.calorieTarget} kcal
                                </div>
                            </div>

                            {/* Tags */}
                            <div style={{ display: "flex", gap: "var(--sp-2)", flexWrap: "wrap" }}>
                                {diet.tags.slice(0, 2).map((tag) => (
                                    <span key={tag} className="label" style={{ color: "rgba(255,255,255,0.35)", background: "rgba(255,255,255,0.04)", padding: "2px 7px", borderRadius: "var(--r-full)" }}>{tag}</span>
                                ))}
                            </div>

                            <button
                                type="button"
                                onClick={diet.active ? undefined : onSwitch}
                                className={diet.active ? "btn-ghost btn-sm" : "btn-ghost btn-sm"}
                                style={{ marginTop: "auto", opacity: diet.active ? 0.45 : 1, cursor: diet.active ? "default" : "pointer", color: diet.active ? "rgba(255,255,255,0.4)" : undefined }}
                                disabled={diet.active}
                            >
                                {diet.active ? "Текущ план" : "Превключи"}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
