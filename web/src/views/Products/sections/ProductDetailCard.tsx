import { useState } from "react";
import type { JSX } from "react";
import { PRODUCTS } from "./productsData";
import type { Product } from "./productsData";

type Props = { product: Product | null; onAddToLog: (p: Product, grams: number) => void };

const NUTRIENTS = [
    { key: "calories",  label: "Калории",      unit: "kcal", color: "var(--c-electric,#0066FF)" },
    { key: "protein",   label: "Протеин",       unit: "г",    color: "var(--c-electric,#0066FF)" },
    { key: "carbs",     label: "Въглехидрати",  unit: "г",    color: "var(--c-acid,#C8FF00)" },
    { key: "sugar",     label: "от кoито захари", unit: "г",  color: "rgba(200,255,0,0.6)" },
    { key: "fat",       label: "Мазнини",       unit: "г",    color: "#FFB300" },
    { key: "saturated", label: "от кoито нас.",  unit: "г",   color: "rgba(255,179,0,0.6)" },
    { key: "fiber",     label: "Фибри",         unit: "г",    color: "#00E676" },
    { key: "sodium",    label: "Натрий",        unit: "мг",   color: "#FF5D73" },
] as const;

const REF: Record<string, number> = {
    calories: 2000, protein: 50, carbs: 260, sugar: 50, fat: 70, saturated: 20, fiber: 25, sodium: 2300,
};

