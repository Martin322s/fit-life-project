import type { JSX } from "react";
import { CALORIES_DATA } from "./caloriesData";

export default function MacroCard(): JSX.Element {
    const totalKcal = CALORIES_DATA.macros.reduce((sum, item) => sum + item.consumed * item.kcalPerGram, 0);
    return (
        <div className="card cal-card">
            <div className="label text-gray">Макронутриенти</div>
            <div className="heading-sm" style={{ color: "var(--color-cream)", marginTop: 4, marginBottom: "var(--sp-4)" }}>Разпределение и покритие</div>
            <div style={{ display: "flex", height: 10, borderRadius: "var(--r-full)", overflow: "hidden", gap: 2, marginBottom: "var(--sp-4)" }}>
                {CALORIES_DATA.macros.map((macro) => (
                    <div key={macro.label} style={{ width: `${(macro.consumed * macro.kcalPerGram / totalKcal) * 100}%`, background: macro.color }} />
                ))}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
                {CALORIES_DATA.macros.map((macro) => {
                    const pct = macro.consumed / macro.target;
                    return (
                        <div key={macro.label}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--sp-1)" }}>
                                <span className="body-sm" style={{ color: "var(--color-cream)", fontWeight: 600 }}>{macro.label}</span>
                                <span className="body-sm text-gray">{macro.consumed} / {macro.target} г</span>
                            </div>
                            <div style={{ height: 7, borderRadius: "var(--r-full)", background: "rgba(255,255,255,0.06)" }}>
                                <div style={{ width: `${Math.min(pct, 1) * 100}%`, height: "100%", borderRadius: "var(--r-full)", background: macro.color }} />
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                                <span className="label text-gray">{Math.round(macro.consumed * macro.kcalPerGram)} kcal</span>
                                <span className="label" style={{ color: macro.color }}>{Math.round(pct * 100)}%</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
