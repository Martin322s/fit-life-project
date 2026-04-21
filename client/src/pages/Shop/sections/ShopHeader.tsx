import type { JSX } from "react";
import { STORE_ITEMS } from "./shopData";

type Props = { onToggleSidebar: () => void; onOpenCart: () => void };

export default function ShopHeader({ onToggleSidebar, onOpenCart }: Props): JSX.Element {
    const today = new Date().toLocaleDateString("bg-BG", {
        weekday: "long",
        day: "numeric",
        month: "long",
    });

    return (
        <div className="sd-header">
            <button type="button" className="sd-hamburger" onClick={onToggleSidebar} aria-label="Меню">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <rect x="1" y="4" width="16" height="1.8" rx="0.9" fill="currentColor" />
                    <rect x="1" y="8.1" width="16" height="1.8" rx="0.9" fill="currentColor" />
                    <rect x="1" y="12.2" width="16" height="1.8" rx="0.9" fill="currentColor" />
                </svg>
            </button>

            <div style={{ flex: 1, minWidth: 0 }}>
                <h1 className="sd-title">Магазин</h1>
                <div className="sd-header-sub body-sm text-gray">{today} · {STORE_ITEMS.length} активни артикула</div>
            </div>

            <div className="sd-header-right">
                <button type="button" className="sd-cart-btn" onClick={onOpenCart}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="9" cy="19.5" r="1.5" />
                        <circle cx="17.5" cy="19.5" r="1.5" />
                        <path d="M3 4h2.5l1.7 8.2a1 1 0 0 0 1 .8h8.8a1 1 0 0 0 1-.7L20 7H7" />
                    </svg>
                    <span>Количка</span>
                </button>
                <div className="sd-avatar">МИ</div>
            </div>
        </div>
    );
}
