import type { JSX } from "react";
import { CALORIES_DATA } from "./caloriesData";

export default function QualityCard(): JSX.Element {
    return (
        <div className="card cal-card">
            <div className="label text-gray">Качество на храненето</div>
            <div className="heading-sm" style={{ color: "var(--color-cream)", marginTop: 4, marginBottom: "var(--sp-4)" }}>Не само калории, а и качество</div>
            <div className="cal-quality-grid">
                {CALORIES_DATA.quality.map((item) => {
                    const pct = item.consumed / item.target;
                    return (
                        <div key={item.label} style={{ borderRadius: "var(--r-lg)", padding: "var(--sp-4)", background: "rgba(255,255,255,0.025)", border: "1px solid var(--c-border,rgba(255,255,255,0.06))" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "var(--sp-2)" }}>
                                <span className="body-sm" style={{ color: "var(--color-cream)", fontWeight: 600 }}>{item.label}</span>
                                <span className="label text-gray">{item.consumed} / {item.target} {item.unit}</span>
                            </div>
                            <div style={{ height: 6, borderRadius: "var(--r-full)", background: "rgba(255,255,255,0.06)", margin: "10px 0 8px" }}>
                                <div style={{ width: `${Math.min(pct, 1) * 100}%`, height: "100%", borderRadius: "var(--r-full)", background: item.color }} />
                            </div>
                            <div className="body-sm text-gray">{item.note}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
