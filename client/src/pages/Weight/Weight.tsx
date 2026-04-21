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

import "./Weight.css";

type WeightProps = { theme: "dark" | "light"; onToggleTheme: () => void };

function Weight({ theme, onToggleTheme }: WeightProps): JSX.Element {
    const { current, goal, start, bmi } = WEIGHT_DATA.stats;
    const { totalLost, remaining, weeklyAvgLoss } = WEIGHT_DATA.insights;
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);

    return (
        <>
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
