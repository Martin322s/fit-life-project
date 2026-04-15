import type { JSX } from "react";
import { DIETS_DATA } from "./dietsData";

type DietsHeaderProps = { onToggleSidebar: () => void; onSwitchDiet: () => void };

export default function DietsHeader({ onToggleSidebar, onSwitchDiet }: DietsHeaderProps): JSX.Element {
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
                    <div className="dt-header-sub body-sm text-gray">
                        {DIETS_DATA.activeDiet.icon} {DIETS_DATA.activeDiet.nameLong} · ден {DIETS_DATA.activeDiet.daysOnPlan}
                    </div>
                </div>
            </div>
            <div className="dt-header-right">
                <div className="dt-streak">
                    <span>🔥</span>
                    <span className="body-sm" style={{ color: "var(--c-acid,#C8FF00)", fontWeight: 600 }}>{DIETS_DATA.user.streak} дни</span>
                </div>
                <button type="button" className="btn-primary btn-sm" onClick={onSwitchDiet}>⇄ Смени диета</button>
                <div className="dt-avatar">{DIETS_DATA.user.initials}</div>
            </div>
        </div>
    );
}
