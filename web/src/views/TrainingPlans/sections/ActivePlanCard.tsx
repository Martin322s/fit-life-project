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
    rest:   "rgba(255,255,255,0.2)",
};

const DIFF_COLOR: Record<string, string> = {
    "Лесно":  "#00E676",
    "Средно": "#FFB300",
    "Трудно": "var(--c-error,#FF3D57)",
};

export default function ActivePlanCard({ onSwitch }: { onSwitch: () => void }): JSX.Element {
    const p = TRAINING_DATA.activePlan;
    const pctComplete = Math.round((p.currentWeek / p.durationWeeks) * 100);
    const schedule = TRAINING_DATA.weekSchedule;

    return (
        <div className="card tp-card" style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
            {/* Hero band */}
            <div style={{ borderRadius: "var(--r-lg)", background: p.gradient, padding: "var(--sp-5)", position: "relative", overflow: "hidden", minHeight: 100 }}>
                <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.2)" }} />
                <div style={{ position: "relative" }}>
                    <div style={{ display: "flex", gap: "var(--sp-2)", flexWrap: "wrap", marginBottom: 8 }}>
                        <span className="tp-pill" style={{ background: "rgba(255,255,255,0.2)", color: "#fff" }}>✓ Активен план</span>
                        <span className="tp-pill" style={{ background: "rgba(255,255,255,0.15)", color: "#fff" }}>Сед. {p.currentWeek}</span>
                        <span className="tp-pill" style={{ background: "rgba(255,255,255,0.15)", color: DIFF_COLOR[p.difficulty] ?? "#fff" }}>{p.difficulty}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--sp-3)" }}>
                        <span style={{ fontSize: "2rem" }}>{p.icon}</span>
                        <div>
                            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", fontWeight: 900, color: "#fff", margin: 0, lineHeight: 1.2 }}>{p.name}</h2>
                            <div style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.8rem", marginTop: 2 }}>{p.daysPerWeek} дни/сед. · Фокус: {p.focus} · От {p.startDate}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Two-column inner */}
            <div className="tp-active-inner">
                {/* Left */}
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-3)", minWidth: 0 }}>
                    <p className="body-sm" style={{ color: "var(--color-cream)", margin: 0, lineHeight: 1.6 }}>{p.description}</p>

                    <div style={{ display: "flex", gap: "var(--sp-2)", flexWrap: "wrap" }}>
                        {p.tags.map((t) => (
                            <span key={t} className="tp-pill" style={{ background: "rgba(108,92,231,0.1)", color: "#A855F7" }}>{t}</span>
                        ))}
                    </div>

                    {/* Plan progress */}
                    <div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                            <span className="label text-gray">Напредък в плана</span>
                            <span className="label" style={{ color: "var(--c-acid,#C8FF00)" }}>{p.currentWeek} / {p.durationWeeks} седмици</span>
                        </div>
                        <div style={{ height: 8, borderRadius: "var(--r-full)", background: "rgba(255,255,255,0.06)" }}>
                            <div style={{ width: `${pctComplete}%`, height: "100%", borderRadius: "var(--r-full)", background: p.gradient }} />
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                            <span className="label text-gray">{pctComplete}% изминат</span>
                            <span className="label text-gray">Остават {p.durationWeeks - p.currentWeek} сед.</span>
                        </div>
                    </div>

                    {/* Week mini-calendar */}
                    <div>
                        <div className="label text-gray" style={{ marginBottom: 8 }}>Тази седмица</div>
                        <div style={{ display: "flex", gap: 5 }}>
                            {schedule.map((d) => (
                                <div key={d.shortDay} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                                    <div className="label" style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.3)" }}>{d.shortDay}</div>
                                    <div style={{
                                        width: "100%", aspectRatio: "1", borderRadius: 6,
                                        background: d.status === "done"     ? TYPE_COLOR[d.type]
                                                  : d.status === "today"    ? "rgba(255,255,255,0.1)"
                                                  : d.status === "rest"     ? "rgba(255,255,255,0.03)"
                                                  : "rgba(255,255,255,0.04)",
                                        border: d.status === "today" ? `2px solid ${TYPE_COLOR[d.type]}` : "1px solid transparent",
                                        opacity: d.status === "upcoming" ? 0.45 : 1,
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                    }}>
                                        {d.status === "done" && <span style={{ fontSize: "0.55rem", color: "#000", fontWeight: 900 }}>✓</span>}
                                        {d.status === "rest" && <span style={{ fontSize: "0.55rem", color: "rgba(255,255,255,0.2)" }}>—</span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right: key stats */}
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-3)", minWidth: 0 }}>
                    {[
                        { label: "Тренировки тази сед.", value: `${TRAINING_DATA.stats.sessionsThisWeek} / ${TRAINING_DATA.stats.sessionsTarget}`, color: "#00E676", sub: "изпълнени сесии" },
                        { label: "Обем тази седмица",    value: `${(TRAINING_DATA.stats.volumeThisWeek / 1000).toFixed(1)}т`,                        color: "var(--c-electric,#0066FF)", sub: "общо вдигнати кг" },
                        { label: "Активна серия",        value: `${TRAINING_DATA.stats.streak} дни`,                                                  color: "var(--c-acid,#C8FF00)",    sub: "без пропуснати сесии" },
                        { label: "Следваща тренировка",  value: TRAINING_DATA.stats.nextWorkout,                                                       color: TYPE_COLOR.legs,            sub: "събота · ~70 мин." },
                    ].map((item) => (
                        <div key={item.label} style={{ padding: "var(--sp-3) var(--sp-4)", borderRadius: "var(--r-lg)", background: "rgba(255,255,255,0.025)", border: "1px solid var(--c-border,rgba(255,255,255,0.06))", minWidth: 0, overflow: "hidden" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "var(--sp-2)", flexWrap: "wrap" }}>
                                <div className="label text-gray">{item.label}</div>
                                <div style={{ color: item.color, fontFamily: "var(--font-display)", fontSize: "1.05rem", fontWeight: 800, flexShrink: 0 }}>{item.value}</div>
                            </div>
                            <div className="body-sm text-gray" style={{ marginTop: 4 }}>{item.sub}</div>
                        </div>
                    ))}
                    <button type="button" className="btn-ghost btn-sm" onClick={onSwitch}>⇄ Смени плана</button>
                </div>
            </div>
        </div>
    );
}
