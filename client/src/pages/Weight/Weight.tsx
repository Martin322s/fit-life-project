import { useState } from "react";
import type { JSX } from "react";
import DashboardSidebar from "../../layout/DashboardLayout/DashboardSidebar";
import { WEIGHT_DATA } from "./sections/weightData";
import WeightHeader from "./sections/WeightHeader";
import WeightStatCard from "./sections/WeightStatCard";
import WeightChartCard from "./sections/WeightChartCard";
import ProgressCard from "./sections/ProgressCard";
import TrendInsightsCard from "./sections/TrendInsightsCard";
import MeasurementsCard from "./sections/MeasurementsCard";
import BmiCard from "./sections/BmiCard";
import ConsistencyCard from "./sections/ConsistencyCard";
import HistoryCard from "./sections/HistoryCard";
import LogWeightModal from "./sections/LogWeightModal";

type WeightProps = { theme: "dark" | "light"; onToggleTheme: () => void };

const WEIGHT_CSS = `
.dash-sidebar { position: sticky; top: 0; height: 100vh; overflow-y: auto; flex-shrink: 0; }
.dash-sidebar-close { display: none !important; }
.wt-page { display: flex; min-height: 100vh; background: var(--c-bg,#080C10); overflow-x: clip; }
.wt-main { flex: 1; min-width: 0; display: flex; flex-direction: column; overflow: auto; overflow-x: hidden; }
.wt-content { padding: var(--sp-5) var(--sp-6); display: flex; flex-direction: column; gap: var(--sp-4); }
.wt-header { padding: var(--sp-4) var(--sp-6); border-bottom: 1px solid var(--c-border,rgba(255,255,255,0.06)); display: flex; justify-content: space-between; align-items: center; gap: var(--sp-3); background: var(--c-surface-1,#0E1318); }
.wt-header-right { display: flex; align-items: center; gap: var(--sp-3); flex-shrink: 0; }
.wt-streak { display: flex; align-items: center; gap: var(--sp-2); padding: var(--sp-2) var(--sp-3); border-radius: var(--r-full); background: rgba(200,255,0,0.08); border: 1px solid rgba(200,255,0,0.2); }
.wt-avatar { width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg,var(--c-electric,#0066FF),var(--c-acid,#C8FF00)); display: flex; align-items: center; justify-content: center; font-family: var(--font-display); font-size: 0.8rem; font-weight: 700; color: var(--c-bg,#080C10); flex-shrink: 0; }
.wt-title { font-family: var(--font-display); font-size: 1.5rem; font-weight: 800; color: var(--color-cream); line-height: 1.15; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.wt-header-sub { margin-top: 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-transform: capitalize; }
.wt-hamburger { display: none; }
.wt-top-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: var(--sp-3); }
.wt-hero-grid { display: grid; grid-template-columns: 1.5fr 1fr; gap: var(--sp-4); }
.wt-three-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: var(--sp-4); }
.wt-two-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--sp-4); }
.wt-card { padding: var(--sp-5); }
.wt-pill { padding: 6px 10px; border-radius: 999px; font-size: 0.72rem; letter-spacing: 0.04em; font-weight: 700; }
@media (max-width: 1250px) {
  .wt-top-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .wt-hero-grid, .wt-three-grid, .wt-two-grid { grid-template-columns: 1fr; }
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
  .wt-hamburger {
    display: flex; align-items: center; justify-content: center;
    background: transparent; border: 1px solid rgba(255,255,255,0.1);
    border-radius: 8px; padding: 8px 10px; cursor: pointer;
    color: var(--color-cream); flex-shrink: 0;
  }
  .wt-header { padding: var(--sp-3) var(--sp-4); }
  .wt-content { padding: var(--sp-3) var(--sp-4); }
  .wt-top-grid { grid-template-columns: 1fr 1fr; }
  .wt-title { font-size: 1rem !important; }
  .wt-header-sub { display: none; }
  .wt-streak { display: none; }
  .wt-avatar { display: none; }
}
@media (max-width: 480px) {
  .wt-top-grid { grid-template-columns: 1fr; }
  .wt-card { padding: var(--sp-4); }
}
`;

function Weight({ theme, onToggleTheme }: WeightProps): JSX.Element {
    const { current, goal, start, bmi } = WEIGHT_DATA.stats;
    const { totalLost, remaining, weeklyAvgLoss } = WEIGHT_DATA.insights;
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <style>{WEIGHT_CSS}</style>
            {showModal && <LogWeightModal onClose={() => setShowModal(false)} />}
            {isSidebarOpen && (
                <div
                    style={{ position: "fixed", inset: 0, zIndex: 299, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)", cursor: "pointer" }}
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
            <div className="wt-page">
                <DashboardSidebar theme={theme} onToggleTheme={onToggleTheme} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
                <div className="wt-main">
                    <WeightHeader
                        onToggleSidebar={() => setIsSidebarOpen((o) => !o)}
                        onLogWeight={() => setShowModal(true)}
                    />
                    <div className="wt-content">

                        {/* Row 1 — 4 key stats */}
                        <div className="wt-top-grid">
                            <WeightStatCard
                                label="Текущо тегло"
                                value={`${current} кг`}
                                sub={`Последно: ${WEIGHT_DATA.stats.lastLogged}`}
                                trend="down"
                            />
                            <WeightStatCard
                                label="Свалени общо"
                                value={`${totalLost} кг`}
                                sub={`от начални ${start} кг`}
                                accent={`${WEIGHT_DATA.insights.percentComplete}%`}
                                accentColor="#00E676"
                            />
                            <WeightStatCard
                                label="Остават до цел"
                                value={`${remaining} кг`}
                                sub={`Цел: ${goal} кг · ${WEIGHT_DATA.stats.goalDate}`}
                                accentColor="var(--c-acid,#C8FF00)"
                            />
                            <WeightStatCard
                                label="ИТМ"
                                value={`${bmi}`}
                                sub="Наднормено тегло · при цел → Нормално"
                                accent={`${weeklyAvgLoss} кг/сед.`}
                                accentColor="var(--c-electric,#0066FF)"
                            />
                        </div>

                        {/* Row 2 — Main chart + Progress */}
                        <div className="wt-hero-grid">
                            <WeightChartCard />
                            <ProgressCard />
                        </div>

                        {/* Row 3 — Insights / Measurements / Consistency */}
                        <div className="wt-three-grid">
                            <TrendInsightsCard />
                            <MeasurementsCard />
                            <ConsistencyCard />
                        </div>

                        {/* Row 4 — BMI + History */}
                        <div className="wt-two-grid">
                            <BmiCard />
                            <HistoryCard />
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}

export default Weight;
