import { useState } from "react";
import type { JSX } from "react";
import DashboardSidebar from "../../layout/DashboardLayout/DashboardSidebar";
import ProductStatCard from "../Products/sections/ProductStatCard";
import SettingsHeader from "./sections/SettingsHeader";
import useLocalStorageState from "../../hooks/useLocalStorageState";

type SettingsProps = { theme: "dark" | "light"; onToggleTheme: () => void };

function ToggleRow({
    label,
    description,
    checked,
    onToggle,
}: {
    label: string;
    description: string;
    checked: boolean;
    onToggle: () => void;
}): JSX.Element {
    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "var(--sp-3)",
                padding: "12px",
                borderRadius: "var(--r-lg)",
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.06)",
            }}
        >
            <div style={{ minWidth: 0 }}>
                <div className="body-sm" style={{ color: "var(--color-cream)", fontWeight: 700 }}>{label}</div>
                <div className="label text-gray" style={{ marginTop: 6, lineHeight: 1.5 }}>{description}</div>
            </div>
            <button
                type="button"
                onClick={onToggle}
                aria-pressed={checked}
                style={{
                    position: "relative",
                    width: 54,
                    height: 30,
                    borderRadius: 999,
                    background: checked ? "rgba(0,102,255,0.22)" : "rgba(255,255,255,0.08)",
                    border: `1px solid ${checked ? "rgba(0,102,255,0.4)" : "rgba(255,255,255,0.12)"}`,
                    flexShrink: 0,
                    cursor: "pointer",
                }}
            >
                <span
                    style={{
                        position: "absolute",
                        top: 3,
                        left: checked ? 27 : 3,
                        width: 22,
                        height: 22,
                        borderRadius: "50%",
                        background: checked ? "var(--c-electric,#0066FF)" : "rgba(255,255,255,0.45)",
                        transition: "left 0.18s ease",
                    }}
                />
            </button>
        </div>
    );
}

function SelectRow({
    label,
    description,
    value,
    onChange,
    options,
}: {
    label: string;
    description: string;
    value: string;
    onChange: (value: string) => void;
    options: { value: string; label: string }[];
}): JSX.Element {
    return (
        <div
            style={{
                padding: "12px",
                borderRadius: "var(--r-lg)",
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.06)",
            }}
        >
            <div className="body-sm" style={{ color: "var(--color-cream)", fontWeight: 700 }}>{label}</div>
            <div className="label text-gray" style={{ marginTop: 6, lineHeight: 1.5 }}>{description}</div>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                style={{
                    width: "100%",
                    marginTop: 10,
                    padding: "10px 12px",
                    borderRadius: "var(--r-md)",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "var(--color-cream)",
                    outline: "none",
                }}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
}

