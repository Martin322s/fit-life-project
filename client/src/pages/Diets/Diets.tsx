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

type DietsProps = { theme: "dark" | "light"; onToggleTheme: () => void };

const DIETS_CSS = `
.dash-sidebar { position: sticky; top: 0; height: 100vh; overflow-y: auto; flex-shrink: 0; }
.dash-sidebar-close { display: none !important; }
.dt-page { display: flex; min-height: 100vh; background: var(--c-bg,#080C10); overflow-x: clip; }
.dt-main { flex: 1; min-width: 0; display: flex; flex-direction: column; overflow: auto; overflow-x: hidden; }
.dt-content { padding: var(--sp-5) var(--sp-6); display: flex; flex-direction: column; gap: var(--sp-4); }
.dt-header { padding: var(--sp-4) var(--sp-6); border-bottom: 1px solid var(--c-border,rgba(255,255,255,0.06)); display: flex; justify-content: space-between; align-items: center; gap: var(--sp-3); background: var(--c-surface-1,#0E1318); }
.dt-header-right { display: flex; align-items: center; gap: var(--sp-3); flex-shrink: 0; }
.dt-streak { display: flex; align-items: center; gap: var(--sp-2); padding: var(--sp-2) var(--sp-3); border-radius: var(--r-full); background: rgba(200,255,0,0.08); border: 1px solid rgba(200,255,0,0.2); }
.dt-avatar { width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg,var(--c-electric,#0066FF),var(--c-acid,#C8FF00)); display: flex; align-items: center; justify-content: center; font-family: var(--font-display); font-size: 0.8rem; font-weight: 700; color: var(--c-bg,#080C10); flex-shrink: 0; }
.dt-hamburger { display: none; }
.dt-title { font-family: var(--font-display); font-size: 1.5rem; font-weight: 800; color: var(--color-cream); line-height: 1.15; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.dt-header-sub { margin-top: 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.dt-top-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: var(--sp-3); }
.dt-hero-grid { display: grid; grid-template-columns: 1.5fr 1fr; gap: var(--sp-4); }
.dt-mid-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: var(--sp-4); }
.dt-bottom-grid { display: grid; grid-template-columns: 1.3fr 1fr; gap: var(--sp-4); }
.dt-card { padding: var(--sp-5); width: 100%; max-width: 100%; overflow: hidden; }
.dt-pill { padding: 5px 10px; border-radius: 999px; font-size: 0.72rem; letter-spacing: 0.03em; font-weight: 700; }
.dt-diets-grid { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: var(--sp-3); }
.dt-active-inner { display: grid; grid-template-columns: 1fr 1fr; gap: var(--sp-4); }
.dt-content > *,
.dt-top-grid,
.dt-hero-grid,
.dt-mid-grid,
.dt-bottom-grid,
.dt-diets-grid,
.dt-active-inner { min-width: 0; width: 100%; }
@media (max-width: 1250px) {
  .dt-top-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .dt-hero-grid { grid-template-columns: 1fr; }
  .dt-mid-grid { grid-template-columns: 1fr 1fr; }
  .dt-bottom-grid { grid-template-columns: 1fr; }
  .dt-diets-grid { grid-template-columns: repeat(2, minmax(0,1fr)); }
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
  .dt-hamburger {
    display: flex; align-items: center; justify-content: center;
    background: transparent; border: 1px solid rgba(255,255,255,0.1);
    border-radius: 8px; padding: 8px 10px; cursor: pointer;
    color: var(--color-cream); flex-shrink: 0;
  }
  .dt-header { padding: var(--sp-3) var(--sp-4); }
  .dt-content { padding: var(--sp-3); }
  .dt-title { font-size: 1rem !important; }
  .dt-header-sub { display: none; }
  .dt-streak { display: none; }
  .dt-avatar { display: none; }
  .dt-top-grid { grid-template-columns: 1fr 1fr; }
  .dt-mid-grid { grid-template-columns: 1fr; }
  .dt-diets-grid { grid-template-columns: 1fr; }
  .dt-active-inner { grid-template-columns: 1fr; gap: var(--sp-3); }
}
@media (max-width: 480px) {
  .dt-top-grid { grid-template-columns: 1fr; }
  .dt-card { padding: var(--sp-4); }
}
`;

function Diets({ theme, onToggleTheme }: DietsProps): JSX.Element {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const { activeDiet } = DIETS_DATA;

    const daysLeft = activeDiet.durationWeeks * 7 - activeDiet.daysOnPlan;
    const weightLost = +(activeDiet.startWeight - activeDiet.currentWeight).toFixed(1);

    return (
        <>
            <style>{DIETS_CSS}</style>
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
