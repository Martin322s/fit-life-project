import { useState } from "react";
import type { JSX } from "react";
import DashboardSidebar from "../../layout/DashboardLayout/DashboardSidebar";

type DashboardProps = { theme: "dark" | "light"; onToggleTheme: () => void };
type ModalType = "weight" | "meal" | "water" | null;

const DASH_CSS = `
.dash-sidebar { position: sticky; top: 0; height: 100vh; overflow-y: auto; flex-shrink: 0; }
.dash-sidebar-close { display: none !important; }
.dash-content { padding: var(--sp-5) var(--sp-6); flex: 1; }
.dash-page { display: flex; min-height: 100vh; background: var(--c-bg,#080C10); overflow-x: clip; }
.dash-main { flex: 1; overflow: auto; overflow-x: hidden; display: flex; flex-direction: column; min-width: 0; }
.dash-stats-grid { display: grid; grid-template-columns: repeat(5,1fr); gap: var(--sp-3); }
.dash-row3 { display: grid; grid-template-columns: repeat(3,1fr); gap: var(--sp-4); margin-top: var(--sp-4); }
.dash-row2 { display: grid; grid-template-columns: 2fr 1fr; gap: var(--sp-4); margin-top: var(--sp-4); }
.dash-hamburger { display: none; }
.dash-header-streak { display: flex; }
.dash-header-logbtn { display: inline-flex; }

@media (max-width: 1100px) {
  .dash-stats-grid { grid-template-columns: repeat(3,1fr); }
  .dash-row3 { grid-template-columns: 1fr 1fr; }
  .dash-content { padding: var(--sp-4) var(--sp-5); }
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
  .dash-hamburger {
    display: flex; align-items: center; justify-content: center;
    background: transparent; border: 1px solid rgba(255,255,255,0.1);
    border-radius: 8px; padding: 8px 10px; cursor: pointer;
    color: var(--color-cream); flex-shrink: 0;
  }
  .dash-stats-grid { grid-template-columns: 1fr 1fr; }
  .dash-row3 { grid-template-columns: 1fr; }
  .dash-row2 { grid-template-columns: 1fr; }
  .dash-content { padding: var(--sp-3) var(--sp-4); }
  .dash-header { padding: var(--sp-3) var(--sp-4) !important; align-items: flex-start !important; }
  .dash-header,
  .dash-header-actions,
  .dash-meal-header,
  .dash-water-header,
  .dash-meal-row,
  .dash-meal-badges { flex-wrap: wrap; }
  .dash-header-actions { justify-content: flex-end; width: 100%; }
  .dash-meal-header > * { width: 100%; }
  .dash-meal-addbtn { width: 100%; justify-content: center; }
  .dash-meal-main { flex: 1 1 calc(100% - 44px); min-width: 0; }
  .dash-meal-badges { margin-left: 44px; }
  .dash-meal-kcal { margin-left: auto; }
  .dash-goals-summary { grid-template-columns: 1fr !important; justify-items: start; text-align: left !important; }
  .dash-goals-arrow { display: none; }
  .dash-header-streak { display: none !important; }
  .dash-header-logbtn { display: none !important; }
}
`;

const USER = {
    firstName: "Мартин", lastName: "Иванов", initials: "МИ", plan: "Отслабване", streak: 14,
    goalCalories: 2200, todayCalories: 1840,
    protein: { consumed: 142, target: 165 },
    carbs:   { consumed: 198, target: 240 },
    fat:     { consumed: 61,  target: 73  },
    currentWeight: 82.4, startWeight: 86.0, targetWeight: 77.0, heightCm: 178,
    bmi: 26.0, bmr: 1890, tdee: 2420,
    water: { consumed: 5, target: 8 },
    steps: { today: 7240, target: 10000 },
    weightHistory: [
        { date: "3 Апр", w: 84.2 }, { date: "4 Апр", w: 83.8 }, { date: "5 Апр", w: 83.5 },
        { date: "6 Апр", w: 83.1 }, { date: "7 Апр", w: 82.9 }, { date: "8 Апр", w: 82.6 },
        { date: "9 Апр", w: 82.4 },
    ],
    meals: [
        { type: "Закуска",            emoji: "🌅", name: "Овесена каша с банан",             kcal: 380, p: 12, c: 68, f: 8,  time: "08:15", logged: true  },
        { type: "Обяд",               emoji: "☀️", name: "Пилешки гърди, ориз, зеленчуци",   kcal: 620, p: 52, c: 74, f: 14, time: "13:00", logged: true  },
        { type: "Следобедна закуска", emoji: "🍎", name: "Ябълка + 30г ядки",                kcal: 180, p: 5,  c: 22, f: 12, time: "16:30", logged: true  },
        { type: "Вечеря",             emoji: "🌙", name: null,                                kcal: 0,   p: 0,  c: 0,  f: 0,  time: null,    logged: false },
    ],
};

function bmiLabel(v: number) {
    if (v < 18.5) return { text: "Поднормено тегло", color: "var(--c-electric,#0066FF)" };
    if (v < 25)   return { text: "Нормално тегло",   color: "#00E676" };
    if (v < 30)   return { text: "Наднормено тегло", color: "#FFB300" };
    return               { text: "Затлъстяване",      color: "var(--c-error,#FF3D57)" };
}
function ring(r: number, pct: number) {
    const circ = +(2 * Math.PI * r).toFixed(2);
    return { circ, offset: +(circ * (1 - Math.min(pct, 1))).toFixed(1) };
}
function sparkline(data: { w: number }[], W: number, H: number, pad = 10) {
    const vals = data.map((d) => d.w);
    const min = Math.min(...vals), max = Math.max(...vals), range = max - min || 1;
    const pts = vals.map((v, i) => ({
        x: +(pad + (i / (vals.length - 1)) * (W - pad * 2)).toFixed(1),
        y: +(pad + ((max - v) / range) * (H - pad * 2)).toFixed(1),
    }));
    const line = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
    const area = `${line} L ${pts.at(-1)!.x} ${H - pad} L ${pts[0].x} ${H - pad} Z`;
    return { pts, line, area };
}

