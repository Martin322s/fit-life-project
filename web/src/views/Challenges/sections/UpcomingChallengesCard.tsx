import type { JSX } from "react";
import { UPCOMING_CHALLENGES } from "./challengesData";

export default function UpcomingChallengesCard(): JSX.Element {
    return (
        <div className="card cg-card" style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
            <div>
                <div className="label text-gray">Следващи</div>
                <div className="heading-sm" style={{ color: "var(--color-cream)", marginTop: 4 }}>Upcoming challenge drops</div>
            </div>

            <div style={{ display: "grid", gap: "var(--sp-3)" }}>
                {UPCOMING_CHALLENGES.map((challenge) => (
                    <div key={challenge.id} style={{ padding: "14px", borderRadius: "var(--r-xl)", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", gap: "var(--sp-2)", alignItems: "flex-start" }}>
                            <div>
                                <div className="body-sm" style={{ color: "var(--color-cream)", fontWeight: 700 }}>{challenge.title}</div>
                                <div className="label text-gray" style={{ marginTop: 5 }}>{challenge.subtitle}</div>
                            </div>
                            <span className="cg-pill" style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.56)" }}>
                                след {challenge.daysLeft} дни
                            </span>
                        </div>

                        <div style={{ display: "flex", justifyContent: "space-between", gap: "var(--sp-2)", marginTop: "var(--sp-3)", alignItems: "center" }}>
                            <span className="label text-gray">{challenge.participants} interested</span>
                            <span className="label" style={{ color: "var(--c-acid,#C8FF00)" }}>{challenge.reward}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ borderRadius: "var(--r-xl)", padding: "var(--sp-4)", background: "linear-gradient(135deg,rgba(255,93,115,0.12),rgba(0,102,255,0.14))", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div className="label" style={{ color: "#FF8A9A" }}>Squad Mode</div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 900, color: "var(--color-cream)", marginTop: 6 }}>Покани приятели и отключи отборни мисии</div>
                <div className="body-sm text-gray" style={{ marginTop: 8 }}>Следващият етап може да включи team ranking, shared streak-и и group rewards.</div>
            </div>
        </div>
    );
}
