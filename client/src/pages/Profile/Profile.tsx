import { useState } from "react";
import type { JSX } from "react";
import DashboardSidebar from "../../layout/DashboardLayout/DashboardSidebar";
import ProductStatCard from "../Products/sections/ProductStatCard";
import ProfileHeader from "./sections/ProfileHeader";
import useLocalStorageState from "../../hooks/useLocalStorageState";

type ProfileProps = { theme: "dark" | "light"; onToggleTheme: () => void };

const USER = {
    name: "Мартин Иванов",
    email: "martin@fitlife.bg",
    phone: "+359 88 123 4567",
    city: "София",
    age: 29,
    height: 178,
    weight: 82.4,
    goalWeight: 78,
    bodyFat: 16.8,
    plan: "FitLife Free",
    joined: "януари 2026",
    goal: "Рекомпозиция",
    activity: "Умерено активен",
    training: "4 силови + 2 разходки",
    calories: 2550,
    protein: 165,
    water: 3.2,
    streak: 14,
    checkins: 46,
    badges: 9,
    privacy: "Само за мен",
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
  .pf-top-grid, .pf-info-grid { grid-template-columns: 1fr; }
  .pf-profile-hero { grid-template-columns: 1fr; justify-items: start; }
}
@media (max-width: 480px) {
  .pf-top-grid { grid-template-columns: 1fr; }
  .pf-card { padding: var(--sp-4); }
  .pf-hero-avatar { width: 88px; height: 88px; border-radius: 20px; font-size: 2rem; }
}
`;

function Profile({ theme, onToggleTheme }: ProfileProps): JSX.Element {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [user, setUser] = useLocalStorageState("fitlife-profile-page", USER);

    const bmi = user.weight / ((user.height / 100) * (user.height / 100));
    const goalDelta = user.weight - user.goalWeight;

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
                <DashboardSidebar theme={theme} onToggleTheme={onToggleTheme} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
                <div className="pf-main">
                    <ProfileHeader onToggleSidebar={() => setIsSidebarOpen((open) => !open)} onEditProfile={() => setIsEditing((value) => !value)} />
                    <div className="pf-content">
                        <div className="pf-top-grid">
                            <ProductStatCard label="План" value={user.plan} sub={`активен от ${user.joined}`} accent="current" accentColor="var(--c-acid,#C8FF00)" />
                            <ProductStatCard label="Текуща цел" value={user.goal} sub={`${user.calories} kcal · ${user.protein}g protein`} accent={user.activity} accentColor="var(--c-electric,#0066FF)" />
                            <ProductStatCard label="Streak" value={`${user.streak} дни`} sub="поредни check-in и логове" accent="steady" accentColor="var(--c-acid,#C8FF00)" />
                            <ProductStatCard label="Achievements" value={String(user.badges)} sub={`${user.checkins} check-ins общо`} accent="earned" accentColor="rgba(255,255,255,0.45)" />
                        </div>

                        <div className="pf-main-grid">
                            <div className="card pf-card" style={{ display: "flex", flexDirection: "column", gap: "var(--sp-5)" }}>
                                <div className="pf-profile-hero">
                                    <div className="pf-hero-avatar">МИ</div>
                                    <div style={{ minWidth: 0 }}>
                                        <div className="label text-gray">FitLife ID</div>
                                        <div style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 900, color: "var(--color-cream)", lineHeight: 1.05, marginTop: 6 }}>{user.name}</div>
                                        <div className="body-sm text-gray" style={{ marginTop: 8 }}>{user.email} · {user.phone}</div>
                                        <div className="pf-chip-row" style={{ marginTop: "var(--sp-3)" }}>
                                            <span className="pf-chip">{user.city}</span>
                                            <span className="pf-chip">{user.age} г.</span>
                                            <span className="pf-chip">{user.privacy}</span>
                                        </div>
                                    </div>
                                </div>

                                {isEditing && (
                                    <div className="pf-info-grid">
                                        {[
                                            ["Име", "name", user.name],
                                            ["Имейл", "email", user.email],
                                            ["Телефон", "phone", user.phone],
                                            ["Град", "city", user.city],
                                            ["Цел", "goal", user.goal],
                                            ["Активност", "activity", user.activity],
                                        ].map(([label, key, value]) => (
                                            <label key={key} className="pf-info-box" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                                <span className="label text-gray">{label}</span>
                                                <input
                                                    value={String(value)}
                                                    onChange={(e) => setUser((prev) => ({ ...prev, [key]: e.target.value }))}
                                                    style={{ width: "100%", padding: "10px 12px", borderRadius: "var(--r-md)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "var(--color-cream)", outline: "none" }}
                                                />
                                            </label>
                                        ))}
                                    </div>
                                )}

                                <div>
                                    <div className="label text-gray">Основни данни</div>
                                    <div className="pf-info-grid" style={{ marginTop: "var(--sp-3)" }}>
                                        {[
                                            ["Ръст", `${user.height} см`],
                                            ["Тегло", `${user.weight.toFixed(1)} кг`],
                                            ["Body Fat", `${user.bodyFat}%`],
                                            ["BMI", bmi.toFixed(1)],
                                            ["Goal Weight", `${user.goalWeight} кг`],
                                            ["Delta", `${goalDelta.toFixed(1)} кг`],
                                        ].map(([label, value]) => (
                                            <div key={label} className="pf-info-box">
                                                <div className="label text-gray">{label}</div>
                                                <div style={{ color: "var(--color-cream)", fontWeight: 800, fontSize: "1.05rem", marginTop: 6 }}>{value}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="card pf-card" style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
                                <div>
                                    <div className="label text-gray">Режим и предпочитания</div>
                                    <div className="heading-sm" style={{ color: "var(--color-cream)", marginTop: 4 }}>Персонализация за приложението</div>
                                </div>

                                <div className="pf-list">
                                    {[
                                        ["Активност", user.activity],
                                        ["Тренировъчен шаблон", user.training],
                                        ["Калориен таргет", `${user.calories} kcal / ден`],
                                        ["Протеин", `${user.protein} g / ден`],
                                        ["Вода", `${user.water.toFixed(1)} L / ден`],
                                        ["Поверителност", user.privacy],
                                    ].map(([label, value]) => (
                                        <div key={label} className="pf-info-box">
                                            <div className="label text-gray">{label}</div>
                                            <div className="body-sm" style={{ color: "var(--color-cream)", fontWeight: 700, marginTop: 6 }}>{value}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="pf-bottom-grid">
                            <div className="card pf-card" style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
                                <div>
                                    <div className="label text-gray">Account & Security</div>
                                    <div className="heading-sm" style={{ color: "var(--color-cream)", marginTop: 4 }}>Най-важното за акаунта</div>
                                </div>

                                <div className="pf-list">
                                    {[
                                        ["Имейл потвърден", "Да, активен login email"],
                                        ["Парола", "Последна смяна преди 43 дни"],
                                        ["2FA", "Неактивирано"],
                                        ["Свързани устройства", "iPhone 15 · Chrome on Windows"],
                                        ["Експорт на данни", "Наличен при поискване"],
                                        ["Delete account", "Ръчно потвърждение и пълно изтриване"],
                                    ].map(([label, value]) => (
                                        <div key={label} className="pf-info-box">
                                            <div className="label text-gray">{label}</div>
                                            <div className="body-sm" style={{ color: "var(--color-cream)", marginTop: 6 }}>{value}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="card pf-card" style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
                                <div>
                                    <div className="label text-gray">Membership</div>
                                    <div className="heading-sm" style={{ color: "var(--color-cream)", marginTop: 4 }}>План, perks и следващи стъпки</div>
                                </div>

                                <div style={{ borderRadius: "var(--r-xl)", padding: "var(--sp-4)", background: "linear-gradient(135deg,rgba(0,102,255,0.16),rgba(200,255,0,0.12))", border: "1px solid rgba(0,102,255,0.18)" }}>
                                    <div className="label" style={{ color: "var(--c-electric,#0066FF)" }}>Current plan</div>
                                    <div style={{ fontFamily: "var(--font-display)", fontSize: "1.55rem", fontWeight: 900, color: "var(--color-cream)", marginTop: 6 }}>{user.plan}</div>
                                    <div className="body-sm text-gray" style={{ marginTop: 8 }}>Достъп до tracking, продукти, калкулатори и базови challenge-и.</div>
                                </div>

                                <div className="pf-list">
                                    {[
                                        ["Отключени модули", "Calories, Weight, Recipes, Products, Shop"],
                                        ["Следващ upgrade", "Advanced analytics, team challenges, premium plans"],
                                        ["Support tier", "Standard help center + email"],
                                    ].map(([label, value]) => (
                                        <div key={label} className="pf-info-box">
                                            <div className="label text-gray">{label}</div>
                                            <div className="body-sm" style={{ color: "var(--color-cream)", marginTop: 6 }}>{value}</div>
                                        </div>
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

export default Profile;
