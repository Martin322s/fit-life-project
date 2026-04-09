import type { JSX } from "react";
import { CALORIES_DATA } from "./caloriesData";

export default function HabitsCard(): JSX.Element {
    return (
        <div className="card cal-card">
            <div className="label text-gray">Контекст за деня</div>
            <div className="heading-sm" style={{ color: "var(--color-cream)", marginTop: 4, marginBottom: "var(--sp-4)" }}>Навици, които влияят на калориите</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-3)" }}>
                {CALORIES_DATA.habits.map((item) => (
                    <div key={item.label} style={{ padding: "var(--sp-4)", borderRadius: "var(--r-lg)", background: "rgba(255,255,255,0.025)", border: "1px solid var(--c-border,rgba(255,255,255,0.06))" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", gap: "var(--sp-3)", alignItems: "baseline" }}>
                            <span className="body-sm" style={{ color: "var(--color-cream)", fontWeight: 600 }}>{item.label}</span>
                            <span className="body-sm text-gray">{item.value}</span>
                        </div>
                        <div className="body-sm text-gray" style={{ marginTop: 6 }}>{item.note}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
