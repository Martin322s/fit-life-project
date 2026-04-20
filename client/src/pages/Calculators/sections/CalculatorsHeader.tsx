import type { JSX } from "react";

type Props = { onToggleSidebar: () => void };

export default function CalculatorsHeader({ onToggleSidebar }: Props): JSX.Element {
    const today = new Date().toLocaleDateString("bg-BG", {
        weekday: "long",
        day: "numeric",
        month: "long",
    });

    return (
        <div className="cx-header">
            <button type="button" className="cx-hamburger" onClick={onToggleSidebar} aria-label="Меню">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <rect x="1" y="4" width="16" height="1.8" rx="0.9" fill="currentColor" />
                    <rect x="1" y="8.1" width="16" height="1.8" rx="0.9" fill="currentColor" />
                    <rect x="1" y="12.2" width="16" height="1.8" rx="0.9" fill="currentColor" />
                </svg>
            </button>

            <div style={{ flex: 1, minWidth: 0 }}>
                <h1 className="cx-title">Калкулатори</h1>
                <div className="cx-header-sub body-sm text-gray">{today} · health, nutrition и performance tools</div>
            </div>

            <div className="cx-header-right">
                <div className="cx-badge">
                    <span>10</span>
                    <span className="label">tools</span>
                </div>
                <div className="cx-avatar">МИ</div>
            </div>
        </div>
    );
}
