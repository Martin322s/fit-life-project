import type { JSX } from "react";
import { CALORIES_DATA } from "./caloriesData";

type CaloriesHeaderProps = { onToggleSidebar: () => void; onAddFood: () => void };

export default function CaloriesHeader({ onToggleSidebar, onAddFood }: CaloriesHeaderProps): JSX.Element {
    const today = new Date().toLocaleDateString("bg-BG", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
    return (
        <div className="cal-header">
            <div style={{ display: "flex", alignItems: "center", gap: "var(--sp-3)", minWidth: 0, flex: 1 }}>
                <button type="button" className="cal-hamburger" onClick={onToggleSidebar} aria-label="Навигация">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
                        <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
                    </svg>
                </button>
                <div style={{ minWidth: 0, flex: 1 }}>
                    <h1 className="cal-title">Калории и хранене</h1>
                    <div className="cal-header-sub body-sm text-gray">{today}</div>
                </div>
            </div>
            <div className="cal-header-right">
                <div className="cal-streak">
                    <span>🔥</span>
                    <span className="body-sm" style={{ color: "var(--c-acid,#C8FF00)", fontWeight: 600 }}>{CALORIES_DATA.user.streak} дни серия</span>
                </div>
                <button type="button" className="btn-primary btn-sm" onClick={onAddFood}>+ Добави храна</button>
                <div className="cal-avatar">{CALORIES_DATA.user.initials}</div>
            </div>
        </div>
    );
}
