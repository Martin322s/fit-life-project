"use client";

import { useState } from "react";
import type { JSX } from "react";
import DashboardSidebar from "../../layout/DashboardLayout/DashboardSidebar";
import { useCaloriesData } from "../../hooks/useCaloriesData";
import { dashboardApi } from "../../services/dashboardApi";
import type { ApiMeal } from "../../services/dashboardApi";
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
import EditMealModal from "./sections/EditMealModal";

import "./Calories.css";

function Calories(): JSX.Element {
  const data = useCaloriesData();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showAddFood, setShowAddFood]     = useState(false);
  const [editMeal, setEditMeal]           = useState<ApiMeal | null>(null);

  const { todayCalories, goalCalories, remaining, tdee, isLoading, error } = data;

  const handleDelete = async (id: string) => {
    try {
      await dashboardApi.deleteMeal(id);
      data.refresh();
    } catch (err) {
      console.error("Delete meal failed:", err);
    }
  };

  return (
    <>
      {showAddFood && (
        <AddFoodModal
          onClose={() => setShowAddFood(false)}
          onSuccess={data.refresh}
        />
      )}
      {editMeal && (
        <EditMealModal
          meal={editMeal}
          onClose={() => setEditMeal(null)}
          onSuccess={data.refresh}
        />
      )}

      {isSidebarOpen && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 299, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)", cursor: "pointer" }}
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className="cal-page">
        <DashboardSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        <div className="cal-main">
          <CaloriesHeader
            onToggleSidebar={() => setIsSidebarOpen((open) => !open)}
            onAddFood={() => setShowAddFood(true)}
          />

          <div className="cal-content">
            {error && (
              <div style={{ padding: "var(--sp-3) var(--sp-4)", borderRadius: "var(--r-md)", background: "rgba(255,61,87,0.1)", border: "1px solid rgba(255,61,87,0.25)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--sp-3)" }}>
                <span className="body-sm" style={{ color: "var(--c-error,#FF3D57)" }}>Грешка при зареждане: {error}</span>
                <button type="button" className="btn-ghost btn-sm" onClick={data.refresh}>Опитай отново</button>
              </div>
            )}

            {/* Top stat row — real values */}
            <div className="cal-top-grid">
              <StatCard
                label="Остават днес"
                value={isLoading ? "—" : `${remaining} kcal`}
                sub={remaining > 0 ? "Буферът е здрав." : todayCalories === 0 ? "Още няма хранения." : "Надвишен дневен бюджет!"}
                accent={remaining > 0 ? "в рамка" : undefined}
              />
              <StatCard
                label="Изядени калории"
                value={isLoading ? "—" : `${todayCalories} kcal`}
                sub={`от ${goalCalories} kcal дневна цел`}
              />
              <StatCard
                label="TDEE контекст"
                value={isLoading ? "—" : tdee != null ? `${tdee} kcal` : "—"}
                sub={tdee != null ? "Изчислено от профила ти." : "Попълни профила за TDEE."}
              />
              {/* TODO(Stage 5): planned dinner concept — no API support yet */}
              <StatCard
                label="Дневна цел"
                value={isLoading ? "—" : `${goalCalories} kcal`}
                sub="От регистрационния профил."
              />
            </div>

            {/* Hero row: ring + macros */}
            <div className="cal-hero-grid">
              <EnergyFocusCard data={data} />
              <MacroCard data={data} />
            </div>

            {/* Meal list + suggestions */}
            <div className="cal-bottom-grid">
              <MealFlowCard
                meals={data.todayMeals}
                isLoading={isLoading}
                onEdit={(meal) => setEditMeal(meal)}
                onDelete={handleDelete}
              />
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
                <SuggestionsCard />
                <HabitsCard />
              </div>
            </div>

            {/* Charts — weekly still mocked (no per-day API), quality still mocked (no fiber/sodium) */}
            <div className="cal-two-grid">
              <WeeklyTrendCard />
              <QualityCard />
            </div>

            {/* Bottom cards: sources mocked, top foods + timing → real meals */}
            <div className="cal-three-grid">
              <SourcesCard />
              <TopFoodsCard meals={data.todayMeals} isLoading={isLoading} />
              <TimingCard meals={data.todayMeals} isLoading={isLoading} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Calories;


