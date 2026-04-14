import type { JSX } from "react";
import { WEIGHT_DATA } from "./weightData";

export default function MeasurementsCard(): JSX.Element {
    return (
        <div className="card wt-card" style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "var(--sp-3)" }}>
                <div>
                    <div className="label text-gray">Телесни мерки</div>
                    <div className="heading-sm" style={{ color: "var(--color-cream)", marginTop: 4 }}>Промяна от началото</div>
                </div>
                <span className="wt-pill" style={{ background: "rgba(0,102,255,0.1)", color: "var(--c-electric,#0066FF)" }}>см</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-3)" }}>
                {WEIGHT_DATA.measurements.map((m) => {
                    const totalRange = m.start - m.goal;
                    const progress = m.start - m.current;
                    // For bíceps, higher is better
                    const isPositive = m.goal > m.start;
                    const pct = isPositive
                        ? Math.min(((m.current - m.start) / (m.goal - m.start)) * 100, 100)
                        : Math.min((progress / totalRange) * 100, 100);
                    const change = +(m.current - m.start).toFixed(1);
                    const changeColor = isPositive
                        ? (change >= 0 ? "#00E676" : "var(--c-error,#FF3D57)")
                        : (change <= 0 ? "#00E676" : "var(--c-error,#FF3D57)");

                    return (
                        <div key={m.label}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "var(--sp-2)" }}>
                                    <span>{m.icon}</span>
                                    <span className="body-sm" style={{ color: "var(--color-cream)", fontWeight: 600 }}>{m.label}</span>
                                </div>
                                <div style={{ display: "flex", alignItems: "baseline", gap: "var(--sp-2)" }}>
                                    <span style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 800, color: "var(--color-cream)" }}>{m.current}</span>
                                    <span className="label text-gray">/ {m.goal} {m.unit}</span>
                                    <span className="label" style={{ color: changeColor }}>{change >= 0 ? "+" : ""}{change}</span>
                                </div>
                            </div>
                            <div style={{ height: 6, borderRadius: "var(--r-full)", background: "rgba(255,255,255,0.06)" }}>
                                <div style={{ width: `${Math.max(pct, 0)}%`, height: "100%", borderRadius: "var(--r-full)", background: "linear-gradient(90deg,var(--c-electric,#0066FF),#00E676)", transition: "width 0.4s" }} />
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                                <span className="label text-gray">Начало: {m.start} {m.unit}</span>
                                <span className="label" style={{ color: "var(--c-acid,#C8FF00)" }}>{Math.round(pct)}%</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
