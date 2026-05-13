import { useState } from "react";
import type { JSX } from "react";
import { TRAINING_DATA } from "./trainingPlansData";
import type { Exercise } from "./trainingPlansData";

export default function TodayWorkoutCard(): JSX.Element {
    const w = TRAINING_DATA.todayWorkout;
    const [exercises, setExercises] = useState<Exercise[]>(w.exercises);

    function toggleDone(id: string) {
        setExercises((prev) => prev.map((e) => e.id === id ? { ...e, done: !e.done } : e));
    }

    const doneCount = exercises.filter((e) => e.done).length;
    const pct = Math.round((doneCount / exercises.length) * 100);

    return (
        <div className="card tp-card" style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "var(--sp-3)" }}>
                <div>
                    <div className="label text-gray">Днешна тренировка</div>
                    <div className="heading-sm" style={{ color: "var(--color-cream)", marginTop: 4 }}>{w.name}</div>
                    <div className="body-sm text-gray" style={{ marginTop: 2 }}>{exercises.length} упражнения · ~{w.targetDuration} мин.</div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", fontWeight: 900, color: pct === 100 ? "#00E676" : "var(--c-electric,#0066FF)", lineHeight: 1 }}>{pct}%</div>
                    <div className="label text-gray" style={{ marginTop: 2 }}>{doneCount}/{exercises.length} готово</div>
                </div>
            </div>

            {/* Progress bar */}
            <div style={{ height: 6, borderRadius: "var(--r-full)", background: "rgba(255,255,255,0.06)" }}>
                <div style={{ width: `${pct}%`, height: "100%", borderRadius: "var(--r-full)", background: pct === 100 ? "#00E676" : "var(--c-electric,#0066FF)", transition: "width 0.4s" }} />
            </div>

            {/* Exercise table */}
            <div className="tp-exercise-table">
                {/* Header */}
                <div className="tp-ex-row tp-ex-header">
                    <span className="label text-gray" style={{ fontSize: "0.65rem" }}>УПРАЖНЕНИЕ</span>
                    <span className="label text-gray" style={{ fontSize: "0.65rem", textAlign: "center" }}>СЕРИИ</span>
                    <span className="label text-gray" style={{ fontSize: "0.65rem", textAlign: "center" }}>ПОВТОРЕНИЯ</span>
                    <span className="label text-gray" style={{ fontSize: "0.65rem", textAlign: "center" }}>ТЕЖЕСТ</span>
                    <span className="label text-gray" style={{ fontSize: "0.65rem", textAlign: "center" }}>ГОТОВО</span>
                </div>

                {exercises.map((ex) => (
                    <div key={ex.id} className="tp-ex-row" style={{
                        background: ex.done ? "rgba(0,230,118,0.04)" : "rgba(255,255,255,0.015)",
                        borderColor: ex.done ? "rgba(0,230,118,0.12)" : "var(--c-border,rgba(255,255,255,0.06))",
                        opacity: ex.done ? 0.65 : 1,
                        transition: "all 0.2s",
                    }}>
                        <div style={{ minWidth: 0 }}>
                            <div className="body-sm" style={{ color: "var(--color-cream)", fontWeight: 600, textDecoration: ex.done ? "line-through" : "none" }}>{ex.name}</div>
                            <div className="label text-gray" style={{ fontSize: "0.65rem" }}>{ex.muscle}</div>
                        </div>
                        <div style={{ textAlign: "center" }}>
                            <span className="tp-pill" style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.6)" }}>{ex.sets}</span>
                        </div>
                        <div style={{ textAlign: "center" }}>
                            <span className="body-sm" style={{ color: "var(--color-cream)", fontWeight: 600 }}>{ex.reps}</span>
                        </div>
                        <div style={{ textAlign: "center" }}>
                            <span className="body-sm" style={{ color: ex.weight ? "var(--c-acid,#C8FF00)" : "rgba(255,255,255,0.3)", fontWeight: 700 }}>
                                {ex.weight ? `${ex.weight} ${ex.unit}` : "Телесно"}
                            </span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "center" }}>
                            <button
                                type="button"
                                onClick={() => toggleDone(ex.id)}
                                style={{
                                    width: 28, height: 28, borderRadius: "50%",
                                    background: ex.done ? "#00E676" : "transparent",
                                    border: `2px solid ${ex.done ? "#00E676" : "rgba(255,255,255,0.2)"}`,
                                    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                                    color: ex.done ? "#000" : "rgba(255,255,255,0.3)",
                                    fontSize: "0.75rem", fontWeight: 900, transition: "all 0.2s",
                                }}
                            >
                                {ex.done ? "✓" : ""}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {pct === 100 && (
                <div style={{ padding: "var(--sp-3) var(--sp-4)", borderRadius: "var(--r-lg)", background: "rgba(0,230,118,0.07)", border: "1px solid rgba(0,230,118,0.18)", textAlign: "center" }}>
                    <div className="body-sm" style={{ color: "#00E676", fontWeight: 700 }}>🎉 Тренировката е завършена!</div>
                    <div className="label text-gray" style={{ marginTop: 4 }}>Запиши резултатите, за да следиш прогреса си.</div>
                </div>
            )}
        </div>
    );
}
