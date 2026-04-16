import { useState } from "react";
import type { JSX } from "react";
import { PRODUCTS, CATEGORIES } from "./productsData";
import type { Product } from "./productsData";

type Props = { onSelect: (p: Product) => void; selectedId: string | null };

export default function ProductCatalogCard({ onSelect, selectedId }: Props): JSX.Element {
    const [category, setCategory] = useState("all");
    const [query, setQuery] = useState("");

    const filtered = PRODUCTS.filter((p) => {
        const matchCat = category === "all" || p.category === category;
        const q = query.toLowerCase();
        const matchQ = !q || p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.tags.some((t) => t.toLowerCase().includes(q));
        return matchCat && matchQ;
    });

    return (
        <div className="card pd-card" style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "var(--sp-3)" }}>
                <div>
                    <div className="label text-gray">Каталог</div>
                    <div className="heading-sm" style={{ color: "var(--color-cream)", marginTop: 4 }}>Намери продукт</div>
                </div>
                <span className="pd-pill" style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.4)" }}>{filtered.length} резултата</span>
            </div>

            {/* Search */}
            <div style={{ position: "relative" }}>
                <svg style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "rgba(255,255,255,0.3)" }} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Търси продукт, марка или тагове..."
                    style={{ width: "100%", padding: "10px 14px 10px 36px", borderRadius: "var(--r-md)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "var(--color-cream)", fontSize: "0.88rem", boxSizing: "border-box", outline: "none" }}
                />
                {query && (
                    <button type="button" onClick={() => setQuery("")} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "transparent", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.4)", fontSize: "1rem", lineHeight: 1, padding: 2 }}>✕</button>
                )}
            </div>

            {/* Category tabs */}
            <div style={{ display: "flex", gap: "var(--sp-2)", overflowX: "auto", paddingBottom: 2 }}>
                {CATEGORIES.map((c) => (
                    <button key={c.key} type="button" onClick={() => setCategory(c.key)} style={{
                        whiteSpace: "nowrap", padding: "6px 12px", borderRadius: "var(--r-full)", fontSize: "0.78rem", fontWeight: 700,
                        cursor: "pointer", border: "1px solid", transition: "all 0.15s", flexShrink: 0,
                        background: category === c.key ? "rgba(0,102,255,0.1)" : "transparent",
                        borderColor: category === c.key ? "var(--c-electric,#0066FF)" : "rgba(255,255,255,0.08)",
                        color: category === c.key ? "var(--c-electric,#0066FF)" : "rgba(255,255,255,0.4)",
                    }}>
                        {c.icon} {c.label}
                    </button>
                ))}
            </div>

            {/* Product grid */}
            {filtered.length === 0 ? (
                <div style={{ padding: "var(--sp-6)", textAlign: "center" }}>
                    <div style={{ fontSize: "2rem", marginBottom: 12 }}>🔍</div>
                    <div className="body-sm text-gray">Няма намерени продукти за „{query}"</div>
                </div>
            ) : (
                <div className="pd-catalog-grid">
                    {filtered.map((p) => {
                        const isSelected = p.id === selectedId;
                        const servingCal = Math.round((p.per100.calories * p.servingG) / 100);
                        const servingProt = Math.round((p.per100.protein * p.servingG) / 100);
                        return (
                            <button
                                key={p.id}
                                type="button"
                                onClick={() => onSelect(p)}
                                style={{
                                    display: "flex", flexDirection: "column", gap: "var(--sp-2)",
                                    padding: "var(--sp-4)", borderRadius: "var(--r-lg)", textAlign: "left", cursor: "pointer",
                                    background: isSelected ? "rgba(0,102,255,0.07)" : "rgba(255,255,255,0.02)",
                                    border: `1px solid ${isSelected ? "var(--c-electric,#0066FF)" : "var(--c-border,rgba(255,255,255,0.06))"}`,
                                    transition: "all 0.15s", width: "100%",
                                }}
                            >
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                    <span style={{ fontSize: "1.5rem" }}>{p.icon}</span>
                                    {p.favorite && <span style={{ fontSize: "0.7rem" }}>❤️</span>}
                                </div>
                                <div>
                                    <div className="body-sm" style={{ color: "var(--color-cream)", fontWeight: 700, lineHeight: 1.3 }}>{p.name}</div>
                                    <div className="label text-gray" style={{ fontSize: "0.65rem", marginTop: 2 }}>{p.brand}</div>
                                </div>

                                {/* Macro mini-bar */}
                                <div style={{ display: "flex", height: 4, borderRadius: "var(--r-full)", overflow: "hidden", gap: 1 }}>
                                    <div style={{ flex: p.per100.carbs,    background: "var(--c-acid,#C8FF00)", opacity: 0.7 }} />
                                    <div style={{ flex: p.per100.protein,  background: "var(--c-electric,#0066FF)", opacity: 0.7 }} />
                                    <div style={{ flex: p.per100.fat,      background: "#FFB300", opacity: 0.7 }} />
                                </div>

                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <span className="label text-gray" style={{ fontSize: "0.62rem" }}>{p.servingG}г порция</span>
                                    <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                                        <span className="label" style={{ fontSize: "0.65rem", color: "var(--c-electric,#0066FF)", fontWeight: 700 }}>{servingCal} kcal</span>
                                        <span className="label" style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.4)" }}>Б{servingProt}г</span>
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