function ModalBase({ title, onClose, children }: { title: string; onClose: () => void; children: JSX.Element | JSX.Element[] }): JSX.Element {
    return (
        <div
            style={{ position: "fixed", inset: 0, zIndex: 400, display: "flex", alignItems: "center", justifyContent: "center", padding: "var(--sp-5)", background: "rgba(0,0,0,0.72)", backdropFilter: "blur(8px)" }}
            onClick={onClose}
        >
            <div
                style={{ background: "var(--c-surface-1,#0E1318)", border: "1px solid var(--c-border-strong,rgba(255,255,255,0.14))", borderRadius: "var(--r-xl)", padding: "var(--sp-6)", width: "100%", maxWidth: 480, maxHeight: "90vh", overflowY: "auto" }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--sp-6)" }}>
                    <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", fontWeight: 800, color: "var(--color-cream)", margin: 0 }}>{title}</h2>
                    <button type="button" onClick={onClose} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "var(--r-md)", width: 32, height: 32, cursor: "pointer", color: "var(--c-text-secondary,#7A8FA3)", fontSize: "1.1rem", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
                </div>
                {children}
            </div>
        </div>
    );
}

function LogWeightModal({ onClose }: { onClose: () => void }): JSX.Element {
    const todayStr = new Date().toISOString().split("T")[0];
    const [date, setDate] = useState(todayStr);
    const [weight, setWeight] = useState("");
    const [note, setNote] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!weight) return;
        setStatus("loading");
        await new Promise((r) => setTimeout(r, 900));
        const existing = window.localStorage.getItem("fitlife-weight-log");
        const entries = existing ? (JSON.parse(existing) as Array<Record<string, unknown>>) : [];
        entries.unshift({
            value: Number(weight),
            date,
            note,
            source: "dashboard",
            addedAt: new Date().toISOString(),
        });
        window.localStorage.setItem("fitlife-weight-log", JSON.stringify(entries.slice(0, 100)));
        setStatus("success");
        setTimeout(onClose, 1400);
    };

    if (status === "success") {
        return (
            <ModalBase title="Запиши тегло" onClose={onClose}>
                <div style={{ textAlign: "center", padding: "var(--sp-6) 0" }}>
                    <div style={{ fontSize: "2.5rem", marginBottom: "var(--sp-4)" }}>✅</div>
                    <div className="heading-sm" style={{ color: "var(--color-cream)", marginBottom: "var(--sp-2)" }}>Записано!</div>
                    <div className="body-md text-gray">{weight} кг — {new Date(date).toLocaleDateString("bg-BG", { day: "numeric", month: "long" })}</div>
                </div>
            </ModalBase>
        );
    }

    return (
        <ModalBase title="Запиши тегло" onClose={onClose}>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
                <div className="form-group">
                    <label className="form-label" htmlFor="wm-date">Дата</label>
                    <input type="date" id="wm-date" className="form-input" value={date} onChange={(e) => setDate(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label className="form-label" htmlFor="wm-weight">Тегло (кг)</label>
                    <div className="input-wrapper">
                        <input
                            type="number" id="wm-weight" className="form-input" step="0.1" min="20" max="300"
                            placeholder={USER.currentWeight.toString()} autoFocus
                            value={weight} onChange={(e) => setWeight(e.target.value)} required
                            style={{ fontSize: "1.4rem", fontFamily: "var(--font-display)", fontWeight: 700, textAlign: "center" }}
                        />
                    </div>
                    <div className="body-sm text-gray" style={{ marginTop: 4 }}>Последно записано: <strong style={{ color: "var(--color-cream)" }}>{USER.currentWeight} кг</strong></div>
                </div>
                <div className="form-group">
                    <label className="form-label" htmlFor="wm-note">Бележка <span className="text-gray">(по желание)</span></label>
                    <textarea
                        id="wm-note" className="form-input" rows={2} placeholder="напр. след тренировка…"
                        value={note} onChange={(e) => setNote(e.target.value)}
                        style={{ resize: "vertical", minHeight: 60 }}
                    />
                </div>
                <button type="submit" className="btn-primary btn-full" disabled={status === "loading" || !weight}>
                    {status === "loading" ? "Записване…" : "⚖️  Запиши тегло"}
                </button>
            </form>
        </ModalBase>
    );
}

function AddMealModal({ initialType, onClose }: { initialType: string; onClose: () => void }): JSX.Element {
    const [mealType, setMealType] = useState(initialType);
    const [name, setName] = useState("");
    const [kcal, setKcal] = useState("");
    const [protein, setProtein] = useState("");
    const [carbs, setCarbs] = useState("");
    const [fat, setFat] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!kcal) return;
        setStatus("loading");
        await new Promise((r) => setTimeout(r, 900));
        const existing = window.localStorage.getItem("fitlife-food-log");
        const entries = existing ? (JSON.parse(existing) as Array<Record<string, unknown>>) : [];
        entries.unshift({
            id: `dashboard-food-${Date.now()}`,
            source: "dashboard",
            mealType,
            name: name || mealType,
            kcal: Number(kcal) || 0,
            protein: Number(protein) || 0,
            carbs: Number(carbs) || 0,
            fat: Number(fat) || 0,
            addedAt: new Date().toISOString(),
        });
        window.localStorage.setItem("fitlife-food-log", JSON.stringify(entries.slice(0, 100)));
        setStatus("success");
        setTimeout(onClose, 1400);
    };

    if (status === "success") {
        return (
            <ModalBase title="Добави хранене" onClose={onClose}>
                <div style={{ textAlign: "center", padding: "var(--sp-6) 0" }}>
                    <div style={{ fontSize: "2.5rem", marginBottom: "var(--sp-4)" }}>✅</div>
                    <div className="heading-sm" style={{ color: "var(--color-cream)", marginBottom: "var(--sp-2)" }}>Добавено!</div>
                    <div className="body-md text-gray">{name || mealType} · {kcal} kcal</div>
                </div>
            </ModalBase>
        );
    }

    return (
        <ModalBase title="Добави хранене" onClose={onClose}>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
                {/* Meal type tabs */}
                <div>
                    <div className="form-label" style={{ marginBottom: "var(--sp-2)" }}>Тип хранене</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--sp-2)" }}>
                        {USER.meals.map((m) => (
                            <button
                                key={m.type} type="button"
                                onClick={() => setMealType(m.type)}
                                style={{
                                    padding: "var(--sp-2) var(--sp-3)", borderRadius: "var(--r-md)",
                                    cursor: "pointer", fontSize: "0.85rem", fontWeight: 500,
                                    display: "flex", alignItems: "center", gap: "var(--sp-2)",
                                    background: mealType === m.type ? "rgba(0,102,255,0.15)" : "rgba(255,255,255,0.04)",
                                    border: mealType === m.type ? "1px solid var(--c-electric,#0066FF)" : "1px solid rgba(255,255,255,0.08)",
                                    color: mealType === m.type ? "var(--c-electric,#0066FF)" : "var(--c-text-secondary,#7A8FA3)",
                                    transition: "var(--t-base)",
                                }}
                            >
                                <span>{m.emoji}</span>{m.type}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="am-name">Продукт / Ястие</label>
                    <input type="text" id="am-name" className="form-input" placeholder="напр. Пилешки гърди с ориз" autoFocus value={name} onChange={(e) => setName(e.target.value)} />
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="am-kcal">Калории (kcal) <span style={{ color: "var(--c-error,#FF3D57)" }}>*</span></label>
                    <input type="number" id="am-kcal" className="form-input" placeholder="0" min="0" max="5000" required value={kcal} onChange={(e) => setKcal(e.target.value)}
                        style={{ fontSize: "1.3rem", fontFamily: "var(--font-display)", fontWeight: 700, textAlign: "center" }} />
                </div>

                {/* Macros — optional */}
                <div>
                    <div className="form-label" style={{ marginBottom: "var(--sp-2)" }}>Макроси <span className="text-gray">(по желание)</span></div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "var(--sp-3)" }}>
                        {[
                            { id: "am-p", label: "Протеин г", val: protein, set: setProtein, color: "var(--c-electric,#0066FF)" },
                            { id: "am-c", label: "Въглехидр. г", val: carbs, set: setCarbs, color: "var(--c-acid,#C8FF00)" },
                            { id: "am-f", label: "Мазнини г", val: fat, set: setFat, color: "#FFB300" },
                        ].map((m) => (
                            <div key={m.id} className="form-group" style={{ margin: 0 }}>
                                <label className="label" htmlFor={m.id} style={{ color: m.color, marginBottom: 4, display: "block" }}>{m.label}</label>
                                <input type="number" id={m.id} className="form-input" placeholder="0" min="0" value={m.val} onChange={(e) => m.set(e.target.value)} style={{ textAlign: "center", padding: "var(--sp-2)" }} />
                            </div>
                        ))}
                    </div>
                </div>

                <button type="submit" className="btn-primary btn-full" disabled={status === "loading" || !kcal}>
                    {status === "loading" ? "Добавяне…" : "🍽️  Добави хранене"}
                </button>
            </form>
        </ModalBase>
    );
}

