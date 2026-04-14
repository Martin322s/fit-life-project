import type { JSX } from "react";
import { WEIGHT_DATA } from "./weightData";

type WeightHeaderProps = { onToggleSidebar: () => void; onLogWeight: () => void };

export default function WeightHeader({ onToggleSidebar, onLogWeight }: WeightHeaderProps): JSX.Element {
    const today = new Date().toLocaleDateString("bg-BG", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
    return (
        <div className="wt-header">
            <div style={{ display: "flex", alignItems: "center", gap: "var(--sp-3)", minWidth: 0, flex: 1 }}>
                <button type="button" className="wt-hamburger" onClick={onToggleSidebar} aria-label="Навигация">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
                        <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
                    </svg>
                </button>
                <div style={{ minWidth: 0, flex: 1 }}>
                    <h1 className="wt-title">Проследяване на тегло</h1>
                    <div className="wt-header-sub body-sm text-gray">
                        {today} · последно: {WEIGHT_DATA.stats.lastLogged}
                    </div>
                </div>
            </div>
            <div className="wt-header-right">
                <div className="wt-streak">
                    <span>🔥</span>
                    <span className="body-sm" style={{ color: "var(--c-acid,#C8FF00)", fontWeight: 600 }}>{WEIGHT_DATA.user.streak} дни серия</span>
                </div>
                <button type="button" className="btn-primary btn-sm" onClick={onLogWeight}>+ Запиши тегло</button>
                <div className="wt-avatar">{WEIGHT_DATA.user.initials}</div>
            </div>
        </div>
    );
}
