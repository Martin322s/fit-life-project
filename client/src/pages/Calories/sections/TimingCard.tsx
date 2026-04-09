import type { JSX } from "react";
import { CALORIES_DATA } from "./caloriesData";

export default function TimingCard(): JSX.Element {
    const max = Math.max(...CALORIES_DATA.timing.map((item) => item.kcal));
    return (
        <div className="card cal-card">
            <div className="label text-gray">Час на хранене</div>
            <div className="heading-sm" style={{ color: "var(--color-cream)", marginTop: 4, marginBottom: "var(--sp-4)" }}>Кога идват калориите</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-3)" }}>
                {CALORIES_DATA.timing.map((item) => (
                    <div key={item.hour} style={{ display: "grid", gridTemplateColumns: "58px minmax(0, 1fr) 70px", alignItems: "center", gap: "var(--sp-3)" }}>
                        <span className="label text-gray">{item.hour}</span>
                        <div>
                            <div className="body-sm" style={{ color: "var(--color-cream)", marginBottom: 6 }}>{item.label}</div>
                            <div style={{ height: 8, borderRadius: "var(--r-full)", background: "rgba(255,255,255,0.06)" }}>
                                <div style={{ width: `${(item.kcal / max) * 100}%`, height: "100%", borderRadius: "var(--r-full)", background: item.label.includes("Планирана") ? "var(--c-acid,#C8FF00)" : "var(--c-electric,#0066FF)" }} />
                            </div>
                        </div>
                        <span className="body-sm" style={{ color: "var(--color-cream)", textAlign: "right" }}>{item.kcal} kcal</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
