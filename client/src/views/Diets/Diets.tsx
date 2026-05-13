"use client";

import { useState } from "react";
import type { JSX } from "react";
import DashboardSidebar from "../../layout/DashboardLayout/DashboardSidebar";
import { getInitials, useAuth } from "../../context/AuthContext";
import { useDietsData } from "../../hooks/useDietsData";
import { dietsApi } from "../../services/dietsApi";
import type { ApiDiet } from "../../services/dietsApi";
import DietsHeader from "./sections/DietsHeader";
import DietsStatCard from "./sections/DietsStatCard";
import DietsGridCard from "./sections/DietsGridCard";
import DietDetailsModal from "./sections/DietDetailsModal";
import AddDietModal from "./sections/AddDietModal";
import { dietCategoryLabel, dietGoalLabel } from "../../lib/dietLabels";

import "./Diets.css";

function Diets(): JSX.Element {
    const { user } = useAuth();
    const data = useDietsData();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedDiet, setSelectedDiet] = useState<ApiDiet | null>(null);

    const isAdmin = user?.role === "admin";
    const initials = user ? getInitials(user) : "FL";
    const avgCalories = data.items.length ? Math.round(data.items.reduce((sum, diet) => sum + diet.caloriesPerDay, 0) / data.items.length) : 0;
    const avgProtein = data.items.length ? Math.round(data.items.reduce((sum, diet) => sum + diet.proteinTarget, 0) / data.items.length) : 0;
    const firstDiet = data.items[0] ?? null;

    const handleDelete = async (id: string) => {
        if (!window.confirm("Сигурен ли си, че искаш да изтриеш тази диета?")) return;
        try {
            await dietsApi.delete(id);
            setSelectedDiet(null);
            data.refresh();
        } catch (err) {
            console.error("Delete diet failed:", err);
        }
    };

    return (
        <>
            {showModal && <AddDietModal onClose={() => setShowModal(false)} onSuccess={data.refresh} />}
            {selectedDiet && <DietDetailsModal diet={selectedDiet} isAdmin={isAdmin} onClose={() => setSelectedDiet(null)} onDelete={handleDelete} />}
            {isSidebarOpen && (
                <div
                    style={{ position: "fixed", inset: 0, zIndex: 299, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)", cursor: "pointer" }}
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
            <div className="dt-page">
                <DashboardSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
                <div className="dt-main">
                    <DietsHeader
                        initials={initials}
                        total={data.total}
                        isAdmin={isAdmin}
                        onToggleSidebar={() => setIsSidebarOpen((o) => !o)}
                        onAddDiet={() => setShowModal(true)}
                    />
                    <div className="dt-content">
                        {data.error && (
                            <div style={{ padding: "var(--sp-3) var(--sp-4)", borderRadius: "var(--r-md)", background: "rgba(255,61,87,0.1)", border: "1px solid rgba(255,61,87,0.25)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--sp-3)" }}>
                                <span className="body-sm" style={{ color: "var(--c-error,#FF3D57)" }}>Грешка при зареждане: {data.error}</span>
                                <button type="button" className="btn-ghost btn-sm" onClick={data.refresh}>Опитай отново</button>
                            </div>
                        )}

                        <div className="dt-top-grid">
                            <DietsStatCard label="Общо диети" value={data.isLoading ? "—" : String(data.total)} sub="глобален каталог" accent={`${data.limit}/стр.`} accentColor="var(--c-electric,#0066FF)" />
                            <DietsStatCard label="Средно kcal" value={data.isLoading ? "—" : String(avgCalories)} sub="за текущата страница" accent="kcal" accentColor="#00E676" />
                            <DietsStatCard label="Среден протеин" value={data.isLoading ? "—" : `${avgProtein} г`} sub="дневна цел тук" accent="П" accentColor="var(--c-electric,#0066FF)" />
                            <DietsStatCard label="Страница" value={`${data.page}/${data.totalPages}`} sub="пагинация" accent="→" accentColor="#FFB300" />
                        </div>

                        <div className="dt-hero-grid">
                            <div className="card dt-card" style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
                                <div style={{ borderRadius: "var(--r-lg)", background: "linear-gradient(135deg,#0066FF,#00CEC9)", padding: "var(--sp-5)", position: "relative", overflow: "hidden", minHeight: 110 }}>
                                    <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.22)" }} />
                                    <div style={{ position: "relative" }}>
                                        <span className="dt-pill" style={{ background: "rgba(255,255,255,0.18)", color: "#fff" }}>Препоръчан план</span>
                                        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 900, color: "#fff", margin: "10px 0 4px" }}>{firstDiet?.title ?? "Каталог с диети"}</h2>
                                        <div style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.85rem" }}>{firstDiet ? `${firstDiet.caloriesPerDay} kcal/ден · ${firstDiet.durationDays} дни` : "Избери план и отвори детайлите."}</div>
                                    </div>
                                </div>
                                <p className="body-sm" style={{ color: "var(--color-cream)", margin: 0, lineHeight: 1.6 }}>{firstDiet?.description ?? "Диетите са глобално съдържание и не стартират проследяване в този етап."}</p>
                                {firstDiet && (
                                    <div style={{ display: "flex", gap: "var(--sp-2)", flexWrap: "wrap" }}>
                                        <span className="dt-pill" style={{ background: "rgba(0,102,255,0.08)", color: "var(--c-electric,#0066FF)" }}>{dietCategoryLabel(firstDiet.category)}</span>
                                        <span className="dt-pill" style={{ background: "rgba(200,255,0,0.08)", color: "var(--c-acid,#C8FF00)" }}>{dietGoalLabel(firstDiet.goalType)}</span>
                                    </div>
                                )}
                                {firstDiet && <button type="button" className="btn-primary" onClick={() => setSelectedDiet(firstDiet)} style={{ alignSelf: "flex-start" }}>Отвори детайли</button>}
                            </div>

                            <div className="card dt-card" style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
                                <div>
                                    <div className="label text-gray">Как работи</div>
                                    <div className="heading-sm" style={{ color: "var(--color-cream)", marginTop: 4 }}>Разглеждане без проследяване</div>
                                </div>
                                <div className="body-sm text-gray">Диетите са видими за всички влезли потребители. Тук не създаваме потребителски диетен прогрес и не свързваме плановете с хранения.</div>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--sp-3)" }}>
                                    <div style={{ padding: "var(--sp-3)", borderRadius: "var(--r-lg)", background: "rgba(255,255,255,0.025)", border: "1px solid var(--c-border,rgba(255,255,255,0.06))" }}><div className="label text-gray">Резултати</div><div style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 800, color: "var(--color-cream)" }}>{data.items.length}</div></div>
                                    <div style={{ padding: "var(--sp-3)", borderRadius: "var(--r-lg)", background: "rgba(255,255,255,0.025)", border: "1px solid var(--c-border,rgba(255,255,255,0.06))" }}><div className="label text-gray">Страница</div><div style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 800, color: "var(--color-cream)" }}>{data.page}</div></div>
                                </div>
                                {isAdmin && <div className="body-sm text-gray">Администраторите могат да добавят и изтриват диети. Редакция е налична през API.</div>}
                            </div>
                        </div>

                        <DietsGridCard
                            diets={data.items}
                            isLoading={data.isLoading}
                            total={data.total}
                            page={data.page}
                            totalPages={data.totalPages}
                            search={data.search}
                            category={data.category}
                            goalType={data.goalType}
                            difficulty={data.difficulty}
                            onSearch={data.setSearch}
                            onCategory={data.setCategory}
                            onGoalType={data.setGoalType}
                            onDifficulty={data.setDifficulty}
                            onPage={data.setPage}
                            onOpen={setSelectedDiet}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

export default Diets;