function AddWaterModal({ onClose }: { onClose: () => void }): JSX.Element {
    const [glasses, setGlasses] = useState(1);
    const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("loading");
        await new Promise((r) => setTimeout(r, 700));
        const existing = window.localStorage.getItem("fitlife-water-log");
        const entries = existing ? (JSON.parse(existing) as Array<Record<string, unknown>>) : [];
        entries.unshift({
            glasses,
            milliliters: glasses * 250,
            source: "dashboard",
            addedAt: new Date().toISOString(),
        });
        window.localStorage.setItem("fitlife-water-log", JSON.stringify(entries.slice(0, 100)));
        setStatus("success");
        setTimeout(onClose, 1200);
    };

    if (status === "success") {
        return (
            <ModalBase title="Добави вода" onClose={onClose}>
                <div style={{ textAlign: "center", padding: "var(--sp-6) 0" }}>
                    <div style={{ fontSize: "2.5rem", marginBottom: "var(--sp-4)" }}>💧</div>
                    <div className="heading-sm" style={{ color: "#0099FF", marginBottom: "var(--sp-2)" }}>Добавено!</div>
                    <div className="body-md text-gray">+{glasses} {glasses === 1 ? "чаша" : "чаши"} · +{glasses * 250} мл</div>
                </div>
            </ModalBase>
        );
    }

    return (
        <ModalBase title="Добави вода" onClose={onClose}>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "var(--sp-5)" }}>
                {/* Current state */}
                <div style={{ textAlign: "center", padding: "var(--sp-4)", borderRadius: "var(--r-lg)", background: "rgba(0,153,255,0.06)", border: "1px solid rgba(0,153,255,0.15)" }}>
                    <div className="label text-gray" style={{ marginBottom: "var(--sp-2)" }}>Вече изпити днес</div>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: "2.5rem", fontWeight: 900, color: "#0099FF", lineHeight: 1 }}>
                        {USER.water.consumed} / {USER.water.target}
                    </div>
                    <div className="body-sm text-gray">чаши · {USER.water.consumed * 250} / {USER.water.target * 250} мл</div>
                </div>

                {/* Quick-pick */}
                <div>
                    <div className="form-label" style={{ marginBottom: "var(--sp-3)" }}>Колко чаши добавяш?</div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "var(--sp-2)" }}>
                        {[1, 2, 3, 4].map((n) => (
                            <button
                                key={n} type="button" onClick={() => setGlasses(n)}
                                style={{
                                    padding: "var(--sp-4) var(--sp-3)", borderRadius: "var(--r-lg)",
                                    cursor: "pointer", fontFamily: "var(--font-display)",
                                    fontSize: "1.6rem", fontWeight: 900, lineHeight: 1,
                                    border: glasses === n ? "2px solid #0099FF" : "2px solid rgba(255,255,255,0.08)",
                                    background: glasses === n ? "rgba(0,153,255,0.15)" : "rgba(255,255,255,0.04)",
                                    color: glasses === n ? "#0099FF" : "var(--c-text-secondary,#7A8FA3)",
                                    transition: "var(--t-base)",
                                    display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                                }}
                            >
                                <span>{"💧".repeat(n)}</span>
                                <span style={{ fontSize: "0.75rem", fontFamily: "var(--font-body,sans-serif)", fontWeight: 400 }}>{n * 250} мл</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Manual input */}
                <div className="form-group">
                    <label className="form-label" htmlFor="wt-glasses">Или въведи ръчно (чаши)</label>
                    <input type="number" id="wt-glasses" className="form-input" min="1" max="20" value={glasses}
                        onChange={(e) => setGlasses(Math.max(1, parseInt(e.target.value) || 1))}
                        style={{ textAlign: "center", fontSize: "1.2rem", fontFamily: "var(--font-display)", fontWeight: 700 }}
                    />
                </div>

                <button type="submit" className="btn-primary btn-full" disabled={status === "loading"}>
                    {status === "loading" ? "Добавяне…" : `💧  Добави ${glasses} ${glasses === 1 ? "чаша" : "чаши"} (${glasses * 250} мл)`}
                </button>
            </form>
        </ModalBase>
    );
}

