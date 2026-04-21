import type { JSX } from "react";
import { WEIGHT_DATA } from "./weightData";

const BMI_ZONES = [
    { label: "Поднормено", min: 0,    max: 18.5, color: "#74B9FF", width: 15 },
    { label: "Нормално",   min: 18.5, max: 25,   color: "#00E676", width: 26 },
    { label: "Наднормено", min: 25,   max: 30,   color: "#FFB300", width: 20 },
    { label: "Затлъстяване І", min: 30, max: 35, color: "#FF7A00", width: 20 },
    { label: "Затлъстяване ІІ+", min: 35, max: 50, color: "#FF3D57", width: 19 },
];

function bmiCategory(bmi: number) {
    return BMI_ZONES.find((z) => bmi >= z.min && bmi < z.max) ?? BMI_ZONES[BMI_ZONES.length - 1];
}

function bmiPct(bmi: number) {
    const clamp = Math.min(Math.max(bmi, 10), 45);
    return ((clamp - 10) / (45 - 10)) * 100;
}

export default function BmiCard(): JSX.Element {
    const { bmi, bmiStart, bmiGoal, height } = WEIGHT_DATA.stats;
    const cat = bmiCategory(bmi);
    const markerPct = bmiPct(bmi);
    const startPct = bmiPct(bmiStart);
    const goalPct = bmiPct(bmiGoal);

    return (
        <div className="card wt-card" style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "var(--sp-3)" }}>
                <div>
                    <div className="label text-gray">Индекс на телесна маса (ИТМ)</div>
                    <div className="heading-sm" style={{ color: "var(--color-cream)", marginTop: 4 }}>
                        {bmi} <span className="label" style={{ color: cat.color }}>— {cat.label}</span>
                    </div>
                </div>
                <span className="wt-pill" style={{ background: "rgba(255,255,255,0.05)", color: "var(--color-cream)" }}>{height} см</span>
            </div>

            {/* Gauge bar */}
            <div style={{ position: "relative" }}>
                <div style={{ display: "flex", height: 14, borderRadius: "var(--r-full)", overflow: "hidden", gap: 2 }}>
                    {BMI_ZONES.map((z) => (
                        <div key={z.label} style={{ flex: z.width, background: z.color, opacity: 0.35 }} />
                    ))}
                </div>
                {/* Start dot */}
                <div title={`Начало: ${bmiStart}`} style={{ position: "absolute", left: `${startPct}%`, top: "50%", transform: "translate(-50%,-50%)", width: 10, height: 10, borderRadius: "50%", background: "rgba(255,255,255,0.4)", border: "2px solid rgba(255,255,255,0.2)" }} />
                {/* Goal dot */}
                <div title={`Цел: ${bmiGoal}`} style={{ position: "absolute", left: `${goalPct}%`, top: "50%", transform: "translate(-50%,-50%)", width: 12, height: 12, borderRadius: "50%", background: "#C8FF00", border: "2px solid var(--c-bg,#080C10)", opacity: 0.85 }} />
                {/* Current marker */}
                <div style={{ position: "absolute", left: `${markerPct}%`, top: "50%", transform: "translate(-50%,-50%)", width: 16, height: 16, borderRadius: "50%", background: cat.color, border: "3px solid var(--c-bg,#080C10)", zIndex: 2 }} />
            </div>

            {/* Zone legend */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--sp-2)" }}>
                {BMI_ZONES.map((z) => (
                    <div key={z.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: z.color, flexShrink: 0 }} />
                        <span className="label" style={{ color: bmi >= z.min && bmi < z.max ? z.color : "rgba(255,255,255,0.3)", fontWeight: bmi >= z.min && bmi < z.max ? 700 : 400 }}>{z.label}</span>
                    </div>
                ))}
            </div>

            {/* Comparison row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "var(--sp-3)" }}>
                {[
                    { label: "При начало",     value: bmiStart, color: "rgba(255,255,255,0.45)" },
                    { label: "Сега",            value: bmi,      color: cat.color },
                    { label: "При цел",         value: bmiGoal,  color: "#00E676" },
                ].map((item) => (
                    <div key={item.label} style={{ textAlign: "center", padding: "var(--sp-3)", borderRadius: "var(--r-lg)", background: "rgba(255,255,255,0.025)", border: "1px solid var(--c-border,rgba(255,255,255,0.06))" }}>
                        <div className="label text-gray" style={{ marginBottom: 4 }}>{item.label}</div>
                        <div style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", fontWeight: 800, color: item.color }}>{item.value}</div>
                    </div>
                ))}
            </div>

            <div className="body-sm text-gray" style={{ padding: "var(--sp-3) var(--sp-4)", borderRadius: "var(--r-lg)", background: "rgba(0,230,118,0.04)", border: "1px solid rgba(0,230,118,0.1)" }}>
                При достигане на {WEIGHT_DATA.stats.goal} кг ще преминеш в категория <strong style={{ color: "#00E676" }}>Нормално тегло</strong> — значимо подобрение за сърдечно-съдовото здраве.
            </div>
        </div>
    );
}
