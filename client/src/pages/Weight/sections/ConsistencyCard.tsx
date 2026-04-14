import type { JSX } from "react";
import { WEIGHT_DATA } from "./weightData";

const DAY_LABELS = ["Пон", "Вт", "Ср", "Чет", "Пет", "Съб", "Нед"];

export default function ConsistencyCard(): JSX.Element {
    const grid = WEIGHT_DATA.consistencyGrid;
    const logged = grid.filter((d) => d.logged).length;
    const pct = Math.round((logged / grid.length) * 100);

    // Current streak from end
    let streak = 0;
    for (let i = grid.length - 1; i >= 0; i--) {
        if (grid[i].logged) streak++;
        else break;
    }

    return (
        <div className="card wt-card" style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "var(--sp-3)" }}>
                <div>
                    <div className="label text-gray">Редовност на измерванията</div>
                    <div className="heading-sm" style={{ color: "var(--color-cream)", marginTop: 4 }}>Последните 5 седмици</div>
                </div>
                <span className="wt-pill" style={{ background: "rgba(200,255,0,0.08)", color: "var(--c-acid,#C8FF00)" }}>{pct}%</span>
            </div>

            {/* Day labels */}
            <div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(7, minmax(0,1fr))", gap: 4, marginBottom: 6 }}>
                    {DAY_LABELS.map((d) => (
                        <div key={d} className="label" style={{ textAlign: "center", color: "rgba(255,255,255,0.25)", fontSize: "0.65rem" }}>{d}</div>
                    ))}
                </div>
                {/* 5 week rows */}
                {[0, 1, 2, 3, 4].map((week) => (
                    <div key={week} style={{ display: "grid", gridTemplateColumns: "repeat(7, minmax(0,1fr))", gap: 4, marginBottom: 4 }}>
                        {[0, 1, 2, 3, 4, 5, 6].map((day) => {
                            const idx = week * 7 + day;
                            const entry = grid[idx];
                            const isToday = idx === grid.length - 1;
                            return (
                                <div key={day} style={{
                                    aspectRatio: "1", borderRadius: 5,
                                    background: entry?.logged
                                        ? isToday ? "var(--c-electric,#0066FF)" : "rgba(0,102,255,0.35)"
                                        : "rgba(255,255,255,0.04)",
                                    border: isToday ? "1px solid var(--c-electric,#0066FF)" : "1px solid transparent",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                }}>
                                    {isToday && entry?.logged && (
                                        <div style={{ width: 4, height: 4, borderRadius: "50%", background: "white", opacity: 0.8 }} />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>

            {/* Summary */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--sp-3)" }}>
                <div style={{ padding: "var(--sp-3)", borderRadius: "var(--r-lg)", background: "rgba(255,255,255,0.025)", border: "1px solid var(--c-border,rgba(255,255,255,0.06))", textAlign: "center" }}>
                    <div className="label text-gray">Записани дни</div>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", fontWeight: 800, color: "var(--c-electric,#0066FF)", marginTop: 4 }}>{logged} / {grid.length}</div>
                </div>
                <div style={{ padding: "var(--sp-3)", borderRadius: "var(--r-lg)", background: "rgba(255,255,255,0.025)", border: "1px solid var(--c-border,rgba(255,255,255,0.06))", textAlign: "center" }}>
                    <div className="label text-gray">Текуща серия</div>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", fontWeight: 800, color: "var(--c-acid,#C8FF00)", marginTop: 4 }}>{streak} дни</div>
                </div>
            </div>
        </div>
    );
}
