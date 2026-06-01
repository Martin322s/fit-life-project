import type { JSX } from "react";
import { RECIPES_DATA } from "./recipesData";

const MEAL_ROWS: { key: "breakfast" | "lunch" | "dinner"; label: string; icon: string }[] = [
    { key: "breakfast", label: "Закуска", icon: "🌅" },
    { key: "lunch",     label: "Обяд",    icon: "☀️" },
    { key: "dinner",    label: "Вечеря",  icon: "🌙" },
];

export default function MealPlanCard(): JSX.Element {
    return (
        <div className="card rc-card" style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "var(--sp-3)" }}>
                <div>
                    <div className="label text-gray">Седмичен хранителен план</div>
                    <div className="heading-sm" style={{ color: "var(--color-cream)", marginTop: 4 }}>Организиран по дни и хранения</div>
                </div>
                <span className="rc-pill" style={{ background: "rgba(200,255,0,0.08)", color: "var(--c-acid,#C8FF00)" }}>Тази седмица</span>
            </div>

            <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 4px", minWidth: 560 }}>
                    <thead>
                        <tr>
                            <th style={{ width: 90, textAlign: "left", paddingBottom: 8 }}>
                                <span className="label text-gray" style={{ fontSize: "0.65rem" }}>ХРАНЕНЕ</span>
                            </th>
                            {RECIPES_DATA.weekPlan.map((day) => (
                                <th key={day.day} style={{ textAlign: "center", paddingBottom: 8 }}>
                                    <div className="label" style={{ color: day.isToday ? "var(--c-electric,#0066FF)" : "rgba(255,255,255,0.4)", fontWeight: day.isToday ? 700 : 400, fontSize: "0.72rem" }}>{day.day}</div>
                                    {day.isToday && <div style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--c-electric,#0066FF)", margin: "2px auto 0" }} />}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {MEAL_ROWS.map((meal) => (
                            <tr key={meal.key}>
                                <td style={{ paddingRight: "var(--sp-3)", paddingBottom: 4 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "var(--sp-2)" }}>
                                        <span style={{ fontSize: "0.9rem" }}>{meal.icon}</span>
                                        <span className="label text-gray">{meal.label}</span>
                                    </div>
                                </td>
                                {RECIPES_DATA.weekPlan.map((day) => {
                                    const value = day[meal.key];
                                    return (
                                        <td key={day.day} style={{ paddingBottom: 4, paddingLeft: 3, paddingRight: 3, textAlign: "center" }}>
                                            <div style={{
                                                padding: "6px 8px", borderRadius: "var(--r-md)", fontSize: "0.68rem", lineHeight: 1.3, fontWeight: 500,
                                                background: value
                                                    ? day.isToday ? "rgba(0,102,255,0.1)" : "rgba(255,255,255,0.025)"
                                                    : "rgba(255,255,255,0.02)",
                                                border: `1px solid ${value
                                                    ? day.isToday ? "rgba(0,102,255,0.2)" : "rgba(255,255,255,0.06)"
                                                    : "rgba(255,255,255,0.03)"}`,
                                                color: value
                                                    ? day.isToday ? "var(--c-electric,#0066FF)" : "var(--color-cream)"
                                                    : "rgba(255,255,255,0.15)",
                                                minHeight: 36, display: "flex", alignItems: "center", justifyContent: "center",
                                            }}>
                                                {value ?? "—"}
                                            </div>
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="body-sm text-gray" style={{ padding: "var(--sp-3) var(--sp-4)", borderRadius: "var(--r-lg)", background: "rgba(0,102,255,0.04)", border: "1px solid rgba(0,102,255,0.08)" }}>
                💡 Плануваното хранене за <strong style={{ color: "var(--c-electric,#0066FF)" }}>Сряда</strong> покрива 1 685 kcal от целевите 2 200 kcal — добавена снак ще затвори деня оптимално.
            </div>
        </div>
    );
}
