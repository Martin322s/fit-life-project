import type { JSX } from "react";
import { CHALLENGE_STATS } from "./challengesData";

type Props = { onToggleSidebar: () => void; onCreateChallenge: () => void };

export default function ChallengesHeader({ onToggleSidebar, onCreateChallenge }: Props): JSX.Element {
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
                <div className="cg-header-sub body-sm text-gray">{today} · {CHALLENGE_STATS.liveNow} активни challenge-а</div>
            </div>

            <div className="cg-header-right">
                <button type="button" className="cg-action-btn" onClick={onCreateChallenge}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    <span>Нов challenge</span>
                </button>
                <div className="cg-avatar">МИ</div>
            </div>
        </div>
    );
}