function DashHeader({ onLogWeight, onToggleSidebar }: { onLogWeight: () => void; onToggleSidebar: () => void }): JSX.Element {
    const today = new Date().toLocaleDateString("bg-BG", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
    return (
        <div className="dash-header" style={{ padding: "var(--sp-4) var(--sp-6)", borderBottom: "1px solid var(--c-border,rgba(255,255,255,0.06))", display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--c-surface-1,#0E1318)", gap: "var(--sp-3)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--sp-3)", minWidth: 0 }}>
                {/* Hamburger — mobile only */}
                <button type="button" className="dash-hamburger" onClick={onToggleSidebar} aria-label="Навигация">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
                        <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
                    </svg>
                </button>
                <div style={{ minWidth: 0 }}>
                    <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.7rem", fontWeight: 800, color: "var(--color-cream)", lineHeight: 1.2, marginBottom: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        Здравей, <span style={{ color: "var(--c-acid,#C8FF00)" }}>{USER.firstName}</span>! 👋
                    </h1>
                    <div className="body-sm text-gray" style={{ textTransform: "capitalize", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{today}</div>
                </div>
            </div>
            <div className="dash-header-actions" style={{ display: "flex", alignItems: "center", gap: "var(--sp-3)", flexShrink: 0 }}>
                <div className="dash-header-streak" style={{ alignItems: "center", gap: "var(--sp-2)", padding: "var(--sp-2) var(--sp-3)", borderRadius: "var(--r-full)", background: "rgba(200,255,0,0.08)", border: "1px solid rgba(200,255,0,0.2)" }}>
                    <span>🔥</span>
                    <span className="body-sm" style={{ color: "var(--c-acid,#C8FF00)", fontWeight: 600 }}>{USER.streak} дни серия</span>
                </div>
                <button type="button" className="btn-primary btn-sm dash-header-logbtn" onClick={onLogWeight}>+ Запиши тегло</button>
                <div style={{ width: 36, height: 36, borderRadius: "50%", flexShrink: 0, cursor: "pointer", background: "linear-gradient(135deg,var(--c-electric,#0066FF),var(--c-acid,#C8FF00))", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontSize: "0.8rem", fontWeight: 700, color: "var(--c-bg,#080C10)" }}>{USER.initials}</div>
            </div>
        </div>
    );
}

function StatsRow({ onLogWeight }: { onLogWeight: () => void }): JSX.Element {
    const bmi = bmiLabel(USER.bmi);
    const stats = [
        { emoji: "🔥", label: "Калории днес", value: USER.todayCalories.toLocaleString("bg-BG"), sub: `от ${USER.goalCalories.toLocaleString("bg-BG")} kcal`, pct: USER.todayCalories / USER.goalCalories, bar: "var(--c-electric,#0066FF)", accent: null },
        { emoji: "⚖️", label: "Тегло",         value: `${USER.currentWeight}`, sub: "кг · ↓ 0.2 кг днес", pct: null, bar: null, accent: { text: "↓ прогрес", color: "#00E676" }, action: onLogWeight },
        { emoji: "📊", label: "BMI",           value: USER.bmi.toFixed(1), sub: bmi.text, pct: null, bar: null, accent: { text: bmi.text.split(" ")[0], color: bmi.color } },
        { emoji: "💧", label: "Хидратация",   value: `${USER.water.consumed}`, sub: `от ${USER.water.target} чаши · ${USER.water.consumed * 250} мл`, pct: USER.water.consumed / USER.water.target, bar: "#0099FF", accent: null },
        { emoji: "👟", label: "Стъпки",        value: USER.steps.today.toLocaleString("bg-BG"), sub: `от ${USER.steps.target.toLocaleString("bg-BG")} стъпки`, pct: USER.steps.today / USER.steps.target, bar: "var(--c-acid,#C8FF00)", accent: null },
    ];
    return (
        <div className="dash-stats-grid">
            {stats.map((s) => (
                <div key={s.label} className="card card-sm" style={{ padding: "var(--sp-4)", cursor: (s as { action?: () => void }).action ? "pointer" : undefined }} onClick={(s as { action?: () => void }).action}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--sp-2)" }}>
                        <span style={{ fontSize: "1.2rem" }}>{s.emoji}</span>
                        {s.accent && <span className="label" style={{ color: s.accent.color }}>{s.accent.text}</span>}
                    </div>
                    <div className="label text-gray" style={{ marginBottom: "var(--sp-1)" }}>{s.label}</div>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: "1.65rem", fontWeight: 900, color: "var(--color-cream)", lineHeight: 1.1 }}>{s.value}</div>
                    <div className="body-sm text-gray" style={{ marginTop: 2, fontSize: "0.78rem" }}>{s.sub}</div>
                    {s.pct !== null && <div style={{ marginTop: "var(--sp-2)", height: 3, borderRadius: "var(--r-full)", background: "rgba(255,255,255,0.06)" }}><div style={{ width: `${Math.min(s.pct * 100, 100)}%`, height: "100%", borderRadius: "var(--r-full)", background: s.bar!, transition: "width 0.6s ease" }} /></div>}
                </div>
            ))}
        </div>
    );
}

function CalorieRingCard(): JSX.Element {
    const calPct = USER.todayCalories / USER.goalCalories;
    const protPct = USER.protein.consumed / USER.protein.target;
    const outer = ring(80, calPct), inner = ring(62, protPct);
    const remaining = USER.goalCalories - USER.todayCalories;
    return (
        <div className="card" style={{ padding: "var(--sp-5)", display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div><div className="label text-gray">Калории днес</div><div className="heading-sm" style={{ color: "var(--color-cream)", marginTop: 2 }}>{USER.todayCalories.toLocaleString("bg-BG")} kcal</div></div>
                <span className="badge badge-olive">{Math.round(calPct * 100)}%</span>
            </div>
            <div style={{ display: "flex", justifyContent: "center", position: "relative" }}>
                <svg width="200" height="200" viewBox="0 0 200 200">
                    <circle cx="100" cy="100" r="80" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="14" />
                    <circle cx="100" cy="100" r="80" fill="none" stroke="var(--c-electric,#0066FF)" strokeWidth="14" strokeLinecap="round" strokeDasharray={outer.circ} strokeDashoffset={outer.offset} transform="rotate(-90 100 100)" style={{ transition: "stroke-dashoffset 1s ease" }} />
                    <circle cx="100" cy="100" r="62" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="10" />
                    <circle cx="100" cy="100" r="62" fill="none" stroke="var(--c-acid,#C8FF00)" strokeWidth="10" strokeLinecap="round" strokeDasharray={inner.circ} strokeDashoffset={inner.offset} transform="rotate(-90 100 100)" style={{ transition: "stroke-dashoffset 1s ease" }} />
                </svg>
                <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", textAlign: "center" }}>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", fontWeight: 900, color: "var(--color-cream)", lineHeight: 1.1 }}>{USER.todayCalories.toLocaleString("bg-BG")}</div>
                    <div className="label text-gray">от {USER.goalCalories}</div>
                </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", gap: "var(--sp-3)" }}>
                    {[{ c: "var(--c-electric,#0066FF)", l: "Калории" }, { c: "var(--c-acid,#C8FF00)", l: "Протеин" }].map((i) => (
                        <span key={i.l} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                            <span style={{ width: 8, height: 8, borderRadius: 2, background: i.c, display: "inline-block" }} />
                            <span className="body-sm text-gray">{i.l}</span>
                        </span>
                    ))}
                </div>
                <div className="body-sm" style={{ color: remaining >= 0 ? "#00E676" : "var(--c-error,#FF3D57)" }}>{remaining >= 0 ? `–${remaining}` : `+${Math.abs(remaining)}`} kcal остават</div>
            </div>
        </div>
    );
}

function MacrosCard(): JSX.Element {
    const macros = [
        { label: "Протеин",       consumed: USER.protein.consumed, target: USER.protein.target, color: "var(--c-electric,#0066FF)", kcalPer: 4 },
        { label: "Въглехидрати", consumed: USER.carbs.consumed,   target: USER.carbs.target,   color: "var(--c-acid,#C8FF00)",     kcalPer: 4 },
        { label: "Мазнини",      consumed: USER.fat.consumed,     target: USER.fat.target,     color: "#FFB300",                   kcalPer: 9 },
    ];
    const totalTarget = USER.protein.target + USER.carbs.target + USER.fat.target;
    return (
        <div className="card" style={{ padding: "var(--sp-5)", display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
            <div className="label text-gray">Макронутриенти</div>
            <div style={{ display: "flex", height: 8, borderRadius: "var(--r-full)", overflow: "hidden", gap: 1 }}>
                {macros.map((m) => <div key={m.label} style={{ width: `${(m.consumed / totalTarget) * 100}%`, background: m.color, transition: "width 0.8s ease" }} />)}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
                {macros.map((m) => (
                    <div key={m.label}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--sp-1)" }}>
                            <span className="body-sm" style={{ color: "var(--color-cream)" }}>{m.label}</span>
                            <span className="body-sm text-gray">{m.consumed} / {m.target} г</span>
                        </div>
                        <div style={{ height: 6, borderRadius: "var(--r-full)", background: "rgba(255,255,255,0.06)" }}>
                            <div style={{ width: `${Math.min(m.consumed / m.target, 1) * 100}%`, height: "100%", borderRadius: "var(--r-full)", background: m.color, transition: "width 0.8s ease" }} />
                        </div>
                    </div>
                ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", borderTop: "1px solid var(--c-border,rgba(255,255,255,0.06))", paddingTop: "var(--sp-3)" }}>
                {macros.map((m) => (
                    <div key={m.label} style={{ textAlign: "center" }}>
                        <div style={{ width: 6, height: 6, borderRadius: 2, background: m.color, margin: "0 auto 4px" }} />
                        <div className="body-sm" style={{ color: "var(--color-cream)", fontWeight: 600 }}>{Math.round(m.consumed * m.kcalPer)}</div>
                        <div className="label text-gray">kcal</div>
                    </div>
                ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderTop: "1px solid var(--c-border,rgba(255,255,255,0.06))", paddingTop: "var(--sp-3)" }}>
                <div><div className="label text-gray">BMR</div><div className="body-sm" style={{ color: "var(--color-cream)", fontWeight: 600 }}>{USER.bmr.toLocaleString("bg-BG")} kcal</div></div>
                <div><div className="label text-gray">TDEE</div><div className="body-sm" style={{ color: "var(--color-cream)", fontWeight: 600 }}>{USER.tdee.toLocaleString("bg-BG")} kcal</div></div>
            </div>
        </div>
    );
}

function WeightChartCard(): JSX.Element {
    const W = 260, H = 90, PAD = 12;
    const sl = sparkline(USER.weightHistory, W, H, PAD);
    const vals = USER.weightHistory.map((d) => d.w);
    const weekLost = +(vals[0] - vals[vals.length - 1]).toFixed(1);
    return (
        <div className="card" style={{ padding: "var(--sp-5)", display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                    <div className="label text-gray">Тегло — последните 7 дни</div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: "var(--sp-2)", marginTop: 4 }}>
                        <span style={{ fontFamily: "var(--font-display)", fontSize: "2.2rem", fontWeight: 900, color: "var(--color-cream)", lineHeight: 1 }}>{USER.currentWeight}</span>
                        <span className="body-sm text-gray">кг</span>
                    </div>
                </div>
                <div style={{ textAlign: "right" }}>
                    <div style={{ color: "#00E676", fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 700 }}>↓ {weekLost} кг</div>
                    <div className="label text-gray">тази седмица</div>
                </div>
            </div>
            <div style={{ borderRadius: "var(--r-md)", overflow: "hidden", background: "rgba(255,255,255,0.02)" }}>
                <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: "block", width: "100%", height: "auto" }}>
                    <defs><linearGradient id="wgr" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0066FF" stopOpacity="0.3" /><stop offset="100%" stopColor="#0066FF" stopOpacity="0" /></linearGradient></defs>
                    {[0.25, 0.5, 0.75].map((f) => <line key={f} x1={PAD} y1={PAD + f * (H - PAD * 2)} x2={W - PAD} y2={PAD + f * (H - PAD * 2)} stroke="rgba(255,255,255,0.04)" strokeWidth={1} />)}
                    <path d={sl.area} fill="url(#wgr)" />
                    <path d={sl.line} fill="none" stroke="var(--c-electric,#0066FF)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    {sl.pts.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={i === sl.pts.length - 1 ? 4 : 2.5} fill={i === sl.pts.length - 1 ? "var(--c-acid,#C8FF00)" : "var(--c-electric,#0066FF)"} stroke="var(--c-bg,#080C10)" strokeWidth={1.5} />)}
                </svg>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                {[0, 3, 6].map((i) => <span key={i} className="label text-gray">{USER.weightHistory[i].date}</span>)}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", borderTop: "1px solid var(--c-border,rgba(255,255,255,0.06))", paddingTop: "var(--sp-3)" }}>
                {[{ l: "Мин.", v: Math.min(...vals).toFixed(1), c: "var(--color-cream)" }, { l: "Днес", v: `${USER.currentWeight}`, c: "var(--c-acid,#C8FF00)" }, { l: "Макс.", v: Math.max(...vals).toFixed(1), c: "var(--color-cream)" }].map((s) => (
                    <div key={s.l} style={{ textAlign: "center" }}>
                        <div className="body-sm" style={{ color: s.c, fontWeight: 600 }}>{s.v}</div>
                        <div className="label text-gray">{s.l}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function MealLogCard({ onAddMeal }: { onAddMeal: (type: string) => void }): JSX.Element {
    const totalKcal = USER.meals.filter((m) => m.logged).reduce((a, m) => a + m.kcal, 0);
    return (
        <div className="card" style={{ padding: "var(--sp-5)" }}>
            <div className="dash-meal-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "var(--sp-3)", marginBottom: "var(--sp-5)" }}>
                <div><div className="label text-gray">Хранения днес</div><div className="heading-sm" style={{ color: "var(--color-cream)", marginTop: 2 }}>{totalKcal} kcal приети</div></div>
                <button type="button" className="btn-primary btn-sm dash-meal-addbtn" onClick={() => onAddMeal("Закуска")}>+ Добави хранене</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-2)" }}>
                {USER.meals.map((meal) => (
                    <div key={meal.type} className="dash-meal-row" style={{ display: "flex", alignItems: "center", gap: "var(--sp-3)", padding: "var(--sp-3) var(--sp-4)", borderRadius: "var(--r-md)", background: meal.logged ? "rgba(255,255,255,0.025)" : "rgba(255,255,255,0.01)", border: `1px solid ${meal.logged ? "var(--c-border,rgba(255,255,255,0.06))" : "rgba(255,255,255,0.04)"}`, opacity: meal.logged ? 1 : 0.55 }}>
                        <span style={{ fontSize: "1.35rem", width: 32, textAlign: "center", flexShrink: 0 }}>{meal.emoji}</span>
                        <div className="dash-meal-main" style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "var(--sp-2)", marginBottom: 2 }}>
                                <span className="body-sm" style={{ color: "var(--color-cream)", fontWeight: 600 }}>{meal.type}</span>
                                {meal.time && <span className="label text-gray">{meal.time}</span>}
                            </div>
                            <span className="body-sm text-gray" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block", maxWidth: 260 }}>{meal.name ?? "Не е записано"}</span>
                        </div>
                        {meal.logged && (
                            <div className="dash-meal-badges" style={{ display: "flex", gap: "var(--sp-1)", flexShrink: 0 }}>
                                <span style={{ padding: "2px 7px", borderRadius: "var(--r-full)", background: "rgba(0,102,255,0.1)", color: "var(--c-electric,#0066FF)" }} className="label">{meal.p}г б</span>
                                <span style={{ padding: "2px 7px", borderRadius: "var(--r-full)", background: "rgba(200,255,0,0.08)", color: "var(--c-acid,#C8FF00)" }} className="label">{meal.c}г в</span>
                                <span style={{ padding: "2px 7px", borderRadius: "var(--r-full)", background: "rgba(255,179,0,0.1)", color: "#FFB300" }} className="label">{meal.f}г м</span>
                            </div>
                        )}
                        <div className="dash-meal-kcal" style={{ textAlign: "right", flexShrink: 0, minWidth: 64 }}>
                            {meal.logged
                                ? <span style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 700, color: "var(--color-cream)" }}>{meal.kcal}<span className="label text-gray" style={{ fontFamily: "inherit", fontWeight: 400 }}> kcal</span></span>
                                : <button type="button" className="btn-secondary btn-sm" style={{ fontSize: "0.75rem" }} onClick={() => onAddMeal(meal.type)}>+ Добави</button>
                            }
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function BmiCard(): JSX.Element {
    const bmi = bmiLabel(USER.bmi);
    const pct = (USER.bmi - 15) / 25;
    const zones = [{ end: 3.5 / 25, c: "var(--c-electric,#0066FF)" }, { end: 10 / 25, c: "#00E676" }, { end: 15 / 25, c: "#FFB300" }, { end: 1, c: "var(--c-error,#FF3D57)" }];
    const targetW = +(24.9 * (USER.heightCm / 100) ** 2).toFixed(1);
    return (
        <div className="card card-sm" style={{ padding: "var(--sp-5)" }}>
            <div className="label text-gray" style={{ marginBottom: "var(--sp-3)" }}>Индекс на телесна маса (BMI)</div>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--sp-3)", marginBottom: "var(--sp-4)" }}>
                <span style={{ fontFamily: "var(--font-display)", fontSize: "2.8rem", fontWeight: 900, color: bmi.color, lineHeight: 1 }}>{USER.bmi.toFixed(1)}</span>
                <span className="label" style={{ color: bmi.color, background: `${bmi.color}22`, padding: "3px 9px", borderRadius: "var(--r-full)" }}>{bmi.text}</span>
            </div>
            <div style={{ position: "relative", marginBottom: "var(--sp-1)" }}>
                <div style={{ display: "flex", height: 8, borderRadius: "var(--r-full)", overflow: "hidden", gap: 1 }}>
                    {zones.map((z, i) => { const prev = i === 0 ? 0 : zones[i - 1].end; return <div key={i} style={{ width: `${(z.end - prev) * 100}%`, background: z.c, opacity: 0.55 }} />; })}
                </div>
                <div style={{ position: "absolute", top: -2, left: `${Math.min(pct * 100, 97)}%`, transform: "translateX(-50%)", width: 12, height: 12, borderRadius: "50%", background: bmi.color, border: "2px solid var(--c-bg,#080C10)", boxShadow: `0 0 6px ${bmi.color}` }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--sp-3)" }}>
                {["15", "18.5", "25", "30", "40"].map((v) => <span key={v} className="label text-gray">{v}</span>)}
            </div>
            <div className="body-sm text-gray" style={{ borderTop: "1px solid var(--c-border,rgba(255,255,255,0.06))", paddingTop: "var(--sp-3)" }}>
                Нормален BMI: <strong style={{ color: "#00E676" }}>18.5 – 24.9</strong>. Цел: ≤ {targetW} кг.
            </div>
        </div>
    );
}

function WaterCard({ onAddWater }: { onAddWater: () => void }): JSX.Element {
    return (
        <div className="card card-sm" style={{ padding: "var(--sp-5)" }}>
            <div className="dash-water-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "var(--sp-3)", marginBottom: "var(--sp-3)" }}>
                <div className="label text-gray">Хидратация</div>
                <button type="button" className="btn-ghost btn-sm" onClick={onAddWater}>+ Чаша</button>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "var(--sp-2)", marginBottom: "var(--sp-4)" }}>
                <span style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 900, color: "#0099FF", lineHeight: 1 }}>{USER.water.consumed}</span>
                <span className="body-sm text-gray">от {USER.water.target} чаши · {USER.water.consumed * 250} мл</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(8,1fr)", gap: 4, marginBottom: "var(--sp-3)" }}>
                {Array.from({ length: USER.water.target }, (_, i) => (
                    <div key={i} style={{ height: 28, borderRadius: "4px 4px 2px 2px", position: "relative", overflow: "hidden", background: i < USER.water.consumed ? "linear-gradient(to top,#0055CC,#0099FF)" : "rgba(255,255,255,0.06)", border: i < USER.water.consumed ? "none" : "1px solid rgba(255,255,255,0.08)" }}>
                        {i < USER.water.consumed && <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "30%", background: "rgba(255,255,255,0.15)" }} />}
                    </div>
                ))}
            </div>
            <div className="body-sm text-gray">Остават {(USER.water.target - USER.water.consumed) * 250} мл до дневната цел.</div>
        </div>
    );
}

function GoalsCard(): JSX.Element {
    const totalToLose = USER.startWeight - USER.targetWeight;
    const alreadyLost = USER.startWeight - USER.currentWeight;
    const pct = alreadyLost / totalToLose;
    const remaining = +(USER.currentWeight - USER.targetWeight).toFixed(1);
    return (
        <div className="card card-sm" style={{ padding: "var(--sp-5)" }}>
            <div className="label text-gray" style={{ marginBottom: "var(--sp-4)" }}>Прогрес към целта</div>
            <div className="dash-goals-summary" style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr auto 1fr", gap: "var(--sp-2)", alignItems: "center", marginBottom: "var(--sp-4)", textAlign: "center" }}>
                <div><div className="label text-gray">Начало</div><div style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 700, color: "var(--color-gray)" }}>{USER.startWeight} кг</div></div>
                <span className="dash-goals-arrow" style={{ color: "rgba(255,255,255,0.15)" }}>→</span>
                <div><div className="label" style={{ color: "var(--c-electric,#0066FF)" }}>Сега</div><div style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 700, color: "var(--c-electric,#0066FF)" }}>{USER.currentWeight} кг</div></div>
                <span className="dash-goals-arrow" style={{ color: "rgba(255,255,255,0.15)" }}>→</span>
                <div><div className="label text-gray">Цел</div><div style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 700, color: "var(--c-acid,#C8FF00)" }}>{USER.targetWeight} кг</div></div>
            </div>
            <div style={{ marginBottom: "var(--sp-2)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--sp-1)" }}>
                    <span className="label text-gray">Свалени {alreadyLost.toFixed(1)} кг</span>
                    <span className="label" style={{ color: "var(--c-acid,#C8FF00)" }}>{Math.round(pct * 100)}%</span>
                </div>
                <div style={{ height: 8, borderRadius: "var(--r-full)", background: "rgba(255,255,255,0.06)", position: "relative" }}>
                    <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${pct * 100}%`, borderRadius: "var(--r-full)", background: "linear-gradient(to right,var(--c-electric,#0066FF),var(--c-acid,#C8FF00))", transition: "width 1s ease" }} />
                    <div style={{ position: "absolute", top: -3, left: `${Math.min(pct * 100, 97)}%`, transform: "translateX(-50%)", width: 14, height: 14, borderRadius: "50%", background: "var(--c-acid,#C8FF00)", border: "2px solid var(--c-bg,#080C10)", boxShadow: "0 0 8px rgba(200,255,0,0.5)" }} />
                </div>
            </div>
            <div className="body-sm text-gray">Остават <strong style={{ color: "var(--color-cream)" }}>{remaining} кг</strong> до целта · прибл. {Math.ceil(remaining / 0.5)} седмици</div>
        </div>
    );
}

function Dashboard({ theme, onToggleTheme }: DashboardProps): JSX.Element {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [modal, setModal] = useState<ModalType>(null);
    const [activeMealType, setActiveMealType] = useState("Вечеря");

    const openMealModal = (type: string) => { setActiveMealType(type); setModal("meal"); };

    return (
        <>
            <style>{DASH_CSS}</style>

            {/* Modals */}
            {modal === "weight" && <LogWeightModal onClose={() => setModal(null)} />}
            {modal === "meal"   && <AddMealModal initialType={activeMealType} onClose={() => setModal(null)} />}
            {modal === "water"  && <AddWaterModal onClose={() => setModal(null)} />}

            {/* Sidebar overlay — mobile */}
            {isSidebarOpen && (
                <div
                    style={{ position: "fixed", inset: 0, zIndex: 299, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)", cursor: "pointer" }}
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <div className="dash-page">
                <DashboardSidebar
                    theme={theme}
                    onToggleTheme={onToggleTheme}
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                />

                <div className="dash-main">
                    <DashHeader
                        onLogWeight={() => setModal("weight")}
                        onToggleSidebar={() => setIsSidebarOpen((v) => !v)}
                    />

                    <div className="dash-content">
                        <StatsRow onLogWeight={() => setModal("weight")} />

                        <div className="dash-row3">
                            <CalorieRingCard />
                            <MacrosCard />
                            <WeightChartCard />
                        </div>

                        <div className="dash-row2">
                            <MealLogCard onAddMeal={openMealModal} />
                            <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
                                <BmiCard />
                                <WaterCard onAddWater={() => setModal("water")} />
                                <GoalsCard />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Dashboard;
