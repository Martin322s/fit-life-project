import { useState } from "react";
import type { JSX } from "react";
import DashboardSidebar from "../../layout/DashboardLayout/DashboardSidebar";
import { CALORIES_DATA } from "./sections/caloriesData";
import CaloriesHeader from "./sections/CaloriesHeader";
import StatCard from "./sections/StatCard";
import EnergyFocusCard from "./sections/EnergyFocusCard";
import MealFlowCard from "./sections/MealFlowCard";
import MacroCard from "./sections/MacroCard";
import WeeklyTrendCard from "./sections/WeeklyTrendCard";
import QualityCard from "./sections/QualityCard";
import SourcesCard from "./sections/SourcesCard";
import TopFoodsCard from "./sections/TopFoodsCard";
import TimingCard from "./sections/TimingCard";
import SuggestionsCard from "./sections/SuggestionsCard";
import HabitsCard from "./sections/HabitsCard";
import AddFoodModal from "./sections/AddFoodModal";

type CaloriesProps = { theme: "dark" | "light"; onToggleTheme: () => void };

const CALORIES_CSS = `
.dash-sidebar { position: sticky; top: 0; height: 100vh; overflow-y: auto; flex-shrink: 0; }
.dash-sidebar-close { display: none !important; }
.cal-page { display: flex; min-height: 100vh; background: var(--c-bg,#080C10); overflow-x: clip; }
.cal-main { flex: 1; min-width: 0; display: flex; flex-direction: column; overflow: auto; overflow-x: hidden; }
.cal-content { padding: var(--sp-5) var(--sp-6); display: flex; flex-direction: column; gap: var(--sp-4); }
.cal-header { padding: var(--sp-4) var(--sp-6); border-bottom: 1px solid var(--c-border,rgba(255,255,255,0.06)); display: flex; justify-content: space-between; align-items: center; gap: var(--sp-3); background: var(--c-surface-1,#0E1318); }
.cal-header-right { display: flex; align-items: center; gap: var(--sp-3); flex-shrink: 0; }
.cal-streak { display: flex; align-items: center; gap: var(--sp-2); padding: var(--sp-2) var(--sp-3); border-radius: var(--r-full); background: rgba(200,255,0,0.08); border: 1px solid rgba(200,255,0,0.2); }
.cal-avatar { width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg,var(--c-electric,#0066FF),var(--c-acid,#C8FF00)); display: flex; align-items: center; justify-content: center; font-family: var(--font-display); font-size: 0.8rem; font-weight: 700; color: var(--c-bg,#080C10); flex-shrink: 0; }
.cal-hamburger { display: none; }
.cal-top-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: var(--sp-3); }
.cal-hero-grid { display: grid; grid-template-columns: 1.45fr 1fr; gap: var(--sp-4); }
.cal-bottom-grid { display: grid; grid-template-columns: 1.2fr .8fr; gap: var(--sp-4); }
.cal-three-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: var(--sp-4); }
.cal-two-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--sp-4); }
.cal-card { padding: var(--sp-5); }
.cal-pill { padding: 6px 10px; border-radius: 999px; font-size: 0.72rem; letter-spacing: 0.04em; font-weight: 700; }
.cal-energy-inner { display: grid; grid-template-columns: minmax(0,320px) 1fr; gap: var(--sp-5); align-items: center; }
.cal-energy-ring { position: relative; width: 100%; max-width: 220px; margin: 0 auto; }
.cal-energy-ring svg { display: block; width: 100%; height: auto; }
.cal-energy-overlay { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; flex-direction: column; text-align: center; pointer-events: none; }
.cal-quality-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--sp-3); }
@media (max-width: 1250px) {
  .cal-top-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .cal-hero-grid, .cal-bottom-grid, .cal-three-grid, .cal-two-grid { grid-template-columns: 1fr; }
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
  .cal-hamburger {
    display: flex; align-items: center; justify-content: center;
    background: transparent; border: 1px solid rgba(255,255,255,0.1);
    border-radius: 8px; padding: 8px 10px; cursor: pointer;
    color: var(--color-cream); flex-shrink: 0;
  }
  .cal-header { padding: var(--sp-3) var(--sp-4); }
  .cal-content { padding: var(--sp-3) var(--sp-4); }
  .cal-top-grid { grid-template-columns: 1fr 1fr; }
  .cal-streak { display: none; }
  .cal-avatar { display: none; }
  .cal-energy-inner { grid-template-columns: 1fr; }
  .cal-energy-ring { max-width: 180px; }
  .cal-quality-grid { grid-template-columns: 1fr; }
}
@media (max-width: 480px) {
  .cal-top-grid { grid-template-columns: 1fr; }
  .cal-card { padding: var(--sp-4); }
}
`;

function Calories({ theme, onToggleTheme }: CaloriesProps): JSX.Element {
    const { target, eaten, burned, tdee, plannedDinner } = CALORIES_DATA.budget;
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [showAddFood, setShowAddFood] = useState(false);
    const remaining = target - eaten;
    const net = eaten - burned;

    return (
        <>
            <style>{CALORIES_CSS}</style>
            {showAddFood && <AddFoodModal onClose={() => setShowAddFood(false)} />}
            {isSidebarOpen && (
                <div
                    style={{ position: "fixed", inset: 0, zIndex: 299, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)", cursor: "pointer" }}
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
            <div className="cal-page">
                <DashboardSidebar theme={theme} onToggleTheme={onToggleTheme} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
                <div className="cal-main">
                    <CaloriesHeader
                        onToggleSidebar={() => setIsSidebarOpen((open) => !open)}
                        onAddFood={() => setShowAddFood(true)}
                    />
                    <div className="cal-content">
                        <div className="cal-top-grid">
                            <StatCard label="Остават днес" value={`${remaining} kcal`} sub="Буферът преди вечеря е здрав и контролируем." accent="в рамка" />
                            <StatCard label="Нетни калории" value={`${net} kcal`} sub={`Изядени ${eaten} минус изгорени ${burned}.`} />
                            <StatCard label="TDEE контекст" value={`${tdee} kcal`} sub="Поддържащият разход дава ориентир за дефицита." />
                            <StatCard label="Планирана вечеря" value={`${plannedDinner} kcal`} sub="Съобразена с целта и останалите макроси." />
                        </div>
                        <div className="cal-hero-grid">
                            <EnergyFocusCard />
                            <MacroCard />
                        </div>
                        <div className="cal-bottom-grid">
                            <MealFlowCard />
                            <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
                                <SuggestionsCard />
                                <HabitsCard />
                            </div>
                        </div>
                        <div className="cal-two-grid">
                            <WeeklyTrendCard />
                            <QualityCard />
                        </div>
                        <div className="cal-three-grid">
                            <SourcesCard />
                            <TopFoodsCard />
                            <TimingCard />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Calories;
