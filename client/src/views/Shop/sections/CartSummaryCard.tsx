import type { JSX } from "react";
import { STORE_ITEMS } from "./shopData";

type CartEntry = { id: string; qty: number };

type Props = {
    cartItems: CartEntry[];
    onChangeQty: (id: string, delta: number) => void;
    onCheckout: () => void;
};

export default function CartSummaryCard({ cartItems, onChangeQty, onCheckout }: Props): JSX.Element {
    const items = cartItems
        .map((entry) => {
            const product = STORE_ITEMS.find((item) => item.id === entry.id);
            return product ? { ...product, qty: entry.qty } : null;
        })
        .filter((item): item is NonNullable<typeof item> => item !== null);

    const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
    const shipping = subtotal > 79 || subtotal === 0 ? 0 : 5.9;
    const total = subtotal + shipping;

    return (
        <div className="card sd-card" style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
            <div>
                <div className="label text-gray">Твоята количка</div>
                <div className="heading-sm" style={{ color: "var(--color-cream)", marginTop: 4 }}>Бърз checkout</div>
            </div>

            {items.length === 0 ? (
                <div style={{ padding: "var(--sp-5)", borderRadius: "var(--r-lg)", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", textAlign: "center" }}>
                    <div style={{ fontSize: "2rem", marginBottom: 8 }}>🛒</div>
                    <div className="body-sm text-gray">Количката е празна. Добави продукти от каталога.</div>
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-3)" }}>
                    {items.map((item) => (
                        <div
                            key={item.id}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: "var(--sp-3)",
                                padding: "12px",
                                borderRadius: "var(--r-lg)",
                                background: "rgba(255,255,255,0.02)",
                                border: "1px solid rgba(255,255,255,0.05)",
                            }}
                        >
                            <div style={{ display: "flex", alignItems: "center", gap: "var(--sp-3)", minWidth: 0 }}>
                                <div style={{ fontSize: "1.25rem", flexShrink: 0 }}>{item.icon}</div>
                                <div style={{ minWidth: 0 }}>
                                    <div className="body-sm" style={{ color: "var(--color-cream)", fontWeight: 700 }}>{item.name}</div>
                                    <div className="label text-gray">{item.brand}</div>
                                </div>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "var(--sp-2)", flexShrink: 0 }}>
                                <button type="button" onClick={() => onChangeQty(item.id, -1)} style={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(255,255,255,0.06)", color: "var(--color-cream)" }}>-</button>
                                <span className="body-sm" style={{ color: "var(--color-cream)", minWidth: 18, textAlign: "center" }}>{item.qty}</span>
                                <button type="button" onClick={() => onChangeQty(item.id, 1)} style={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(255,255,255,0.06)", color: "var(--color-cream)" }}>+</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 10, paddingTop: "var(--sp-2)", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "var(--sp-2)" }}>
                    <span className="body-sm text-gray">Междинна сума</span>
                    <span className="body-sm" style={{ color: "var(--color-cream)" }}>{subtotal.toFixed(2)} лв</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "var(--sp-2)" }}>
                    <span className="body-sm text-gray">Доставка</span>
                    <span className="body-sm" style={{ color: shipping === 0 ? "var(--c-acid,#C8FF00)" : "var(--color-cream)" }}>
                        {shipping === 0 ? "Безплатна" : `${shipping.toFixed(2)} лв`}
                    </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "var(--sp-2)", alignItems: "baseline" }}>
                    <span style={{ fontFamily: "var(--font-display)", fontWeight: 900, color: "var(--color-cream)" }}>Общо</span>
                    <span style={{ fontFamily: "var(--font-display)", fontSize: "1.7rem", fontWeight: 900, color: "var(--color-cream)" }}>{total.toFixed(2)} лв</span>
                </div>
            </div>

            <button
                type="button"
                onClick={onCheckout}
                disabled={items.length === 0}
                style={{
                    border: "none",
                    borderRadius: "var(--r-lg)",
                    padding: "12px 14px",
                    background: items.length === 0 ? "rgba(255,255,255,0.08)" : "linear-gradient(135deg,var(--c-electric,#0066FF),#00C2FF)",
                    color: items.length === 0 ? "rgba(255,255,255,0.45)" : "white",
                    fontWeight: 800,
                    cursor: items.length === 0 ? "not-allowed" : "pointer",
                }}
            >
                Продължи към плащане
            </button>
        </div>
    );
}
