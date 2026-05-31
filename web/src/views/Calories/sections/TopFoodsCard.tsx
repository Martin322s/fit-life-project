import type { JSX } from "react";
import type { ApiMeal } from "../../../services/dashboardApi";

type Props = { meals: ApiMeal[]; isLoading: boolean };

export default function TopFoodsCard({ meals, isLoading }: Props): JSX.Element {
  const sorted = [...meals].sort((a, b) => b.calories - a.calories).slice(0, 5);

  return (
    <div className="card cal-card">
      <div style={{ marginBottom: "var(--sp-4)" }}>
        <div className="label text-gray">Топ храни за деня</div>
        <div className="heading-sm" style={{ color: "var(--color-cream)", marginTop: 2 }}>Най-калорични записи</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-2)" }}>
        {isLoading ? (
          <div className="body-sm text-gray" style={{ textAlign: "center", padding: "var(--sp-4)" }}>Зареждане…</div>
        ) : sorted.length === 0 ? (
          <div style={{ textAlign: "center", padding: "var(--sp-6)", display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--sp-2)" }}>
            <span style={{ fontSize: "1.8rem" }}>🍽️</span>
            <span className="body-sm text-gray">Добави хранения, за да видиш топ храните</span>
          </div>
        ) : (
          sorted.map((meal, index) => (
            <div key={meal.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "var(--sp-3)", padding: "var(--sp-3) var(--sp-4)", borderRadius: "var(--r-lg)", background: "rgba(255,255,255,0.025)", border: "1px solid var(--c-border,rgba(255,255,255,0.06))" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--sp-3)", minWidth: 0 }}>
                <div style={{ width: 30, height: 30, borderRadius: "50%", background: index === 0 ? "rgba(200,255,0,0.12)" : "rgba(255,255,255,0.06)", color: index === 0 ? "var(--c-acid,#C8FF00)" : "var(--color-cream)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, flexShrink: 0 }}>
                  {index + 1}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div className="body-sm" style={{ color: "var(--color-cream)", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{meal.title}</div>
                  <div className="label text-gray">
                    {new Date(meal.createdAt).toLocaleTimeString("bg-BG", { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div className="body-sm" style={{ color: "var(--color-cream)", fontWeight: 700 }}>{meal.calories} kcal</div>
                {meal.protein != null && (
                  <div className="label text-gray">{Math.round(meal.protein)} г протеин</div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
