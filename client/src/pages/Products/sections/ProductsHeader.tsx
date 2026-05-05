import type { JSX } from "react";

type Props = {
    initials: string;
    total: number;
    isAdmin: boolean;
    onToggleSidebar: () => void;
    onAddProduct: () => void;
};

export default function ProductsHeader({ initials, total, isAdmin, onToggleSidebar, onAddProduct }: Props): JSX.Element {
    return (
        <div className="pd-header">
            <button type="button" className="pd-hamburger" onClick={onToggleSidebar} aria-label="Меню">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <rect x="1" y="4" width="16" height="1.8" rx="0.9" fill="currentColor" />
                    <rect x="1" y="8.1" width="16" height="1.8" rx="0.9" fill="currentColor" />
                    <rect x="1" y="12.2" width="16" height="1.8" rx="0.9" fill="currentColor" />
                </svg>
            </button>
            <div style={{ flex: 1, minWidth: 0 }}>
                <h1 className="pd-title">Продукти</h1>
                <div className="pd-header-sub body-sm text-gray">{total} артикула в каталога · информационен преглед без поръчки</div>
            </div>
            <div className="pd-header-right">
                {isAdmin && <button type="button" className="btn-primary btn-sm" onClick={onAddProduct}>+ Нов продукт</button>}
                <div className="pd-avatar">{initials}</div>
            </div>
        </div>
    );
}
