import type { JSX } from "react";
import { TRAINING_DATA } from "./trainingPlansData";

export default function PersonalRecordsCard(): JSX.Element {
    const prs = TRAINING_DATA.personalRecords;
    const recent = TRAINING_DATA.recentSessions;

    return (
        <div className="card tp-card" style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
            {/* PRs */}
            <div>
                <div className="label text-gray">Лични рекорди</div>
                <div className="heading-sm" style={{ color: "var(--color-cream)", marginTop: 4 }}>Най-добри резултати</div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-2)" }}>
                {prs.map((pr) => (
                    <div key={pr.exercise} style={{ display: "flex", alignItems: "center", gap: "var(--sp-3)", padding: "var(--sp-3) var(--sp-4)", borderRadius: "var(--r-lg)", background: "rgba(255,255,255,0.025)", border: "1px solid var(--c-border,rgba(255,255,255,0.06))" }}>
                        <span style={{ fontSize: "1.1rem", flexShrink: 0 }}>{pr.icon}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div className="body-sm" style={{ color: "var(--color-cream)", fontWeight: 700 }}>{pr.exercise}</div>
                            <div className="label text-gray" style={{ fontSize: "0.65rem", marginTop: 1 }}>{pr.muscle} · {pr.date}</div>
                        </div>
                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                            <span style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 900, color: "var(--c-acid,#C8FF00)" }}>{pr.weight}</span>
                            <span className="label text-gray" style={{ marginLeft: 3 }}>кг</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: "var(--c-border,rgba(255,255,255,0.06))" }} />

            {/* Recent sessions */}
            <div>
                <div className="label text-gray" style={{ marginBottom: "var(--sp-3)" }}>Последни сесии</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-2)" }}>
                    {recent.map((s) => (
                        <div key={s.date} style={{ display: "flex", alignItems: "center", gap: "var(--sp-3)", padding: "var(--sp-2) var(--sp-3)", borderRadius: "var(--r-md)", background: "rgba(255,255,255,0.015)" }}>
                            <div className="label" style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.65rem", width: 34, flexShrink: 0 }}>{s.date}</div>
                            <div className="body-sm" style={{ color: "var(--color-cream)", fontWeight: 600, flex: 1, minWidth: 0 }}>{s.name}</div>
                            <div style={{ display: "flex", gap: "var(--sp-2)", flexShrink: 0 }}>
                                <span className="label text-gray" style={{ fontSize: "0.65rem" }}>⏱ {s.durationMin}м</span>
                                <span className="label" style={{ fontSize: "0.65rem", color: "var(--c-electric,#0066FF)" }}>{(s.volumeKg / 1000).toFixed(1)}т</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
