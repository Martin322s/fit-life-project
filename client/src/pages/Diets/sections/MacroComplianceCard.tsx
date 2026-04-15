import type { JSX } from "react";
import { DIETS_DATA } from "./dietsData";

export default function MacroComplianceCard(): JSX.Element {
    const m = DIETS_DATA.macroTargets;
    const { macroSplit } = DIETS_DATA.activeDiet;

    const rows = [
        { label: "Калории",       ...m.calories, color: "var(--c-electric,#0066FF)" },
        { label: "Протеин",       ...m.protein,  color: "var(--c-electric,#0066FF)" },
        { label: "Въглехидрати",  ...m.carbs,    color: "var(--c-acid,#C8FF00)" },
        { label: "Мазнини",       ...m.fat,      color: "#FFB300" },
        { label: "Фибри",         ...m.fiber,    color: "#00E676" },
        { label: "Омега-3",       ...m.omega3,   color: "#74B9FF" },
    ];

    return (
        <div className="card dt-card" style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
            <div>
                <div className="label text-gray">Макро цели на диетата</div>
                <div className="heading-sm" style={{ color: "var(--color-cream)", marginTop: 4 }}>Реално срещу план (днес)</div>
            </div>

            {/* Macro split donut-like bar */}
            <div>
                <div className="label text-gray" style={{ marginBottom: 8 }}>Разпределение по диета</div>
                <div style={{ display: "flex", height: 14, borderRadius: "var(--r-full)", overflow: "hidden", gap: 2 }}>
                    <div style={{ width: `${macroSplit.carbs}%`,   background: "var(--c-acid,#C8FF00)", opacity: 0.8 }} />
                    <div style={{ width: `${macroSplit.protein}%`, background: "var(--c-electric,#0066FF)", opacity: 0.8 }} />
                    <div style={{ width: `${macroSplit.fat}%`,     background: "#FFB300", opacity: 0.8 }} />
                </div>
                <div style={{ display: "flex", gap: "var(--sp-4)", marginTop: 8, flexWrap: "wrap" }}>
                    {[
                        { label: `Въгл. ${macroSplit.carbs}%`, color: "var(--c-acid,#C8FF00)" },
                        { label: `Протеин ${macroSplit.protein}%`, color: "var(--c-electric,#0066FF)" },
                        { label: `Мазнини ${macroSplit.fat}%`, color: "#FFB300" },
                    ].map((l) => (
                        <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                            <div style={{ width: 8, height: 8, borderRadius: "50%", background: l.color }} />
                            <span className="label" style={{ color: l.color }}>{l.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Macro rows */}
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-3)" }}>
                {rows.map((row) => {
                    const pct = Math.min((row.actual / row.target) * 100, 100);
                    const over = row.actual > row.target;
                    return (
                        <div key={row.label}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                                <span className="body-sm" style={{ color: "var(--color-cream)", fontWeight: 600 }}>{row.label}</span>
                                <div style={{ display: "flex", alignItems: "center", gap: "var(--sp-2)" }}>
                                    <span className="body-sm text-gray">{row.actual} / {row.target} {row.unit}</span>
                                    {over
                                        ? <span className="label" style={{ color: "#FFB300" }}>+{+(row.actual - row.target).toFixed(1)}</span>
                                        : <span className="label" style={{ color: "#00E676" }}>{Math.round(pct)}%</span>
                                    }
                                </div>
                            </div>
                            <div style={{ height: 6, borderRadius: "var(--r-full)", background: "rgba(255,255,255,0.06)" }}>
                                <div style={{ width: `${pct}%`, height: "100%", borderRadius: "var(--r-full)", background: over ? "#FFB300" : row.color, transition: "width 0.4s" }} />
                            </div>
                        </div>
                    );
                })}
            </div>

            <div style={{ padding: "var(--sp-3) var(--sp-4)", borderRadius: "var(--r-lg)", background: "rgba(0,230,118,0.05)", border: "1px solid rgba(0,230,118,0.1)" }}>
                <div className="body-sm" style={{ color: "var(--color-cream)", fontWeight: 600 }}>✓ Добро спазване</div>
                <div className="body-sm text-gray" style={{ marginTop: 4 }}>
                    Протеинът е над целта — добре за запазване на мускулна маса при дефицит. Добави повече риба за омега-3.
                </div>
            </div>
        </div>
    );
}
