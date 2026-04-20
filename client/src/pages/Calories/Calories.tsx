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

import "./Calories.css";

type CaloriesProps = { theme: "dark" | "light"; onToggleTheme: () => void };

function Calories({ theme, onToggleTheme }: CaloriesProps): JSX.Element {
    const { target, eaten, burned, tdee, plannedDinner } = CALORIES_DATA.budget;
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [showAddFood, setShowAddFood] = useState(false);
    const remaining = target - eaten;
    const net = eaten - burned;

    return (
        <>
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
