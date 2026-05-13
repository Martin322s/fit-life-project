import { useState } from "react";
import type { JSX } from "react";
import { PRODUCTS } from "./productsData";

const FIELDS = [
    { key: "calories",  label: "Калории",     unit: "kcal", best: "low", color: "var(--c-electric,#0066FF)" },
    { key: "protein",   label: "Протеин",      unit: "г",    best: "high", color: "var(--c-electric,#0066FF)" },
    { key: "carbs",     label: "Въглехидрати", unit: "г",    best: "low",  color: "var(--c-acid,#C8FF00)" },
    { key: "fat",       label: "Мазнини",      unit: "г",    best: "low",  color: "#FFB300" },
    { key: "fiber",     label: "Фибри",        unit: "г",    best: "high", color: "#00E676" },
    { key: "sodium",    label: "Натрий",       unit: "мг",   best: "low",  color: "#FF5D73" },
] as const;

const PRESETS = ["chicken-breast", "greek-yogurt", "oats"];

export default function NutritionCompareCard(): JSX.Element {
    const [ids, setIds] = useState<string[]>(PRESETS);

    function changeProduct(slot: number, id: string) {
        setIds((prev) => { const n = [...prev]; n[slot] = id; return n; });
    }

    const products = ids.map((id) => PRODUCTS.find((p) => p.id === id) ?? PRODUCTS[0]);

    function getBest(field: typeof FIELDS[number]) {
        const vals = products.map((p) => p.per100[field.key as keyof typeof p.per100] as number);
        return field.best === "high" ? Math.max(...vals) : Math.min(...vals);
    }

    return (
        <div className="card pd-card" style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
            <div>
                <div className="label text-gray">Сравни продукти</div>
                <div className="heading-sm" style={{ color: "var(--color-cream)", marginTop: 4 }}>На 100г — страничен анализ</div>
            </div>

            {/* Product selectors */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--sp-2)" }}>
                {products.map((p, i) => (
                    <div key={i}>
                        <select
                            value={p.id}
                            onChange={(e) => changeProduct(i, e.target.value)}
                            style={{ width: "100%", padding: "8px 10px", borderRadius: "var(--r-md)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "var(--color-cream)", fontSize: "0.78rem", outline: "none", cursor: "pointer" }}
                        >
                            {PRODUCTS.map((prod) => (
                                <option key={prod.id} value={prod.id}>{prod.name}</option>
                            ))}
                        </select>
                        <div style={{ textAlign: "center", marginTop: 6 }}>
                            <span style={{ fontSize: "1.4rem" }}>{p.icon}</span>
                            <div className="label text-gray" style={{ fontSize: "0.62rem", marginTop: 2 }}>{p.brand}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Comparison table */}
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-2)" }}>
                {FIELDS.map((f) => {
                    const best = getBest(f);
                    const vals = products.map((p) => p.per100[f.key as keyof typeof p.per100] as number);
                    const maxVal = Math.max(...vals) || 1;

                    return (
                        <div key={f.key} style={{ padding: "var(--sp-3) var(--sp-4)", borderRadius: "var(--r-lg)", background: "rgba(255,255,255,0.02)", border: "1px solid var(--c-border,rgba(255,255,255,0.05))" }}>
                            <div className="label text-gray" style={{ marginBottom: 8, fontSize: "0.7rem" }}>{f.label}</div>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--sp-2)" }}>
                                {vals.map((v, i) => {
                                    const isBest = v === best;
                                    const barW = Math.round((v / maxVal) * 100);
                                    return (
                                        <div key={i}>
                                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, alignItems: "baseline" }}>
                                                <span style={{ fontFamily: "var(--font-display)", fontSize: "0.9rem", fontWeight: 800, color: isBest ? f.color : "var(--color-cream)" }}>{v}</span>
                                                <span className="label text-gray" style={{ fontSize: "0.6rem" }}>{f.unit}</span>
                                            </div>
                                            <div style={{ height: 4, borderRadius: "var(--r-full)", background: "rgba(255,255,255,0.05)" }}>
                                                <div style={{ width: `${barW}%`, height: "100%", borderRadius: "var(--r-full)", background: isBest ? f.color : "rgba(255,255,255,0.2)", transition: "width 0.35s" }} />
                                            </div>
                                            {isBest && <div className="label" style={{ fontSize: "0.58rem", color: f.color, marginTop: 3 }}>★ Най-добро</div>}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
