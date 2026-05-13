import type { JSX } from "react";

type Props = {
    onToggleSidebar: () => void;
    onRefresh: () => void;
    liveNow: number;
    initials: string;
};

export default function ChallengesHeader({ onToggleSidebar, onRefresh, liveNow, initials }: Props): JSX.Element {
    const today = new Date().toLocaleDateString("bg-BG", {
        weekday: "long",
        day: "numeric",
        month: "long",
    });

    return (
        <div className="cg-header">
            <button type="button" className="cg-hamburger" onClick={onToggleSidebar} aria-label="Меню">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <rect x="1" y="4" width="16" height="1.8" rx="0.9" fill="currentColor" />
                    <rect x="1" y="8.1" width="16" height="1.8" rx="0.9" fill="currentColor" />
                    <rect x="1" y="12.2" width="16" height="1.8" rx="0.9" fill="currentColor" />
                </svg>
            </button>

            <div style={{ flex: 1, minWidth: 0 }}>
                <h1 className="cg-title">Предизвикателства</h1>
                <div className="cg-header-sub body-sm text-gray">{today} · {liveNow} активни участия</div>
            </div>

            <div className="cg-header-right">
                <button type="button" className="cg-action-btn" onClick={onRefresh}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="23 4 23 10 17 10" />
                        <polyline points="1 20 1 14 7 14" />
                        <path d="M3.51 9a9 9 0 0 1 14.13-3.36L23 10" />
                        <path d="M20.49 15a9 9 0 0 1-14.13 3.36L1 14" />
                    </svg>
                    <span>Обнови</span>
                </button>
                <div className="cg-avatar">{initials}</div>
            </div>
        </div>
    );
}
