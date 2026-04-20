import type { JSX } from "react";
import { NavLink, Link } from "react-router-dom";

type DashboardSidebarProps = {
    theme: "dark" | "light";
    onToggleTheme: () => void;
    isOpen?: boolean;
    onClose?: () => void;
};

// ─── Icons ────────────────────────────────────────────────────
function IcGrid(): JSX.Element {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
    );
}
function IcFire(): JSX.Element {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
        </svg>
    );
}
function IcTrend(): JSX.Element {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
        </svg>
    );
}
function IcBook(): JSX.Element {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
    );
}
function IcApple(): JSX.Element {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 8c-2.2-2.8-6.4-1.8-7.3 2-.7 2.8.6 6.2 2.5 8.2 1.3 1.3 2.8 1.9 4.2 1 .4-.3 1-.3 1.4 0 1.6.9 3 .3 4.3-1 1.8-2 3.1-5.4 2.4-8.2-.9-3.8-5-4.8-7.5-2Z" />
            <path d="M12.9 3.2c.3 1.6-.6 3.2-2.3 4 .1-1.6 1-3.1 2.3-4Z" />
            <path d="M14.9 4c.9-.5 1.8-.7 2.8-.5" />
        </svg>
    );
}
function IcCalc(): JSX.Element {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="2" width="16" height="20" rx="2" />
            <line x1="8" y1="6" x2="16" y2="6" /><line x1="8" y1="10" x2="16" y2="10" />
            <line x1="8" y1="14" x2="11" y2="14" /><line x1="8" y1="18" x2="11" y2="18" />
            <line x1="13" y1="14" x2="16" y2="14" /><line x1="13" y1="18" x2="16" y2="18" />
        </svg>
    );
}
function IcDumbbell(): JSX.Element {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M2.5 10.5v3" /><path d="M5.5 9v6" /><path d="M8.5 8v8" />
            <path d="M15.5 8v8" /><path d="M18.5 9v6" /><path d="M21.5 10.5v3" />
            <path d="M8.5 12h7" />
        </svg>
    );
}
function IcBox(): JSX.Element {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 7.5 12 3l9 4.5" />
            <path d="M3 7.5V16.5L12 21l9-4.5V7.5" />
            <path d="M3 7.5 12 12l9-4.5" />
            <path d="M12 12v9" />
        </svg>
    );
}
function IcCart(): JSX.Element {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="19.5" r="1.5" />
            <circle cx="17.5" cy="19.5" r="1.5" />
            <path d="M3 4h2.5l1.7 8.2a1 1 0 0 0 1 .8h8.8a1 1 0 0 0 1-.7L20 7H7" />
        </svg>
    );
}
function IcTrophy(): JSX.Element {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 21h8" />
            <path d="M12 17v4" />
            <path d="M8 4h8v2.5A4.5 4.5 0 0 1 11.5 11h-1A4.5 4.5 0 0 1 6 6.5V4h2Z" />
            <path d="M8 5H4.5A2.5 2.5 0 0 0 7 9.5h1" />
            <path d="M16 5h3.5A2.5 2.5 0 0 1 17 9.5h-1" />
        </svg>
    );
}
function IcUser(): JSX.Element {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
        </svg>
    );
}
function IcSettings(): JSX.Element {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
    );
}
function IcLogout(): JSX.Element {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
        </svg>
    );
}

// ─── Nav config ───────────────────────────────────────────────
type NavItemCfg = { icon: JSX.Element; label: string; to: string; soon?: boolean };

const PRIMARY_NAV: NavItemCfg[] = [
    { icon: <IcGrid />, label: "Табло", to: "/dashboard" },
    { icon: <IcFire />, label: "Калории", to: "/calories" },
    { icon: <IcTrend />, label: "Тегло", to: "/weight" },
    { icon: <IcBook />, label: "Рецепти", to: "/recipes" },
    { icon: <IcApple />, label: "Диети", to: "/diets" },
    { icon: <IcDumbbell />, label: "Тренировъчни планове", to: "/training-plans" },
    { icon: <IcBox />, label: "Продукти", to: "/products" },
    { icon: <IcCart />, label: "Магазин", to: "/shop" },
    { icon: <IcTrophy />, label: "Предизвикателства", to: "/challenges" },
    { icon: <IcCalc />, label: "Калкулатори", to: "/calculators" },
];

const BOTTOM_NAV: NavItemCfg[] = [
    { icon: <IcUser />, label: "Профил", to: "/profile" },
    { icon: <IcSettings />, label: "Настройки", to: "/settings" },
];

