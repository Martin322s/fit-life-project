import type { JSX } from "react";
import type { ApiTrainingPlan, TrainingEquipment, TrainingGoalType, TrainingLevel } from "../../../services/trainingPlansApi";
import { TRAINING_EQUIPMENT_OPTIONS, TRAINING_GOAL_OPTIONS, TRAINING_LEVEL_COLOR, TRAINING_LEVEL_OPTIONS, trainingEquipmentLabel, trainingGoalLabel, trainingLevelLabel } from "../../../lib/trainingPlanLabels";

type Props = {
    plans: ApiTrainingPlan[];
    isLoading: boolean;
    total: number;
    page: number;
    totalPages: number;
    search: string;
    goalType: TrainingGoalType | "";
    level: TrainingLevel | "";
    equipment: TrainingEquipment | "";
    onSearch: (value: string) => void;
    onGoalType: (value: TrainingGoalType | "") => void;
    onLevel: (value: TrainingLevel | "") => void;
    onEquipment: (value: TrainingEquipment | "") => void;
    onPage: (value: number) => void;
    onOpen: (plan: ApiTrainingPlan) => void;
};

function pageNumbers(page: number, totalPages: number): number[] {
    const start = Math.max(1, Math.min(page - 2, totalPages - 4));
    const end = Math.min(totalPages, start + 4);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

function PlanCard({ plan, onOpen }: { plan: ApiTrainingPlan; onOpen: (plan: ApiTrainingPlan) => void }): JSX.Element {
    return (
        <button type="button" onClick={() => onOpen(plan)} className="card tp-card" style={{ display: "flex", flexDirection: "column", gap: "var(--sp-3)", textAlign: "left", cursor: "pointer", border: "1px solid var(--c-border,rgba(255,255,255,0.06))" }}>
            <div style={{ height: 6, margin: "calc(var(--sp-5) * -1) calc(var(--sp-5) * -1) var(--sp-2)", background: "linear-gradient(90deg,var(--c-electric,#0066FF),var(--c-acid,#C8FF00))" }} />
            <div style={{ display: "flex", justifyContent: "space-between", gap: "var(--sp-2)", alignItems: "flex-start" }}>
                <div style={{ minWidth: 0 }}>
                    <div className="body-sm" style={{ color: "var(--color-cream)", fontWeight: 800, lineHeight: 1.3 }}>{plan.title}</div>
                    <div className="body-sm text-gray" style={{ marginTop: 5, lineHeight: 1.45 }}>{plan.description}</div>
                </div>
                <span className="tp-pill" style={{ background: "rgba(255,255,255,0.04)", color: TRAINING_LEVEL_COLOR[plan.level], flexShrink: 0 }}>{trainingLevelLabel(plan.level)}</span>
            </div>
            <div style={{ display: "flex", gap: "var(--sp-2)", flexWrap: "wrap" }}>
                <span className="tp-pill" style={{ background: "rgba(0,102,255,0.08)", color: "var(--c-electric,#0066FF)" }}>{trainingGoalLabel(plan.goalType)}</span>
                {plan.equipment.slice(0, 2).map((item) => (
                    <span key={item} className="tp-pill" style={{ background: "rgba(200,255,0,0.08)", color: "var(--c-acid,#C8FF00)" }}>{trainingEquipmentLabel(item)}</span>
                ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "var(--sp-2)", marginTop: "auto" }}>
                <div style={{ padding: "var(--sp-2)", borderRadius: "var(--r-md)", background: "rgba(255,255,255,0.025)" }}>
                    <div className="label text-gray">Седмици</div>
                    <div style={{ color: "var(--color-cream)", fontWeight: 800 }}>{plan.durationWeeks}</div>
                </div>
                <div style={{ padding: "var(--sp-2)", borderRadius: "var(--r-md)", background: "rgba(255,255,255,0.025)" }}>
                    <div className="label text-gray">Сесии</div>
                    <div style={{ color: "var(--color-cream)", fontWeight: 800 }}>{plan.sessionsPerWeek}/сед.</div>
                </div>
                <div style={{ padding: "var(--sp-2)", borderRadius: "var(--r-md)", background: "rgba(255,255,255,0.025)" }}>
                    <div className="label text-gray">Време</div>
                    <div style={{ color: "var(--color-cream)", fontWeight: 800 }}>{plan.averageSessionMinutes} мин.</div>
                </div>
            </div>
        </button>
    );
}

export default function TrainingPlansGridCard({ plans, isLoading, total, page, totalPages, search, goalType, level, equipment, onSearch, onGoalType, onLevel, onEquipment, onPage, onOpen }: Props): JSX.Element {
    return (
        <div className="card tp-card" style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "var(--sp-3)", flexWrap: "wrap" }}>
                <div>
                    <div className="label text-gray">Каталог с тренировъчни планове</div>
                    <div className="heading-sm" style={{ color: "var(--color-cream)", marginTop: 4 }}>{total} плана</div>
                </div>
                <div className="body-sm text-gray">Страница {page} / {totalPages}</div>
            </div>

            <div className="tp-filter-grid">
                <input value={search} onChange={(e) => onSearch(e.target.value)} placeholder="Търси по име или описание..." style={{ width: "100%", padding: "10px 14px", borderRadius: "var(--r-lg)", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "var(--color-cream)", outline: "none", boxSizing: "border-box" }} />
                <select value={goalType} onChange={(e) => onGoalType(e.target.value as TrainingGoalType | "")} style={{ padding: "10px 14px", borderRadius: "var(--r-lg)", background: "var(--c-surface-1,#0E1318)", border: "1px solid rgba(255,255,255,0.1)", color: "var(--color-cream)", outline: "none" }}>{TRAINING_GOAL_OPTIONS.map((o) => <option key={o.value || "all"} value={o.value}>{o.label}</option>)}</select>
                <select value={level} onChange={(e) => onLevel(e.target.value as TrainingLevel | "")} style={{ padding: "10px 14px", borderRadius: "var(--r-lg)", background: "var(--c-surface-1,#0E1318)", border: "1px solid rgba(255,255,255,0.1)", color: "var(--color-cream)", outline: "none" }}>{TRAINING_LEVEL_OPTIONS.map((o) => <option key={o.value || "all"} value={o.value}>{o.label}</option>)}</select>
                <select value={equipment} onChange={(e) => onEquipment(e.target.value as TrainingEquipment | "")} style={{ padding: "10px 14px", borderRadius: "var(--r-lg)", background: "var(--c-surface-1,#0E1318)", border: "1px solid rgba(255,255,255,0.1)", color: "var(--color-cream)", outline: "none" }}>{TRAINING_EQUIPMENT_OPTIONS.map((o) => <option key={o.value || "all"} value={o.value}>{o.label}</option>)}</select>
            </div>

            {isLoading && <div className="body-sm text-gray" style={{ padding: "var(--sp-6)", textAlign: "center" }}>Зареждане на тренировъчни планове...</div>}
            {!isLoading && plans.length === 0 && <div className="body-sm text-gray" style={{ padding: "var(--sp-6)", textAlign: "center" }}>Няма планове по тези критерии.</div>}
            {!isLoading && plans.length > 0 && <div className="tp-plans-grid">{plans.map((plan) => <PlanCard key={plan.id} plan={plan} onOpen={onOpen} />)}</div>}

            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "var(--sp-2)", flexWrap: "wrap" }}>
                <button type="button" className="btn-ghost btn-sm" disabled={page <= 1} onClick={() => onPage(page - 1)}>Назад</button>
                {pageNumbers(page, totalPages).map((n) => <button key={n} type="button" className={n === page ? "btn-primary btn-sm" : "btn-ghost btn-sm"} onClick={() => onPage(n)}>{n}</button>)}
                <button type="button" className="btn-ghost btn-sm" disabled={page >= totalPages} onClick={() => onPage(page + 1)}>Напред</button>
            </div>
        </div>
    );
}
