import type { JSX } from "react";
import { TRAINING_DATA } from "./trainingPlansData";

const DIFF_COLOR: Record<string, string> = {
    "Лесно":  "#00E676",
    "Средно": "#FFB300",
    "Трудно": "var(--c-error,#FF3D57)",
};

export default function AvailablePlansCard({ onSwitch }: { onSwitch: () => void }): JSX.Element {
    return (
        <div className="card tp-card" style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                    <div className="label text-gray">Налични програми</div>
                    <div className="heading-sm" style={{ color: "var(--color-cream)", marginTop: 4 }}>Избери план за твоите цели</div>
                </div>
                <span className="tp-pill" style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.4)" }}>{TRAINING_DATA.availablePlans.length} плана</span>
            </div>

            <div className="tp-plans-grid">
                {TRAINING_DATA.availablePlans.map((plan) => (
                    <div key={plan.id} style={{ borderRadius: "var(--r-lg)", overflow: "hidden", border: `1px solid ${plan.active ? "var(--c-electric,#0066FF)" : "var(--c-border,rgba(255,255,255,0.06))"}`, background: plan.active ? "rgba(0,102,255,0.05)" : "rgba(255,255,255,0.015)", display: "flex", flexDirection: "column" }}>
                        <div style={{ height: 6, background: plan.gradient }} />
                        <div style={{ padding: "var(--sp-4)", flex: 1, display: "flex", flexDirection: "column", gap: "var(--sp-3)" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "var(--sp-2)" }}>
                                    <span style={{ fontSize: "1.2rem" }}>{plan.icon}</span>
                                    <div>
                                        <div className="body-sm" style={{ color: "var(--color-cream)", fontWeight: 700 }}>{plan.name}</div>
                                        <div className="label" style={{ color: DIFF_COLOR[plan.difficulty], marginTop: 2 }}>{plan.difficulty}</div>
                                    </div>
                                </div>
                                {plan.active && (
                                    <span className="tp-pill" style={{ background: "rgba(0,102,255,0.12)", color: "var(--c-electric,#0066FF)", fontSize: "0.62rem" }}>✓ Активен</span>
                                )}
                            </div>

                            <div className="label text-gray" style={{ fontSize: "0.65rem" }}>
                                {plan.daysPerWeek} дни/сед. · {plan.durationWeeks} сед. · {plan.focus}
                            </div>

                            <div style={{ display: "flex", gap: "var(--sp-2)", flexWrap: "wrap" }}>
                                {plan.tags.slice(0, 2).map((tag) => (
                                    <span key={tag} className="label" style={{ color: "rgba(255,255,255,0.35)", background: "rgba(255,255,255,0.04)", padding: "2px 7px", borderRadius: "var(--r-full)" }}>{tag}</span>
                                ))}
                            </div>

                            <button
                                type="button"
                                onClick={plan.active ? undefined : onSwitch}
                                className="btn-ghost btn-sm"
                                style={{ marginTop: "auto", opacity: plan.active ? 0.45 : 1, cursor: plan.active ? "default" : "pointer", color: plan.active ? "rgba(255,255,255,0.4)" : undefined }}
                                disabled={plan.active}
                            >
                                {plan.active ? "Текущ план" : "Превключи"}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
