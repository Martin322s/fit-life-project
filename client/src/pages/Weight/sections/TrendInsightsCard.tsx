import type { JSX } from "react";
import { WEIGHT_DATA } from "./weightData";

export default function TrendInsightsCard(): JSX.Element {
    const { weeklyAvgLoss, totalLost, remaining, bestWeek, consistencyPct, daysAheadOfSchedule } = WEIGHT_DATA.insights;

    const metrics = [
        {
            label: "Средна загуба",
            value: `${weeklyAvgLoss} кг`,
            unit: "на седмица",
            color: "#00E676",
            icon: "📉",
        },
        {
            label: "Общо свалени",
            value: `${totalLost} кг`,
            unit: `от ${WEIGHT_DATA.stats.startDate}`,
            color: "var(--c-electric,#0066FF)",
            icon: "⚖️",
        },
        {
            label: "Остават",
            value: `${remaining} кг`,
            unit: "до целта",
            color: "var(--c-acid,#C8FF00)",
            icon: "🎯",
        },
        {
            label: "Най-добра седмица",
            value: `${bestWeek} кг`,
            unit: "за 7 дни",
            color: "#FFB300",
            icon: "🏆",
        },
        {
            label: "Консистентност",
            value: `${consistencyPct}%`,
            unit: "дни с логване",
            color: "#74B9FF",
            icon: "📅",
        },
        {
            label: "Напред по план",
            value: `${daysAheadOfSchedule} дни`,
            unit: "по-рано",
            color: "#00E676",
            icon: "🚀",
        },
    ];

    return (
        <div className="card wt-card" style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
            <div>
                <div className="label text-gray">Ключови метрики</div>
                <div className="heading-sm" style={{ color: "var(--color-cream)", marginTop: 4 }}>Твоят прогрес в числа</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-2)" }}>
                {metrics.map((m) => (
                    <div key={m.label} style={{ display: "flex", alignItems: "center", gap: "var(--sp-3)", padding: "var(--sp-3) var(--sp-4)", borderRadius: "var(--r-lg)", background: "rgba(255,255,255,0.025)", border: "1px solid var(--c-border,rgba(255,255,255,0.06))" }}>
                        <span style={{ fontSize: "1.1rem", flexShrink: 0 }}>{m.icon}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div className="label text-gray">{m.label}</div>
                            <div className="body-sm text-gray" style={{ marginTop: 1 }}>{m.unit}</div>
                        </div>
                        <div style={{ fontFamily: "var(--font-display)", fontSize: "1.15rem", fontWeight: 800, color: m.color, flexShrink: 0 }}>{m.value}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
