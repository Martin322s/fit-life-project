import type { JSX } from "react";
import { CALORIES_DATA } from "./caloriesData";

export default function WeeklyTrendCard(): JSX.Element {
    const barsMax = Math.max(...CALORIES_DATA.weekly.map((day) => Math.max(day.eaten, day.target)));
    return (
        <div className="card cal-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "var(--sp-3)", marginBottom: "var(--sp-4)" }}>
                <div>
                    <div className="label text-gray">7-дневен тренд</div>
                    <div className="heading-sm" style={{ color: "var(--color-cream)", marginTop: 2 }}>Прием срещу цел</div>
                </div>
                <span className="label text-gray">Средно {CALORIES_DATA.budget.weeklyAverage} kcal</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, minmax(0, 1fr))", gap: "var(--sp-2)", alignItems: "end", minHeight: 220 }}>
                {CALORIES_DATA.weekly.map((day) => (
                    <div key={day.day} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", gap: 8 }}>
                        <span className="label text-gray">{day.eaten}</span>
                        <div style={{ width: "100%", maxWidth: 38, height: 160, borderRadius: "var(--r-lg)", background: "rgba(255,255,255,0.04)", position: "relative", overflow: "hidden", border: "1px solid rgba(255,255,255,0.05)" }}>
                            <div style={{ position: "absolute", insetInline: 0, bottom: 0, height: `${(day.target / barsMax) * 100}%`, background: "rgba(255,255,255,0.06)" }} />
                            <div style={{ position: "absolute", insetInline: 4, bottom: 4, height: `calc(${(day.eaten / barsMax) * 100}% - 8px)`, borderRadius: "12px 12px 8px 8px", background: day.eaten <= day.target ? "linear-gradient(180deg,#5AA3FF,#0066FF)" : "linear-gradient(180deg,#FFB300,#FF7A00)" }} />
                        </div>
                        <span className="body-sm" style={{ color: "var(--color-cream)" }}>{day.day}</span>
                        <span className="label" style={{ color: "var(--c-acid,#C8FF00)" }}>-{day.burned}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
