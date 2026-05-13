import type { JSX } from "react";
import type { ApiMeal } from "../../../services/dashboardApi";

type Props = { meals: ApiMeal[]; isLoading: boolean };

export default function TimingCard({ meals, isLoading }: Props): JSX.Element {
  const max = meals.length > 0 ? Math.max(...meals.map((m) => m.calories)) : 1;

  return (
    <div className="card cal-card">
      <div className="label text-gray">Час на хранене</div>
      <div className="heading-sm" style={{ color: "var(--color-cream)", marginTop: 4, marginBottom: "var(--sp-4)" }}>Кога идват калориите</div>

      <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-3)" }}>
        {isLoading ? (
          <div className="body-sm text-gray" style={{ textAlign: "center", padding: "var(--sp-4)" }}>Зареждане…</div>
        ) : meals.length === 0 ? (
          <div style={{ textAlign: "center", padding: "var(--sp-6)", display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--sp-2)" }}>
            <span style={{ fontSize: "1.8rem" }}>🕐</span>
            <span className="body-sm text-gray">Все още няма хранения за деня</span>
          </div>
        ) : (
          meals.map((meal) => {
            const time = new Date(meal.createdAt).toLocaleTimeString("bg-BG", { hour: "2-digit", minute: "2-digit" });
            return (
              <div key={meal.id} style={{ display: "grid", gridTemplateColumns: "58px minmax(0, 1fr) 70px", alignItems: "center", gap: "var(--sp-3)" }}>
                <span className="label text-gray">{time}</span>
                <div>
                  <div className="body-sm" style={{ color: "var(--color-cream)", marginBottom: 6, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{meal.title}</div>
                  <div style={{ height: 8, borderRadius: "var(--r-full)", background: "rgba(255,255,255,0.06)" }}>
                    <div style={{ width: `${(meal.calories / max) * 100}%`, height: "100%", borderRadius: "var(--r-full)", background: "var(--c-electric,#0066FF)", transition: "width 0.6s ease" }} />
                  </div>
                </div>
                <span className="body-sm" style={{ color: "var(--color-cream)", textAlign: "right" }}>{meal.calories} kcal</span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
