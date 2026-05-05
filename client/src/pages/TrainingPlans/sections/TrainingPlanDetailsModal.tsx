import type { JSX } from "react";
import type { ApiTrainingPlan } from "../../../services/trainingPlansApi";
import { trainingEquipmentLabel, trainingGoalLabel, trainingLevelLabel } from "../../../lib/trainingPlanLabels";

type Props = {
    plan: ApiTrainingPlan;
    isAdmin: boolean;
    onClose: () => void;
    onDelete: (id: string) => void;
};

function ListBlock({ title, items, ordered = false }: { title: string; items: string[]; ordered?: boolean }): JSX.Element {
    const Tag = ordered ? "ol" : "ul";
    return (
        <div style={{ padding: "var(--sp-4)", borderRadius: "var(--r-lg)", background: "rgba(255,255,255,0.025)", border: "1px solid var(--c-border,rgba(255,255,255,0.06))" }}>
            <div className="label text-gray" style={{ marginBottom: 8 }}>{title}</div>
            <Tag style={{ margin: 0, paddingLeft: 18, color: "var(--color-cream)", lineHeight: 1.65 }}>
                {items.map((item) => <li key={item}>{item}</li>)}
            </Tag>
        </div>
    );
}

export default function TrainingPlanDetailsModal({ plan, isAdmin, onClose, onDelete }: Props): JSX.Element {
    return (
        <div style={{ position: "fixed", inset: 0, zIndex: 400, display: "flex", alignItems: "center", justifyContent: "center", padding: "var(--sp-4)", background: "rgba(0,0,0,0.72)", backdropFilter: "blur(6px)" }} onClick={onClose}>
            <div style={{ width: "100%", maxWidth: 920, maxHeight: "90vh", overflowY: "auto", background: "var(--c-surface-1,#0E1318)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "var(--r-xl,20px)", padding: "var(--sp-6)", display: "flex", flexDirection: "column", gap: "var(--sp-4)" }} onClick={(e) => e.stopPropagation()}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "var(--sp-3)", alignItems: "flex-start" }}>
                    <div>
                        <div style={{ display: "flex", gap: "var(--sp-2)", flexWrap: "wrap", marginBottom: 10 }}>
                            <span className="tp-pill" style={{ background: "rgba(0,102,255,0.08)", color: "var(--c-electric,#0066FF)" }}>{trainingGoalLabel(plan.goalType)}</span>
                            <span className="tp-pill" style={{ background: "rgba(200,255,0,0.08)", color: "var(--c-acid,#C8FF00)" }}>{trainingLevelLabel(plan.level)}</span>
                        </div>
                        <h2 className="heading-md" style={{ color: "var(--color-cream)", margin: 0 }}>{plan.title}</h2>
                        <p className="body-sm text-gray" style={{ margin: "8px 0 0", lineHeight: 1.6 }}>{plan.description}</p>
                    </div>
                    <button type="button" onClick={onClose} style={{ background: "rgba(255,255,255,0.06)", border: "none", borderRadius: "50%", width: 34, height: 34, cursor: "pointer", color: "var(--color-cream)", fontSize: "1.1rem", flexShrink: 0 }}>×</button>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: "var(--sp-3)" }}>
                    <div style={{ padding: "var(--sp-3)", borderRadius: "var(--r-lg)", background: "rgba(255,255,255,0.025)" }}><div className="label text-gray">Продължителност</div><div style={{ color: "var(--color-cream)", fontWeight: 800 }}>{plan.durationWeeks} седмици</div></div>
                    <div style={{ padding: "var(--sp-3)", borderRadius: "var(--r-lg)", background: "rgba(255,255,255,0.025)" }}><div className="label text-gray">Сесии</div><div style={{ color: "var(--color-cream)", fontWeight: 800 }}>{plan.sessionsPerWeek}/сед.</div></div>
                    <div style={{ padding: "var(--sp-3)", borderRadius: "var(--r-lg)", background: "rgba(255,255,255,0.025)" }}><div className="label text-gray">Средно време</div><div style={{ color: "var(--color-cream)", fontWeight: 800 }}>{plan.averageSessionMinutes} мин.</div></div>
                    <div style={{ padding: "var(--sp-3)", borderRadius: "var(--r-lg)", background: "rgba(255,255,255,0.025)" }}><div className="label text-gray">Разход</div><div style={{ color: "var(--color-cream)", fontWeight: 800 }}>{plan.caloriesBurnEstimate ?? "—"} kcal</div></div>
                </div>

                <div style={{ display: "flex", gap: "var(--sp-2)", flexWrap: "wrap" }}>
                    {plan.equipment.map((item) => <span key={item} className="tp-pill" style={{ background: "rgba(255,255,255,0.04)", color: "var(--color-cream)" }}>{trainingEquipmentLabel(item)}</span>)}
                    {plan.targetMuscles.map((item) => <span key={item} className="tp-pill" style={{ background: "rgba(0,206,201,0.1)", color: "#00CEC9" }}>{item}</span>)}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: "var(--sp-3)" }}>
                    <ListBlock title="Седмичен график" items={plan.weeklySchedule} />
                    <ListBlock title="Структура на плана" items={plan.planStructure} ordered />
                    <ListBlock title="Безопасност" items={plan.safetyNotes} />
                    <div style={{ padding: "var(--sp-4)", borderRadius: "var(--r-lg)", background: "rgba(200,255,0,0.055)", border: "1px solid rgba(200,255,0,0.14)" }}>
                        <div className="label text-gray" style={{ marginBottom: 8 }}>Старт на план</div>
                        <p className="body-sm" style={{ margin: 0, color: "var(--color-cream)", lineHeight: 1.6 }}>В този етап плановете са само каталог. Проследяване на започнат тренировъчен план ще се добави, когато има user-plan модел.</p>
                    </div>
                </div>

                {isAdmin && (
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "var(--sp-2)", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "var(--sp-4)" }}>
                        <button type="button" className="btn-ghost" onClick={() => onDelete(plan.id)} style={{ color: "var(--c-error,#FF3D57)" }}>Изтрий плана</button>
                    </div>
                )}
            </div>
        </div>
    );
}
