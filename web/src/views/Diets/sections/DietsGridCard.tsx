import type { JSX } from "react";
import type { ApiDiet, DietCategory, DietDifficulty, DietGoalType } from "../../../services/dietsApi";
import { DIET_CATEGORY_OPTIONS, DIET_DIFFICULTY_COLOR, DIET_DIFFICULTY_OPTIONS, DIET_GOAL_OPTIONS, dietCategoryLabel, dietDifficultyLabel, dietGoalLabel } from "../../../lib/dietLabels";

type Props = {
    diets: ApiDiet[];
    isLoading: boolean;
    total: number;
    page: number;
    totalPages: number;
    search: string;
    category: DietCategory | "";
    goalType: DietGoalType | "";
    difficulty: DietDifficulty | "";
    onSearch: (value: string) => void;
    onCategory: (value: DietCategory | "") => void;
    onGoalType: (value: DietGoalType | "") => void;
    onDifficulty: (value: DietDifficulty | "") => void;
    onPage: (value: number) => void;
    onOpen: (diet: ApiDiet) => void;
};

function pageNumbers(page: number, totalPages: number): number[] {
    const start = Math.max(1, page - 2);
    const end = Math.min(totalPages, start + 4);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

function DietCard({ diet, onOpen }: { diet: ApiDiet; onOpen: (diet: ApiDiet) => void }): JSX.Element {
    return (
        <button type="button" onClick={() => onOpen(diet)} className="card dt-card" style={{ display: "flex", flexDirection: "column", gap: "var(--sp-3)", textAlign: "left", cursor: "pointer", border: "1px solid var(--c-border,rgba(255,255,255,0.06))" }}>
            <div style={{ height: 6, margin: "calc(var(--sp-5) * -1) calc(var(--sp-5) * -1) var(--sp-2)", background: "linear-gradient(90deg,var(--c-electric,#0066FF),var(--c-acid,#C8FF00))" }} />
            <div style={{ display: "flex", justifyContent: "space-between", gap: "var(--sp-2)", alignItems: "flex-start" }}>
                <div style={{ minWidth: 0 }}>
                    <div className="body-sm" style={{ color: "var(--color-cream)", fontWeight: 800, lineHeight: 1.3 }}>{diet.title}</div>
                    <div className="body-sm text-gray" style={{ marginTop: 5, lineHeight: 1.45 }}>{diet.description}</div>
                </div>
                <span className="dt-pill" style={{ background: "rgba(255,255,255,0.04)", color: DIET_DIFFICULTY_COLOR[diet.difficulty], flexShrink: 0 }}>{dietDifficultyLabel(diet.difficulty)}</span>
            </div>
            <div style={{ display: "flex", gap: "var(--sp-2)", flexWrap: "wrap" }}>
                <span className="dt-pill" style={{ background: "rgba(0,102,255,0.08)", color: "var(--c-electric,#0066FF)" }}>{dietCategoryLabel(diet.category)}</span>
                <span className="dt-pill" style={{ background: "rgba(200,255,0,0.08)", color: "var(--c-acid,#C8FF00)" }}>{dietGoalLabel(diet.goalType)}</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--sp-2)", marginTop: "auto" }}>
                <div style={{ padding: "var(--sp-2)", borderRadius: "var(--r-md)", background: "rgba(255,255,255,0.025)" }}>
                    <div className="label text-gray">Продължителност</div>
                    <div style={{ color: "var(--color-cream)", fontWeight: 800 }}>{diet.durationDays} дни</div>
                </div>
                <div style={{ padding: "var(--sp-2)", borderRadius: "var(--r-md)", background: "rgba(255,255,255,0.025)" }}>
                    <div className="label text-gray">Калории</div>
                    <div style={{ color: "var(--color-cream)", fontWeight: 800 }}>{diet.caloriesPerDay} kcal</div>
                </div>
            </div>
        </button>
    );
}

export default function DietsGridCard({ diets, isLoading, total, page, totalPages, search, category, goalType, difficulty, onSearch, onCategory, onGoalType, onDifficulty, onPage, onOpen }: Props): JSX.Element {
    return (
        <div className="card dt-card" style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "var(--sp-3)", flexWrap: "wrap" }}>
                <div>
                    <div className="label text-gray">Каталог с диети</div>
                    <div className="heading-sm" style={{ color: "var(--color-cream)", marginTop: 4 }}>{total} плана</div>
                </div>
                <div className="body-sm text-gray">Страница {page} / {totalPages}</div>
            </div>

            <div className="dt-filter-grid">
                <input value={search} onChange={(e) => onSearch(e.target.value)} placeholder="Търси по име или описание..." style={{ width: "100%", padding: "10px 14px", borderRadius: "var(--r-lg)", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "var(--color-cream)", outline: "none", boxSizing: "border-box" }} />
                <select value={category} onChange={(e) => onCategory(e.target.value as DietCategory | "")} style={{ padding: "10px 14px", borderRadius: "var(--r-lg)", background: "var(--c-surface-1,#0E1318)", border: "1px solid rgba(255,255,255,0.1)", color: "var(--color-cream)", outline: "none" }}>{DIET_CATEGORY_OPTIONS.map((o) => <option key={o.value || "all"} value={o.value}>{o.label}</option>)}</select>
                <select value={goalType} onChange={(e) => onGoalType(e.target.value as DietGoalType | "")} style={{ padding: "10px 14px", borderRadius: "var(--r-lg)", background: "var(--c-surface-1,#0E1318)", border: "1px solid rgba(255,255,255,0.1)", color: "var(--color-cream)", outline: "none" }}>{DIET_GOAL_OPTIONS.map((o) => <option key={o.value || "all"} value={o.value}>{o.label}</option>)}</select>
                <select value={difficulty} onChange={(e) => onDifficulty(e.target.value as DietDifficulty | "")} style={{ padding: "10px 14px", borderRadius: "var(--r-lg)", background: "var(--c-surface-1,#0E1318)", border: "1px solid rgba(255,255,255,0.1)", color: "var(--color-cream)", outline: "none" }}>{DIET_DIFFICULTY_OPTIONS.map((o) => <option key={o.value || "all"} value={o.value}>{o.label}</option>)}</select>
            </div>

            {isLoading && <div className="body-sm text-gray" style={{ padding: "var(--sp-6)", textAlign: "center" }}>Зареждане на диети...</div>}
            {!isLoading && diets.length === 0 && <div className="body-sm text-gray" style={{ padding: "var(--sp-6)", textAlign: "center" }}>Няма диети по тези критерии.</div>}
            {!isLoading && diets.length > 0 && <div className="dt-diets-grid">{diets.map((diet) => <DietCard key={diet.id} diet={diet} onOpen={onOpen} />)}</div>}

            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "var(--sp-2)", flexWrap: "wrap" }}>
                <button type="button" className="btn-ghost btn-sm" disabled={page <= 1} onClick={() => onPage(page - 1)}>Назад</button>
                {pageNumbers(page, totalPages).map((n) => <button key={n} type="button" className={n === page ? "btn-primary btn-sm" : "btn-ghost btn-sm"} onClick={() => onPage(n)}>{n}</button>)}
                <button type="button" className="btn-ghost btn-sm" disabled={page >= totalPages} onClick={() => onPage(page + 1)}>Напред</button>
            </div>
        </div>
    );
}
