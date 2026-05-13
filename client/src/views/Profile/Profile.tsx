"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { JSX } from "react";
import DashboardSidebar from "../../layout/DashboardLayout/DashboardSidebar";
import ProductStatCard from "../Products/sections/ProductStatCard";
import ProfileHeader from "./sections/ProfileHeader";
import { getInitials, useAuth } from "../../context/AuthContext";
import { useProfileData } from "../../hooks/useProfileData";
import { profileApi } from "../../services/profileApi";
import type { ApiProfile, ProfileActivityLevel, ProfileGoalType, ProfileGender } from "../../services/profileApi";
import {
    calculateBMR,
    calculateCaloriesForGoal,
    calculateMacros,
    calculateTDEE,
    type GoalType,
    type Sex,
} from "../../lib/calculatorUtils";

type FormState = {
    firstName: string;
    lastName: string;
    email: string;
    gender: ProfileGender | "";
    age: string;
    heightCm: string;
    goalWeight: string;
    activityLevel: ProfileActivityLevel | "";
    goalType: ProfileGoalType | "";
    caloriesTarget: string;
    proteinTarget: string;
    carbsTarget: string;
    fatTarget: string;
};

const PF_CSS = `
.dash-sidebar { position: sticky; top: 0; height: 100vh; overflow-y: auto; flex-shrink: 0; }
.dash-sidebar-close { display: none !important; }
.pf-page { display: flex; min-height: 100vh; background: var(--c-bg,#080C10); overflow-x: clip; }
.pf-main { flex: 1; min-width: 0; display: flex; flex-direction: column; overflow: auto; overflow-x: hidden; }
.pf-content { padding: var(--sp-5) var(--sp-6); display: flex; flex-direction: column; gap: var(--sp-4); }
.pf-header { padding: var(--sp-4) var(--sp-6); border-bottom: 1px solid var(--c-border,rgba(255,255,255,0.06)); display: flex; justify-content: space-between; align-items: center; gap: var(--sp-3); background: var(--c-surface-1,#0E1318); }
.pf-header-right { display: flex; align-items: center; gap: var(--sp-3); flex-shrink: 0; }
.pf-avatar { width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg,var(--c-electric,#0066FF),var(--c-acid,#C8FF00)); display: flex; align-items: center; justify-content: center; font-family: var(--font-display); font-size: 0.8rem; font-weight: 700; color: var(--c-bg,#080C10); flex-shrink: 0; }
.pf-hamburger { display: none; }
.pf-title { font-family: var(--font-display); font-size: 1.5rem; font-weight: 800; color: var(--color-cream); line-height: 1.15; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.pf-header-sub { margin-top: 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-transform: capitalize; }
.pf-edit-btn { display: flex; align-items: center; gap: var(--sp-2); padding: 8px 14px; border-radius: var(--r-md); background: rgba(0,102,255,0.1); border: 1px solid rgba(0,102,255,0.25); color: var(--c-electric,#0066FF); font-size: 0.82rem; font-weight: 700; cursor: pointer; transition: all 0.15s; white-space: nowrap; flex-shrink: 0; }
.pf-edit-btn:hover { background: rgba(0,102,255,0.18); }
.pf-top-grid { display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap: var(--sp-3); }
.pf-main-grid { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: var(--sp-4); align-items: start; }
.pf-bottom-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--sp-4); align-items: start; }
.pf-card { padding: var(--sp-5); box-sizing: border-box; min-width: 0; }
.pf-profile-hero { display: grid; grid-template-columns: 120px 1fr; gap: var(--sp-5); align-items: center; }
.pf-hero-avatar { width: 120px; height: 120px; border-radius: 28px; background: linear-gradient(135deg,rgba(0,102,255,0.22),rgba(200,255,0,0.18)); border: 1px solid rgba(255,255,255,0.08); display: flex; align-items: center; justify-content: center; font-family: var(--font-display); font-size: 2.8rem; font-weight: 900; color: var(--color-cream); }
.pf-chip-row { display: flex; flex-wrap: wrap; gap: var(--sp-2); }
.pf-chip { padding: 5px 10px; border-radius: 999px; font-size: 0.72rem; letter-spacing: 0.03em; font-weight: 700; background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.65); }
.pf-info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--sp-3); }
.pf-info-box { padding: 12px; border-radius: var(--r-lg); background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); }
.pf-list { display: grid; gap: var(--sp-3); }
.pf-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--sp-3); }
.pf-field { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
.pf-input, .pf-select { width: 100%; box-sizing: border-box; border-radius: var(--r-md); background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); color: var(--color-cream); padding: 11px 12px; outline: none; }
.pf-select { color-scheme: dark; }
[data-theme="light"] .pf-select { color-scheme: light; }
.pf-inline-actions { display: flex; gap: var(--sp-2); flex-wrap: wrap; }
.pf-error-box { padding: var(--sp-3) var(--sp-4); border-radius: var(--r-md); background: rgba(255,61,87,0.1); border: 1px solid rgba(255,61,87,0.25); }
.pf-success-box { padding: var(--sp-3) var(--sp-4); border-radius: var(--r-md); background: rgba(0,230,118,0.1); border: 1px solid rgba(0,230,118,0.25); }
.pf-note-box { padding: var(--sp-3) var(--sp-4); border-radius: var(--r-md); background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); }
.pf-field-error { color: var(--c-error,#FF3D57); font-size: 0.74rem; margin-top: 2px; }
@media (max-width: 1280px) {
  .pf-top-grid { grid-template-columns: repeat(2, minmax(0,1fr)); }
  .pf-main-grid, .pf-bottom-grid { grid-template-columns: 1fr; }
}
@media (max-width: 768px) {
  .dash-sidebar { position: fixed; left: 0; top: 0; bottom: 0; height: 100%; z-index: 300; transform: translateX(-100%); transition: transform 0.28s cubic-bezier(0.4,0,0.2,1); }
  .dash-sidebar.dash-sidebar--open { transform: translateX(0); box-shadow: 8px 0 48px rgba(0,0,0,0.85); }
  .dash-sidebar-close { display: flex !important; }
  .pf-hamburger { display: flex; align-items: center; justify-content: center; background: transparent; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 8px 10px; cursor: pointer; color: var(--color-cream); flex-shrink: 0; }
  .pf-header { padding: var(--sp-3) var(--sp-4); }
  .pf-content { padding: var(--sp-3) var(--sp-4); }
  .pf-title { font-size: 1rem !important; }
  .pf-header-sub, .pf-avatar { display: none; }
  .pf-edit-btn span { display: none; }
  .pf-top-grid, .pf-info-grid, .pf-form-grid { grid-template-columns: 1fr; }
  .pf-profile-hero { grid-template-columns: 1fr; justify-items: start; }
}
@media (max-width: 480px) {
  .pf-top-grid { grid-template-columns: 1fr; }
  .pf-card { padding: var(--sp-4); }
  .pf-hero-avatar { width: 88px; height: 88px; border-radius: 20px; font-size: 2rem; }
}
`;

