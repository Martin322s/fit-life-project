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

type RecipesProps = { theme: "dark" | "light"; onToggleTheme: () => void };

const RECIPES_CSS = `
.dash-sidebar { position: sticky; top: 0; height: 100vh; overflow-y: auto; flex-shrink: 0; }
.dash-sidebar-close { display: none !important; }
.rc-page { display: flex; min-height: 100vh; background: var(--c-bg,#080C10); overflow-x: clip; }
.rc-main { flex: 1; min-width: 0; display: flex; flex-direction: column; overflow: auto; overflow-x: hidden; }
.rc-content { padding: var(--sp-5) var(--sp-6); display: flex; flex-direction: column; gap: var(--sp-4); }
.rc-header { padding: var(--sp-4) var(--sp-6); border-bottom: 1px solid var(--c-border,rgba(255,255,255,0.06)); display: flex; justify-content: space-between; align-items: center; gap: var(--sp-3); background: var(--c-surface-1,#0E1318); }
.rc-header-right { display: flex; align-items: center; gap: var(--sp-3); flex-shrink: 0; }
.rc-streak { display: flex; align-items: center; gap: var(--sp-2); padding: var(--sp-2) var(--sp-3); border-radius: var(--r-full); background: rgba(200,255,0,0.08); border: 1px solid rgba(200,255,0,0.2); }
.rc-avatar { width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg,var(--c-electric,#0066FF),var(--c-acid,#C8FF00)); display: flex; align-items: center; justify-content: center; font-family: var(--font-display); font-size: 0.8rem; font-weight: 700; color: var(--c-bg,#080C10); flex-shrink: 0; }
.rc-hamburger { display: none; }
.rc-title { font-family: var(--font-display); font-size: 1.5rem; font-weight: 800; color: var(--color-cream); line-height: 1.15; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.rc-header-sub { margin-top: 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.rc-top-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: var(--sp-3); }
.rc-hero-grid { display: grid; grid-template-columns: 1.5fr 1fr; gap: var(--sp-4); }
.rc-bottom-grid { display: grid; grid-template-columns: 1.3fr 1fr; gap: var(--sp-4); }
.rc-card { padding: var(--sp-5); }
.rc-pill { padding: 5px 10px; border-radius: 999px; font-size: 0.72rem; letter-spacing: 0.03em; font-weight: 700; }
.rc-recipe-grid { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: var(--sp-3); }
.rc-recipe-card { padding: 20px; }
.rc-featured-inner { display: grid; grid-template-columns: 1fr 1fr; gap: var(--sp-5); }
@media (max-width: 1250px) {
  .rc-top-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .rc-hero-grid, .rc-bottom-grid { grid-template-columns: 1fr; }
  .rc-recipe-grid { grid-template-columns: repeat(2, minmax(0,1fr)); }
  .rc-featured-inner { grid-template-columns: 1fr; }
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
  .rc-hamburger {
    display: flex; align-items: center; justify-content: center;
    background: transparent; border: 1px solid rgba(255,255,255,0.1);
    border-radius: 8px; padding: 8px 10px; cursor: pointer;
    color: var(--color-cream); flex-shrink: 0;
  }
  .rc-header { padding: var(--sp-3) var(--sp-4); }
  .rc-content { padding: var(--sp-3) var(--sp-4); }
  .rc-title { font-size: 1rem !important; }
  .rc-header-sub { display: none; }
  .rc-streak { display: none; }
  .rc-avatar { display: none; }
  .rc-top-grid { grid-template-columns: 1fr 1fr; }
  .rc-recipe-grid { grid-template-columns: 1fr; }
}
@media (max-width: 480px) {
  .rc-top-grid { grid-template-columns: 1fr; }
  .rc-card { padding: var(--sp-4); }
  .rc-recipe-card { padding: var(--sp-4); }
}
`;

function Recipes({ theme, onToggleTheme }: RecipesProps): JSX.Element {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [featuredAdded, setFeaturedAdded] = useState(false);

    const { stats } = RECIPES_DATA;

    return (
        <>
            <style>{RECIPES_CSS}</style>
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
                            <FeaturedRecipeCard onAddToLog={() => setFeaturedAdded(true)} />
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
