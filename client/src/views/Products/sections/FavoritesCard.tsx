import type { JSX } from "react";
import { PRODUCTS } from "./productsData";
import type { Product } from "./productsData";

type Props = { onSelect: (p: Product) => void; selectedId: string | null };

export default function FavoritesCard({ onSelect, selectedId }: Props): JSX.Element {
    const favorites = PRODUCTS.filter((p) => p.favorite);
    const recent = PRODUCTS.filter((p) => ["chicken-breast", "greek-yogurt", "oats", "whey-protein"].includes(p.id));

    function Row({ p }: { p: Product }) {
        const cal100 = p.per100.calories;
        const prot100 = p.per100.protein;
        const isSelected = p.id === selectedId;
        return (
            <button
                type="button"
                onClick={() => onSelect(p)}
                style={{
                    display: "flex", alignItems: "center", gap: "var(--sp-3)", padding: "var(--sp-3) var(--sp-4)",
                    borderRadius: "var(--r-lg)", cursor: "pointer", textAlign: "left", width: "100%",
                    background: isSelected ? "rgba(0,102,255,0.07)" : "rgba(255,255,255,0.02)",
                    border: `1px solid ${isSelected ? "var(--c-electric,#0066FF)" : "transparent"}`,
                    transition: "all 0.15s",
                }}
            >
                <span style={{ fontSize: "1.3rem", flexShrink: 0 }}>{p.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="body-sm" style={{ color: "var(--color-cream)", fontWeight: 600 }}>{p.name}</div>
                    <div className="label text-gray" style={{ fontSize: "0.65rem", marginTop: 1 }}>{p.brand}</div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div className="label" style={{ color: "var(--c-electric,#0066FF)", fontWeight: 700, fontSize: "0.72rem" }}>{cal100} kcal</div>
                    <div className="label text-gray" style={{ fontSize: "0.62rem" }}>Б {prot100}г / 100г</div>
                </div>
            </button>
        );
    }

    return (
        <div className="card pd-card" style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
            {/* Favorites */}
            <div>
                <div className="label text-gray">Любими продукти</div>
                <div className="heading-sm" style={{ color: "var(--color-cream)", marginTop: 4 }}>Бърз достъп</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-1)" }}>
                {favorites.map((p) => <Row key={p.id} p={p} />)}
            </div>

            <div style={{ height: 1, background: "var(--c-border,rgba(255,255,255,0.06))" }} />

            {/* Recently viewed */}
            <div>
                <div className="label text-gray" style={{ marginBottom: "var(--sp-3)" }}>Последно разгледани</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-1)" }}>
                    {recent.map((p) => <Row key={p.id} p={p} />)}
                </div>
            </div>
        </div>
    );
}