const ACTIVITY_OPTIONS: { value: ProfileActivityLevel; label: string }[] = [
    { value: "sedentary", label: "Заседнал" },
    { value: "light", label: "Леко активен" },
    { value: "moderate", label: "Умерено активен" },
    { value: "very", label: "Много активен" },
];

const GOAL_OPTIONS: { value: ProfileGoalType; label: string }[] = [
    { value: "lose_weight", label: "Сваляне" },
    { value: "maintain", label: "Поддържане" },
    { value: "gain_weight", label: "Покачване" },
];

type FieldErrors = Partial<Record<keyof FormState, string>>;

function toStringOrEmpty(value: number | null | undefined): string {
    return value == null ? "" : String(value);
}

function toNullableNumber(value: string): number | null {
    const trimmed = value.trim();
    if (!trimmed) return null;
    const n = Number(trimmed);
    return Number.isFinite(n) ? n : Number.NaN;
}

function mapGoalToCalculator(goalType: ProfileGoalType): GoalType {
    if (goalType === "maintain") return "maintain_weight";
    return goalType;
}

function initialForm(): FormState {
    return {
        firstName: "",
        lastName: "",
        email: "",
        gender: "",
        age: "",
        heightCm: "",
        goalWeight: "",
        activityLevel: "",
        goalType: "",
        caloriesTarget: "",
        proteinTarget: "",
        carbsTarget: "",
        fatTarget: "",
    };
}

