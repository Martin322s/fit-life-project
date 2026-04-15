import type { JSX } from "react";
import { DIETS_DATA } from "./dietsData";

export default function ActiveDietCard({ onSwitch }: { onSwitch: () => void }): JSX.Element {
    const d = DIETS_DATA.activeDiet;
    const totalWeeks = d.durationWeeks;
    const completedWeeks = Math.floor(d.daysOnPlan / 7);
    const pctComplete = Math.round((d.daysOnPlan / (totalWeeks * 7)) * 100);
    const weightLost = +(d.startWeight - d.currentWeight).toFixed(1);
    const daysLeft = totalWeeks * 7 - d.daysOnPlan;

    return (
        <div className="card dt-card" style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
            {/* Hero band */}
            <div style={{ borderRadius: "var(--r-lg)", background: d.gradient, padding: "var(--sp-5)", position: "relative", overflow: "hidden", minHeight: 110 }}>
                <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.2)" }} />
                <div style={{ position: "relative" }}>
                    <div style={{ display: "flex", gap: "var(--sp-2)", flexWrap: "wrap", marginBottom: 8 }}>
                        <span className="dt-pill" style={{ background: "rgba(255,255,255,0.2)", color: "#fff" }}>✓ Активна диета</span>
                        <span className="dt-pill" style={{ background: "rgba(255,255,255,0.15)", color: "#fff" }}>Ден {d.daysOnPlan}</span>
                        <span className="dt-pill" style={{ background: "rgba(255,255,255,0.15)", color: "#fff" }}>{d.difficulty}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--sp-3)", minWidth: 0 }}>
                        <span style={{ fontSize: "2.2rem", flexShrink: 0 }}>{d.icon}</span>
                        <div style={{ minWidth: 0, flex: 1 }}>
                            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.15rem, 4.8vw, 1.5rem)", fontWeight: 900, color: "#fff", margin: 0, lineHeight: 1.15 }}>{d.nameLong}</h2>
                            <div style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.8rem", marginTop: 2 }}>От {d.startDate} · {d.calorieTarget} kcal/ден</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="dt-active-inner" style={{ minWidth: 0 }}>
                {/* Left: description + plan progress */}
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-3)", minWidth: 0 }}>
                    <p className="body-sm" style={{ color: "var(--color-cream)", margin: 0, lineHeight: 1.6 }}>{d.description}</p>

                    {/* Tags */}
                    <div style={{ display: "flex", gap: "var(--sp-2)", flexWrap: "wrap" }}>
                        {d.tags.map((t) => (
                            <span key={t} className="dt-pill" style={{ background: "rgba(0,102,255,0.08)", color: "var(--c-electric,#0066FF)" }}>{t}</span>
                        ))}
                    </div>

                    {/* Plan duration progress */}
                    <div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                            <span className="label text-gray">Напредък в плана</span>
                            <span className="label" style={{ color: "var(--c-acid,#C8FF00)" }}>{completedWeeks} / {totalWeeks} седмици</span>
                        </div>
                        <div style={{ height: 8, borderRadius: "var(--r-full)", background: "rgba(255,255,255,0.06)" }}>
                            <div style={{ width: `${pctComplete}%`, height: "100%", borderRadius: "var(--r-full)", background: "linear-gradient(90deg,#0066FF,#00CEC9)" }} />
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                            <span className="label text-gray">{pctComplete}% изминат</span>
                            <span className="label text-gray">Остават {daysLeft} дни</span>
                        </div>
                    </div>

                    <div className="body-sm text-gray" style={{ padding: "var(--sp-3) var(--sp-4)", borderRadius: "var(--r-lg)", background: "rgba(0,102,255,0.05)", border: "1px solid rgba(0,102,255,0.1)" }}>
                        🎯 Очакван резултат: <span style={{ color: "var(--color-cream)", fontWeight: 600 }}>{d.expectedResults}</span>
                    </div>
                </div>

                {/* Right: key stats */}
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-3)", minWidth: 0 }}>
                    {[
                        { label: "Спазване", value: `${d.compliancePct}%`, color: d.compliancePct >= 80 ? "#00E676" : "#FFB300", sub: "от дните в рамките на плана" },
                        { label: "Калориен дефицит", value: `${d.calorieDeficit} kcal`, color: "var(--c-electric,#0066FF)", sub: "среден дневен дефицит" },
                        { label: "Свалено тегло", value: `${weightLost} кг`, color: "#00E676", sub: `от ${d.startWeight} до ${d.currentWeight} кг` },
                        { label: "Хранителна цел", value: `${d.calorieTarget} kcal`, color: "var(--color-cream)", sub: `${d.macroSplit.protein}% П · ${d.macroSplit.carbs}% В · ${d.macroSplit.fat}% М` },
                    ].map((item) => (
                        <div key={item.label} style={{ padding: "var(--sp-3) var(--sp-4)", borderRadius: "var(--r-lg)", background: "rgba(255,255,255,0.025)", border: "1px solid var(--c-border,rgba(255,255,255,0.06))", minWidth: 0, overflow: "hidden" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "var(--sp-2)", flexWrap: "wrap" }}>
                                <div className="label text-gray">{item.label}</div>
                                <div style={{ color: item.color, fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 800 }}>{item.value}</div>
                            </div>
                            <div className="body-sm text-gray" style={{ marginTop: 4 }}>{item.sub}</div>
                        </div>
                    ))}
                    <button type="button" className="btn-ghost btn-sm" onClick={onSwitch}>⇄ Смени диетата</button>
                </div>
            </div>
        </div>
    );
}
