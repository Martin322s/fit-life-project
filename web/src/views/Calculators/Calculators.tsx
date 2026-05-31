"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { JSX } from "react";
import DashboardSidebar from "../../layout/DashboardLayout/DashboardSidebar";
import ProductStatCard from "../Products/sections/ProductStatCard";
import { getInitials, useAuth } from "../../context/AuthContext";
import { dashboardApi } from "../../services/dashboardApi";
import { readLocalProfile } from "../../lib/mealUtils";
import {
    calculateBMI,
    calculateBMR,
    calculateCaloriesForGoal,
    calculateGoalTimeline,
    calculateIdealWeightRange,
    calculateMacros,
    calculateTDEE,
    calculateWaterIntake,
    getBMICategory,
    type ActivityLevel,
    type GoalType,
    type Sex,
} from "../../lib/calculatorUtils";
import CalculatorsHeader from "./sections/CalculatorsHeader";

type CalculatorTab = "bmi" | "bmr" | "tdee" | "calories" | "macros" | "water" | "ideal" | "timeline";

type FormState = {
    sex: Sex | "";
    age: string;
    heightCm: string;
    weightKg: string;
    activityLevel: ActivityLevel | "";
    goalType: GoalType | "";
    calorieGoal: string;
    targetWeightKg: string;
    weeklyChangeKg: string;
};

type ProfileLike = {
    gender?: string | null;
    age?: number | null;
    heightCm?: number | null;
    height?: number | null;
    heightUnit?: "cm" | "ft" | null;
    weight?: number | null;
    weightUnit?: "kg" | "lb" | null;
    goalWeight?: number | null;
    goalType?: string | null;
    activityLevel?: string | null;
    goal?: string | null;
    activity?: string | null;
};

const TAB_OPTIONS: { key: CalculatorTab; label: string }[] = [
    { key: "bmi", label: "BMI" },
    { key: "bmr", label: "BMR" },
    { key: "tdee", label: "TDEE" },
    { key: "calories", label: "Калориен таргет" },
    { key: "macros", label: "Макроси" },
    { key: "water", label: "Вода" },
    { key: "ideal", label: "Идеално тегло" },
    { key: "timeline", label: "Срок до цел" },
];

const ACTIVITY_OPTIONS: { value: ActivityLevel; label: string }[] = [
    { value: "sedentary", label: "Заседнал" },
    { value: "light", label: "Леко активен" },
    { value: "moderate", label: "Умерено активен" },
    { value: "very", label: "Много активен" },
    { value: "athlete", label: "Атлетично натоварване" },
];

const GOAL_OPTIONS: { value: GoalType; label: string }[] = [
    { value: "lose_weight", label: "Сваляне" },
    { value: "maintain_weight", label: "Поддържане" },
    { value: "gain_weight", label: "Покачване" },
];

