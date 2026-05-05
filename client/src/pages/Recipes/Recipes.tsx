import { useMemo, useState } from "react";
import type { JSX } from "react";
import DashboardSidebar from "../../layout/DashboardLayout/DashboardSidebar";
import { getInitials, useAuth } from "../../context/AuthContext";
import { useRecipesData } from "../../hooks/useRecipesData";
import useLocalStorageState from "../../hooks/useLocalStorageState";
import { recipesApi } from "../../services/recipesApi";
import type { ApiRecipe } from "../../services/recipesApi";
import RecipesHeader from "./sections/RecipesHeader";
import RecipesStatCard from "./sections/RecipesStatCard";
import FeaturedRecipeCard from "./sections/FeaturedRecipeCard";
import RecipeGridCard from "./sections/RecipeGridCard";
import AddRecipeModal from "./sections/AddRecipeModal";
import RecipeDetailsModal from "./sections/RecipeDetailsModal";
import SavedRecipesSection from "./sections/SavedRecipesSection";

import "./Recipes.css";

type RecipesProps = { theme: "dark" | "light"; onToggleTheme: () => void };

function Recipes({ theme, onToggleTheme }: RecipesProps): JSX.Element {
    const { user } = useAuth();
    const data = useRecipesData();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedRecipe, setSelectedRecipe] = useState<ApiRecipe | null>(null);
    const [savedIds, setSavedIds] = useLocalStorageState<string[]>(`fitlife-saved-recipes-${user?.id ?? "guest"}`, []);

    const isAdmin = user?.role === "admin";
    const initials = user ? getInitials(user) : "FL";
    const avgProtein = data.items.length
        ? Math.round(data.items.reduce((sum, recipe) => sum + recipe.protein, 0) / data.items.length)
        : 0;
    const fastRecipes = data.items.filter((recipe) => recipe.prepMinutes <= 15).length;
    const visibleSavedCount = data.items.filter((recipe) => savedIds.includes(recipe.id)).length;

    const savedIdsSet = useMemo(() => new Set(savedIds), [savedIds]);

    const handleToggleSave = (recipe: ApiRecipe) => {
        setSavedIds((current) =>
            current.includes(recipe.id)
                ? current.filter((id) => id !== recipe.id)
                : [recipe.id, ...current],
        );
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Сигурен ли си, че искаш да изтриеш тази рецепта?")) return;
        try {
            await recipesApi.delete(id);
            setSavedIds((current) => current.filter((recipeId) => recipeId !== id));
            setSelectedRecipe(null);
            data.refresh();
        } catch (err) {
            console.error("Delete recipe failed:", err);
        }
    };

    return (
        <>
            {showModal && <AddRecipeModal onClose={() => setShowModal(false)} onSuccess={data.refresh} />}
            {selectedRecipe && (
                <RecipeDetailsModal
                    recipe={selectedRecipe}
                    isAdmin={isAdmin}
                    isSaved={savedIdsSet.has(selectedRecipe.id)}
                    onClose={() => setSelectedRecipe(null)}
                    onDelete={handleDelete}
                    onToggleSave={handleToggleSave}
                />
            )}
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
                        initials={initials}
                        total={data.total}
                        isAdmin={isAdmin}
                        onToggleSidebar={() => setIsSidebarOpen((o) => !o)}
                        onAddRecipe={() => setShowModal(true)}
                    />
                    <div className="rc-content">
                        {data.error && (
                            <div style={{ padding: "var(--sp-3) var(--sp-4)", borderRadius: "var(--r-md)", background: "rgba(255,61,87,0.1)", border: "1px solid rgba(255,61,87,0.25)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--sp-3)" }}>
                                <span className="body-sm" style={{ color: "var(--c-error,#FF3D57)" }}>Грешка при зареждане: {data.error}</span>
                                <button type="button" className="btn-ghost btn-sm" onClick={data.refresh}>Опитай отново</button>
                            </div>
                        )}

                        <div className="rc-top-grid">
                            <RecipesStatCard label="Общо рецепти" value={data.isLoading ? "—" : String(data.total)} sub="глобален каталог" accent={`${data.limit}/стр.`} accentColor="var(--c-electric,#0066FF)" />
                            <RecipesStatCard label="Запазени" value={String(savedIds.length)} sub={`${visibleSavedCount} на текущата страница`} accent="♥" accentColor="#FF6B35" />
                            <RecipesStatCard label="Среден протеин" value={data.isLoading ? "—" : `${avgProtein} г`} sub="за текущата страница" accent="П" accentColor="var(--c-electric,#0066FF)" />
                            <RecipesStatCard label="Бързи рецепти" value={data.isLoading ? "—" : String(fastRecipes)} sub="до 15 минути тук" accent="⏱" accentColor="rgba(255,255,255,0.4)" />
                        </div>

                        <div className="rc-hero-grid">
                            <FeaturedRecipeCard recipe={data.items[0] ?? null} isLoading={data.isLoading} onOpen={setSelectedRecipe} />
                            <SavedRecipesSection
                                recipes={data.items}
                                savedIds={savedIds}
                                onOpen={setSelectedRecipe}
                                onToggleSave={handleToggleSave}
                            />
                        </div>

                        <RecipeGridCard
                            recipes={data.items}
                            isLoading={data.isLoading}
                            total={data.total}
                            page={data.page}
                            totalPages={data.totalPages}
                            search={data.search}
                            savedIds={savedIds}
                            onSearch={data.setSearch}
                            onPage={data.setPage}
                            onOpen={setSelectedRecipe}
                            onToggleSave={handleToggleSave}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

export default Recipes;
