import type { JSX } from "react";
import { RECIPES_DATA } from "./recipesData";

type RecipesHeaderProps = { onToggleSidebar: () => void; onAddRecipe: () => void };

export default function RecipesHeader({ onToggleSidebar, onAddRecipe }: RecipesHeaderProps): JSX.Element {
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
                    <div className="rc-header-sub body-sm text-gray">{RECIPES_DATA.stats.savedCount} запазени рецепти · план за цялата седмица</div>
                </div>
            </div>
            <div className="rc-header-right">
                <div className="rc-streak">
                    <span>🔥</span>
                    <span className="body-sm" style={{ color: "var(--c-acid,#C8FF00)", fontWeight: 600 }}>{RECIPES_DATA.user.streak} дни серия</span>
                </div>
                <button type="button" className="btn-primary btn-sm" onClick={onAddRecipe}>+ Нова рецепта</button>
                <div className="rc-avatar">{RECIPES_DATA.user.initials}</div>
            </div>
        </div>
    );
}
