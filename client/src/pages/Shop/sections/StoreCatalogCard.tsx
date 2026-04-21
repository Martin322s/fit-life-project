import { useMemo, useState } from "react";
import type { JSX } from "react";
import { STORE_CATEGORIES, STORE_ITEMS } from "./shopData";

type Props = { onAddToCart: (id: string) => void };

export default function StoreCatalogCard({ onAddToCart }: Props): JSX.Element {
    const [category, setCategory] = useState("all");
    const [query, setQuery] = useState("");

    const filtered = useMemo(() => {
        const normalized = query.trim().toLowerCase();

        return STORE_ITEMS.filter((item) => {
            const matchesCategory = category === "all" || item.category === category;
            const matchesQuery =
                normalized === "" ||
                item.name.toLowerCase().includes(normalized) ||
                item.brand.toLowerCase().includes(normalized) ||
                (item.badge ?? "").toLowerCase().includes(normalized);

            return matchesCategory && matchesQuery;
        });
    }, [category, query]);

    return (
        <div className="card sd-card" style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "var(--sp-3)", alignItems: "flex-start" }}>
                <div>
                    <div className="label text-gray">Каталог</div>
                    <div className="heading-sm" style={{ color: "var(--color-cream)", marginTop: 4 }}>Намери продукт за поръчка</div>
                </div>
                <span className="sd-pill" style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.45)" }}>{filtered.length} резултата</span>
            </div>

            <div style={{ position: "relative" }}>
                <svg style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "rgba(255,255,255,0.3)" }} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Търси марка, продукт или промоция..."
                    style={{
                        width: "100%",
                        padding: "10px 14px 10px 36px",
                        borderRadius: "var(--r-md)",
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        color: "var(--color-cream)",
                        fontSize: "0.88rem",
                        boxSizing: "border-box",
                        outline: "none",
                    }}
                />
            </div>

            <div className="sd-tab-row">
                {STORE_CATEGORIES.map((item) => (
                    <button
                        key={item.key}
                        type="button"
                        onClick={() => setCategory(item.key)}
                        style={{
                            whiteSpace: "nowrap",
                            padding: "6px 12px",
                            borderRadius: "var(--r-full)",
                            fontSize: "0.78rem",
                            fontWeight: 700,
                            cursor: "pointer",
                            border: "1px solid",
                            transition: "all 0.15s",
                            flexShrink: 0,
                            background: category === item.key ? "rgba(0,102,255,0.12)" : "transparent",
                            borderColor: category === item.key ? "var(--c-electric,#0066FF)" : "rgba(255,255,255,0.08)",
                            color: category === item.key ? "var(--c-electric,#0066FF)" : "rgba(255,255,255,0.45)",
                        }}
                    >
                        {item.icon} {item.label}
                    </button>
                ))}
            </div>

            <div className="sd-store-grid">
                {filtered.map((item) => (
                    <div key={item.id} className="sd-store-item">
                        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "var(--sp-3)" }}>
                            <div style={{ display: "flex", gap: "var(--sp-3)", minWidth: 0 }}>
                                <div
                                    style={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: "14px",
                                        background: "rgba(255,255,255,0.04)",
                                        border: "1px solid rgba(255,255,255,0.06)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "1.4rem",
                                        flexShrink: 0,
                                    }}
                                >
                                    {item.icon}
                                </div>
                                <div style={{ minWidth: 0 }}>
                                    <div className="body-sm" style={{ color: "var(--color-cream)", fontWeight: 700, lineHeight: 1.3 }}>{item.name}</div>
                                    <div className="label text-gray" style={{ marginTop: 3 }}>{item.brand}</div>
                                </div>
                            </div>
                            {item.badge && (
                                <span className="sd-pill" style={{ background: "rgba(200,255,0,0.08)", color: "var(--c-acid,#C8FF00)" }}>
                                    {item.badge}
                                </span>
                            )}
                        </div>

                        <div style={{ display: "flex", justifyContent: "space-between", gap: "var(--sp-3)", alignItems: "center" }}>
                            <div>
                                <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
                                    <span style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 900, color: "var(--color-cream)" }}>{item.price.toFixed(2)} лв</span>
                                    {item.oldPrice && <span className="label text-gray" style={{ textDecoration: "line-through" }}>{item.oldPrice.toFixed(2)} лв</span>}
                                </div>
                                <div className="label text-gray" style={{ marginTop: 4 }}>⭐ {item.rating.toFixed(1)} · {item.reviews} ревюта</div>
                            </div>
                            <button
                                type="button"
                                onClick={() => item.inStock && onAddToCart(item.id)}
                                disabled={!item.inStock}
                                style={{
                                    border: "1px solid",
                                    borderColor: item.inStock ? "rgba(0,102,255,0.35)" : "rgba(255,255,255,0.08)",
                                    background: item.inStock ? "rgba(0,102,255,0.1)" : "rgba(255,255,255,0.03)",
                                    color: item.inStock ? "var(--c-electric,#0066FF)" : "rgba(255,255,255,0.32)",
                                    borderRadius: "var(--r-lg)",
                                    padding: "10px 14px",
                                    fontWeight: 700,
                                    cursor: item.inStock ? "pointer" : "not-allowed",
                                    flexShrink: 0,
                                }}
                            >
                                {item.inStock ? "Добави" : "Няма"}
                            </button>
                        </div>

                        <div style={{ display: "flex", justifyContent: "space-between", gap: "var(--sp-2)", alignItems: "center" }}>
                            <span className="label" style={{ color: item.inStock ? "var(--c-acid,#C8FF00)" : "rgba(255,255,255,0.32)" }}>
                                {item.inStock ? "В наличност" : "Изчерпан"}
                            </span>
                            <span className="label text-gray">{item.delivery}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
