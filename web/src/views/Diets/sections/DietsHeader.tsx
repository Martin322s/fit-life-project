import type { JSX } from "react";

type Props = {
    initials: string;
    total: number;
    isAdmin: boolean;
    onToggleSidebar: () => void;
    onAddDiet: () => void;
};

export default function DietsHeader({ initials, total, isAdmin, onToggleSidebar, onAddDiet }: Props): JSX.Element {
    return (
        <div className="dt-header">
            <div style={{ display: "flex", alignItems: "center", gap: "var(--sp-3)", minWidth: 0, flex: 1 }}>
                <button type="button" className="dt-hamburger" onClick={onToggleSidebar} aria-label="Навигация">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
                        <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
                    </svg>
                </button>
                <div style={{ minWidth: 0, flex: 1 }}>
                    <h1 className="dt-title">Диети и хранителни планове</h1>
                    <div className="dt-header-sub body-sm text-gray">{total} плана в каталога · видими за всички потребители</div>
                </div>
            </div>
            <div className="dt-header-right">
                {isAdmin && <button type="button" className="btn-primary btn-sm" onClick={onAddDiet}>+ Нова диета</button>}
                <div className="dt-avatar">{initials}</div>
            </div>
        </div>
    );
}
