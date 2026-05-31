import type { JSX } from "react";
import type { CaloriesData } from "../../../hooks/useCaloriesData";

type Props = { data: CaloriesData };

const MACRO_CONFIG = [
  { key: "protein" as const, label: "Протеин",       color: "var(--c-electric,#0066FF)", kcalPerGram: 4 },
  { key: "carbs"   as const, label: "Въглехидрати", color: "var(--c-acid,#C8FF00)",     kcalPerGram: 4 },
  { key: "fat"     as const, label: "Мазнини",      color: "#FFB300",                   kcalPerGram: 9 },
];

export default function MacroCard({ data }: Props): JSX.Element {
  const { todayMacros, macroTargets, isLoading } = data;

  const macros = MACRO_CONFIG.map((cfg) => ({
    ...cfg,
    consumed: Math.round(todayMacros[cfg.key]),
    target:   macroTargets[cfg.key],
  }));

  const totalKcal = macros.reduce((sum, m) => sum + m.consumed * m.kcalPerGram, 0);

  return (
    <div className="card cal-card">
      <div className="label text-gray">Макронутриенти</div>
      <div className="heading-sm" style={{ color: "var(--color-cream)", marginTop: 4, marginBottom: "var(--sp-4)" }}>Разпределение и покритие</div>

      {/* Proportional colour bar */}
      <div style={{ display: "flex", height: 10, borderRadius: "var(--r-full)", overflow: "hidden", gap: 2, marginBottom: "var(--sp-4)" }}>
        {macros.map((m) => (
          <div
            key={m.label}
            style={{ width: `${totalKcal > 0 ? (m.consumed * m.kcalPerGram / totalKcal) * 100 : 33}%`, background: m.color, transition: "width 0.6s ease" }}
          />
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
        {macros.map((m) => {
          const pct = m.target > 0 ? m.consumed / m.target : 0;
          return (
            <div key={m.label}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--sp-1)" }}>
                <span className="body-sm" style={{ color: "var(--color-cream)", fontWeight: 600 }}>{m.label}</span>
                <span className="body-sm text-gray">
                  {isLoading ? "—" : `${m.consumed} / ${m.target} г`}
                </span>
              </div>
              <div style={{ height: 7, borderRadius: "var(--r-full)", background: "rgba(255,255,255,0.06)" }}>
                <div style={{ width: `${Math.min(pct, 1) * 100}%`, height: "100%", borderRadius: "var(--r-full)", background: m.color, transition: "width 0.8s ease" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                <span className="label text-gray">
                  {isLoading ? "—" : `${Math.round(m.consumed * m.kcalPerGram)} kcal`}
                </span>
                <span className="label" style={{ color: m.color }}>
                  {isLoading ? "—" : `${Math.round(pct * 100)}%`}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
