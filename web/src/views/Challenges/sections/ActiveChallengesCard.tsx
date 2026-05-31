import type { JSX } from "react";
import { ACTIVE_CHALLENGES } from "./challengesData";

const TYPE_LABEL: Record<string, string> = {
    steps: "Движение",
    nutrition: "Хранене",
    training: "Тренировки",
    mindset: "Навици",
};

export default function ActiveChallengesCard(): JSX.Element {
    return (
        <div className="card cg-card" style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "var(--sp-3)", alignItems: "flex-start" }}>
                <div>
                    <div className="label text-gray">Активни сега</div>
                    <div className="heading-sm" style={{ color: "var(--color-cream)", marginTop: 4 }}>Избери challenge и влез в ритъм</div>
                </div>
                <span className="cg-pill" style={{ background: "rgba(200,255,0,0.1)", color: "var(--c-acid,#C8FF00)" }}>live</span>
            </div>

            <div className="cg-challenge-grid">
                {ACTIVE_CHALLENGES.map((challenge) => (
                    <div key={challenge.id} className="cg-challenge-card">
                        <div
                            style={{
                                borderRadius: "var(--r-xl)",
                                padding: "var(--sp-4)",
                                background: challenge.accent,
                                color: "#061018",
                                display: "flex",
                                flexDirection: "column",
                                gap: "var(--sp-3)",
                                minHeight: 188,
                            }}
                        >
                            <div style={{ display: "flex", justifyContent: "space-between", gap: "var(--sp-2)", alignItems: "flex-start" }}>
                                <div>
                                    <div className="label" style={{ color: "rgba(6,16,24,0.72)" }}>{TYPE_LABEL[challenge.type]}</div>
                                    <div style={{ fontFamily: "var(--font-display)", fontSize: "1.35rem", fontWeight: 900, lineHeight: 1.05, marginTop: 6 }}>{challenge.title}</div>
                                </div>
                                <span className="label" style={{ color: "rgba(6,16,24,0.75)" }}>{challenge.daysLeft} дни</span>
                            </div>

                            <div className="body-sm" style={{ color: "rgba(6,16,24,0.8)" }}>{challenge.subtitle}</div>

                            <div style={{ marginTop: "auto" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", gap: "var(--sp-2)", marginBottom: 8 }}>
                                    <span className="label" style={{ color: "rgba(6,16,24,0.7)" }}>Прогрес</span>
                                    <span className="label" style={{ color: "#061018" }}>{challenge.progress}%</span>
                                </div>
                                <div style={{ height: 8, borderRadius: 999, background: "rgba(6,16,24,0.12)", overflow: "hidden" }}>
                                    <div style={{ width: `${challenge.progress}%`, height: "100%", borderRadius: 999, background: "rgba(6,16,24,0.88)" }} />
                                </div>
                            </div>

                            <div style={{ display: "flex", justifyContent: "space-between", gap: "var(--sp-2)", alignItems: "center" }}>
                                <span className="label" style={{ color: "rgba(6,16,24,0.72)" }}>{challenge.participants} участника</span>
                                <span className="label" style={{ color: "#061018", fontWeight: 800 }}>{challenge.reward}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
