import type { JSX } from "react";

type Props = {
    initials: string;
    total: number;
    isAdmin: boolean;
    onToggleSidebar: () => void;
    onAddRecipe: () => void;
};

export default function RecipesHeader({ initials, total, isAdmin, onToggleSidebar, onAddRecipe }: Props): JSX.Element {
    return (
        <div className="rc-header">
            <div style={{ display: "flex", alignItems: "center", gap: "var(--sp-3)", minWidth: 0, flex: 1 }}>
                <button type="button" className="rc-hamburger" onClick={onToggleSidebar} aria-label="Навигация">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
                        <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
                    </svg>
                </button>
                <div style={{ minWidth: 0, flex: 1 }}>
                    <h1 className="rc-title">Рецепти и хранене</h1>
                    <div className="rc-header-sub body-sm text-gray">{total} рецепти в каталога · видими за всички потребители</div>
                </div>
            </div>
            <div className="rc-header-right">
                {isAdmin && <button type="button" className="btn-primary btn-sm" onClick={onAddRecipe}>+ Нова рецепта</button>}
                <div className="rc-avatar">{initials}</div>
            </div>
        </div>
    );
}
