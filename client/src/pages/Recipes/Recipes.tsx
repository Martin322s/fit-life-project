import { useState } from "react";
import type { JSX } from "react";
import DashboardSidebar from "../../layout/DashboardLayout/DashboardSidebar";
import { RECIPES_DATA } from "./sections/recipesData";
import RecipesHeader from "./sections/RecipesHeader";
import RecipesStatCard from "./sections/RecipesStatCard";
import FeaturedRecipeCard from "./sections/FeaturedRecipeCard";
import NutritionSummaryCard from "./sections/NutritionSummaryCard";
import RecipeGridCard from "./sections/RecipeGridCard";
import MealPlanCard from "./sections/MealPlanCard";
import SavedRecipesCard from "./sections/SavedRecipesCard";
import AddRecipeModal from "./sections/AddRecipeModal";

import "./Recipes.css";

type RecipesProps = { theme: "dark" | "light"; onToggleTheme: () => void };

function Recipes({ theme, onToggleTheme }: RecipesProps): JSX.Element {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const { stats } = RECIPES_DATA;

    return (
        <>
            {showModal && <AddRecipeModal onClose={() => setShowModal(false)} />}
            {isSidebarOpen && (
                <div
                    style={{ position: "fixed", inset: 0, zIndex: 299, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)", cursor: "pointer" }}
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
            <div className="rc-page">
                <DashboardSidebar theme={theme} onToggleTheme={onToggleTheme} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
                <div className="rc-main">
                    <RecipesHeader
                        onToggleSidebar={() => setIsSidebarOpen((o) => !o)}
                        onAddRecipe={() => setShowModal(true)}
                    />
                    <div className="rc-content">

                        {/* Row 1 — 4 key stats */}
                        <div className="rc-top-grid">
                            <RecipesStatCard label="Рецепти за днес" value={String(stats.todayPlanned)} sub="планирани хранения за сряда" accent="3 от 4" accentColor="var(--c-electric,#0066FF)" />
                            <RecipesStatCard label="Калории от план" value={`${stats.todayCalories}`} sub="kcal от планираните рецепти" accent="77%" accentColor="#00E676" />
                            <RecipesStatCard label="Запазени рецепти" value={String(stats.savedCount)} sub="в личната библиотека" accent="♥" accentColor="#FF6B35" />
                            <RecipesStatCard label="Средно на рецепта" value={`${stats.avgCalPerRecipe}`} sub="kcal средна стойност" accent="kcal" accentColor="rgba(255,255,255,0.4)" />
                        </div>

                        {/* Row 2 — Featured recipe + Today's nutrition */}
                        <div className="rc-hero-grid">
                            <FeaturedRecipeCard onAddToLog={() => setShowModal(true)} />
                            <NutritionSummaryCard />
                        </div>

                        {/* Row 3 — Recipe grid with category filter */}
                        <RecipeGridCard />

                        {/* Row 4 — Meal plan + Saved */}
                        <div className="rc-bottom-grid">
                            <MealPlanCard />
                            <SavedRecipesCard />
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}

export default Recipes;
