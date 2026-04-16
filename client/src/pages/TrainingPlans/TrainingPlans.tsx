import { useState } from "react";
import type { JSX } from "react";
import DashboardSidebar from "../../layout/DashboardLayout/DashboardSidebar";
import { TRAINING_DATA } from "./sections/trainingPlansData";
import TrainingPlansHeader from "./sections/TrainingPlansHeader";
import TrainingStatCard from "./sections/TrainingStatCard";
import ActivePlanCard from "./sections/ActivePlanCard";
import WeeklyScheduleCard from "./sections/WeeklyScheduleCard";
import TodayWorkoutCard from "./sections/TodayWorkoutCard";
import StrengthProgressCard from "./sections/StrengthProgressCard";
import PersonalRecordsCard from "./sections/PersonalRecordsCard";
import AvailablePlansCard from "./sections/AvailablePlansCard";
import LogWorkoutModal from "./sections/LogWorkoutModal";

type TrainingPlansProps = { theme: "dark" | "light"; onToggleTheme: () => void };

const TP_CSS = `
.dash-sidebar { position: sticky; top: 0; height: 100vh; overflow-y: auto; flex-shrink: 0; }
.dash-sidebar-close { display: none !important; }
.tp-page { display: flex; min-height: 100vh; background: var(--c-bg,#080C10); overflow-x: clip; }
.tp-main { flex: 1; min-width: 0; display: flex; flex-direction: column; overflow: auto; overflow-x: hidden; }
.tp-content { padding: var(--sp-5) var(--sp-6); display: flex; flex-direction: column; gap: var(--sp-4); }
.tp-header { padding: var(--sp-4) var(--sp-6); border-bottom: 1px solid var(--c-border,rgba(255,255,255,0.06)); display: flex; justify-content: space-between; align-items: center; gap: var(--sp-3); background: var(--c-surface-1,#0E1318); }
.tp-header-right { display: flex; align-items: center; gap: var(--sp-3); flex-shrink: 0; }
.tp-streak { display: flex; align-items: center; gap: var(--sp-2); padding: var(--sp-2) var(--sp-3); border-radius: var(--r-full); background: rgba(200,255,0,0.08); border: 1px solid rgba(200,255,0,0.2); }
.tp-avatar { width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg,#6C5CE7,#A855F7); display: flex; align-items: center; justify-content: center; font-family: var(--font-display); font-size: 0.8rem; font-weight: 700; color: #fff; flex-shrink: 0; }
.tp-hamburger { display: none; }
.tp-title { font-family: var(--font-display); font-size: 1.5rem; font-weight: 800; color: var(--color-cream); line-height: 1.15; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.tp-header-sub { margin-top: 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.tp-top-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: var(--sp-3); }
.tp-hero-grid { display: grid; grid-template-columns: 1.5fr 1fr; gap: var(--sp-4); }
.tp-bottom-grid { display: grid; grid-template-columns: 1.4fr 1fr; gap: var(--sp-4); }
.tp-card { padding: var(--sp-5); }
.tp-pill { padding: 5px 10px; border-radius: 999px; font-size: 0.72rem; letter-spacing: 0.03em; font-weight: 700; }
.tp-active-inner { display: grid; grid-template-columns: 1fr 1fr; gap: var(--sp-4); }
.tp-plans-grid { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: var(--sp-3); }
.tp-exercise-table { display: flex; flex-direction: column; gap: var(--sp-2); }
.tp-ex-row { display: grid; grid-template-columns: 1fr 48px 72px 80px 48px; gap: var(--sp-2); align-items: center; padding: var(--sp-3) var(--sp-4); border-radius: var(--r-lg); border: 1px solid var(--c-border,rgba(255,255,255,0.06)); }
.tp-ex-header { background: transparent !important; border-color: transparent !important; padding-bottom: 0; }
@media (max-width: 1250px) {
  .tp-top-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .tp-hero-grid { grid-template-columns: 1fr; }
  .tp-bottom-grid { grid-template-columns: 1fr; }
  .tp-plans-grid { grid-template-columns: repeat(2, minmax(0,1fr)); }
}
@media (max-width: 768px) {
  .dash-sidebar {
    position: fixed; left: 0; top: 0; bottom: 0; height: 100%;
    z-index: 300; transform: translateX(-100%);
    transition: transform 0.28s cubic-bezier(0.4,0,0.2,1);
  }
  .dash-sidebar.dash-sidebar--open {
    transform: translateX(0);
    box-shadow: 8px 0 48px rgba(0,0,0,0.85);
  }
  .dash-sidebar-close { display: flex !important; }
  .tp-hamburger {
    display: flex; align-items: center; justify-content: center;
    background: transparent; border: 1px solid rgba(255,255,255,0.1);
    border-radius: 8px; padding: 8px 10px; cursor: pointer;
    color: var(--color-cream); flex-shrink: 0;
  }
  .tp-header { padding: var(--sp-3) var(--sp-4); }
  .tp-content { padding: var(--sp-3) var(--sp-4); }
  .tp-title { font-size: 1rem !important; }
  .tp-header-sub { display: none; }
  .tp-streak { display: none; }
  .tp-avatar { display: none; }
  .tp-top-grid { grid-template-columns: 1fr 1fr; }
  .tp-active-inner { grid-template-columns: 1fr 1fr; gap: var(--sp-3); }
  .tp-plans-grid { grid-template-columns: 1fr; }
  .tp-ex-row { grid-template-columns: 1fr 40px 60px 70px 40px; gap: var(--sp-1); padding: var(--sp-2) var(--sp-3); }
}
@media (max-width: 480px) {
  .tp-top-grid { grid-template-columns: 1fr; }
  .tp-card { padding: var(--sp-4); }
  .tp-ex-row { grid-template-columns: 1fr 36px 52px 64px 36px; }
}
`;