const CX_CSS = `
.dash-sidebar { position: sticky; top: 0; height: 100vh; overflow-y: auto; flex-shrink: 0; }
.dash-sidebar-close { display: none !important; }
.cx-page { display: flex; min-height: 100vh; background: var(--c-bg,#080C10); overflow-x: clip; }
.cx-main { flex: 1; min-width: 0; display: flex; flex-direction: column; overflow: auto; overflow-x: hidden; }
.cx-content { padding: var(--sp-5) var(--sp-6); display: flex; flex-direction: column; gap: var(--sp-4); }
.cx-hamburger { display: none; }
.cx-top-grid { display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap: var(--sp-3); }
.cx-card { padding: var(--sp-5); box-sizing: border-box; min-width: 0; }
.cx-tab-row { display: flex; gap: var(--sp-2); overflow-x: auto; padding-bottom: 2px; }
.cx-tab-btn { white-space: nowrap; padding: 9px 14px; border-radius: var(--r-full); font-size: 0.8rem; font-weight: 800; cursor: pointer; border: 1px solid rgba(255,255,255,0.08); background: transparent; color: rgba(255,255,255,0.5); flex-shrink: 0; }
.cx-tab-btn--active { background: rgba(0,102,255,0.12); border-color: var(--c-electric,#0066FF); color: var(--c-electric,#0066FF); }
.cx-main-grid { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: var(--sp-4); align-items: start; }
.cx-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--sp-3); }
.cx-field { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
.cx-input, .cx-select { width: 100%; box-sizing: border-box; border-radius: var(--r-md); background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); color: var(--color-cream); padding: 11px 12px; outline: none; }
.cx-select { color-scheme: dark; }
[data-theme="light"] .cx-select { color-scheme: light; }
.cx-error { color: var(--c-error,#FF3D57); font-size: 0.74rem; margin-top: 2px; }
.cx-results-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--sp-3); }
.cx-result-box { padding: 14px; border-radius: var(--r-lg); background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); min-width: 0; }
.cx-helper-list { display: grid; gap: var(--sp-3); }
.cx-muted-box { padding: var(--sp-3) var(--sp-4); border-radius: var(--r-md); background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); }
@media (max-width: 1250px) { .cx-top-grid { grid-template-columns: repeat(2, minmax(0,1fr)); } .cx-main-grid { grid-template-columns: 1fr; } }
@media (max-width: 768px) {
  .dash-sidebar { position: fixed; left: 0; top: 0; bottom: 0; height: 100%; z-index: 300; transform: translateX(-100%); transition: transform 0.28s cubic-bezier(0.4,0,0.2,1); }
  .dash-sidebar.dash-sidebar--open { transform: translateX(0); box-shadow: 8px 0 48px rgba(0,0,0,0.85); }
  .dash-sidebar-close { display: flex !important; }
  .cx-hamburger { display: flex; align-items: center; justify-content: center; background: transparent; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 8px 10px; cursor: pointer; color: var(--color-cream); flex-shrink: 0; }
  .cx-content { padding: var(--sp-3) var(--sp-4); }
  .cx-top-grid, .cx-form-grid, .cx-results-grid { grid-template-columns: 1fr; }
}
`;

function round(value: number, digits = 1): number {
    const factor = 10 ** digits;
    return Math.round(value * factor) / factor;
}

function parseNum(value: string): number | null {
    const next = Number(value);
    return Number.isFinite(next) ? next : null;
}

function formatDate(date: Date): string {
    return date.toLocaleDateString("bg-BG", { day: "numeric", month: "long", year: "numeric" });
}

function validateRange(label: string, value: number | null, min: number, max: number): string | null {
    if (value == null) return `${label} е задължително поле.`;
    if (value < min || value > max) return `${label} трябва да е между ${min} и ${max}.`;
    return null;
}

function NumberField({ label, value, onChange, suffix }: { label: string; value: string; onChange: (next: string) => void; suffix?: string }): JSX.Element {
    return (
        <label className="cx-field">
            <span className="label text-gray">{label}</span>
            <div style={{ position: "relative" }}>
                <input className="cx-input" type="number" inputMode="decimal" value={value} onChange={(e) => onChange(e.target.value)} style={{ paddingRight: suffix ? 44 : 12 }} />
                {suffix && <span className="label text-gray" style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)" }}>{suffix}</span>}
            </div>
        </label>
    );
}

function SelectField<T extends string>({ label, value, onChange, options }: { label: string; value: T; onChange: (next: T) => void; options: { value: T; label: string }[] }): JSX.Element {
    return (
        <label className="cx-field">
            <span className="label text-gray">{label}</span>
            <select className="cx-select" value={value} onChange={(e) => onChange(e.target.value as T)}>
                {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
        </label>
    );
}

function ResultMetric({ label, value, hint, color }: { label: string; value: string; hint?: string; color?: string }): JSX.Element {
    return (
        <div className="cx-result-box">
            <div className="label text-gray">{label}</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 900, color: color ?? "var(--color-cream)", marginTop: 6, lineHeight: 1.1 }}>{value}</div>
            {hint && <div className="body-sm text-gray" style={{ marginTop: 8 }}>{hint}</div>}
        </div>
    );
}

function mapGoal(value?: string | null): GoalType | "" {
    if (value === "lose") return "lose_weight";
    if (value === "lose_weight") return "lose_weight";
    if (value === "gain") return "gain_weight";
    if (value === "gain_weight") return "gain_weight";
    if (value === "maintain") return "maintain_weight";
    if (value === "maintain_weight") return "maintain_weight";
    return "";
}

