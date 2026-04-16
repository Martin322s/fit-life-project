import type { JSX } from "react";
import { PRODUCTS_STATS } from "./productsData";

type Props = { onToggleSidebar: () => void; onScan: () => void };

export default function ProductsHeader({ onToggleSidebar, onScan }: Props): JSX.Element {
    const today = new Date().toLocaleDateString("bg-BG", { weekday: "long", day: "numeric", month: "long" });

    return (
        <div className="pd-header">
            <button type="button" className="pd-hamburger" onClick={onToggleSidebar} aria-label="Меню">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <rect x="1" y="4"   width="16" height="1.8" rx="0.9" fill="currentColor" />
                    <rect x="1" y="8.1" width="16" height="1.8" rx="0.9" fill="currentColor" />
                    <rect x="1" y="12.2" width="16" height="1.8" rx="0.9" fill="currentColor" />
                </svg>
            </button>

            <div style={{ flex: 1, minWidth: 0 }}>
                <h1 className="pd-title">Продукти</h1>
                <div className="pd-header-sub body-sm text-gray">{today} · {PRODUCTS_STATS.totalProducts.toLocaleString()} продукта в базата</div>
            </div>

            <div className="pd-header-right">
                <button type="button" className="pd-scan-btn" onClick={onScan}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 7V5a2 2 0 0 1 2-2h2" /><path d="M17 3h2a2 2 0 0 1 2 2v2" />
                        <path d="M21 17v2a2 2 0 0 1-2 2h-2" /><path d="M7 21H5a2 2 0 0 1-2-2v-2" />
                        <line x1="7" y1="12" x2="17" y2="12" />
                    </svg>
                    Сканирай
                </button>
                <div className="pd-avatar">МИ</div>
            </div>
        </div>
    );
}
