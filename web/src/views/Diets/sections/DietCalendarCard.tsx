import type { JSX } from "react";
import { DIETS_DATA } from "./dietsData";

const DAY_LABELS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"];

export default function DietCalendarCard(): JSX.Element {
    const data = DIETS_DATA.calendarData;
    const full    = data.filter((v) => v === 1).length;
    const partial = data.filter((v) => v === 0.5).length;
    const missed  = data.filter((v) => v === 0).length;
    const score   = Math.round(((full + partial * 0.5) / data.length) * 100);

    return (
        <div className="card dt-card" style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "var(--sp-3)" }}>
                <div>
                    <div className="label text-gray">Календар на спазване</div>
                    <div className="heading-sm" style={{ color: "var(--color-cream)", marginTop: 4 }}>Последните 30 дни</div>
                </div>
                <span className="dt-pill" style={{ background: score >= 80 ? "rgba(0,230,118,0.1)" : "rgba(255,179,0,0.1)", color: score >= 80 ? "#00E676" : "#FFB300" }}>{score}%</span>
            </div>

            {/* Day labels */}
            <div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(7, minmax(0,1fr))", gap: 4, marginBottom: 6 }}>
                    {DAY_LABELS.map((d) => (
                        <div key={d} className="label" style={{ textAlign: "center", color: "rgba(255,255,255,0.25)", fontSize: "0.65rem" }}>{d}</div>
                    ))}
                </div>
                {/* Pad to start on correct weekday, then 30 days + remaining empties */}
                {[0, 1, 2, 3, 4].map((week) => (
                    <div key={week} style={{ display: "grid", gridTemplateColumns: "repeat(7, minmax(0,1fr))", gap: 4, marginBottom: 4 }}>
                        {[0, 1, 2, 3, 4, 5, 6].map((day) => {
                            const idx = week * 7 + day;
                            const val = data[idx];
                            const isToday = idx === data.length - 1;
                            const bg = val === 1 ? "rgba(0,230,118,0.5)"
                                     : val === 0.5 ? "rgba(255,179,0,0.4)"
                                     : val === 0 ? "rgba(255,61,87,0.25)"
                                     : "rgba(255,255,255,0.02)";
                            return (
                                <div key={day} style={{
                                    aspectRatio: "1", borderRadius: 5,
                                    background: idx < data.length ? bg : "rgba(255,255,255,0.02)",
                                    border: isToday ? "2px solid var(--c-electric,#0066FF)" : "1px solid transparent",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                }}>
                                    {isToday && (
                                        <div style={{ width: 4, height: 4, borderRadius: "50%", background: "white", opacity: 0.9 }} />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>

            {/* Legend + stats */}
            <div style={{ display: "flex", gap: "var(--sp-3)", flexWrap: "wrap" }}>
                {[
                    { color: "rgba(0,230,118,0.5)",  label: `Пълно (${full})` },
                    { color: "rgba(255,179,0,0.4)",  label: `Частично (${partial})` },
                    { color: "rgba(255,61,87,0.25)", label: `Пропуснат (${missed})` },
                ].map((l) => (
                    <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <div style={{ width: 10, height: 10, borderRadius: 2, background: l.color, flexShrink: 0 }} />
                        <span className="label text-gray" style={{ fontSize: "0.7rem" }}>{l.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