function mapActivity(value?: string | null): ActivityLevel | "" {
    if (value === "sedentary") return "sedentary";
    if (value === "light") return "light";
    if (value === "moderate") return "moderate";
    if (value === "very") return "very";
    return "";
}

function normalizeWeight(value?: number | null, unit?: string | null): number | null {
    if (value == null) return null;
    return unit === "lb" ? +(value * 0.453592).toFixed(1) : value;
}

function normalizeHeight(value?: number | null, unit?: string | null): number | null {
    if (value == null) return null;
    return unit === "ft" ? +(value * 30.48).toFixed(1) : value;
}

function Calculators(): JSX.Element {
    const { user } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<CalculatorTab>("bmi");
    const [calculated, setCalculated] = useState<Record<CalculatorTab, boolean>>({
        bmi: false,
        bmr: false,
        tdee: false,
        calories: false,
        macros: false,
        water: false,
        ideal: false,
        timeline: false,
    });
    const [loadingProgress, setLoadingProgress] = useState(true);
    const [progressError, setProgressError] = useState<string | null>(null);
    const [latestWeight, setLatestWeight] = useState<number | null>(null);
    const [form, setForm] = useState<FormState>({
        sex: "",
        age: "",
        heightCm: "",
        weightKg: "",
        activityLevel: "",
        goalType: "",
        calorieGoal: "",
        targetWeightKg: "",
        weeklyChangeKg: "",
    });

    const initials = user ? getInitials(user) : "FL";

    const applyLatestData = useCallback((overrideLatestWeight?: number | null) => {
        const localProfile = readLocalProfile();
        const profileUser = (user as unknown as ProfileLike | null) ?? null;
        const userWeight = normalizeWeight(profileUser?.weight, profileUser?.weightUnit);
        const profileWeight = localProfile?.weight ? normalizeWeight(Number(localProfile.weight), localProfile.weightUnit) : null;
        const userHeight = profileUser?.heightCm ?? normalizeHeight(profileUser?.height, profileUser?.heightUnit);
        const profileHeight = localProfile?.height ? normalizeHeight(Number(localProfile.height), localProfile.heightUnit) : null;
        const nextWeight = overrideLatestWeight ?? latestWeight ?? userWeight ?? profileWeight;
        const nextHeight = userHeight ?? profileHeight;

        setForm((prev) => ({
            ...prev,
            sex:
                profileUser?.gender === "female" || localProfile?.gender === "female"
                    ? "female"
                    : profileUser?.gender === "male" || localProfile?.gender === "male"
                        ? "male"
                        : prev.sex,
            age: String(profileUser?.age ?? (localProfile?.age ? Number(localProfile.age) : prev.age || "")),
            heightCm: nextHeight != null ? String(round(nextHeight, 1)) : prev.heightCm,
            weightKg: nextWeight != null ? String(round(nextWeight, 1)) : prev.weightKg,
            activityLevel: mapActivity(profileUser?.activityLevel ?? profileUser?.activity ?? localProfile?.activity) || prev.activityLevel,
            goalType: mapGoal(profileUser?.goalType ?? profileUser?.goal ?? localProfile?.goal) || prev.goalType,
            targetWeightKg: profileUser?.goalWeight != null ? String(round(profileUser.goalWeight, 1)) : prev.targetWeightKg,
        }));
    }, [latestWeight, user]);

    useEffect(() => {
        let cancelled = false;
        Promise.resolve().then(() => {
            if (!cancelled) {
                setLoadingProgress(true);
                setProgressError(null);
            }
        });

        dashboardApi
            .getProgress()
            .then((res) => {
                if (cancelled) return;
                const uid = user?.id;
                const items = uid ? res.items.filter((item) => item.userId === uid) : res.items;
                const latest = [...items].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0] ?? null;
                const latestWeightValue = latest?.weightKg ?? null;
                setLatestWeight(latestWeightValue);
            })
            .catch((err) => {
                if (!cancelled) setProgressError(err instanceof Error ? err.message : "Грешка при зареждане.");
            })
            .finally(() => {
                if (!cancelled) setLoadingProgress(false);
            });

        return () => {
            cancelled = true;
        };
    }, [user?.id]);

    const age = parseNum(form.age);
    const heightCm = parseNum(form.heightCm);
    const weightKg = parseNum(form.weightKg);
    const calorieGoal = parseNum(form.calorieGoal);
    const targetWeightKg = parseNum(form.targetWeightKg);
    const weeklyChangeKg = parseNum(form.weeklyChangeKg);

    const bmiData = useMemo(() => {
        const error = validateRange("Ръст", heightCm, 120, 230) ?? validateRange("Тегло", weightKg, 30, 300);
        if (error || heightCm == null || weightKg == null) return { error, value: null as number | null };
        return { error: null as string | null, value: calculateBMI(heightCm, weightKg) };
    }, [heightCm, weightKg]);

    const bmrData = useMemo(() => {
        const error = (form.sex ? null : "Пол е задължително поле.")
            ?? validateRange("Възраст", age, 14, 90)
            ?? validateRange("Ръст", heightCm, 120, 230)
            ?? validateRange("Тегло", weightKg, 30, 300);
        if (error || age == null || heightCm == null || weightKg == null || !form.sex) return { error, value: null as number | null };
        return { error: null as string | null, value: calculateBMR(form.sex, age, heightCm, weightKg) };
    }, [form.sex, age, heightCm, weightKg]);

    const tdeeData = useMemo(() => {
        if (!form.activityLevel) return { error: "Ниво на активност е задължително поле.", value: null as number | null };
        if (bmrData.value == null) return { error: bmrData.error, value: null as number | null };
        return { error: null as string | null, value: calculateTDEE(bmrData.value, form.activityLevel) };
    }, [bmrData, form.activityLevel]);

    const caloriesData = useMemo(() => {
        if (!form.goalType) return { error: "Цел е задължително поле.", value: null as ReturnType<typeof calculateCaloriesForGoal> | null };
        if (tdeeData.value == null) return { error: tdeeData.error, value: null as ReturnType<typeof calculateCaloriesForGoal> | null };
        return { error: null as string | null, value: calculateCaloriesForGoal(tdeeData.value, form.goalType) };
    }, [tdeeData, form.goalType]);

    const macrosData = useMemo(() => {
        if (!form.goalType) return { error: "Цел е задължително поле.", value: null as ReturnType<typeof calculateMacros> | null, chosenCalories: null as number | null };
        const chosenCalories = calorieGoal ?? caloriesData.value?.calories ?? null;
        const error = validateRange("Тегло", weightKg, 30, 300) ?? (chosenCalories == null ? "Калориите са задължителни." : null);
        if (error || chosenCalories == null || weightKg == null) return { error, value: null as ReturnType<typeof calculateMacros> | null };
        return { error: null as string | null, value: calculateMacros(chosenCalories, weightKg, form.goalType), chosenCalories };
    }, [calorieGoal, caloriesData.value, weightKg, form.goalType]);

    const waterData = useMemo(() => {
        if (!form.activityLevel) return { error: "Ниво на активност е задължително поле.", value: null as number | null };
        const error = validateRange("Тегло", weightKg, 30, 300);
        if (error || weightKg == null) return { error, value: null as number | null };
        return { error: null as string | null, value: calculateWaterIntake(weightKg, form.activityLevel) };
    }, [weightKg, form.activityLevel]);

    const idealWeightData = useMemo(() => {
        const error = validateRange("Ръст", heightCm, 120, 230);
        if (error || heightCm == null) return { error, value: null as ReturnType<typeof calculateIdealWeightRange> | null };
        return { error: null as string | null, value: calculateIdealWeightRange(heightCm) };
    }, [heightCm]);

    const timelineData = useMemo(() => {
        const error = validateRange("Текущо тегло", weightKg, 30, 300)
            ?? validateRange("Целево тегло", targetWeightKg, 30, 300)
            ?? validateRange("Промяна на седмица", weeklyChangeKg, 0.1, 2);
        if (error || weightKg == null || targetWeightKg == null || weeklyChangeKg == null) {
            return { error, value: null as ReturnType<typeof calculateGoalTimeline> | null };
        }
        if (weightKg === targetWeightKg) return { error: "Текущото и целевото тегло съвпадат.", value: null };
        return { error: null as string | null, value: calculateGoalTimeline(weightKg, targetWeightKg, weeklyChangeKg) };
    }, [weightKg, targetWeightKg, weeklyChangeKg]);

    const currentSummary = `${weightKg != null ? `${round(weightKg, 1)} кг` : "-"} · ${heightCm != null ? `${Math.round(heightCm)} см` : "-"} · ${age != null ? `${Math.round(age)} г` : "-"}`;

    const renderError = (error: string | null) => {
        if (!error) return null;
        return <div className="cx-error">{error}</div>;
    };

    const onCalculate = () => setCalculated((prev) => ({ ...prev, [activeTab]: true }));

    return (
        <>
            <style>{CX_CSS}</style>
            {isSidebarOpen && <div style={{ position: "fixed", inset: 0, zIndex: 299, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)", cursor: "pointer" }} onClick={() => setIsSidebarOpen(false)} />}
            <div className="cx-page">
                <DashboardSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
                <div className="cx-main">
                    <CalculatorsHeader initials={initials} onToggleSidebar={() => setIsSidebarOpen((open) => !open)} />
                    <div className="cx-content">
                        <div className="cx-top-grid">
                            <ProductStatCard label="Калкулатори" value="8" sub="фокус: хранене, тегло и фитнес цели" accent="готово" accentColor="var(--c-acid,#C8FF00)" />
                            <ProductStatCard label="Профил за изчисления" value={currentSummary} sub="можеш да редактираш ръчно всяко поле" />
                            <ProductStatCard label="Последно тегло" value={latestWeight != null ? `${round(latestWeight, 1)} кг` : "Няма"} sub={loadingProgress ? "зареждане от прогрес" : "източник: /api/progress"} accent={progressError ? "грешка" : "API"} accentColor={progressError ? "var(--c-error,#FF3D57)" : "var(--c-electric,#0066FF)"} />
                            <ProductStatCard label="Медицинска бележка" value="Оценка" sub="тези калкулатори са ориентировъчни" accent="не е медицински съвет" accentColor="rgba(255,255,255,0.45)" />
                        </div>

                        {progressError && (
                            <div style={{ padding: "var(--sp-3) var(--sp-4)", borderRadius: "var(--r-md)", background: "rgba(255,61,87,0.1)", border: "1px solid rgba(255,61,87,0.25)" }}>
                                <span className="body-sm" style={{ color: "var(--c-error,#FF3D57)" }}>Грешка при зареждане на последно тегло: {progressError}</span>
                            </div>
                        )}

                        <div className="card cx-card" style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", gap: "var(--sp-3)", flexWrap: "wrap", alignItems: "center" }}>
                                <div>
                                    <div className="label text-gray">Калкулатори</div>
                                    <div className="heading-sm" style={{ color: "var(--color-cream)", marginTop: 4 }}>Избери калкулатор и натисни Изчисли</div>
                                </div>
                                <button type="button" className="btn-ghost btn-sm" onClick={() => applyLatestData()} disabled={loadingProgress}>Използвай последни данни</button>
                            </div>
                            <div className="cx-tab-row">
                                {TAB_OPTIONS.map((tab) => (
                                    <button key={tab.key} type="button" className={`cx-tab-btn${activeTab === tab.key ? " cx-tab-btn--active" : ""}`} onClick={() => setActiveTab(tab.key)}>{tab.label}</button>
                                ))}
                            </div>
                        </div>

                        <div className="cx-main-grid">
                            <div className="card cx-card" style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
                                {(activeTab === "bmi" || activeTab === "bmr" || activeTab === "tdee" || activeTab === "calories" || activeTab === "macros" || activeTab === "water" || activeTab === "ideal" || activeTab === "timeline") && (
                                    <div className="cx-form-grid">
                                        {(activeTab === "bmi" || activeTab === "bmr" || activeTab === "tdee" || activeTab === "calories" || activeTab === "macros" || activeTab === "water" || activeTab === "ideal" || activeTab === "timeline") && (
                                            <NumberField label="Тегло" value={form.weightKg} onChange={(next) => setForm((prev) => ({ ...prev, weightKg: next }))} suffix="кг" />
                                        )}
                                        {(activeTab === "bmi" || activeTab === "bmr" || activeTab === "tdee" || activeTab === "calories" || activeTab === "ideal") && (
                                            <NumberField label="Ръст" value={form.heightCm} onChange={(next) => setForm((prev) => ({ ...prev, heightCm: next }))} suffix="см" />
                                        )}
                                        {(activeTab === "bmr" || activeTab === "tdee" || activeTab === "calories") && (
                                            <NumberField label="Възраст" value={form.age} onChange={(next) => setForm((prev) => ({ ...prev, age: next }))} suffix="г" />
                                        )}
                                        {(activeTab === "bmr" || activeTab === "tdee" || activeTab === "calories") && (
                                            <SelectField label="Пол" value={form.sex} onChange={(next) => setForm((prev) => ({ ...prev, sex: next }))} options={[{ value: "", label: "Избери" }, { value: "male", label: "Мъж" }, { value: "female", label: "Жена" }]} />
                                        )}
                                        {(activeTab === "tdee" || activeTab === "calories" || activeTab === "water") && (
                                            <SelectField label="Активност" value={form.activityLevel} onChange={(next) => setForm((prev) => ({ ...prev, activityLevel: next }))} options={[{ value: "", label: "Избери" }, ...ACTIVITY_OPTIONS]} />
                                        )}
                                        {(activeTab === "calories" || activeTab === "macros") && (
                                            <SelectField label="Цел" value={form.goalType} onChange={(next) => setForm((prev) => ({ ...prev, goalType: next }))} options={[{ value: "", label: "Избери" }, ...GOAL_OPTIONS]} />
                                        )}
                                        {activeTab === "macros" && (
                                            <NumberField label="Дневни калории (по избор)" value={form.calorieGoal} onChange={(next) => setForm((prev) => ({ ...prev, calorieGoal: next }))} suffix="kcal" />
                                        )}
                                        {activeTab === "timeline" && (
                                            <>
                                                <NumberField label="Целево тегло" value={form.targetWeightKg} onChange={(next) => setForm((prev) => ({ ...prev, targetWeightKg: next }))} suffix="кг" />
                                                <NumberField label="Промяна на седмица" value={form.weeklyChangeKg} onChange={(next) => setForm((prev) => ({ ...prev, weeklyChangeKg: next }))} suffix="кг" />
                                            </>
                                        )}
                                    </div>
                                )}
                                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                    <button type="button" className="btn-primary" onClick={onCalculate}>Изчисли</button>
                                </div>
                            </div>

                            <div className="card cx-card" style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
                                <div>
                                    <div className="label text-gray">Резултат</div>
                                    <div className="heading-sm" style={{ color: "var(--color-cream)", marginTop: 4 }}>Оценка и обяснение</div>
                                </div>

                                {!calculated[activeTab] && <div className="cx-muted-box body-sm text-gray">Въведи стойности и натисни Изчисли.</div>}

                                {calculated.bmi && activeTab === "bmi" && (
                                    <div className="cx-helper-list">
                                        {renderError(bmiData.error)}
                                        {bmiData.value != null && (
                                            <div className="cx-results-grid">
                                                <ResultMetric label="BMI" value={round(bmiData.value, 1).toFixed(1)} hint="индекс на телесната маса" color="var(--c-electric,#0066FF)" />
                                                <ResultMetric label="Категория" value={getBMICategory(bmiData.value)} hint="ориентировъчна класификация" />
                                            </div>
                                        )}
                                    </div>
                                )}

                                {calculated.bmr && activeTab === "bmr" && (
                                    <div className="cx-helper-list">
                                        {renderError(bmrData.error)}
                                        {bmrData.value != null && <ResultMetric label="BMR" value={`${Math.round(bmrData.value)} kcal`} hint="базов разход в покой" color="var(--c-electric,#0066FF)" />}
                                    </div>
                                )}

                                {calculated.tdee && activeTab === "tdee" && (
                                    <div className="cx-helper-list">
                                        {renderError(tdeeData.error)}
                                        {tdeeData.value != null && (
                                            <div className="cx-results-grid">
                                                <ResultMetric label="BMR" value={`${Math.round(bmrData.value ?? 0)} kcal`} hint="изходна стойност" />
                                                <ResultMetric label="TDEE" value={`${Math.round(tdeeData.value)} kcal`} hint="поддържащ прием" color="var(--c-electric,#0066FF)" />
                                            </div>
                                        )}
                                    </div>
                                )}

                                {calculated.calories && activeTab === "calories" && (
                                    <div className="cx-helper-list">
                                        {renderError(caloriesData.error)}
                                        {caloriesData.value && (
                                            <>
                                                <div className="cx-results-grid">
                                                    <ResultMetric label="Дневни калории" value={`${Math.round(caloriesData.value.calories)} kcal`} hint="препоръчителен прием" color="var(--c-electric,#0066FF)" />
                                                    <ResultMetric label="Делта" value={`${caloriesData.value.delta > 0 ? "+" : ""}${caloriesData.value.delta} kcal`} hint="спрямо поддържащия прием" />
                                                </div>
                                                <div className="cx-muted-box body-sm text-gray">{caloriesData.value.explanation}</div>
                                            </>
                                        )}
                                    </div>
                                )}

                                {calculated.macros && activeTab === "macros" && (
                                    <div className="cx-helper-list">
                                        {renderError(macrosData.error)}
                                        {macrosData.value && (
                                            <div className="cx-results-grid">
                                                <ResultMetric label="Протеин" value={`${Math.round(macrosData.value.protein)} г`} hint="4 kcal/г" color="#7BDCB5" />
                                                <ResultMetric label="Въглехидрати" value={`${Math.round(macrosData.value.carbs)} г`} hint="4 kcal/г" color="var(--c-electric,#0066FF)" />
                                                <ResultMetric label="Мазнини" value={`${Math.round(macrosData.value.fat)} г`} hint="9 kcal/г" color="#FFB300" />
                                                <ResultMetric label="Използвани калории" value={`${Math.round(macrosData.chosenCalories ?? 0)} kcal`} hint="или от въведени, или от калкулатора" />
                                            </div>
                                        )}
                                    </div>
                                )}

                                {calculated.water && activeTab === "water" && (
                                    <div className="cx-helper-list">
                                        {renderError(waterData.error)}
                                        {waterData.value != null && (
                                            <div className="cx-results-grid">
                                                <ResultMetric label="Вода" value={`${round(waterData.value, 1)} L`} hint="препоръчителен дневен прием" color="#00C2FF" />
                                                <ResultMetric label="Бутилки 500 ml" value={`${Math.round(waterData.value * 2)}`} hint="удобен дневен таргет" />
                                            </div>
                                        )}
                                    </div>
                                )}

                                {calculated.ideal && activeTab === "ideal" && (
                                    <div className="cx-helper-list">
                                        {renderError(idealWeightData.error)}
                                        {idealWeightData.value && (
                                            <div className="cx-results-grid">
                                                <ResultMetric label="Мин. здравословно" value={`${round(idealWeightData.value.minWeight, 1)} кг`} hint="BMI 18.5" color="var(--c-electric,#0066FF)" />
                                                <ResultMetric label="Макс. здравословно" value={`${round(idealWeightData.value.maxWeight, 1)} кг`} hint="BMI 24.9" />
                                            </div>
                                        )}
                                    </div>
                                )}

                                {calculated.timeline && activeTab === "timeline" && (
                                    <div className="cx-helper-list">
                                        {renderError(timelineData.error)}
                                        {timelineData.value && (
                                            <>
                                                <div className="cx-results-grid">
                                                    <ResultMetric label="Оставащо време" value={`${Math.ceil(timelineData.value.weeks)} седмици`} hint="приблизителна оценка" color="var(--c-electric,#0066FF)" />
                                                    <ResultMetric label="Ориентировъчна дата" value={formatDate(timelineData.value.etaDate)} hint="при постоянен темп" />
                                                </div>
                                                {timelineData.value.warning && <div className="cx-error">{timelineData.value.warning}</div>}
                                            </>
                                        )}
                                    </div>
                                )}

                                <div className="cx-muted-box body-sm text-gray">Тези резултати са ориентировъчни и не са медицински съвет.</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Calculators;


