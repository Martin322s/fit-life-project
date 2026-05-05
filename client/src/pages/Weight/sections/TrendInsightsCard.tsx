import type { JSX } from "react";

type Props = {
    totalEntries: number;
    minWeight: number | null;
    maxWeight: number | null;
    averageWeight: number | null;
    remainingToGoal: number | null;
    totalChangeFromStart: number | null;
    goalProgressPct: number | null;
};

export default function TrendInsightsCard({ totalEntries, minWeight, maxWeight, averageWeight, remainingToGoal, totalChangeFromStart, goalProgressPct }: Props): JSX.Element {
    const metrics = [
        { label: "Общо записи", value: String(totalEntries), unit: "измервания", color: "var(--c-electric,#0066FF)" },
        { label: "Минимум", value: minWeight != null ? `${minWeight} кг` : "—", unit: "най-ниско тегло", color: "#00E676" },
        { label: "Максимум", value: maxWeight != null ? `${maxWeight} кг` : "—", unit: "най-високо тегло", color: "#FFB300" },
        { label: "Средно", value: averageWeight != null ? `${averageWeight} кг` : "—", unit: "за всички записи", color: "#74B9FF" },
        { label: "До целта", value: remainingToGoal != null ? `${remainingToGoal} кг` : "—", unit: "от профила", color: "var(--c-acid,#C8FF00)" },
        { label: "От началото", value: totalChangeFromStart != null ? `${totalChangeFromStart > 0 ? "+" : ""}${totalChangeFromStart} кг` : "—", unit: goalProgressPct != null ? `${goalProgressPct}% към целта` : "нужна е цел", color: totalChangeFromStart != null && totalChangeFromStart <= 0 ? "#00E676" : "var(--c-error,#FF3D57)" },
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
