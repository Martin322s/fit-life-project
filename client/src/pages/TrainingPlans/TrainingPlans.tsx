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

import "./TrainingPlans.css";

type TrainingPlansProps = { theme: "dark" | "light"; onToggleTheme: () => void };

function TrainingPlans({ theme, onToggleTheme }: TrainingPlansProps): JSX.Element {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const { stats } = TRAINING_DATA;
    const weekPct = Math.round((stats.sessionsThisWeek / stats.sessionsTarget) * 100);

    return (
        <>
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