function TrainingPlans({ theme, onToggleTheme }: TrainingPlansProps): JSX.Element {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const { stats, activePlan } = TRAINING_DATA;
    const weekPct = Math.round((stats.sessionsThisWeek / stats.sessionsTarget) * 100);

    return (
        <>
            <style>{TP_CSS}</style>
            {showModal && <LogWorkoutModal onClose={() => setShowModal(false)} />}
            {isSidebarOpen && (
                <div
                    style={{ position: "fixed", inset: 0, zIndex: 299, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)", cursor: "pointer" }}
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
            <div className="tp-page">
                <DashboardSidebar theme={theme} onToggleTheme={onToggleTheme} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
                <div className="tp-main">
                    <TrainingPlansHeader
                        onToggleSidebar={() => setIsSidebarOpen((o) => !o)}
                        onLogWorkout={() => setShowModal(true)}
                    />
                    <div className="tp-content">

                        {/* Row 1 — 4 stat cards */}
                        <div className="tp-top-grid">
                            <TrainingStatCard label="Тренировки тази сед." value={`${stats.sessionsThisWeek}/${stats.sessionsTarget}`} sub="изпълнени сесии" accent={`${weekPct}%`} accentColor="#00E676" />
                            <TrainingStatCard label="Обем тази седмица" value={`${(stats.volumeThisWeek / 1000).toFixed(1)}т`} sub="общо вдигнати кг" accent="↑ 8%" accentColor="#00E676" />
                            <TrainingStatCard label="Активна серия" value={`${stats.streak}д`} sub="без пропуснати сесии" accent="🔥" accentColor="var(--c-acid,#C8FF00)" />
                            <TrainingStatCard label="Общо сесии" value={String(stats.totalSessions)} sub={`средно ${stats.avgDurationMin} мин.`} accent={`${stats.personalRecords} PR`} accentColor="#FFB300" />
                        </div>

                        {/* Row 2 — Active plan + Weekly schedule */}
                        <div className="tp-hero-grid">
                            <ActivePlanCard onSwitch={() => setShowModal(false)} />
                            <WeeklyScheduleCard />
                        </div>

                        {/* Row 3 — Today's workout (full width) */}
                        <TodayWorkoutCard />

                        {/* Row 4 — Strength progress + PRs */}
                        <div className="tp-bottom-grid">
                            <StrengthProgressCard />
                            <PersonalRecordsCard />
                        </div>

                        {/* Row 5 — Available plans */}
                        <AvailablePlansCard onSwitch={() => setShowModal(true)} />

                    </div>
                </div>
            </div>
        </>
    );
}

export default TrainingPlans;
