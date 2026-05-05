import { useState } from "react";
import type { JSX } from "react";
import DashboardSidebar from "../../layout/DashboardLayout/DashboardSidebar";
import { getInitials, useAuth } from "../../context/AuthContext";
import { useTrainingPlansData } from "../../hooks/useTrainingPlansData";
import { trainingPlansApi } from "../../services/trainingPlansApi";
import type { ApiTrainingPlan } from "../../services/trainingPlansApi";
import TrainingPlansHeader from "./sections/TrainingPlansHeader";
import TrainingStatCard from "./sections/TrainingStatCard";
import TrainingPlansGridCard from "./sections/TrainingPlansGridCard";
import TrainingPlanDetailsModal from "./sections/TrainingPlanDetailsModal";
import AddTrainingPlanModal from "./sections/AddTrainingPlanModal";
import { trainingEquipmentLabel, trainingGoalLabel } from "../../lib/trainingPlanLabels";

import "./TrainingPlans.css";

type TrainingPlansProps = { theme: "dark" | "light"; onToggleTheme: () => void };

function TrainingPlans({ theme, onToggleTheme }: TrainingPlansProps): JSX.Element {
    const { user } = useAuth();
    const data = useTrainingPlansData();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<ApiTrainingPlan | null>(null);

    const isAdmin = user?.role === "admin";
    const initials = user ? getInitials(user) : "FL";
    const avgMinutes = data.items.length ? Math.round(data.items.reduce((sum, plan) => sum + plan.averageSessionMinutes, 0) / data.items.length) : 0;
    const avgSessions = data.items.length ? (data.items.reduce((sum, plan) => sum + plan.sessionsPerWeek, 0) / data.items.length).toFixed(1) : "0";
    const firstPlan = data.items[0] ?? null;
    const equipmentCount = new Set(data.items.flatMap((plan) => plan.equipment)).size;

    const handleDelete = async (id: string) => {
        if (!window.confirm("Сигурен ли си, че искаш да изтриеш този тренировъчен план?")) return;
        try {
            await trainingPlansApi.delete(id);
            setSelectedPlan(null);
            data.refresh();
        } catch (err) {
            console.error("Delete training plan failed:", err);
        }
    };

    return (
        <>
            {showModal && <AddTrainingPlanModal onClose={() => setShowModal(false)} onSuccess={data.refresh} />}
            {selectedPlan && <TrainingPlanDetailsModal plan={selectedPlan} isAdmin={isAdmin} onClose={() => setSelectedPlan(null)} onDelete={handleDelete} />}
            {isSidebarOpen && (
                <div
                    style={{ position: "fixed", inset: 0, zIndex: 299, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)", cursor: "pointer" }}
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
            <div className="tp-page">
                <DashboardSidebar theme={theme} onToggleTheme={onToggleTheme} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
                <div className="tp-main">
                    <TrainingPlansHeader
                        initials={initials}
                        total={data.total}
                        isAdmin={isAdmin}
                        onToggleSidebar={() => setIsSidebarOpen((o) => !o)}
                        onAddPlan={() => setShowModal(true)}
                    />
                    <div className="tp-content">
                        {data.error && (
                            <div style={{ padding: "var(--sp-3) var(--sp-4)", borderRadius: "var(--r-md)", background: "rgba(255,61,87,0.1)", border: "1px solid rgba(255,61,87,0.25)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--sp-3)" }}>
                                <span className="body-sm" style={{ color: "var(--c-error,#FF3D57)" }}>Грешка при зареждане: {data.error}</span>
                                <button type="button" className="btn-ghost btn-sm" onClick={data.refresh}>Опитай отново</button>
                            </div>
                        )}

                        <div className="tp-top-grid">
                            <TrainingStatCard label="Общо планове" value={data.isLoading ? "—" : String(data.total)} sub="глобален каталог" accent={`${data.limit}/стр.`} accentColor="var(--c-electric,#0066FF)" />
                            <TrainingStatCard label="Средна сесия" value={data.isLoading ? "—" : `${avgMinutes} мин.`} sub="за текущата страница" accent="⏱" accentColor="#00E676" />
                            <TrainingStatCard label="Сесии седмично" value={data.isLoading ? "—" : avgSessions} sub="средно в показаните планове" accent="сед." accentColor="var(--c-electric,#0066FF)" />
                            <TrainingStatCard label="Оборудване" value={data.isLoading ? "—" : String(equipmentCount)} sub="варианта на страницата" accent="вид" accentColor="#FFB300" />
                        </div>

                        <div className="tp-hero-grid">
                            <div className="card tp-card" style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
                                <div style={{ borderRadius: "var(--r-lg)", background: "linear-gradient(135deg,#0066FF,#00CEC9)", padding: "var(--sp-5)", position: "relative", overflow: "hidden", minHeight: 110 }}>
                                    <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.22)" }} />
                                    <div style={{ position: "relative" }}>
                                        <span className="tp-pill" style={{ background: "rgba(255,255,255,0.18)", color: "#fff" }}>Препоръчан план</span>
                                        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 900, color: "#fff", margin: "10px 0 4px" }}>{firstPlan?.title ?? "Каталог с тренировъчни планове"}</h2>
                                        <div style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.85rem" }}>{firstPlan ? `${firstPlan.durationWeeks} седмици · ${firstPlan.sessionsPerWeek} сесии/сед.` : "Избери план и отвори детайлите."}</div>
                                    </div>
                                </div>
                                <p className="body-sm" style={{ color: "var(--color-cream)", margin: 0, lineHeight: 1.6 }}>{firstPlan?.description ?? "Тренировъчните планове са глобално съдържание и не стартират лично проследяване в този етап."}</p>
                                {firstPlan && (
                                    <div style={{ display: "flex", gap: "var(--sp-2)", flexWrap: "wrap" }}>
                                        <span className="tp-pill" style={{ background: "rgba(0,102,255,0.08)", color: "var(--c-electric,#0066FF)" }}>{trainingGoalLabel(firstPlan.goalType)}</span>
                                        {firstPlan.equipment.slice(0, 2).map((item) => <span key={item} className="tp-pill" style={{ background: "rgba(200,255,0,0.08)", color: "var(--c-acid,#C8FF00)" }}>{trainingEquipmentLabel(item)}</span>)}
                                    </div>
                                )}
                                {firstPlan && <button type="button" className="btn-primary" onClick={() => setSelectedPlan(firstPlan)} style={{ alignSelf: "flex-start" }}>Отвори детайли</button>}
                            </div>

                            <div className="card tp-card" style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
                                <div>
                                    <div className="label text-gray">Как работи</div>
                                    <div className="heading-sm" style={{ color: "var(--color-cream)", marginTop: 4 }}>Разглеждане без проследяване</div>
                                </div>
                                <div className="body-sm text-gray">Плановете са видими за всички влезли потребители. Тук не създаваме личен тренировъчен прогрес и не свързваме плановете с workout записи.</div>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--sp-3)" }}>
                                    <div style={{ padding: "var(--sp-3)", borderRadius: "var(--r-lg)", background: "rgba(255,255,255,0.025)", border: "1px solid var(--c-border,rgba(255,255,255,0.06))" }}><div className="label text-gray">Резултати</div><div style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 800, color: "var(--color-cream)" }}>{data.items.length}</div></div>
                                    <div style={{ padding: "var(--sp-3)", borderRadius: "var(--r-lg)", background: "rgba(255,255,255,0.025)", border: "1px solid var(--c-border,rgba(255,255,255,0.06))" }}><div className="label text-gray">Страница</div><div style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 800, color: "var(--color-cream)" }}>{data.page}</div></div>
                                </div>
                                {isAdmin && <div className="body-sm text-gray">Администраторите могат да добавят и изтриват планове. Редакция е налична през API.</div>}
                            </div>
                        </div>

                        <TrainingPlansGridCard
                            plans={data.items}
                            isLoading={data.isLoading}
                            total={data.total}
                            page={data.page}
                            totalPages={data.totalPages}
                            search={data.search}
                            goalType={data.goalType}
                            level={data.level}
                            equipment={data.equipment}
                            onSearch={data.setSearch}
                            onGoalType={data.setGoalType}
                            onLevel={data.setLevel}
                            onEquipment={data.setEquipment}
                            onPage={data.setPage}
                            onOpen={setSelectedPlan}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

export default TrainingPlans;
