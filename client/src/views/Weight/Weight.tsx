"use client";

import { useState } from "react";
import type { JSX } from "react";
import DashboardSidebar from "../../layout/DashboardLayout/DashboardSidebar";
import { getInitials, useAuth } from "../../context/AuthContext";
import { useWeightData } from "../../hooks/useWeightData";
import { dashboardApi } from "../../services/dashboardApi";
import { formatDate } from "../../lib/progressUtils";
import WeightHeader from "./sections/WeightHeader";
import WeightStatCard from "./sections/WeightStatCard";
import WeightChartCard from "./sections/WeightChartCard";
import ProgressCard from "./sections/ProgressCard";
import TrendInsightsCard from "./sections/TrendInsightsCard";
import MeasurementsCard from "./sections/MeasurementsCard";
import BmiCard from "./sections/BmiCard";
import ConsistencyCard from "./sections/ConsistencyCard";
import HistoryCard from "./sections/HistoryCard";
import LogWeightModal from "./sections/LogWeightModal";

import "./Weight.css";

function formatKg(value: number | null): string {
    return value != null ? `${value} кг` : "—";
}

function Weight(): JSX.Element {
    const { user } = useAuth();
    const data = useWeightData();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const latestDate = data.latest ? formatDate(data.latest.createdAt) : null;
    const initials = user ? getInitials(user) : "FL";
    const weightTrend = data.weightChange == null ? "neutral" : data.weightChange > 0 ? "up" : data.weightChange < 0 ? "down" : "neutral";
    const weightChangeText =
        data.weightChange == null
            ? "Нужни са поне 2 записа"
            : data.weightChange === 0
                ? "Без промяна спрямо предишния запис"
                : `${data.weightChange > 0 ? "+" : ""}${data.weightChange} кг спрямо предишния запис`;
    const firstWithWaist = data.entriesOldest.find((entry) => entry.waistCm != null) ?? null;

    const handleDelete = async (id: string) => {
        if (!window.confirm("Сигурен ли си, че искаш да изтриеш този запис?")) return;
        try {
            await dashboardApi.deleteProgress(id);
            data.refresh();
        } catch (err) {
            console.error("Delete progress failed:", err);
        }
    };

    return (
        <>
            {showModal && (
                <LogWeightModal
                    currentWeight={data.currentWeight}
                    onClose={() => setShowModal(false)}
                    onSuccess={data.refresh}
                />
            )}
            {isSidebarOpen && (
                <div
                    style={{ position: "fixed", inset: 0, zIndex: 299, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)", cursor: "pointer" }}
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
            <div className="wt-page">
                <DashboardSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
                <div className="wt-main">
                    <WeightHeader
                        initials={initials}
                        streak={data.streak}
                        lastLogged={latestDate}
                        onToggleSidebar={() => setIsSidebarOpen((o) => !o)}
                        onLogWeight={() => setShowModal(true)}
                    />
                    <div className="wt-content">
                        {data.error && (
                            <div style={{ padding: "var(--sp-3) var(--sp-4)", borderRadius: "var(--r-md)", background: "rgba(255,61,87,0.1)", border: "1px solid rgba(255,61,87,0.25)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--sp-3)" }}>
                                <span className="body-sm" style={{ color: "var(--c-error,#FF3D57)" }}>Грешка при зареждане: {data.error}</span>
                                <button type="button" className="btn-ghost btn-sm" onClick={data.refresh}>Опитай отново</button>
                            </div>
                        )}

                        <div className="wt-top-grid">
                            <WeightStatCard
                                label="Текущо тегло"
                                value={data.isLoading ? "—" : formatKg(data.currentWeight)}
                                sub={data.latest ? `Последно: ${latestDate}` : "Няма записано тегло"}
                                trend={weightTrend}
                            />
                            <WeightStatCard
                                label="Промяна"
                                value={data.isLoading ? "—" : data.weightChange != null ? `${data.weightChange > 0 ? "+" : ""}${data.weightChange} кг` : "—"}
                                sub={weightChangeText}
                                accent={data.weightChange == null ? undefined : data.weightChange <= 0 ? "надолу" : "нагоре"}
                                accentColor={data.weightChange != null && data.weightChange <= 0 ? "#00E676" : "var(--c-error,#FF3D57)"}
                            />
                            <WeightStatCard
                                label="Общо записи"
                                value={data.isLoading ? "—" : String(data.totalEntries)}
                                sub={`Мин: ${formatKg(data.minWeight)} · Макс: ${formatKg(data.maxWeight)}`}
                            />
                            <WeightStatCard
                                label="Средно тегло"
                                value={data.isLoading ? "—" : formatKg(data.averageWeight)}
                                sub={data.goalWeight != null ? `Цел: ${data.goalWeight} кг` : "Целево тегло липсва в профила"}
                                accent={data.goalProgressPct != null ? `${data.goalProgressPct}%` : undefined}
                                accentColor="var(--c-acid,#C8FF00)"
                            />
                        </div>

                        <div className="wt-hero-grid">
                            <WeightChartCard entries={data.entriesOldest} goalWeight={data.goalWeight} isLoading={data.isLoading} />
                            <ProgressCard
                                startWeight={data.startWeight}
                                currentWeight={data.currentWeight}
                                goalWeight={data.goalWeight}
                                progressPct={data.goalProgressPct}
                                totalChangeFromStart={data.totalChangeFromStart}
                            />
                        </div>

                        <div className="wt-three-grid">
                            <TrendInsightsCard
                                totalEntries={data.totalEntries}
                                minWeight={data.minWeight}
                                maxWeight={data.maxWeight}
                                averageWeight={data.averageWeight}
                                remainingToGoal={data.remainingToGoal}
                                totalChangeFromStart={data.totalChangeFromStart}
                                goalProgressPct={data.goalProgressPct}
                            />
                            <MeasurementsCard latest={data.latest} firstWithWaist={firstWithWaist} />
                            <ConsistencyCard loggedDays={data.loggedDaysLast35} streak={data.streak} />
                        </div>

                        <div className="wt-two-grid">
                            <BmiCard
                                bmi={data.bmi}
                                startBmi={data.startBmi}
                                goalBmi={data.goalBmi}
                                heightCm={data.heightCm}
                                goalWeight={data.goalWeight}
                            />
                            <HistoryCard entries={data.entriesNewest} isLoading={data.isLoading} onDelete={handleDelete} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Weight;


