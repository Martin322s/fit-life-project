import { useState } from "react";
import type { JSX } from "react";
import DashboardSidebar from "../../layout/DashboardLayout/DashboardSidebar";
import { DIETS_DATA } from "./sections/dietsData";
import DietsHeader from "./sections/DietsHeader";
import DietsStatCard from "./sections/DietsStatCard";
import ActiveDietCard from "./sections/ActiveDietCard";
import MacroComplianceCard from "./sections/MacroComplianceCard";
import FoodGuideCard from "./sections/FoodGuideCard";
import DietCalendarCard from "./sections/DietCalendarCard";
import DietInsightsCard from "./sections/DietInsightsCard";
import AvailableDietsCard from "./sections/AvailableDietsCard";
import MealIdeasCard from "./sections/MealIdeasCard";
import SwitchDietModal from "./sections/SwitchDietModal";

import "./Diets.css";

type DietsProps = { theme: "dark" | "light"; onToggleTheme: () => void };

function Diets({ theme, onToggleTheme }: DietsProps): JSX.Element {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const { activeDiet } = DIETS_DATA;

    const daysLeft = activeDiet.durationWeeks * 7 - activeDiet.daysOnPlan;
    const weightLost = +(activeDiet.startWeight - activeDiet.currentWeight).toFixed(1);

    return (
        <>
            {showModal && <SwitchDietModal onClose={() => setShowModal(false)} />}
            {isSidebarOpen && (
                <div
                    style={{ position: "fixed", inset: 0, zIndex: 299, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)", cursor: "pointer" }}
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
            <div className="dt-page">
                <DashboardSidebar theme={theme} onToggleTheme={onToggleTheme} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
                <div className="dt-main">
                    <DietsHeader
                        onToggleSidebar={() => setIsSidebarOpen((o) => !o)}
                        onSwitchDiet={() => setShowModal(true)}
                    />
                    <div className="dt-content">

                        {/* Row 1 — 4 key stats */}
                        <div className="dt-top-grid">
                            <DietsStatCard label="Активна диета" value={activeDiet.name} sub="средиземноморска кухня" accent={activeDiet.icon} accentColor="var(--c-electric,#0066FF)" />
                            <DietsStatCard label="Спазване" value={`${activeDiet.compliancePct}%`} sub="последните 30 дни" accent="↑ 4%" accentColor="#00E676" />
                            <DietsStatCard label="Изгубено тегло" value={`${weightLost} кг`} sub={`от ${activeDiet.startWeight} кг начало`} accent="на план" accentColor="#00E676" />
                            <DietsStatCard label="Дни до края" value={String(daysLeft)} sub={`от ${activeDiet.durationWeeks * 7}-дневния план`} accent={`ден ${activeDiet.daysOnPlan}`} accentColor="#FFB300" />
                        </div>

                        {/* Row 2 — Active diet hero + Macro compliance */}
                        <div className="dt-hero-grid">
                            <ActiveDietCard onSwitch={() => setShowModal(true)} />
                            <MacroComplianceCard />
                        </div>

                        {/* Row 3 — Food guide + Calendar + Insights */}
                        <div className="dt-mid-grid">
                            <FoodGuideCard />
                            <DietCalendarCard />
                            <DietInsightsCard />
                        </div>

                        {/* Row 4 — Available diets + Meal ideas */}
                        <div className="dt-bottom-grid">
                            <AvailableDietsCard onSwitch={() => setShowModal(true)} />
                            <MealIdeasCard />
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}

export default Diets;
