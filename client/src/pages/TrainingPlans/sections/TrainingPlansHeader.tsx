import type { JSX } from "react";
import { TRAINING_DATA } from "./trainingPlansData";

type Props = { onToggleSidebar: () => void; onLogWorkout: () => void };

export default function TrainingPlansHeader({ onToggleSidebar, onLogWorkout }: Props): JSX.Element {
    const today = new Date().toLocaleDateString("bg-BG", { weekday: "long", day: "numeric", month: "long" });

    return (
        <div className="tp-header">
            <button type="button" className="tp-hamburger" onClick={onToggleSidebar} aria-label="Меню">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <rect x="1" y="4"  width="16" height="1.8" rx="0.9" fill="currentColor" />
                    <rect x="1" y="8.1" width="16" height="1.8" rx="0.9" fill="currentColor" />
                    <rect x="1" y="12.2" width="16" height="1.8" rx="0.9" fill="currentColor" />
                </svg>
            </button>

            <div style={{ flex: 1, minWidth: 0 }}>
                <h1 className="tp-title">Тренировъчни планове</h1>
                <div className="tp-header-sub body-sm text-gray" style={{ textTransform: "capitalize" }}>{today} · седмица {TRAINING_DATA.activePlan.currentWeek} от {TRAINING_DATA.activePlan.durationWeeks}</div>
            </div>

            <div className="tp-header-right">
                <div className="tp-streak">
                    <span style={{ fontSize: "0.85rem" }}>🔥</span>
                    <span className="label" style={{ color: "var(--c-acid,#C8FF00)", fontWeight: 700 }}>{TRAINING_DATA.user.streak}</span>
                </div>
                <button type="button" className="btn-primary btn-sm" onClick={onLogWorkout}>+ Запиши</button>
                <div className="tp-avatar">{TRAINING_DATA.user.initials}</div>
            </div>
        </div>
    );
}