function Profile(): JSX.Element {
    const { user, refreshUser } = useAuth();
    const { profile, isLoading, isSaving, error, saveError, saveSuccess, save, refresh } = useProfileData();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [form, setForm] = useState<FormState>(initialForm);
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
    const [recalcError, setRecalcError] = useState<string | null>(null);
    const [manualTargets, setManualTargets] = useState(false);

    useEffect(() => {
        if (!profile) return;
        let cancelled = false;
        Promise.resolve().then(() => {
            if (cancelled) return;
            setForm({
                firstName: profile.firstName,
                lastName: profile.lastName,
                email: profile.email,
                gender: profile.gender ?? "",
                age: toStringOrEmpty(profile.age),
                heightCm: toStringOrEmpty(profile.heightCm),
                goalWeight: toStringOrEmpty(profile.goalWeight),
                activityLevel: profile.activityLevel ?? "",
                goalType: profile.goalType ?? "",
                caloriesTarget: toStringOrEmpty(profile.caloriesTarget),
                proteinTarget: toStringOrEmpty(profile.proteinTarget),
                carbsTarget: toStringOrEmpty(profile.carbsTarget),
                fatTarget: toStringOrEmpty(profile.fatTarget),
            });
            setFieldErrors({});
            setRecalcError(null);
            setManualTargets(false);
        });

        return () => {
            cancelled = true;
        };
    }, [profile]);

    const initials = user ? getInitials(user) : "FL";
    const currentWeight = profile?.currentWeight ?? null;

    const summaryText = useMemo(() => {
        const age = form.age ? `${form.age} г` : "-";
        const height = form.heightCm ? `${form.heightCm} см` : "-";
        const goalWeight = form.goalWeight ? `${form.goalWeight} кг` : "-";
        return `${age} · ${height} · цел ${goalWeight}`;
    }, [form.age, form.heightCm, form.goalWeight]);

    const macroSummary = useMemo(() => {
        const p = form.proteinTarget || "-";
        const c = form.carbsTarget || "-";
        const f = form.fatTarget || "-";
        return `${p}P · ${c}C · ${f}F`;
    }, [form.proteinTarget, form.carbsTarget, form.fatTarget]);

    const validate = (): FieldErrors => {
        const errors: FieldErrors = {};
        const age = toNullableNumber(form.age);
        const heightCm = toNullableNumber(form.heightCm);
        const goalWeight = toNullableNumber(form.goalWeight);
        const caloriesTarget = toNullableNumber(form.caloriesTarget);
        const proteinTarget = toNullableNumber(form.proteinTarget);
        const carbsTarget = toNullableNumber(form.carbsTarget);
        const fatTarget = toNullableNumber(form.fatTarget);

        if (!form.firstName.trim()) errors.firstName = "Името е задължително.";
        if (!form.lastName.trim()) errors.lastName = "Фамилията е задължителна.";
        if (!form.gender) errors.gender = "Пол е задължително поле.";
        if (age == null) errors.age = "Възраст е задължително поле.";
        if (age != null && (Number.isNaN(age) || age < 10 || age > 100)) errors.age = "Възрастта трябва да е между 10 и 100.";
        if (heightCm == null) errors.heightCm = "Ръст е задължително поле.";
        if (heightCm != null && (Number.isNaN(heightCm) || heightCm < 100 || heightCm > 250)) errors.heightCm = "Ръстът трябва да е между 100 и 250 см.";
        if (goalWeight != null && (Number.isNaN(goalWeight) || goalWeight < 30 || goalWeight > 300)) errors.goalWeight = "Целевото тегло трябва да е между 30 и 300 кг.";
        if (!form.activityLevel) errors.activityLevel = "Ниво на активност е задължително поле.";
        if (!form.goalType) errors.goalType = "Цел е задължително поле.";
        if (caloriesTarget != null && (Number.isNaN(caloriesTarget) || caloriesTarget < 0)) errors.caloriesTarget = "Калорийният таргет не може да е отрицателен.";
        if (proteinTarget != null && (Number.isNaN(proteinTarget) || proteinTarget < 0)) errors.proteinTarget = "Протеинът не може да е отрицателен.";
        if (carbsTarget != null && (Number.isNaN(carbsTarget) || carbsTarget < 0)) errors.carbsTarget = "Въглехидратите не могат да са отрицателни.";
        if (fatTarget != null && (Number.isNaN(fatTarget) || fatTarget < 0)) errors.fatTarget = "Мазнините не могат да са отрицателни.";

        return errors;
    };

    const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
        setForm((prev) => ({ ...prev, [key]: value }));
        setFieldErrors((prev) => ({ ...prev, [key]: undefined }));
        if (key === "caloriesTarget" || key === "proteinTarget" || key === "carbsTarget" || key === "fatTarget") {
            setManualTargets(true);
        }
    };

    const onRecalculateTargets = () => {
        setRecalcError(null);
        const age = toNullableNumber(form.age);
        const heightCm = toNullableNumber(form.heightCm);

        if (!form.gender || !form.activityLevel || !form.goalType || age == null || heightCm == null) {
            setRecalcError("Попълни пол, възраст, ръст, активност и цел преди преизчисляване.");
            return;
        }
        if (currentWeight == null) {
            setRecalcError("Няма текущо тегло от прогреса. Добави запис в Тегло и опитай отново.");
            return;
        }
        if (age < 10 || age > 100 || heightCm < 100 || heightCm > 250 || currentWeight < 30 || currentWeight > 300) {
            setRecalcError("Данните са извън валидните граници за изчисление.");
            return;
        }

        const hasManualValues = !!(form.caloriesTarget || form.proteinTarget || form.carbsTarget || form.fatTarget);
        if (manualTargets && hasManualValues) {
            const shouldOverride = window.confirm("Ще презапишем ръчно въведените таргети. Продължаваме ли?");
            if (!shouldOverride) return;
        }

        const bmr = calculateBMR(form.gender as Sex, age, heightCm, currentWeight);
        const tdee = calculateTDEE(bmr, form.activityLevel);
        const calories = calculateCaloriesForGoal(tdee, mapGoalToCalculator(form.goalType)).calories;
        const macros = calculateMacros(calories, currentWeight, mapGoalToCalculator(form.goalType));

        setForm((prev) => ({
            ...prev,
            caloriesTarget: String(Math.round(calories)),
            proteinTarget: String(Math.round(macros.protein)),
            carbsTarget: String(Math.round(macros.carbs)),
            fatTarget: String(Math.round(macros.fat)),
        }));
        setManualTargets(false);
    };

    const onSaveProfile = async () => {
        const errors = validate();
        setFieldErrors(errors);
        if (Object.keys(errors).length > 0) return;

        const updated = await save({
            firstName: form.firstName.trim(),
            lastName: form.lastName.trim(),
            gender: (form.gender || null) as ProfileGender | null,
            age: toNullableNumber(form.age),
            heightCm: toNullableNumber(form.heightCm),
            goalWeight: toNullableNumber(form.goalWeight),
            activityLevel: (form.activityLevel || null) as ProfileActivityLevel | null,
            goalType: (form.goalType || null) as ProfileGoalType | null,
            caloriesTarget: toNullableNumber(form.caloriesTarget),
            proteinTarget: toNullableNumber(form.proteinTarget),
            carbsTarget: toNullableNumber(form.carbsTarget),
            fatTarget: toNullableNumber(form.fatTarget),
        });

        if (updated) {
            await refreshUser();
        }
    };

    return (
        <>
            <style>{PF_CSS}</style>
            {isSidebarOpen && (
                <div
                    style={{ position: "fixed", inset: 0, zIndex: 299, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)", cursor: "pointer" }}
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
            <div className="pf-page">
                <DashboardSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
                <div className="pf-main">
                    <ProfileHeader
                        onToggleSidebar={() => setIsSidebarOpen((open) => !open)}
                        onAction={onSaveProfile}
                        actionLabel={isSaving ? "Запазване..." : "Запази"}
                        actionDisabled={isSaving || isLoading}
                        initials={initials}
                        avatarUrl={profile?.avatarUrl ?? user?.avatarUrl}
                    />
                    <div className="pf-content">
                        {error && (
                            <div className="pf-error-box">
                                <span className="body-sm" style={{ color: "var(--c-error,#FF3D57)" }}>Грешка при зареждане: {error}</span>
                                <div style={{ marginTop: "var(--sp-2)" }}>
                                    <button type="button" className="btn-ghost btn-sm" onClick={() => void refresh()}>Опитай отново</button>
                                </div>
                            </div>
                        )}

                        {saveError && (
                            <div className="pf-error-box">
                                <span className="body-sm" style={{ color: "var(--c-error,#FF3D57)" }}>Грешка при запазване: {saveError}</span>
                            </div>
                        )}

                        {saveSuccess && (
                            <div className="pf-success-box">
                                <span className="body-sm" style={{ color: "#00E676" }}>{saveSuccess}</span>
                            </div>
                        )}

                        <div className="pf-top-grid">
                            <ProductStatCard label="Профил" value={form.firstName && form.lastName ? `${form.firstName} ${form.lastName}` : "Непълен"} sub={summaryText} accent="лични данни" accentColor="var(--c-acid,#C8FF00)" />
                            <ProductStatCard label="Текущо тегло" value={currentWeight != null ? `${currentWeight.toFixed(1)} кг` : "Няма данни"} sub="източник: последен запис от Прогрес" accent="/api/progress" accentColor="var(--c-electric,#0066FF)" />
                            <ProductStatCard label="Калориен таргет" value={form.caloriesTarget ? `${form.caloriesTarget} kcal` : "Няма"} sub={form.goalType ? GOAL_OPTIONS.find((g) => g.value === form.goalType)?.label ?? "" : "Задай цел"} accent="персонален" accentColor="var(--c-electric,#0066FF)" />
                            <ProductStatCard label="Макроси" value={macroSummary} sub="протеин / въглехидрати / мазнини" accent="дневни таргети" accentColor="rgba(255,255,255,0.45)" />
                        </div>

                        <div className="pf-main-grid">
                            <div className="card pf-card" style={{ display: "flex", flexDirection: "column", gap: "var(--sp-5)" }}>
                                <div className="pf-profile-hero">
                                    <div className="pf-hero-avatar" style={{ overflow: "hidden" }}>
                                        {profile?.avatarUrl
                                            ? <img src={profile.avatarUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                            : initials}
                                    </div>
                                    <div style={{ minWidth: 0 }}>
                                        <div className="label text-gray">FitLife ID</div>
                                        <div style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 900, color: "var(--color-cream)", lineHeight: 1.05, marginTop: 6 }}>{form.firstName || form.lastName ? `${form.firstName} ${form.lastName}` : "Профил"}</div>
                                        <div className="body-sm text-gray" style={{ marginTop: 8 }}>{form.email || "-"}</div>
                                        <div className="pf-chip-row" style={{ marginTop: "var(--sp-3)" }}>
                                            <span className="pf-chip">{form.activityLevel ? ACTIVITY_OPTIONS.find((a) => a.value === form.activityLevel)?.label : "Без активност"}</span>
                                            <span className="pf-chip">{form.goalType ? GOAL_OPTIONS.find((g) => g.value === form.goalType)?.label : "Без цел"}</span>
                                            <span className="pf-chip">{profile?.updatedAt ? `обновен: ${new Date(profile.updatedAt).toLocaleDateString("bg-BG")}` : "нов профил"}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="pf-note-box body-sm text-gray">Профилът е личен за всеки потребител. Текущото тегло се взима от последния запис в секция Тегло/Прогрес.</div>
                            </div>

                            <div className="card pf-card" style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
                                <div>
                                    <div className="label text-gray">A. Основна информация</div>
                                    <div className="heading-sm" style={{ color: "var(--color-cream)", marginTop: 4 }}>Име, имейл и лични данни</div>
                                </div>

                                <div className="pf-form-grid">
                                    <label className="pf-field">
                                        <span className="label text-gray">Име</span>
                                        <input className="pf-input" value={form.firstName} onChange={(e) => setField("firstName", e.target.value)} />
                                        {fieldErrors.firstName && <span className="pf-field-error">{fieldErrors.firstName}</span>}
                                    </label>
                                    <label className="pf-field">
                                        <span className="label text-gray">Фамилия</span>
                                        <input className="pf-input" value={form.lastName} onChange={(e) => setField("lastName", e.target.value)} />
                                        {fieldErrors.lastName && <span className="pf-field-error">{fieldErrors.lastName}</span>}
                                    </label>
                                    <label className="pf-field">
                                        <span className="label text-gray">Имейл</span>
                                        <input className="pf-input" value={form.email} readOnly disabled />
                                    </label>
                                    <label className="pf-field">
                                        <span className="label text-gray">Пол</span>
                                        <select className="pf-select" value={form.gender} onChange={(e) => setField("gender", e.target.value as FormState["gender"])}>
                                            <option value="">Избери</option>
                                            <option value="male">Мъж</option>
                                            <option value="female">Жена</option>
                                        </select>
                                        {fieldErrors.gender && <span className="pf-field-error">{fieldErrors.gender}</span>}
                                    </label>
                                    <label className="pf-field">
                                        <span className="label text-gray">Възраст</span>
                                        <input className="pf-input" type="number" inputMode="numeric" value={form.age} onChange={(e) => setField("age", e.target.value)} />
                                        {fieldErrors.age && <span className="pf-field-error">{fieldErrors.age}</span>}
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="pf-bottom-grid">
                            <div className="card pf-card" style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
                                <div>
                                    <div className="label text-gray">B, C и D. Тяло, активност и таргети</div>
                                    <div className="heading-sm" style={{ color: "var(--color-cream)", marginTop: 4 }}>Метрики и хранителни настройки</div>
                                </div>

                                <div className="pf-form-grid">
                                    <label className="pf-field">
                                        <span className="label text-gray">Ръст (см)</span>
                                        <input className="pf-input" type="number" inputMode="decimal" value={form.heightCm} onChange={(e) => setField("heightCm", e.target.value)} />
                                        {fieldErrors.heightCm && <span className="pf-field-error">{fieldErrors.heightCm}</span>}
                                    </label>
                                    <label className="pf-field">
                                        <span className="label text-gray">Текущо тегло (кг)</span>
                                        <input className="pf-input" value={currentWeight != null ? currentWeight.toFixed(1) : ""} placeholder="Няма данни" readOnly disabled />
                                    </label>
                                    <label className="pf-field">
                                        <span className="label text-gray">Целево тегло (кг)</span>
                                        <input className="pf-input" type="number" inputMode="decimal" value={form.goalWeight} onChange={(e) => setField("goalWeight", e.target.value)} />
                                        {fieldErrors.goalWeight && <span className="pf-field-error">{fieldErrors.goalWeight}</span>}
                                    </label>
                                    <label className="pf-field">
                                        <span className="label text-gray">Ниво на активност</span>
                                        <select className="pf-select" value={form.activityLevel} onChange={(e) => setField("activityLevel", e.target.value as FormState["activityLevel"])}>
                                            <option value="">Избери</option>
                                            {ACTIVITY_OPTIONS.map((option) => (
                                                <option key={option.value} value={option.value}>{option.label}</option>
                                            ))}
                                        </select>
                                        {fieldErrors.activityLevel && <span className="pf-field-error">{fieldErrors.activityLevel}</span>}
                                    </label>
                                    <label className="pf-field">
                                        <span className="label text-gray">Цел</span>
                                        <select className="pf-select" value={form.goalType} onChange={(e) => setField("goalType", e.target.value as FormState["goalType"])}>
                                            <option value="">Избери</option>
                                            {GOAL_OPTIONS.map((option) => (
                                                <option key={option.value} value={option.value}>{option.label}</option>
                                            ))}
                                        </select>
                                        {fieldErrors.goalType && <span className="pf-field-error">{fieldErrors.goalType}</span>}
                                    </label>
                                    <label className="pf-field">
                                        <span className="label text-gray">Калориен таргет (kcal)</span>
                                        <input className="pf-input" type="number" inputMode="numeric" value={form.caloriesTarget} onChange={(e) => setField("caloriesTarget", e.target.value)} />
                                        {fieldErrors.caloriesTarget && <span className="pf-field-error">{fieldErrors.caloriesTarget}</span>}
                                    </label>
                                    <label className="pf-field">
                                        <span className="label text-gray">Протеин (г)</span>
                                        <input className="pf-input" type="number" inputMode="decimal" value={form.proteinTarget} onChange={(e) => setField("proteinTarget", e.target.value)} />
                                        {fieldErrors.proteinTarget && <span className="pf-field-error">{fieldErrors.proteinTarget}</span>}
                                    </label>
                                    <label className="pf-field">
                                        <span className="label text-gray">Въглехидрати (г)</span>
                                        <input className="pf-input" type="number" inputMode="decimal" value={form.carbsTarget} onChange={(e) => setField("carbsTarget", e.target.value)} />
                                        {fieldErrors.carbsTarget && <span className="pf-field-error">{fieldErrors.carbsTarget}</span>}
                                    </label>
                                    <label className="pf-field">
                                        <span className="label text-gray">Мазнини (г)</span>
                                        <input className="pf-input" type="number" inputMode="decimal" value={form.fatTarget} onChange={(e) => setField("fatTarget", e.target.value)} />
                                        {fieldErrors.fatTarget && <span className="pf-field-error">{fieldErrors.fatTarget}</span>}
                                    </label>
                                </div>

                                {recalcError && <div className="pf-error-box"><span className="body-sm" style={{ color: "var(--c-error,#FF3D57)" }}>{recalcError}</span></div>}

                                <div className="pf-inline-actions">
                                    <button type="button" className="btn-ghost btn-sm" onClick={onRecalculateTargets}>Преизчисли таргетите</button>
                                    <button type="button" className="btn-primary btn-sm" disabled={isSaving || isLoading} onClick={onSaveProfile}>{isSaving ? "Запазване..." : "Запази профила"}</button>
                                </div>

                                <div className="pf-note-box body-sm text-gray">При преизчисляване таргетите не се презаписват автоматично без потвърждение, ако вече са редактирани ръчно.</div>
                            </div>

                            <div className="card pf-card" style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
                                <div>
                                    <div className="label text-gray">Профилни действия</div>
                                    <div className="heading-sm" style={{ color: "var(--color-cream)", marginTop: 4 }}>Сигурност и допълнения</div>
                                </div>
                                <div className="pf-list">
                                    <AvatarUploadBox profile={profile} onChanged={async () => {
                                        await refresh();
                                        await refreshUser();
                                    }} />
                                    <div className="pf-info-box">
                                        <div className="label text-gray">Парола</div>
                                        <div className="body-sm" style={{ color: "var(--color-cream)", marginTop: 6 }}>Смяна на парола: използвай текущия auth flow за reset.</div>
                                    </div>
                                    <div className="pf-info-box">
                                        <div className="label text-gray">Източник на тегло</div>
                                        <div className="body-sm" style={{ color: "var(--color-cream)", marginTop: 6 }}>Историята на теглото остава в Прогрес (/api/progress) и не се дублира в профила.</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

// ─── AvatarUploadBox ──────────────────────────────────────────────────────────

const AVATAR_ALLOWED = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

function AvatarUploadBox({
    profile,
    onChanged,
}: {
    profile: ApiProfile | null;
    onChanged: () => Promise<void>;
}): JSX.Element {
    const fileRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [blobUrl, setBlobUrl] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [err, setErr] = useState("");
    const [ok, setOk] = useState(false);

    // Revoke the object URL when it's replaced or the component unmounts.
    useEffect(() => {
        return () => {
            if (blobUrl) URL.revokeObjectURL(blobUrl);
        };
    }, [blobUrl]);

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setErr("");
        setOk(false);
        if (!AVATAR_ALLOWED.includes(file.type)) {
            setErr("Само изображения (jpg, jpeg, png, webp).");
            return;
        }
        if (file.size > 5_000_000) {
            setErr("Файлът е твърде голям — максимум 5 MB.");
            return;
        }
        if (blobUrl) URL.revokeObjectURL(blobUrl);
        setSelectedFile(file);
        setBlobUrl(URL.createObjectURL(file));
    };

    const handleSave = async () => {
        if (!selectedFile) return;
        setSaving(true);
        setErr("");
        try {
            await profileApi.uploadAvatar(selectedFile);
            setSelectedFile(null);
            if (blobUrl) { URL.revokeObjectURL(blobUrl); setBlobUrl(null); }
            await onChanged();
            setOk(true);
            setTimeout(() => setOk(false), 3000);
        } catch (e) {
            setErr(e instanceof Error ? e.message : "Грешка при качване.");
        } finally {
            setSaving(false);
        }
    };

    const handleRemove = async () => {
        setSaving(true);
        setErr("");
        try {
            await profileApi.deleteAvatar();
            setSelectedFile(null);
            if (blobUrl) { URL.revokeObjectURL(blobUrl); setBlobUrl(null); }
            await onChanged();
            setOk(true);
            setTimeout(() => setOk(false), 3000);
        } catch (e) {
            setErr(e instanceof Error ? e.message : "Грешка при премахване.");
        } finally {
            setSaving(false);
        }
    };

    const displaySrc = blobUrl ?? profile?.avatarUrl ?? null;

    return (
        <div className="pf-info-box" style={{ display: "flex", flexDirection: "column", gap: "var(--sp-3)" }}>
            <div className="label text-gray">Аватар</div>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--sp-4)" }}>
                <div style={{
                    width: 72, height: 72, borderRadius: 16, overflow: "hidden", flexShrink: 0,
                    background: "linear-gradient(135deg,rgba(0,102,255,0.22),rgba(200,255,0,0.18))",
                    border: "1px solid rgba(255,255,255,0.08)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                    {displaySrc
                        ? <img src={displaySrc} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        : <span style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", fontWeight: 900, color: "var(--color-cream)" }}>
                            {profile ? getInitials({ firstName: profile.firstName, lastName: profile.lastName, id: "", email: "", role: "user" }) : "?"}
                          </span>
                    }
                </div>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "var(--sp-2)" }}>
                    <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" style={{ display: "none" }} onChange={handleFile} />
                    <button type="button" className="btn-ghost btn-sm" onClick={() => fileRef.current?.click()}>
                        📷 Избери снимка
                    </button>
                    {selectedFile && (
                        <button type="button" className="btn-primary btn-sm" disabled={saving} onClick={handleSave}>
                            {saving ? "Качване…" : "Запази аватара"}
                        </button>
                    )}
                    {!selectedFile && profile?.avatarUrl && (
                        <button type="button" className="btn-ghost btn-sm" disabled={saving} onClick={handleRemove}
                            style={{ color: "var(--c-error,#FF3D57)", borderColor: "rgba(255,61,87,0.25)" }}>
                            Премахни аватара
                        </button>
                    )}
                </div>
            </div>
            {err && <div className="pf-error-box"><span className="body-sm" style={{ color: "var(--c-error,#FF3D57)" }}>{err}</span></div>}
            {ok  && <div className="pf-success-box"><span className="body-sm" style={{ color: "#00E676" }}>✓ Аватарът е запазен.</span></div>}
            <div className="label text-gray">Макс. 5 MB · jpg, jpeg, png, webp</div>
        </div>
    );
}

export default Profile;