function SideNavItem({ item, onClick }: { item: NavItemCfg; onClick?: () => void }): JSX.Element {
    if (item.soon) {
        return (
            <div style={{
                display: "flex", alignItems: "center", gap: "var(--sp-3)",
                padding: "10px 14px 10px 18px", borderRadius: "var(--r-md)",
                fontSize: "0.875rem", fontWeight: 500,
                color: "var(--c-text-secondary, #7A8FA3)", opacity: 0.45, cursor: "not-allowed",
            }}>
                <span style={{ width: 18, minWidth: 18, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{item.icon}</span>
                <span style={{ flex: 1, minWidth: 0, lineHeight: 1.25 }}>{item.label}</span>
                <span style={{ flexShrink: 0, marginLeft: "var(--sp-2)", fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.08em", padding: "2px 5px", borderRadius: "var(--r-full)", background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.25)" }}>СКОРО</span>
            </div>
        );
    }
    return (
        <NavLink
            to={item.to}
            end
            onClick={onClick}
            style={({ isActive }) => ({
                display: "flex", alignItems: "center", gap: "var(--sp-3)",
                padding: "10px 14px 10px 18px", borderRadius: "var(--r-md)",
                fontSize: "0.875rem", fontWeight: 500,
                textDecoration: "none", transition: "var(--t-base)",
                color: isActive ? "var(--c-electric, #0066FF)" : "var(--c-text-secondary, #7A8FA3)",
                background: isActive ? "rgba(0,102,255,0.1)" : "transparent",
                borderLeft: isActive ? "2px solid var(--c-electric, #0066FF)" : "2px solid transparent",
                paddingLeft: isActive ? "16px" : "18px",
            })}
        >
            <span style={{ width: 18, minWidth: 18, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{item.icon}</span>
            <span style={{ minWidth: 0, lineHeight: 1.25 }}>{item.label}</span>
        </NavLink>
    );
}

function DashboardSidebar({ theme, onToggleTheme, isOpen = false, onClose = () => {} }: DashboardSidebarProps): JSX.Element {
    return (
        <aside
            className={`dash-sidebar${isOpen ? " dash-sidebar--open" : ""}`}
            style={{
                width: 292, minWidth: 292,
                background: "var(--c-surface-1, #0E1318)",
                borderRight: "1px solid var(--c-border, rgba(255,255,255,0.06))",
                display: "flex", flexDirection: "column",
            }}
        >
            {/* Logo + close button row */}
            <div style={{ padding: "var(--sp-5) var(--sp-4)", borderBottom: "1px solid var(--c-border, rgba(255,255,255,0.06))", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Link to="/dashboard" className="navbar-logo" style={{ textDecoration: "none" }} onClick={onClose}>
                    <div className="navbar-logo-icon">⚡</div>
                    <span className="navbar-logo-text">Fit<span>Life</span></span>
                </Link>
                {/* Close button — mobile only */}
                <button
                    type="button"
                    onClick={onClose}
                    className="dash-sidebar-close"
                    style={{
                        background: "transparent", border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "var(--r-md)", width: 30, height: 30, cursor: "pointer",
                        color: "var(--c-text-secondary, #7A8FA3)", fontSize: "1.1rem", lineHeight: 1,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0,
                    }}
                    aria-label="Затвори менюто"
                >×</button>
            </div>

            {/* Primary nav */}
            <nav style={{ flex: 1, padding: "var(--sp-4)" }}>
                <div className="label text-gray" style={{ marginBottom: "var(--sp-3)", paddingLeft: "var(--sp-3)" }}>НАВИГАЦИЯ</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {PRIMARY_NAV.map((item) => <SideNavItem key={item.label} item={item} onClick={onClose} />)}
                </div>
            </nav>

            {/* Bottom */}
            <div style={{ padding: "var(--sp-4)", borderTop: "1px solid var(--c-border, rgba(255,255,255,0.06))" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: "var(--sp-3)" }}>
                    {BOTTOM_NAV.map((item) => <SideNavItem key={item.label} item={item} onClick={onClose} />)}
                </div>

                {/* Theme toggle */}
                <div style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "8px var(--sp-3)", borderRadius: "var(--r-md)",
                    background: "rgba(255,255,255,0.02)", marginBottom: "var(--sp-2)",
                }}>
                    <span className="body-sm text-gray">Тема</span>
                    <button type="button" className="theme-toggle" aria-label="Смени тема" aria-pressed={theme === "light"} onClick={onToggleTheme}>
                        <span className="theme-toggle-icon-dark">🌙</span>
                        <span className="theme-toggle-icon-light">☀️</span>
                    </button>
                </div>

                <Link to="/" style={{
                    display: "flex", alignItems: "center", gap: "var(--sp-3)",
                    padding: "10px var(--sp-3)", borderRadius: "var(--r-md)",
                    textDecoration: "none", fontSize: "0.875rem", fontWeight: 500,
                    color: "var(--c-text-muted, #3D5068)",
                }}>
                    <IcLogout /><span>Изход</span>
                </Link>

                {/* User card */}
                <div style={{
                    marginTop: "var(--sp-3)", padding: "var(--sp-3)", borderRadius: "var(--r-md)",
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid var(--c-border, rgba(255,255,255,0.06))",
                    display: "flex", alignItems: "center", gap: "var(--sp-2)",
                }}>
                    <div style={{
                        width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                        background: "linear-gradient(135deg, var(--c-electric, #0066FF), var(--c-acid, #C8FF00))",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontFamily: "var(--font-display)", fontSize: "0.75rem", fontWeight: 700,
                        color: "var(--c-bg, #080C10)",
                    }}>МИ</div>
                    <div style={{ minWidth: 0 }}>
                        <div className="body-sm" style={{ color: "var(--color-cream)", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Мартин Иванов</div>
                        <div className="label text-gray">Безплатен план</div>
                    </div>
                </div>
            </div>
        </aside>
    );
}

export default DashboardSidebar;
