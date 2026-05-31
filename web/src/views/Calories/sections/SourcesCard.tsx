import type { JSX } from "react";
import { CALORIES_DATA } from "./caloriesData";

export default function SourcesCard(): JSX.Element {
    return (
        <div className="card cal-card">
            <div className="label text-gray">Източници на калории</div>
            <div className="heading-sm" style={{ color: "var(--color-cream)", marginTop: 4, marginBottom: "var(--sp-4)" }}>Откъде идва енергията</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-3)" }}>
                {CALORIES_DATA.sources.map((source) => (
                    <div key={source.label}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                            <span className="body-sm" style={{ color: "var(--color-cream)" }}>{source.label}</span>
                            <span className="body-sm text-gray">{source.calories} kcal · {source.pct}%</span>
                        </div>
                        <div style={{ height: 8, borderRadius: "var(--r-full)", background: "rgba(255,255,255,0.06)" }}>
                            <div style={{ width: `${source.pct}%`, height: "100%", borderRadius: "var(--r-full)", background: source.color }} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