const ST_CSS = `
.dash-sidebar { position: sticky; top: 0; height: 100vh; overflow-y: auto; flex-shrink: 0; }
.dash-sidebar-close { display: none !important; }
.st-page { display: flex; min-height: 100vh; background: var(--c-bg,#080C10); overflow-x: clip; }
.st-main { flex: 1; min-width: 0; display: flex; flex-direction: column; overflow: auto; overflow-x: hidden; }
.st-content { padding: var(--sp-5) var(--sp-6); display: flex; flex-direction: column; gap: var(--sp-4); }
.st-header { padding: var(--sp-4) var(--sp-6); border-bottom: 1px solid var(--c-border,rgba(255,255,255,0.06)); display: flex; justify-content: space-between; align-items: center; gap: var(--sp-3); background: var(--c-surface-1,#0E1318); }
.st-header-right { display: flex; align-items: center; gap: var(--sp-3); flex-shrink: 0; }
.st-avatar { width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg,var(--c-electric,#0066FF),var(--c-acid,#C8FF00)); display: flex; align-items: center; justify-content: center; font-family: var(--font-display); font-size: 0.8rem; font-weight: 700; color: var(--c-bg,#080C10); flex-shrink: 0; }
.st-badge { display: flex; align-items: center; gap: 8px; padding: 8px 12px; border-radius: 999px; background: rgba(0,102,255,0.08); border: 1px solid rgba(0,102,255,0.18); color: var(--c-electric,#0066FF); font-weight: 800; }
.st-hamburger { display: none; }
.st-title { font-family: var(--font-display); font-size: 1.5rem; font-weight: 800; color: var(--color-cream); line-height: 1.15; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.st-header-sub { margin-top: 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-transform: capitalize; }
.st-top-grid { display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap: var(--sp-3); }
.st-main-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--sp-4); align-items: start; }
.st-card { padding: var(--sp-5); box-sizing: border-box; min-width: 0; }
.st-list { display: grid; gap: var(--sp-3); }
@media (max-width: 1280px) {
  .st-top-grid { grid-template-columns: repeat(2, minmax(0,1fr)); }
  .st-main-grid { grid-template-columns: 1fr; }
}
@media (max-width: 768px) {
  .dash-sidebar { position: fixed; left: 0; top: 0; bottom: 0; height: 100%; z-index: 300; transform: translateX(-100%); transition: transform 0.28s cubic-bezier(0.4,0,0.2,1); }
  .dash-sidebar.dash-sidebar--open { transform: translateX(0); box-shadow: 8px 0 48px rgba(0,0,0,0.85); }
  .dash-sidebar-close { display: flex !important; }
  .st-hamburger { display: flex; align-items: center; justify-content: center; background: transparent; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 8px 10px; cursor: pointer; color: var(--color-cream); flex-shrink: 0; }
  .st-header { padding: var(--sp-3) var(--sp-4); }
  .st-content { padding: var(--sp-3) var(--sp-4); }
  .st-title { font-size: 1rem !important; }
  .st-header-sub, .st-avatar { display: none; }
  .st-top-grid { grid-template-columns: 1fr; }
}
@media (max-width: 480px) {
  .st-card { padding: var(--sp-4); }
}
`;

