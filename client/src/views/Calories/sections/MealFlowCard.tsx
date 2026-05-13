import type { JSX } from "react";
import type { ApiMeal } from "../../../services/dashboardApi";

type Props = {
  meals: ApiMeal[];
  isLoading: boolean;
  onEdit: (meal: ApiMeal) => void;
  onDelete: (id: string) => void;
};

function fmt(n: number) {
  return n.toLocaleString("bg-BG");
}

function MealRow({ meal, onEdit, onDelete }: { meal: ApiMeal; onEdit: () => void; onDelete: () => void }): JSX.Element {
  const time = new Date(meal.createdAt).toLocaleTimeString("bg-BG", { hour: "2-digit", minute: "2-digit" });
  const hasMacros = meal.protein != null || meal.carbs != null || meal.fat != null;

  return (
    <div style={{ borderRadius: "var(--r-lg)", padding: "var(--sp-4)", background: "rgba(255,255,255,0.025)", border: "1px solid var(--c-border,rgba(255,255,255,0.06))" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: "var(--sp-3)", alignItems: "flex-start", marginBottom: hasMacros ? "var(--sp-3)" : 0 }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--sp-2)", flexWrap: "wrap" }}>
            <span className="body-sm" style={{ color: "var(--color-cream)", fontWeight: 700 }}>{meal.title}</span>
            <span className="label text-gray">{time}</span>
          </div>
          {meal.notes && <div className="body-sm text-gray" style={{ marginTop: 4 }}>{meal.notes}</div>}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--sp-2)", flexShrink: 0 }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 800, color: "var(--color-cream)" }}>
              {fmt(meal.calories)}<span className="label text-gray" style={{ marginLeft: 4 }}>kcal</span>
            </div>
          </div>
          {/* Edit */}
          <button
            type="button"
            onClick={onEdit}
            title="Редактирай"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "var(--r-md)", width: 30, height: 30, cursor: "pointer", color: "var(--c-text-secondary,#7A8FA3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
          {/* Delete */}
          <button
            type="button"
            onClick={onDelete}
            title="Изтрий"
            style={{ background: "rgba(255,61,87,0.08)", border: "1px solid rgba(255,61,87,0.15)", borderRadius: "var(--r-md)", width: 30, height: 30, cursor: "pointer", color: "var(--c-error,#FF3D57)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              <path d="M10 11v6M14 11v6" />
              <path d="M9 6V4h6v2" />
            </svg>
          </button>
        </div>
      </div>

      {hasMacros && (
        <div style={{ display: "flex", gap: "var(--sp-2)", flexWrap: "wrap" }}>
          {meal.protein != null && (
            <span className="label" style={{ color: "var(--c-electric,#0066FF)", background: "rgba(0,102,255,0.1)", padding: "3px 8px", borderRadius: "var(--r-full)" }}>
              {Math.round(meal.protein)} г протеин
            </span>
          )}
          {meal.carbs != null && (
            <span className="label" style={{ color: "var(--c-acid,#C8FF00)", background: "rgba(200,255,0,0.08)", padding: "3px 8px", borderRadius: "var(--r-full)" }}>
              {Math.round(meal.carbs)} г въгл.
            </span>
          )}
          {meal.fat != null && (
            <span className="label" style={{ color: "#FFB300", background: "rgba(255,179,0,0.1)", padding: "3px 8px", borderRadius: "var(--r-full)" }}>
              {Math.round(meal.fat)} г мазнини
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default function MealFlowCard({ meals, isLoading, onEdit, onDelete }: Props): JSX.Element {
  const totalLogged = meals.reduce((s, m) => s + m.calories, 0);

  return (
    <div className="card cal-card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--sp-4)", gap: "var(--sp-3)" }}>
        <div>
          <div className="label text-gray">Разбивка по хранения</div>
          <div className="heading-sm" style={{ color: "var(--color-cream)", marginTop: 2 }}>
            {isLoading ? "Зареждане…" : `${fmt(totalLogged)} kcal приети днес`}
          </div>
        </div>
        {!isLoading && meals.length > 0 && (
          <span className="label" style={{ color: "var(--c-electric,#0066FF)" }}>
            {meals.length} {meals.length === 1 ? "запис" : "записа"}
          </span>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-2)" }}>
        {isLoading ? (
          <div className="body-sm text-gray" style={{ textAlign: "center", padding: "var(--sp-6)" }}>Зареждане…</div>
        ) : meals.length === 0 ? (
          <div style={{ textAlign: "center", padding: "var(--sp-8)", display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--sp-3)" }}>
            <span style={{ fontSize: "2.5rem" }}>🍽️</span>
            <span className="body-sm text-gray">Няма добавени хранения за днес</span>
            <span className="label text-gray">Кликни „+ Добави храна" от горния десен ъгъл.</span>
          </div>
        ) : (
          meals.map((meal) => (
            <MealRow
              key={meal.id}
              meal={meal}
              onEdit={() => onEdit(meal)}
              onDelete={() => onDelete(meal.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
