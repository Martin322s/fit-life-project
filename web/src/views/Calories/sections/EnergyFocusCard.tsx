import type { JSX } from "react";
import type { CaloriesData } from "../../../hooks/useCaloriesData";
import { CALORIES_DATA } from "./caloriesData";

function ring(r: number, pct: number) {
  const circ = +(2 * Math.PI * r).toFixed(2);
  return { circ, offset: +(circ * (1 - Math.min(Math.max(pct, 0), 1))).toFixed(1) };
}

type Props = { data: CaloriesData };

export default function EnergyFocusCard({ data }: Props): JSX.Element {
  const { todayCalories, goalCalories, remaining, tdee, isLoading } = data;

  // burned calories require workouts API — not in this stage
  // TODO(Stage 5): fetch today's workout calories burned from /api/workouts
  const burned = 0;

  const net       = todayCalories - burned;
  const pct       = goalCalories > 0 ? todayCalories / goalCalories : 0;
  const tdeeValue = tdee ?? CALORIES_DATA.budget.tdee; // fall back to static if profile missing
  const outer     = ring(86, pct);
  const inner     = ring(68, tdeeValue > 0 ? net / tdeeValue : 0);

  // TODO(Stage 5): weekly average requires historical /api/meals per day
  const { weeklyAverage, weeklyTargetAverage } = CALORIES_DATA.budget;

  const statRows = [
    {
      label: "Остават днес",
      value: isLoading ? "—" : `${remaining} kcal`,
      color: remaining >= 0 ? "#00E676" : "var(--c-error,#FF3D57)",
      sub: remaining >= 0 ? "Буферът е в рамка." : "Надвишен дневен бюджет!",
    },
    {
      label: "Нетни калории",
      value: isLoading ? "—" : `${net} kcal`,
      color: "var(--c-electric,#0066FF)",
      // TODO(Stage 5): show real burned when workouts API is connected
      sub: `Изядени ${isLoading ? "—" : todayCalories} · изгорени ${burned}.`,
    },
    {
      label: "Прогноза за деня",
      value: isLoading ? "—" : `${todayCalories} kcal`,
      color: todayCalories <= goalCalories ? "var(--c-acid,#C8FF00)" : "#FFB300",
      sub: "Текущ прием без добавени хранения.",
    },
    {
      // TODO(Stage 5): compute from last 7 days of /api/meals
      label: "Седмичен среден прием",
      value: `${weeklyAverage} kcal`,
      color: "var(--color-cream)",
      sub: `Спрямо средна цел ${weeklyTargetAverage} kcal.`,
    },
  ];

  return (
    <div className="card cal-card" style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "var(--sp-3)" }}>
        <div>
          <div className="label text-gray">Дневен енергиен баланс</div>
          <div className="heading-sm" style={{ color: "var(--color-cream)", marginTop: 4 }}>Всичко важно за деня на едно място</div>
        </div>
        <span className="cal-pill" style={{ background: "rgba(0,102,255,0.1)", color: "var(--c-electric,#0066FF)", flexShrink: 0 }}>
          {isLoading ? "—" : `${Math.round(pct * 100)}% от бюджета`}
        </span>
      </div>

      <div className="cal-energy-inner">
        <div className="cal-energy-ring">
          <svg viewBox="0 0 220 220">
            <defs>
              <linearGradient id="energyOuter" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0066FF" />
                <stop offset="100%" stopColor="#5AA3FF" />
              </linearGradient>
              <linearGradient id="energyInner" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#C8FF00" />
                <stop offset="100%" stopColor="#7DFF7A" />
              </linearGradient>
            </defs>
            <circle cx="110" cy="110" r="86" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="16" />
            <circle cx="110" cy="110" r="86" fill="none" stroke="url(#energyOuter)" strokeWidth="16" strokeLinecap="round" strokeDasharray={outer.circ} strokeDashoffset={outer.offset} transform="rotate(-90 110 110)" />
            <circle cx="110" cy="110" r="68" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="12" />
            <circle cx="110" cy="110" r="68" fill="none" stroke="url(#energyInner)" strokeWidth="12" strokeLinecap="round" strokeDasharray={inner.circ} strokeDashoffset={inner.offset} transform="rotate(-90 110 110)" />
          </svg>
          <div className="cal-energy-overlay">
            <div className="label text-gray">Изядени</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 900, color: "var(--color-cream)", lineHeight: 1 }}>
              {isLoading ? "—" : todayCalories}
            </div>
            <div className="body-sm text-gray">от {goalCalories} kcal</div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-3)" }}>
          {statRows.map((item) => (
            <div key={item.label} style={{ padding: "var(--sp-3) var(--sp-4)", borderRadius: "var(--r-lg)", background: "rgba(255,255,255,0.03)", border: "1px solid var(--c-border,rgba(255,255,255,0.06))" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: "var(--sp-3)", alignItems: "center" }}>
                <div className="label text-gray">{item.label}</div>
                <div style={{ color: item.color, fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 800, flexShrink: 0 }}>{item.value}</div>
              </div>
              <div className="body-sm text-gray" style={{ marginTop: 6 }}>{item.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
