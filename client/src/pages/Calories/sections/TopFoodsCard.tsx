import type { JSX } from "react";
import { CALORIES_DATA } from "./caloriesData";

export default function TopFoodsCard(): JSX.Element {
    return (
        <div className="card cal-card">
            <div style={{ marginBottom: "var(--sp-4)" }}>
                <div className="label text-gray">Топ храни за деня</div>
                <div className="heading-sm" style={{ color: "var(--color-cream)", marginTop: 2 }}>Най-силните contributors</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-2)" }}>
                {CALORIES_DATA.topFoods.map((food, index) => (
                    <div key={food.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "var(--sp-3)", padding: "var(--sp-3) var(--sp-4)", borderRadius: "var(--r-lg)", background: "rgba(255,255,255,0.025)", border: "1px solid var(--c-border,rgba(255,255,255,0.06))" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "var(--sp-3)", minWidth: 0 }}>
                            <div style={{ width: 30, height: 30, borderRadius: "50%", background: index === 0 ? "rgba(200,255,0,0.12)" : "rgba(255,255,255,0.06)", color: index === 0 ? "var(--c-acid,#C8FF00)" : "var(--color-cream)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, flexShrink: 0 }}>{index + 1}</div>
                            <div style={{ minWidth: 0 }}>
                                <div className="body-sm" style={{ color: "var(--color-cream)", fontWeight: 600 }}>{food.name}</div>
                                <div className="label text-gray">{food.tag}</div>
                            </div>
                        </div>
                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                            <div className="body-sm" style={{ color: "var(--color-cream)", fontWeight: 700 }}>{food.calories} kcal</div>
                            <div className="label text-gray">{food.protein} г протеин</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