function Settings({ theme, onToggleTheme }: SettingsProps): JSX.Element {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [notice, setNotice] = useState("");

    const [pushNotifications, setPushNotifications] = useLocalStorageState("fitlife-settings-push", true);
    const [emailReports, setEmailReports] = useLocalStorageState("fitlife-settings-email", true);
    const [challengeReminders, setChallengeReminders] = useLocalStorageState("fitlife-settings-challenges", true);
    const [mealReminders, setMealReminders] = useLocalStorageState("fitlife-settings-meals", false);
    const [privateProfile, setPrivateProfile] = useLocalStorageState("fitlife-settings-private-profile", true);
    const [showOnlineStatus, setShowOnlineStatus] = useLocalStorageState("fitlife-settings-online-status", false);
    const [biometricLock, setBiometricLock] = useLocalStorageState("fitlife-settings-biometric", false);
    const [healthSync, setHealthSync] = useLocalStorageState("fitlife-settings-health-sync", true);
    const [wearableSync, setWearableSync] = useLocalStorageState("fitlife-settings-wearable-sync", false);
    const [autoBackup, setAutoBackup] = useLocalStorageState("fitlife-settings-backup", true);

    const [units, setUnits] = useLocalStorageState("fitlife-settings-units", "metric");
    const [language, setLanguage] = useLocalStorageState("fitlife-settings-language", "bg");
    const [weekStarts, setWeekStarts] = useLocalStorageState("fitlife-settings-week-starts", "monday");
    const [privacyLevel, setPrivacyLevel] = useLocalStorageState("fitlife-settings-privacy", "private");
    const [calorieGoalSource, setCalorieGoalSource] = useLocalStorageState("fitlife-settings-calorie-source", "adaptive");
    const [dashboardFocus, setDashboardFocus] = useLocalStorageState("fitlife-settings-dashboard-focus", "calories");

    function readJson<T>(key: string, fallback: T): T {
        try {
            const raw = window.localStorage.getItem(key);
            return raw ? (JSON.parse(raw) as T) : fallback;
        } catch {
            return fallback;
        }
    }

    function handleDataAction(title: string) {
        if (title === "Export personal data") {
            const exportPayload = {
                exportedAt: new Date().toISOString(),
                profile: readJson("fitlife-profile-page", null),
                auth: readJson("fitlife-auth", null),
                settings: {
                    pushNotifications,
                    emailReports,
                    challengeReminders,
                    mealReminders,
                    privateProfile,
                    showOnlineStatus,
                    biometricLock,
                    healthSync,
                    wearableSync,
                    autoBackup,
                    units,
                    language,
                    weekStarts,
                    privacyLevel,
                    calorieGoalSource,
                    dashboardFocus,
                },
                foodLog: readJson("fitlife-food-log", []),
                weightLog: readJson("fitlife-weight-log", []),
                workouts: readJson("fitlife-workout-log", []),
                recipes: readJson("fitlife-custom-recipes", []),
                cart: readJson("fitlife-shop-cart", []),
                messages: readJson("fitlife-contact-messages", []),
            };

            window.localStorage.setItem("fitlife-last-export", JSON.stringify(exportPayload));
            setNotice("Локален export е подготвен и записан в fitlife-last-export.");
            return;
        }

        if (title === "Reset onboarding answers") {
            window.localStorage.removeItem("fitlife-profile");
            window.localStorage.removeItem("fitlife-password-reset-request");
            setNotice("Onboarding данните са нулирани локално.");
            return;
        }

        if (title === "Clear local cache") {
            [
                "fitlife-food-log",
                "fitlife-weight-log",
                "fitlife-workout-log",
                "fitlife-custom-recipes",
                "fitlife-shop-cart",
                "fitlife-contact-messages",
                "fitlife-last-export",
            ].forEach((key) => window.localStorage.removeItem(key));
            setNotice("Временните локални данни и кешът са изчистени.");
            return;
        }

        if (title === "Request account deletion") {
            window.localStorage.setItem(
                "fitlife-delete-request",
                JSON.stringify({
                    requestedAt: new Date().toISOString(),
                    email: readJson<{ email?: string } | null>("fitlife-auth", null)?.email ?? null,
                    status: "pending-local-review",
                }),
            );
            setNotice("Локална заявка за изтриване е подадена и маркирана за бъдещ backend flow.");
        }
    }

    return (
        <>
            <style>{ST_CSS}</style>
            {isSidebarOpen && (
                <div
                    style={{ position: "fixed", inset: 0, zIndex: 299, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)", cursor: "pointer" }}
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
            <div className="st-page">
                <DashboardSidebar theme={theme} onToggleTheme={onToggleTheme} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
                <div className="st-main">
                    <SettingsHeader onToggleSidebar={() => setIsSidebarOpen((open) => !open)} />
                    <div className="st-content">
                        {notice && (
                            <div className="card st-card" style={{ padding: "14px 16px", background: "rgba(0,102,255,0.08)", border: "1px solid rgba(0,102,255,0.18)", color: "var(--color-cream)" }}>
                                {notice}
                            </div>
                        )}
                        <div className="st-top-grid">
                            <ProductStatCard label="Appearance" value={theme === "light" ? "Light" : "Dark"} sub="активната тема на приложението" accent="live" accentColor="var(--c-electric,#0066FF)" />
                            <ProductStatCard label="Notifications" value={pushNotifications ? "On" : "Off"} sub="push, reminders и weekly reports" accent={emailReports ? "email sync" : "email off"} accentColor="var(--c-acid,#C8FF00)" />
                            <ProductStatCard label="Privacy" value={privacyLevel === "private" ? "Private" : privacyLevel === "friends" ? "Friends" : "Public"} sub="видимост на профил и активност" accent={privateProfile ? "safe" : "shared"} accentColor="rgba(255,255,255,0.45)" />
                            <ProductStatCard label="Sync" value={healthSync ? "Connected" : "Manual"} sub={wearableSync ? "health + wearable" : "health only"} accent={autoBackup ? "backup on" : "backup off"} accentColor="var(--c-acid,#C8FF00)" />
                        </div>

                        <div className="st-main-grid">
                            <div className="card st-card" style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
                                <div>
                                    <div className="label text-gray">Appearance & Experience</div>
                                    <div className="heading-sm" style={{ color: "var(--color-cream)", marginTop: 4 }}>Как се държи приложението за теб</div>
                                </div>
                                <div className="st-list">
                                    <ToggleRow label="Dark / Light theme" description="Използва глобалната тема на приложението и dashboard-а." checked={theme === "light"} onToggle={onToggleTheme} />
                                    <SelectRow label="Language" description="Основен език на интерфейса и системните съобщения." value={language} onChange={setLanguage} options={[{ value: "bg", label: "Български" }, { value: "en", label: "English" }]} />
                                    <SelectRow label="Units" description="Избор между метрична и имперска система за тегло, ръст и разстояния." value={units} onChange={setUnits} options={[{ value: "metric", label: "Metric · kg / cm / km" }, { value: "imperial", label: "Imperial · lb / ft / mi" }]} />
                                    <SelectRow label="Week starts on" description="Важно за calorie, weight, workout и challenge графики." value={weekStarts} onChange={setWeekStarts} options={[{ value: "monday", label: "Понеделник" }, { value: "sunday", label: "Неделя" }]} />
                                </div>
                            </div>

                            <div className="card st-card" style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
                                <div>
                                    <div className="label text-gray">Notifications</div>
                                    <div className="heading-sm" style={{ color: "var(--color-cream)", marginTop: 4 }}>Напомняния и полезни сигнали</div>
                                </div>
                                <div className="st-list">
                                    <ToggleRow label="Push notifications" description="Общи нотификации за streak, прогрес и daily nudges." checked={pushNotifications} onToggle={() => setPushNotifications((v) => !v)} />
                                    <ToggleRow label="Weekly email reports" description="Седмичен digest за калории, тегло и активности." checked={emailReports} onToggle={() => setEmailReports((v) => !v)} />
                                    <ToggleRow label="Meal reminders" description="Напомняния за логване на хранения и вода." checked={mealReminders} onToggle={() => setMealReminders((v) => !v)} />
                                    <ToggleRow label="Challenge reminders" description="Updates за active challenges, ranking и earned rewards." checked={challengeReminders} onToggle={() => setChallengeReminders((v) => !v)} />
                                </div>
                            </div>
                        </div>

                        <div className="st-main-grid">
                            <div className="card st-card" style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
                                <div>
                                    <div className="label text-gray">Privacy & Security</div>
                                    <div className="heading-sm" style={{ color: "var(--color-cream)", marginTop: 4 }}>Контрол върху профила и достъпа</div>
                                </div>
                                <div className="st-list">
                                    <SelectRow label="Profile visibility" description="Кой може да вижда профила, badge-овете и challenge участието ти." value={privacyLevel} onChange={setPrivacyLevel} options={[{ value: "private", label: "Само за мен" }, { value: "friends", label: "Само приятели" }, { value: "public", label: "Публичен" }]} />
                                    <ToggleRow label="Private profile mode" description="Скрива activity feed и progress snapshots от другите." checked={privateProfile} onToggle={() => setPrivateProfile((v) => !v)} />
                                    <ToggleRow label="Show online status" description="Показва кога си активен за social/challenge функционалности." checked={showOnlineStatus} onToggle={() => setShowOnlineStatus((v) => !v)} />
                                    <ToggleRow label="Biometric / quick lock" description="Допълнителна защита при отваряне на приложението." checked={biometricLock} onToggle={() => setBiometricLock((v) => !v)} />
                                </div>
                            </div>

                            <div className="card st-card" style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
                                <div>
                                    <div className="label text-gray">Integrations & Sync</div>
                                    <div className="heading-sm" style={{ color: "var(--color-cream)", marginTop: 4 }}>Свързани платформи и backup</div>
                                </div>
                                <div className="st-list">
                                    <ToggleRow label="Health data sync" description="Синхронизира стъпки, активност и basic wellness данни." checked={healthSync} onToggle={() => setHealthSync((v) => !v)} />
                                    <ToggleRow label="Wearable sync" description="Смарт часовник / тракер за workouts, HR и калории." checked={wearableSync} onToggle={() => setWearableSync((v) => !v)} />
                                    <ToggleRow label="Automatic cloud backup" description="Съхранява профил, history и preferences сигурно в облака." checked={autoBackup} onToggle={() => setAutoBackup((v) => !v)} />
                                    <div style={{ padding: "12px", borderRadius: "var(--r-lg)", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                                        <div className="body-sm" style={{ color: "var(--color-cream)", fontWeight: 700 }}>Connected services</div>
                                        <div className="label text-gray" style={{ marginTop: 6, lineHeight: 1.5 }}>Apple Health / Google Fit ready, wearable bridge prepared, nutrition export compatible.</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="st-main-grid">
                            <div className="card st-card" style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
                                <div>
                                    <div className="label text-gray">Goals & Tracking Defaults</div>
                                    <div className="heading-sm" style={{ color: "var(--color-cream)", marginTop: 4 }}>Какво да следим по подразбиране</div>
                                </div>
                                <div className="st-list">
                                    <div style={{ padding: "12px", borderRadius: "var(--r-lg)", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                                        <div className="body-sm" style={{ color: "var(--color-cream)", fontWeight: 700 }}>Default health targets</div>
                                        <div className="label text-gray" style={{ marginTop: 6 }}>Calories, protein, water, weight trend, steps and workout consistency.</div>
                                    </div>
                                    <SelectRow label="Default calorie goal source" description="Кой модул да има приоритет при обновяване на дневния таргет." value={calorieGoalSource} onChange={setCalorieGoalSource} options={[{ value: "adaptive", label: "Adaptive from progress" }, { value: "manual", label: "Manual goal" }, { value: "coach", label: "Coach / plan based" }]} />
                                    <SelectRow label="Default dashboard focus" description="Кой KPI да се показва най-отгоре при влизане." value={dashboardFocus} onChange={setDashboardFocus} options={[{ value: "calories", label: "Calories" }, { value: "weight", label: "Weight" }, { value: "training", label: "Training" }, { value: "challenges", label: "Challenges" }]} />
                                </div>
                            </div>

                            <div className="card st-card" style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
                                <div>
                                    <div className="label text-gray">Data & Account Actions</div>
                                    <div className="heading-sm" style={{ color: "var(--color-cream)", marginTop: 4 }}>По-силни действия за акаунта</div>
                                </div>
                                <div className="st-list">
                                    {[
                                        ["Export personal data", "Сваля историята на тегло, логове, цели и preferences в архив."],
                                        ["Reset onboarding answers", "Позволява повторно попълване на ръст, тегло, цел и активност."],
                                        ["Clear local cache", "Изчиства локално пазени UI preferences и временни данни."],
                                        ["Request account deletion", "Подава заявка за пълно изтриване на профил и история."],
                                    ].map(([title, text]) => (
                                        <button
                                            key={title}
                                            type="button"
                                            onClick={() => handleDataAction(title)}
                                            style={{
                                                textAlign: "left",
                                                padding: "12px",
                                                borderRadius: "var(--r-lg)",
                                                background: "rgba(255,255,255,0.02)",
                                                border: "1px solid rgba(255,255,255,0.06)",
                                                color: "inherit",
                                            }}
                                        >
                                            <div className="body-sm" style={{ color: "var(--color-cream)", fontWeight: 700 }}>{title}</div>
                                            <div className="label text-gray" style={{ marginTop: 6, lineHeight: 1.5 }}>{text}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Settings;
