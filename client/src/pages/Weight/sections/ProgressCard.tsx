import type { JSX } from "react";
import { WEIGHT_DATA } from "./weightData";

export default function ProgressCard(): JSX.Element {
    const { start, current, goal } = WEIGHT_DATA.stats;
    const totalToLose = start - goal;
    const lost = start - current;
    const pct = Math.min((lost / totalToLose) * 100, 100);

    // Milestone markers at 25%, 50%, 75%
    const milestones = [25, 50, 75].map((m) => ({
        pct: m,
        weight: +(start - (totalToLose * m) / 100).toFixed(1),
        reached: pct >= m,
    }));

    return (
        <div className="card wt-card" style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
            <div>
                <div className="label text-gray">Напредък към целта</div>
                <div className="heading-sm" style={{ color: "var(--color-cream)", marginTop: 4 }}>
                    {WEIGHT_DATA.insights.percentComplete}% от пътя изминат
                </div>
            </div>

            {/* Progress bar with marker */}
            <div style={{ position: "relative", paddingBottom: 28 }}>
                {/* Track */}
                <div style={{ height: 12, borderRadius: "var(--r-full)", background: "rgba(255,255,255,0.06)", position: "relative", overflow: "visible" }}>
                    {/* Fill */}
                    <div style={{ width: `${pct}%`, height: "100%", borderRadius: "var(--r-full)", background: "linear-gradient(90deg,#0066FF,#00E676)", transition: "width 0.4s" }} />
                    {/* Current marker */}
                    <div style={{ position: "absolute", left: `${pct}%`, top: "50%", transform: "translate(-50%,-50%)", width: 18, height: 18, borderRadius: "50%", background: "#00E676", border: "3px solid var(--c-bg,#080C10)", zIndex: 2 }} />
                </div>
                {/* Milestone dots */}
                {milestones.map((m) => (
                    <div key={m.pct} style={{ position: "absolute", left: `${m.pct}%`, top: 0, transform: "translateX(-50%)" }}>
                        <div style={{ width: 8, height: 12, background: m.reached ? "rgba(0,230,118,0.4)" : "rgba(255,255,255,0.12)", borderRadius: "var(--r-full)" }} />
                        <div className="label" style={{ position: "absolute", top: 18, left: "50%", transform: "translateX(-50%)", color: m.reached ? "rgba(0,230,118,0.7)" : "rgba(255,255,255,0.25)", whiteSpace: "nowrap", fontSize: "0.65rem" }}>{m.weight}</div>
                    </div>
                ))}
            </div>

            {/* Start / Current / Goal row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "var(--sp-3)" }}>
                {[
                    { label: "Начало", value: `${start} кг`, sub: WEIGHT_DATA.stats.startDate, color: "rgba(255,255,255,0.45)" },
                    { label: "Сега", value: `${current} кг`, sub: `−${lost.toFixed(1)} кг`, color: "#00E676" },
                    { label: "Цел", value: `${goal} кг`, sub: WEIGHT_DATA.stats.goalDate, color: "var(--c-acid,#C8FF00)" },
                ].map((item) => (
                    <div key={item.label} style={{ textAlign: "center", padding: "var(--sp-3)", borderRadius: "var(--r-lg)", background: "rgba(255,255,255,0.025)", border: "1px solid var(--c-border,rgba(255,255,255,0.06))" }}>
                        <div className="label text-gray" style={{ marginBottom: 4 }}>{item.label}</div>
                        <div style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", fontWeight: 800, color: item.color, lineHeight: 1 }}>{item.value}</div>
                        <div className="label text-gray" style={{ marginTop: 4 }}>{item.sub}</div>
                    </div>
                ))}
            </div>

            {/* Prediction */}
            <div style={{ padding: "var(--sp-3) var(--sp-4)", borderRadius: "var(--r-lg)", background: "rgba(200,255,0,0.05)", border: "1px solid rgba(200,255,0,0.12)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "var(--sp-3)" }}>
                    <div className="body-sm" style={{ color: "var(--color-cream)", fontWeight: 600 }}>Прогнозна дата за цел</div>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 800, color: "var(--c-acid,#C8FF00)" }}>{WEIGHT_DATA.insights.projectedDate}</div>
                </div>
                <div className="body-sm text-gray" style={{ marginTop: 4 }}>
                    На текущото темпо ще достигнеш целта {WEIGHT_DATA.insights.daysAheadOfSchedule} дни по-рано от плана.
                </div>
            </div>
        </div>
    );
}