export default function ProductDetailCard({ product, onAddToLog }: Props): JSX.Element {
    const [grams, setGrams] = useState(product?.servingG ?? 100);
    const [added, setAdded] = useState(false);

    const p = product ?? PRODUCTS.find((x) => x.favorite) ?? PRODUCTS[0];

    function scaled(val: number) {
        return +((val * grams) / 100).toFixed(1);
    }

    function handleAdd() {
        setAdded(true);
        onAddToLog(p, grams);
        setTimeout(() => setAdded(false), 2000);
    }

    const totalCal = scaled(p.per100.calories);
    const carbPct   = Math.round((p.per100.carbs   * 4 / p.per100.calories) * 100) || 0;
    const protPct   = Math.round((p.per100.protein * 4 / p.per100.calories) * 100) || 0;
    const fatPct    = Math.round((p.per100.fat     * 9 / p.per100.calories) * 100) || 0;

    return (
        <div className="card pd-card" style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
            {/* Hero */}
            <div style={{ display: "flex", alignItems: "center", gap: "var(--sp-4)", padding: "var(--sp-4)", borderRadius: "var(--r-lg)", background: "rgba(0,102,255,0.05)", border: "1px solid rgba(0,102,255,0.12)" }}>
                <div style={{ width: 60, height: 60, borderRadius: "var(--r-lg)", background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem", flexShrink: 0 }}>{p.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="heading-sm" style={{ color: "var(--color-cream)" }}>{p.name}</div>
                    <div className="body-sm text-gray" style={{ marginTop: 2 }}>{p.brand}</div>
                    <div style={{ display: "flex", gap: "var(--sp-2)", flexWrap: "wrap", marginTop: 6 }}>
                        {p.tags.slice(0, 3).map((t) => (
                            <span key={t} className="pd-pill" style={{ background: "rgba(0,102,255,0.08)", color: "var(--c-electric,#0066FF)", fontSize: "0.62rem" }}>{t}</span>
                        ))}
                    </div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", fontWeight: 900, color: "var(--c-electric,#0066FF)", lineHeight: 1 }}>{totalCal}</div>
                    <div className="label text-gray">kcal</div>
                </div>
            </div>

            {/* Serving slider */}
            <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <span className="label text-gray">Порция</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <button type="button" onClick={() => setGrams(Math.max(5, grams - 5))} style={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer", color: "var(--color-cream)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.9rem" }}>−</button>
                        <span style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 800, color: "var(--color-cream)", minWidth: 50, textAlign: "center" }}>{grams}г</span>
                        <button type="button" onClick={() => setGrams(Math.min(1000, grams + 5))} style={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer", color: "var(--color-cream)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.9rem" }}>+</button>
                    </div>
                </div>
                <input type="range" min="5" max="500" step="5" value={grams} onChange={(e) => setGrams(Number(e.target.value))}
                    style={{ width: "100%", accentColor: "var(--c-electric,#0066FF)", cursor: "pointer" }} />
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span className="label text-gray" style={{ fontSize: "0.65rem" }}>5г</span>
                    <span className="label text-gray" style={{ fontSize: "0.65rem" }}>Стандартна: {p.servingG}г</span>
                    <span className="label text-gray" style={{ fontSize: "0.65rem" }}>500г</span>
                </div>
            </div>

            {/* Macro split bar */}
            <div>
                <div className="label text-gray" style={{ marginBottom: 8 }}>Макро разпределение</div>
                <div style={{ display: "flex", height: 10, borderRadius: "var(--r-full)", overflow: "hidden", gap: 1 }}>
                    <div style={{ flex: carbPct,  background: "var(--c-acid,#C8FF00)", opacity: 0.8 }} />
                    <div style={{ flex: protPct,  background: "var(--c-electric,#0066FF)", opacity: 0.8 }} />
                    <div style={{ flex: fatPct,   background: "#FFB300", opacity: 0.8 }} />
                </div>
                <div style={{ display: "flex", gap: "var(--sp-3)", marginTop: 6, flexWrap: "wrap" }}>
                    {[
                        { label: `В ${carbPct}%`, color: "var(--c-acid,#C8FF00)" },
                        { label: `П ${protPct}%`, color: "var(--c-electric,#0066FF)" },
                        { label: `М ${fatPct}%`,  color: "#FFB300" },
                    ].map((l) => (
                        <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                            <div style={{ width: 8, height: 8, borderRadius: "50%", background: l.color }} />
                            <span className="label" style={{ color: l.color }}>{l.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Nutrition table */}
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: "var(--sp-3)", padding: "var(--sp-2) var(--sp-3)" }}>
                    <span className="label text-gray" style={{ fontSize: "0.62rem" }}>ХРАНИТЕЛНО ВЕЩЕСТВО</span>
                    <span className="label text-gray" style={{ fontSize: "0.62rem", textAlign: "right" }}>НА 100Г</span>
                    <span className="label text-gray" style={{ fontSize: "0.62rem", textAlign: "right" }}>ПОРЦИЯ ({grams}Г)</span>
                </div>
                {NUTRIENTS.map((n) => {
                    const val100 = p.per100[n.key as keyof typeof p.per100] as number;
                    const valServ = scaled(val100);
                    const pct = Math.min(Math.round((valServ / REF[n.key]) * 100), 999);
                    const isSubRow = n.key === "sugar" || n.key === "saturated";
                    return (
                        <div key={n.key} style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: "var(--sp-3)", alignItems: "center", padding: "var(--sp-2) var(--sp-3)", borderRadius: "var(--r-md)", background: isSubRow ? "transparent" : "rgba(255,255,255,0.02)" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                {isSubRow && <div style={{ width: 12, flexShrink: 0 }} />}
                                <div>
                                    <div className="body-sm" style={{ color: isSubRow ? "rgba(255,255,255,0.5)" : "var(--color-cream)", fontWeight: isSubRow ? 400 : 600, fontSize: isSubRow ? "0.78rem" : undefined }}>{n.label}</div>
                                    {!isSubRow && pct > 0 && (
                                        <div style={{ marginTop: 3, height: 3, width: 60, borderRadius: "var(--r-full)", background: "rgba(255,255,255,0.06)" }}>
                                            <div style={{ width: `${Math.min(pct, 100)}%`, height: "100%", borderRadius: "var(--r-full)", background: n.color }} />
                                        </div>
                                    )}
                                </div>
                            </div>
                            <span className="label text-gray" style={{ textAlign: "right", fontSize: "0.78rem" }}>{val100}{n.unit}</span>
                            <span className="body-sm" style={{ textAlign: "right", color: n.color, fontWeight: 700 }}>{valServ}{n.unit}</span>
                        </div>
                    );
                })}
            </div>

            {/* Add to log */}
            <button
                type="button"
                onClick={handleAdd}
                style={{
                    padding: "11px 0", borderRadius: "var(--r-md)", fontSize: "0.9rem", fontWeight: 700,
                    cursor: "pointer", border: "none", transition: "all 0.2s",
                    background: added ? "#00E676" : "var(--c-electric,#0066FF)",
                    color: added ? "#000" : "#fff",
                }}
            >
                {added ? "✓ Добавено към дневника" : `+ Добави ${grams}г към дневника`}
            </button>
        </div>
    );
}
