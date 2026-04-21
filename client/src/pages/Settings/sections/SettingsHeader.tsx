import type { JSX } from "react";

type Props = { onToggleSidebar: () => void };

export default function SettingsHeader({ onToggleSidebar }: Props): JSX.Element {
    const today = new Date().toLocaleDateString("bg-BG", {
        weekday: "long",
        day: "numeric",
        month: "long",
    });

    return (
        <div className="st-header">
            <button type="button" className="st-hamburger" onClick={onToggleSidebar} aria-label="Меню">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <rect x="1" y="4" width="16" height="1.8" rx="0.9" fill="currentColor" />
                    <rect x="1" y="8.1" width="16" height="1.8" rx="0.9" fill="currentColor" />
                    <rect x="1" y="12.2" width="16" height="1.8" rx="0.9" fill="currentColor" />
                </svg>
            </button>

            <div style={{ flex: 1, minWidth: 0 }}>
                <h1 className="st-title">Настройки</h1>
                <div className="st-header-sub body-sm text-gray">{today} · приложение, акаунт и поверителност</div>
            </div>

            <div className="st-header-right">
                <div className="st-badge">
                    <span>FitLife</span>
                    <span className="label">control</span>
                </div>
                <div className="st-avatar">МИ</div>
            </div>
        </div>
    );
}
