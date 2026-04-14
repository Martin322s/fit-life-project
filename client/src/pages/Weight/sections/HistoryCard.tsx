import type { JSX } from "react";
import { WEIGHT_DATA } from "./weightData";

export default function HistoryCard(): JSX.Element {
    const entries = WEIGHT_DATA.recentEntries;

    return (
        <div className="card wt-card" style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
            <div>
                <div className="label text-gray">История на измерванията</div>
                <div className="heading-sm" style={{ color: "var(--color-cream)", marginTop: 4 }}>Последните 10 записа</div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-1)" }}>
                {/* Header */}
                <div style={{ display: "grid", gridTemplateColumns: "80px 1fr 80px 70px", gap: "var(--sp-3)", padding: "0 var(--sp-2)", marginBottom: 4 }}>
                    {["Дата", "Ден", "Тегло", "Промяна"].map((h) => (
                        <div key={h} className="label" style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.65rem", letterSpacing: "0.06em" }}>{h}</div>
                    ))}
                </div>

                {entries.map((entry, i) => {
                    const isFirst = i === 0;
                    const changeColor = entry.change < 0 ? "#00E676" : entry.change > 0 ? "var(--c-error,#FF3D57)" : "rgba(255,255,255,0.3)";
                    const changeStr = entry.change === 0 ? "—" : (entry.change > 0 ? `+${entry.change}` : `${entry.change}`);
                    return (
                        <div key={entry.date} style={{
                            display: "grid", gridTemplateColumns: "80px 1fr 80px 70px",
                            gap: "var(--sp-3)", padding: "var(--sp-3) var(--sp-2)",
                            borderRadius: "var(--r-lg)",
                            background: isFirst ? "rgba(0,102,255,0.06)" : "rgba(255,255,255,0.015)",
                            border: `1px solid ${isFirst ? "rgba(0,102,255,0.15)" : "var(--c-border,rgba(255,255,255,0.04))"}`,
                            alignItems: "center",
                        }}>
                            <div className="label" style={{ color: isFirst ? "var(--c-electric,#0066FF)" : "rgba(255,255,255,0.45)" }}>{entry.date}</div>
                            <div className="body-sm" style={{ color: "var(--color-cream)", fontWeight: isFirst ? 600 : 400, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {entry.day}{entry.note ? ` · ${entry.note}` : ""}
                            </div>
                            <div style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 700, color: isFirst ? "var(--color-cream)" : "rgba(255,255,255,0.7)" }}>{entry.weight} кг</div>
                            <div className="label" style={{ color: changeColor, fontWeight: 700 }}>{changeStr} кг</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
