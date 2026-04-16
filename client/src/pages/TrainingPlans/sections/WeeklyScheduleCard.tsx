import type { JSX } from "react";
import { TRAINING_DATA } from "./trainingPlansData";

const TYPE_COLOR: Record<string, string> = {
    push:   "#FF6B35",
    pull:   "var(--c-electric,#0066FF)",
    legs:   "var(--c-acid,#C8FF00)",
    upper:  "#A855F7",
    lower:  "#00CEC9",
    full:   "#00E676",
    cardio: "#FF5D73",
    rest:   "rgba(255,255,255,0.15)",
};

const TYPE_BG: Record<string, string> = {
    push:   "rgba(255,107,53,0.08)",
    pull:   "rgba(0,102,255,0.08)",
    legs:   "rgba(200,255,0,0.06)",
    upper:  "rgba(168,85,247,0.08)",
    lower:  "rgba(0,206,201,0.08)",
    full:   "rgba(0,230,118,0.06)",
    cardio: "rgba(255,93,115,0.08)",
    rest:   "rgba(255,255,255,0.02)",
};

export default function WeeklyScheduleCard(): JSX.Element {
    const schedule = TRAINING_DATA.weekSchedule;

    return (
        <div className="card tp-card" style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                    <div className="label text-gray">Седмична програма</div>
                    <div className="heading-sm" style={{ color: "var(--color-cream)", marginTop: 4 }}>Разпределение на тренировките</div>
                </div>
                <span className="tp-pill" style={{ background: "rgba(108,92,231,0.1)", color: "#A855F7" }}>Сед. {TRAINING_DATA.activePlan.currentWeek}</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-2)" }}>
                {schedule.map((d) => (
                    <div key={d.day} style={{
                        display: "flex", alignItems: "center", gap: "var(--sp-3)",
                        padding: "var(--sp-3) var(--sp-4)",
                        borderRadius: "var(--r-lg)",
                        background: d.status === "today" ? TYPE_BG[d.type] : "rgba(255,255,255,0.02)",
                        border: `1px solid ${d.status === "today" ? TYPE_COLOR[d.type] : "var(--c-border,rgba(255,255,255,0.06))"}`,
                        opacity: d.status === "upcoming" ? 0.6 : 1,
                    }}>
                        {/* Day dot */}
                        <div style={{
                            width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                            background: d.status === "done"  ? TYPE_COLOR[d.type]
                                      : d.status === "today" ? `${TYPE_COLOR[d.type]}22`
                                      : "rgba(255,255,255,0.04)",
                            border: d.status === "today" ? `2px solid ${TYPE_COLOR[d.type]}` : "none",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: "0.7rem", fontWeight: 900,
                            color: d.status === "done" ? "#000" : TYPE_COLOR[d.type],
                        }}>
                            {d.status === "done" ? "✓" : d.shortDay}
                        </div>

                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "var(--sp-2)" }}>
                                <div className="body-sm" style={{ color: "var(--color-cream)", fontWeight: 700 }}>{d.name}</div>
                                {d.status === "today" && (
                                    <span className="tp-pill" style={{ background: `${TYPE_COLOR[d.type]}18`, color: TYPE_COLOR[d.type], fontSize: "0.6rem" }}>Днес</span>
                                )}
                            </div>
                            {d.type !== "rest" && (
                                <div className="label text-gray" style={{ fontSize: "0.65rem", marginTop: 2 }}>
                                    {d.muscles.slice(0, 2).join(" · ")}{d.durationMin > 0 ? ` · ${d.durationMin} мин.` : ""}
                                </div>
                            )}
                        </div>

                        {d.status === "done" && (
                            <span className="label" style={{ color: "#00E676", fontSize: "0.65rem", flexShrink: 0 }}>✓ Готово</span>
                        )}
                        {d.status === "rest" && (
                            <span className="label text-gray" style={{ fontSize: "0.65rem", flexShrink: 0 }}>Почивка</span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
