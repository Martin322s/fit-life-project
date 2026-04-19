import type { JSX } from "react";
import { LEADERBOARD } from "./challengesData";

export default function LeaderboardCard(): JSX.Element {
    return (
        <div className="card cg-card" style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
            <div>
                <div className="label text-gray">Leaderboard</div>
                <div className="heading-sm" style={{ color: "var(--color-cream)", marginTop: 4 }}>Тази седмица</div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-3)" }}>
                {LEADERBOARD.map((entry) => {
                    const isUser = entry.name === "Мартин";

                    return (
                        <div
                            key={entry.id}
                            style={{
                                display: "grid",
                                gridTemplateColumns: "40px 1fr auto",
                                gap: "var(--sp-3)",
                                alignItems: "center",
                                padding: "12px",
                                borderRadius: "var(--r-lg)",
                                background: isUser ? "rgba(0,102,255,0.08)" : "rgba(255,255,255,0.02)",
                                border: `1px solid ${isUser ? "rgba(0,102,255,0.25)" : "rgba(255,255,255,0.05)"}`,
                            }}
                        >
                            <div
                                style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: "50%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    background: isUser ? "linear-gradient(135deg,#0066FF,#00C2FF)" : "rgba(255,255,255,0.06)",
                                    color: isUser ? "white" : "var(--color-cream)",
                                    fontWeight: 900,
                                    flexShrink: 0,
                                }}
                            >
                                #{entry.rank}
                            </div>

                            <div style={{ minWidth: 0 }}>
                                <div className="body-sm" style={{ color: "var(--color-cream)", fontWeight: 700 }}>{entry.name}</div>
                                <div className="label text-gray" style={{ marginTop: 4 }}>{entry.streak} дни streak</div>
                            </div>

                            <div style={{ textAlign: "right", flexShrink: 0 }}>
                                <div style={{ color: "var(--color-cream)", fontWeight: 800 }}>{entry.points} XP</div>
                                <div className="label" style={{ marginTop: 4, color: "var(--c-acid,#C8FF00)" }}>{entry.trend}</div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
