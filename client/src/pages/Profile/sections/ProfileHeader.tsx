import type { JSX } from "react";

type Props = { onToggleSidebar: () => void; onEditProfile: () => void };

export default function ProfileHeader({ onToggleSidebar, onEditProfile }: Props): JSX.Element {
    const today = new Date().toLocaleDateString("bg-BG", {
        weekday: "long",
        day: "numeric",
        month: "long",
    });

    return (
        <div className="pf-header">
            <button type="button" className="pf-hamburger" onClick={onToggleSidebar} aria-label="Меню">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <rect x="1" y="4" width="16" height="1.8" rx="0.9" fill="currentColor" />
                    <rect x="1" y="8.1" width="16" height="1.8" rx="0.9" fill="currentColor" />
                    <rect x="1" y="12.2" width="16" height="1.8" rx="0.9" fill="currentColor" />
                </svg>
            </button>

            <div style={{ flex: 1, minWidth: 0 }}>
                <h1 className="pf-title">Профил</h1>
                <div className="pf-header-sub body-sm text-gray">{today} · лични данни, цели и fit настройки</div>
            </div>

            <div className="pf-header-right">
                <button type="button" className="pf-edit-btn" onClick={onEditProfile}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 20h9" />
                        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
                    </svg>
                    <span>Редактирай</span>
                </button>
                <div className="pf-avatar">МИ</div>
            </div>
        </div>
    );
}
