import { useState } from "react";
import type { JSX } from "react";
import DashboardSidebar from "../../layout/DashboardLayout/DashboardSidebar";
import { useAuth, getInitials } from "../../context/AuthContext";
import { useDashboardData } from "../../hooks/useDashboardData";
import { dashboardApi } from "../../services/dashboardApi";
import { hydrationApi } from "../../services/hydrationApi";
import type { DashboardData } from "../../hooks/useDashboardData";
import type { ApiMeal } from "../../services/dashboardApi";

type DashboardProps = { theme: "dark" | "light"; onToggleTheme: () => void };
type ModalType = "weight" | "meal" | "water" | null;

// ─── Static data ──────────────────────────────────────────────────────────────

const MEAL_TYPES = [
  { type: "Закуска",            emoji: "🌅" },
  { type: "Обяд",               emoji: "☀️" },
  { type: "Следобедна закуска", emoji: "🍎" },
  { type: "Вечеря",             emoji: "🌙" },
];

// ─── CSS ──────────────────────────────────────────────────────────────────────

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

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

function fmt(n: number) { return n.toLocaleString("bg-BG"); }
function round1(n: number) { return Math.round(n * 10) / 10; }

// ─── ModalBase ────────────────────────────────────────────────────────────────

function ModalBase({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: JSX.Element | JSX.Element[];
}): JSX.Element {
  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 400, display: "flex", alignItems: "center", justifyContent: "center", padding: "var(--sp-5)", background: "rgba(0,0,0,0.72)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <div
        style={{ background: "var(--c-surface-1,#0E1318)", border: "1px solid var(--c-border-strong,rgba(255,255,255,0.14))", borderRadius: "var(--r-xl)", padding: "var(--sp-6)", width: "100%", maxWidth: 480, maxHeight: "90vh", overflowY: "auto" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--sp-6)" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", fontWeight: 800, color: "var(--color-cream)", margin: 0 }}>{title}</h2>
          <button type="button" onClick={onClose} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "var(--r-md)", width: 32, height: 32, cursor: "pointer", color: "var(--c-text-secondary,#7A8FA3)", fontSize: "1.1rem", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ─── LogWeightModal — connected to POST /api/progress ────────────────────────

function LogWeightModal({
  currentWeight,
  onClose,
  onSuccess,
}: {
  currentWeight: number | null;
  onClose: () => void;
  onSuccess: () => void;
}): JSX.Element {
  const todayStr = new Date().toISOString().split("T")[0];
  const [weight, setWeight] = useState("");
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errMsg, setErrMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!weight) return;
    setStatus("loading");
    setErrMsg("");
    try {
      await dashboardApi.logWeight(Number(weight), note || undefined);
      setStatus("success");
      onSuccess();
      setTimeout(onClose, 1400);
    } catch (err) {
      setErrMsg(err instanceof Error ? err.message : "Грешка. Опитай отново.");
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <ModalBase title="Запиши тегло" onClose={onClose}>
        <div style={{ textAlign: "center", padding: "var(--sp-6) 0" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "var(--sp-4)" }}>✅</div>
          <div className="heading-sm" style={{ color: "var(--color-cream)", marginBottom: "var(--sp-2)" }}>Записано!</div>
          <div className="body-md text-gray">{weight} кг</div>
        </div>
      </ModalBase>
    );
  }

  return (
    <ModalBase title="Запиши тегло" onClose={onClose}>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
        <div className="form-group">
          <label className="form-label" htmlFor="wm-date">Дата</label>
          <input type="date" id="wm-date" className="form-input" value={todayStr} readOnly />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="wm-weight">Тегло (кг)</label>
          <input
            type="number" id="wm-weight" className="form-input" step="0.1" min="20" max="300"
            placeholder={currentWeight != null ? String(currentWeight) : "напр. 82.5"}
            autoFocus value={weight} onChange={(e) => setWeight(e.target.value)} required
            style={{ fontSize: "1.4rem", fontFamily: "var(--font-display)", fontWeight: 700, textAlign: "center" }}
          />
          {currentWeight != null && (
            <div className="body-sm text-gray" style={{ marginTop: 4 }}>
              Последно записано: <strong style={{ color: "var(--color-cream)" }}>{currentWeight} кг</strong>
            </div>
          )}
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="wm-note">Бележка <span className="text-gray">(по желание)</span></label>
          <textarea id="wm-note" className="form-input" rows={2} placeholder="напр. след тренировка…" value={note} onChange={(e) => setNote(e.target.value)} style={{ resize: "vertical", minHeight: 60 }} />
        </div>
        {status === "error" && (
          <div className="login-error"><span>{errMsg}</span></div>
        )}
        <button type="submit" className="btn-primary btn-full" disabled={status === "loading" || !weight}>
          {status === "loading" ? "Записване…" : "⚖️  Запиши тегло"}
        </button>
      </form>
    </ModalBase>
  );
}

// ─── AddMealModal — connected to POST /api/meals ──────────────────────────────

function AddMealModal({
  initialType,
  onClose,
  onSuccess,
}: {
  initialType: string;
  onClose: () => void;
  onSuccess: () => void;
}): JSX.Element {
  const [mealType, setMealType] = useState(initialType);
  const [name, setName] = useState("");
  const [kcal, setKcal] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errMsg, setErrMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!kcal) return;
    setStatus("loading");
    setErrMsg("");
    try {
      await dashboardApi.logMeal({
        title: name.trim() || mealType,
        calories: Number(kcal),
        ...(protein ? { protein: Number(protein) } : {}),
        ...(carbs   ? { carbs:   Number(carbs)   } : {}),
        ...(fat     ? { fat:     Number(fat)     } : {}),
      });
      setStatus("success");
      onSuccess();
      setTimeout(onClose, 1400);
    } catch (err) {
      setErrMsg(err instanceof Error ? err.message : "Грешка. Опитай отново.");
      setStatus("error");
    }
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
        <div>
          <div className="form-label" style={{ marginBottom: "var(--sp-2)" }}>Тип хранене</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--sp-2)" }}>
            {MEAL_TYPES.map((m) => (
              <button
                key={m.type} type="button"
                onClick={() => setMealType(m.type)}
                style={{
                  padding: "var(--sp-2) var(--sp-3)", borderRadius: "var(--r-md)", cursor: "pointer",
                  fontSize: "0.85rem", fontWeight: 500, display: "flex", alignItems: "center", gap: "var(--sp-2)",
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
          <input type="number" id="am-kcal" className="form-input" placeholder="0" min="0" max="5000" required value={kcal} onChange={(e) => setKcal(e.target.value)} style={{ fontSize: "1.3rem", fontFamily: "var(--font-display)", fontWeight: 700, textAlign: "center" }} />
        </div>

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

        {status === "error" && (
          <div className="login-error"><span>{errMsg}</span></div>
        )}
        <button type="submit" className="btn-primary btn-full" disabled={status === "loading" || !kcal}>
          {status === "loading" ? "Добавяне…" : "🍽️  Добави хранене"}
        </button>
      </form>
    </ModalBase>
  );
}

// ─── AddWaterModal ─────────────────────────────────────────────────────────────

function AddWaterModal({
  consumed,
  target,
  onClose,
  onAdded,
}: {
  consumed: number;
  target: number;
  onClose: () => void;
  onAdded: () => void;
}): JSX.Element {
  const [glasses, setGlasses] = useState(1);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errMsg, setErrMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrMsg("");
    try {
      await hydrationApi.add(glasses * 250);
      setStatus("success");
      onAdded();
      setTimeout(onClose, 1200);
    } catch (err) {
      setErrMsg(err instanceof Error ? err.message : "Грешка при добавяне.");
      setStatus("error");
    }
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
        <div style={{ textAlign: "center", padding: "var(--sp-4)", borderRadius: "var(--r-lg)", background: "rgba(0,153,255,0.06)", border: "1px solid rgba(0,153,255,0.15)" }}>
          <div className="label text-gray" style={{ marginBottom: "var(--sp-2)" }}>Вече изпити днес</div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: "2.5rem", fontWeight: 900, color: "#0099FF", lineHeight: 1 }}>{consumed} / {target}</div>
          <div className="body-sm text-gray">чаши · {consumed * 250} / {target * 250} мл</div>
        </div>
        <div>
          <div className="form-label" style={{ marginBottom: "var(--sp-3)" }}>Колко чаши добавяш?</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "var(--sp-2)" }}>
            {[1, 2, 3, 4].map((n) => (
              <button key={n} type="button" onClick={() => setGlasses(n)} style={{ padding: "var(--sp-4) var(--sp-3)", borderRadius: "var(--r-lg)", cursor: "pointer", fontFamily: "var(--font-display)", fontSize: "1.6rem", fontWeight: 900, lineHeight: 1, border: glasses === n ? "2px solid #0099FF" : "2px solid rgba(255,255,255,0.08)", background: glasses === n ? "rgba(0,153,255,0.15)" : "rgba(255,255,255,0.04)", color: glasses === n ? "#0099FF" : "var(--c-text-secondary,#7A8FA3)", transition: "var(--t-base)", display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <span>{"💧".repeat(n)}</span>
                <span style={{ fontSize: "0.75rem", fontFamily: "var(--font-body,sans-serif)", fontWeight: 400 }}>{n * 250} мл</span>
              </button>
            ))}
          </div>
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="wt-glasses">Или въведи ръчно (чаши)</label>
          <input type="number" id="wt-glasses" className="form-input" min="1" max="20" value={glasses} onChange={(e) => setGlasses(Math.max(1, parseInt(e.target.value) || 1))} style={{ textAlign: "center", fontSize: "1.2rem", fontFamily: "var(--font-display)", fontWeight: 700 }} />
        </div>
        {errMsg && <div className="login-error"><span>{errMsg}</span></div>}
        <button type="submit" className="btn-primary btn-full" disabled={status === "loading"}>
          {status === "loading" ? "Добавяне…" : `💧  Добави ${glasses} ${glasses === 1 ? "чаша" : "чаши"} (${glasses * 250} мл)`}
        </button>
      </form>
    </ModalBase>
  );
}

// ─── DashHeader ───────────────────────────────────────────────────────────────

function DashHeader({
  onLogWeight,
  onToggleSidebar,
}: {
  onLogWeight: () => void;
  onToggleSidebar: () => void;
}): JSX.Element {
  const { user } = useAuth();
  const today = new Date().toLocaleDateString("bg-BG", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const initials = user ? getInitials(user) : "?";

  return (
    <div className="dash-header" style={{ padding: "var(--sp-4) var(--sp-6)", borderBottom: "1px solid var(--c-border,rgba(255,255,255,0.06))", display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--c-surface-1,#0E1318)", gap: "var(--sp-3)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "var(--sp-3)", minWidth: 0 }}>
        <button type="button" className="dash-hamburger" onClick={onToggleSidebar} aria-label="Навигация">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <div style={{ minWidth: 0 }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.7rem", fontWeight: 800, color: "var(--color-cream)", lineHeight: 1.2, marginBottom: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            Здравей, <span style={{ color: "var(--c-acid,#C8FF00)" }}>{user?.firstName ?? ""}</span>! 👋
          </h1>
          <div className="body-sm text-gray" style={{ textTransform: "capitalize", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{today}</div>
        </div>
      </div>
      <div className="dash-header-actions" style={{ display: "flex", alignItems: "center", gap: "var(--sp-3)", flexShrink: 0 }}>
        {/* TODO(Stage 5): Replace with real streak count from activity logs */}
        <div className="dash-header-streak" style={{ alignItems: "center", gap: "var(--sp-2)", padding: "var(--sp-2) var(--sp-3)", borderRadius: "var(--r-full)", background: "rgba(200,255,0,0.08)", border: "1px solid rgba(200,255,0,0.2)" }}>
          <span>🔥</span>
          <span className="body-sm" style={{ color: "var(--c-acid,#C8FF00)", fontWeight: 600 }}>Серия</span>
        </div>
        <button type="button" className="btn-primary btn-sm dash-header-logbtn" onClick={onLogWeight}>+ Запиши тегло</button>
        <div style={{ width: 36, height: 36, borderRadius: "50%", flexShrink: 0, cursor: "pointer", background: "linear-gradient(135deg,var(--c-electric,#0066FF),var(--c-acid,#C8FF00))", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontSize: "0.8rem", fontWeight: 700, color: "var(--c-bg,#080C10)", overflow: "hidden" }}>
          {user?.avatarDataUrl
            ? <img src={user.avatarDataUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : initials}
        </div>
      </div>
    </div>
  );
}

// ─── StatsRow ─────────────────────────────────────────────────────────────────

function StatsRow({
  data,
  onLogWeight,
}: {
  data: DashboardData;
  onLogWeight: () => void;
}): JSX.Element {
  const { todayCalories, goalCalories, currentWeight, weightChange, bmi, water, steps, isLoading } = data;
  const dash = isLoading ? "—" : null;
  const bmiInfo = bmi != null ? bmiLabel(bmi) : null;

  const weightSub = (() => {
    if (isLoading) return "кг";
    if (currentWeight == null) return "Запиши тегло";
    if (weightChange == null) return "кг · само 1 запис";
    const sign = weightChange < 0 ? "↓" : weightChange > 0 ? "↑" : "→";
    return `кг · ${sign} ${Math.abs(weightChange)} кг`;
  })();

  const weightAccent = (() => {
    if (weightChange == null || currentWeight == null) return null;
    if (weightChange < 0) return { text: "↓ прогрес", color: "#00E676" };
    if (weightChange > 0) return { text: "↑ качване",  color: "var(--c-error,#FF3D57)" };
    return { text: "→ без промяна", color: "#FFB300" };
  })();

  const stats = [
    {
      emoji: "🔥", label: "Калории днес",
      value: dash ?? fmt(todayCalories),
      sub: `от ${fmt(goalCalories)} kcal`,
      pct: goalCalories > 0 ? todayCalories / goalCalories : 0,
      bar: "var(--c-electric,#0066FF)", accent: null, action: undefined as (() => void) | undefined,
    },
    {
      emoji: "⚖️", label: "Тегло",
      value: dash ?? (currentWeight != null ? String(currentWeight) : "—"),
      sub: weightSub, pct: null, bar: null,
      accent: weightAccent, action: onLogWeight,
    },
    {
      emoji: "📊", label: "BMI",
      value: dash ?? (bmi != null ? bmi.toFixed(1) : "—"),
      sub: bmiInfo?.text ?? "Попълни профила",
      pct: null, bar: null,
      accent: bmiInfo ? { text: bmiInfo.text.split(" ")[0], color: bmiInfo.color } : null,
      action: undefined as (() => void) | undefined,
    },
    {
      // TODO(Stage 5): replace consumed with real hydration API data
      emoji: "💧", label: "Хидратация",
      value: dash ?? String(water.consumed),
      sub: `от ${water.target} чаши · ${water.consumed * 250} мл`,
      pct: water.consumed / water.target,
      bar: "#0099FF", accent: null, action: undefined as (() => void) | undefined,
    },
    {
      // TODO(Stage 5): replace today with real steps API data
      emoji: "👟", label: "Стъпки",
      value: dash ?? fmt(steps.today),
      sub: `от ${fmt(steps.target)} стъпки`,
      pct: steps.today / steps.target,
      bar: "var(--c-acid,#C8FF00)", accent: null, action: undefined as (() => void) | undefined,
    },
  ];

  return (
    <div className="dash-stats-grid">
      {stats.map((s) => (
        <div key={s.label} className="card card-sm" style={{ padding: "var(--sp-4)", cursor: s.action ? "pointer" : undefined }} onClick={s.action}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--sp-2)" }}>
            <span style={{ fontSize: "1.2rem" }}>{s.emoji}</span>
            {s.accent && <span className="label" style={{ color: s.accent.color }}>{s.accent.text}</span>}
          </div>
          <div className="label text-gray" style={{ marginBottom: "var(--sp-1)" }}>{s.label}</div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: "1.65rem", fontWeight: 900, color: "var(--color-cream)", lineHeight: 1.1 }}>{s.value}</div>
          <div className="body-sm text-gray" style={{ marginTop: 2, fontSize: "0.78rem" }}>{s.sub}</div>
          {s.pct !== null && (
            <div style={{ marginTop: "var(--sp-2)", height: 3, borderRadius: "var(--r-full)", background: "rgba(255,255,255,0.06)" }}>
              <div style={{ width: `${Math.min(s.pct * 100, 100)}%`, height: "100%", borderRadius: "var(--r-full)", background: s.bar!, transition: "width 0.6s ease" }} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── CalorieRingCard ──────────────────────────────────────────────────────────

function CalorieRingCard({ data }: { data: DashboardData }): JSX.Element {
  const { todayCalories, goalCalories, todayMacros, macroTargets, isLoading } = data;
  const calPct  = goalCalories > 0 ? todayCalories / goalCalories : 0;
  const protPct = macroTargets.protein > 0 ? todayMacros.protein / macroTargets.protein : 0;
  const outer = ring(80, calPct), inner = ring(62, protPct);
  const remaining = goalCalories - todayCalories;

  return (
    <div className="card" style={{ padding: "var(--sp-5)", display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div className="label text-gray">Калории днес</div>
          <div className="heading-sm" style={{ color: "var(--color-cream)", marginTop: 2 }}>
            {isLoading ? "—" : `${fmt(todayCalories)} kcal`}
          </div>
        </div>
        <span className="badge badge-olive">{isLoading ? "—" : `${Math.round(calPct * 100)}%`}</span>
      </div>
      <div style={{ display: "flex", justifyContent: "center", position: "relative" }}>
        <svg width="200" height="200" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="80" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="14" />
          <circle cx="100" cy="100" r="80" fill="none" stroke="var(--c-electric,#0066FF)" strokeWidth="14" strokeLinecap="round" strokeDasharray={outer.circ} strokeDashoffset={outer.offset} transform="rotate(-90 100 100)" style={{ transition: "stroke-dashoffset 1s ease" }} />
          <circle cx="100" cy="100" r="62" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="10" />
          <circle cx="100" cy="100" r="62" fill="none" stroke="var(--c-acid,#C8FF00)" strokeWidth="10" strokeLinecap="round" strokeDasharray={inner.circ} strokeDashoffset={inner.offset} transform="rotate(-90 100 100)" style={{ transition: "stroke-dashoffset 1s ease" }} />
        </svg>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", textAlign: "center" }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", fontWeight: 900, color: "var(--color-cream)", lineHeight: 1.1 }}>
            {isLoading ? "—" : fmt(todayCalories)}
          </div>
          <div className="label text-gray">от {fmt(goalCalories)}</div>
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
        {!isLoading && (
          <div className="body-sm" style={{ color: remaining >= 0 ? "#00E676" : "var(--c-error,#FF3D57)" }}>
            {remaining >= 0 ? `–${fmt(remaining)}` : `+${fmt(Math.abs(remaining))}`} kcal остават
          </div>
        )}
      </div>
    </div>
  );
}

// ─── MacrosCard ───────────────────────────────────────────────────────────────

function MacrosCard({ data }: { data: DashboardData }): JSX.Element {
  const { todayMacros, macroTargets, bmr, tdee, isLoading } = data;
  const macros = [
    { label: "Протеин",       consumed: round1(todayMacros.protein), target: macroTargets.protein, color: "var(--c-electric,#0066FF)", kcalPer: 4 },
    { label: "Въглехидрати", consumed: round1(todayMacros.carbs),   target: macroTargets.carbs,   color: "var(--c-acid,#C8FF00)",     kcalPer: 4 },
    { label: "Мазнини",      consumed: round1(todayMacros.fat),     target: macroTargets.fat,     color: "#FFB300",                   kcalPer: 9 },
  ];
  const totalTarget = macroTargets.protein + macroTargets.carbs + macroTargets.fat;

  return (
    <div className="card" style={{ padding: "var(--sp-5)", display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
      <div className="label text-gray">Макронутриенти</div>
      <div style={{ display: "flex", height: 8, borderRadius: "var(--r-full)", overflow: "hidden", gap: 1 }}>
        {macros.map((m) => (
          <div key={m.label} style={{ width: `${totalTarget > 0 ? (m.consumed / totalTarget) * 100 : 33}%`, background: m.color, transition: "width 0.8s ease" }} />
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
        {macros.map((m) => (
          <div key={m.label}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--sp-1)" }}>
              <span className="body-sm" style={{ color: "var(--color-cream)" }}>{m.label}</span>
              <span className="body-sm text-gray">{isLoading ? "—" : `${m.consumed} / ${m.target} г`}</span>
            </div>
            <div style={{ height: 6, borderRadius: "var(--r-full)", background: "rgba(255,255,255,0.06)" }}>
              <div style={{ width: `${m.target > 0 ? Math.min(m.consumed / m.target, 1) * 100 : 0}%`, height: "100%", borderRadius: "var(--r-full)", background: m.color, transition: "width 0.8s ease" }} />
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", borderTop: "1px solid var(--c-border,rgba(255,255,255,0.06))", paddingTop: "var(--sp-3)" }}>
        {macros.map((m) => (
          <div key={m.label} style={{ textAlign: "center" }}>
            <div style={{ width: 6, height: 6, borderRadius: 2, background: m.color, margin: "0 auto 4px" }} />
            <div className="body-sm" style={{ color: "var(--color-cream)", fontWeight: 600 }}>{isLoading ? "—" : Math.round(m.consumed * m.kcalPer)}</div>
            <div className="label text-gray">kcal</div>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderTop: "1px solid var(--c-border,rgba(255,255,255,0.06))", paddingTop: "var(--sp-3)" }}>
        <div><div className="label text-gray">BMR</div><div className="body-sm" style={{ color: "var(--color-cream)", fontWeight: 600 }}>{isLoading ? "—" : bmr != null ? `${fmt(bmr)} kcal` : "—"}</div></div>
        <div><div className="label text-gray">TDEE</div><div className="body-sm" style={{ color: "var(--color-cream)", fontWeight: 600 }}>{isLoading ? "—" : tdee != null ? `${fmt(tdee)} kcal` : "—"}</div></div>
      </div>
    </div>
  );
}

// ─── WeightChartCard ──────────────────────────────────────────────────────────

function WeightChartCard({ data }: { data: DashboardData }): JSX.Element {
  const { currentWeight, weightHistory, isLoading } = data;
  const W = 260, H = 90, PAD = 12;
  const hasChart = weightHistory.length >= 2;
  const vals = weightHistory.map((d) => d.w);
  const sl = hasChart ? sparkline(weightHistory, W, H, PAD) : null;
  const weekLost = hasChart ? +(vals[0] - vals[vals.length - 1]).toFixed(1) : null;

  return (
    <div className="card" style={{ padding: "var(--sp-5)", display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div className="label text-gray">Тегло — последните 7 дни</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: "var(--sp-2)", marginTop: 4 }}>
            <span style={{ fontFamily: "var(--font-display)", fontSize: "2.2rem", fontWeight: 900, color: "var(--color-cream)", lineHeight: 1 }}>
              {isLoading ? "—" : currentWeight != null ? currentWeight : "—"}
            </span>
            <span className="body-sm text-gray">кг</span>
          </div>
        </div>
        {weekLost != null && (
          <div style={{ textAlign: "right" }}>
            <div style={{ color: weekLost >= 0 ? "#00E676" : "var(--c-error,#FF3D57)", fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 700 }}>
              {weekLost >= 0 ? "↓" : "↑"} {Math.abs(weekLost)} кг
            </div>
            <div className="label text-gray">тази седмица</div>
          </div>
        )}
      </div>

      {isLoading ? (
        <div style={{ height: H, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.02)", borderRadius: "var(--r-md)" }}>
          <span className="body-sm text-gray">Зареждане…</span>
        </div>
      ) : !hasChart ? (
        <div style={{ height: H, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.02)", borderRadius: "var(--r-md)", flexDirection: "column", gap: "var(--sp-2)", textAlign: "center", padding: "0 var(--sp-4)" }}>
          <span style={{ fontSize: "1.4rem" }}>⚖️</span>
          <span className="body-sm text-gray">Запиши поне 2 измервания, за да видиш графиката</span>
        </div>
      ) : (
        <>
          <div style={{ borderRadius: "var(--r-md)", overflow: "hidden", background: "rgba(255,255,255,0.02)" }}>
            <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: "block", width: "100%", height: "auto" }}>
              <defs><linearGradient id="wgr" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0066FF" stopOpacity="0.3" /><stop offset="100%" stopColor="#0066FF" stopOpacity="0" /></linearGradient></defs>
              {[0.25, 0.5, 0.75].map((f) => <line key={f} x1={PAD} y1={PAD + f * (H - PAD * 2)} x2={W - PAD} y2={PAD + f * (H - PAD * 2)} stroke="rgba(255,255,255,0.04)" strokeWidth={1} />)}
              <path d={sl!.area} fill="url(#wgr)" />
              <path d={sl!.line} fill="none" stroke="var(--c-electric,#0066FF)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              {sl!.pts.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={i === sl!.pts.length - 1 ? 4 : 2.5} fill={i === sl!.pts.length - 1 ? "var(--c-acid,#C8FF00)" : "var(--c-electric,#0066FF)"} stroke="var(--c-bg,#080C10)" strokeWidth={1.5} />)}
            </svg>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            {[weightHistory[0], weightHistory[Math.floor(weightHistory.length / 2)], weightHistory[weightHistory.length - 1]].map((e, i) => (
              <span key={i} className="label text-gray">{e?.date ?? ""}</span>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", borderTop: "1px solid var(--c-border,rgba(255,255,255,0.06))", paddingTop: "var(--sp-3)" }}>
            {[{ l: "Мін.", v: Math.min(...vals).toFixed(1), c: "var(--color-cream)" }, { l: "Днес", v: currentWeight != null ? String(currentWeight) : "—", c: "var(--c-acid,#C8FF00)" }, { l: "Макс.", v: Math.max(...vals).toFixed(1), c: "var(--color-cream)" }].map((s) => (
              <div key={s.l} style={{ textAlign: "center" }}>
                <div className="body-sm" style={{ color: s.c, fontWeight: 600 }}>{s.v}</div>
                <div className="label text-gray">{s.l}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─── MealLogCard ──────────────────────────────────────────────────────────────

function MealRow({ meal }: { meal: ApiMeal }): JSX.Element {
  const time = new Date(meal.createdAt).toLocaleTimeString("bg-BG", { hour: "2-digit", minute: "2-digit" });
  const hasMacros = meal.protein != null || meal.carbs != null || meal.fat != null;

  return (
    <div className="dash-meal-row" style={{ display: "flex", alignItems: "center", gap: "var(--sp-3)", padding: "var(--sp-3) var(--sp-4)", borderRadius: "var(--r-md)", background: "rgba(255,255,255,0.025)", border: "1px solid var(--c-border,rgba(255,255,255,0.06))" }}>
      <span style={{ fontSize: "1.35rem", width: 32, textAlign: "center", flexShrink: 0 }}>🍽️</span>
      <div className="dash-meal-main" style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--sp-2)", marginBottom: 2 }}>
          <span className="body-sm" style={{ color: "var(--color-cream)", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{meal.title}</span>
          <span className="label text-gray" style={{ flexShrink: 0 }}>{time}</span>
        </div>
        {meal.notes && <span className="body-sm text-gray" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block" }}>{meal.notes}</span>}
      </div>
      {hasMacros && (
        <div className="dash-meal-badges" style={{ display: "flex", gap: "var(--sp-1)", flexShrink: 0 }}>
          {meal.protein != null && <span style={{ padding: "2px 7px", borderRadius: "var(--r-full)", background: "rgba(0,102,255,0.1)",  color: "var(--c-electric,#0066FF)" }} className="label">{Math.round(meal.protein)}г б</span>}
          {meal.carbs   != null && <span style={{ padding: "2px 7px", borderRadius: "var(--r-full)", background: "rgba(200,255,0,0.08)", color: "var(--c-acid,#C8FF00)" }}     className="label">{Math.round(meal.carbs)}г в</span>}
          {meal.fat     != null && <span style={{ padding: "2px 7px", borderRadius: "var(--r-full)", background: "rgba(255,179,0,0.1)",  color: "#FFB300" }}                    className="label">{Math.round(meal.fat)}г м</span>}
        </div>
      )}
      <div className="dash-meal-kcal" style={{ textAlign: "right", flexShrink: 0, minWidth: 64 }}>
        <span style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 700, color: "var(--color-cream)" }}>
          {meal.calories}<span className="label text-gray" style={{ fontFamily: "inherit", fontWeight: 400 }}> kcal</span>
        </span>
      </div>
    </div>
  );
}

function MealLogCard({
  data,
  onAddMeal,
}: {
  data: DashboardData;
  onAddMeal: (type: string) => void;
}): JSX.Element {
  const { todayMeals, todayCalories, isLoading } = data;

  return (
    <div className="card" style={{ padding: "var(--sp-5)" }}>
      <div className="dash-meal-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "var(--sp-3)", marginBottom: "var(--sp-5)" }}>
        <div>
          <div className="label text-gray">Хранения днес</div>
          <div className="heading-sm" style={{ color: "var(--color-cream)", marginTop: 2 }}>
            {isLoading ? "—" : `${fmt(todayCalories)} kcal приети`}
          </div>
        </div>
        <button type="button" className="btn-primary btn-sm dash-meal-addbtn" onClick={() => onAddMeal("Закуска")}>+ Добави хранене</button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-2)" }}>
        {isLoading ? (
          <div className="body-sm text-gray" style={{ textAlign: "center", padding: "var(--sp-4)" }}>Зареждане…</div>
        ) : todayMeals.length === 0 ? (
          <div style={{ textAlign: "center", padding: "var(--sp-6)", display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--sp-3)" }}>
            <span style={{ fontSize: "2rem" }}>🍽️</span>
            <span className="body-sm text-gray">Няма добавени хранения за днес</span>
            <button type="button" className="btn-secondary btn-sm" onClick={() => onAddMeal("Закуска")}>+ Добави първото хранене</button>
          </div>
        ) : (
          todayMeals.map((meal) => <MealRow key={meal.id} meal={meal} />)
        )}
      </div>
    </div>
  );
}

// ─── BmiCard ──────────────────────────────────────────────────────────────────

function BmiCard({ data }: { data: DashboardData }): JSX.Element {
  const { bmi, heightCm, isLoading } = data;
  const bmiInfo = bmi != null ? bmiLabel(bmi) : null;
  const pct = bmi != null ? (bmi - 15) / 25 : 0;
  const zones = [
    { end: 3.5 / 25, c: "var(--c-electric,#0066FF)" },
    { end: 10 / 25,  c: "#00E676" },
    { end: 15 / 25,  c: "#FFB300" },
    { end: 1,        c: "var(--c-error,#FF3D57)" },
  ];
  const targetW = heightCm != null ? +(24.9 * (heightCm / 100) ** 2).toFixed(1) : null;

  return (
    <div className="card card-sm" style={{ padding: "var(--sp-5)" }}>
      <div className="label text-gray" style={{ marginBottom: "var(--sp-3)" }}>Индекс на телесна маса (BMI)</div>
      {isLoading ? (
        <div className="body-sm text-gray">Зареждане…</div>
      ) : bmi == null ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-2)" }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: "2.8rem", fontWeight: 900, color: "var(--c-text-secondary,#7A8FA3)", lineHeight: 1 }}>—</div>
          <div className="body-sm text-gray">Запиши тегло и попълни ръст в профила</div>
        </div>
      ) : (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--sp-3)", marginBottom: "var(--sp-4)" }}>
            <span style={{ fontFamily: "var(--font-display)", fontSize: "2.8rem", fontWeight: 900, color: bmiInfo!.color, lineHeight: 1 }}>{bmi.toFixed(1)}</span>
            <span className="label" style={{ color: bmiInfo!.color, background: `${bmiInfo!.color}22`, padding: "3px 9px", borderRadius: "var(--r-full)" }}>{bmiInfo!.text}</span>
          </div>
          <div style={{ position: "relative", marginBottom: "var(--sp-1)" }}>
            <div style={{ display: "flex", height: 8, borderRadius: "var(--r-full)", overflow: "hidden", gap: 1 }}>
              {zones.map((z, i) => {
                const prev = i === 0 ? 0 : zones[i - 1].end;
                return <div key={i} style={{ width: `${(z.end - prev) * 100}%`, background: z.c, opacity: 0.55 }} />;
              })}
            </div>
            <div style={{ position: "absolute", top: -2, left: `${Math.min(pct * 100, 97)}%`, transform: "translateX(-50%)", width: 12, height: 12, borderRadius: "50%", background: bmiInfo!.color, border: "2px solid var(--c-bg,#080C10)", boxShadow: `0 0 6px ${bmiInfo!.color}` }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--sp-3)" }}>
            {["15", "18.5", "25", "30", "40"].map((v) => <span key={v} className="label text-gray">{v}</span>)}
          </div>
          <div className="body-sm text-gray" style={{ borderTop: "1px solid var(--c-border,rgba(255,255,255,0.06))", paddingTop: "var(--sp-3)" }}>
            Нормален BMI: <strong style={{ color: "#00E676" }}>18.5 – 24.9</strong>.
            {targetW != null && <> Цел: ≤ {targetW} кг.</>}
          </div>
        </>
      )}
    </div>
  );
}

// ─── WaterCard ─────────────────────────────────────────────────────────────────
// TODO(Stage 5): connect consumed count to hydration API

function WaterCard({
  consumed,
  target,
  onAddWater,
}: {
  consumed: number;
  target: number;
  onAddWater: () => void;
}): JSX.Element {
  return (
    <div className="card card-sm" style={{ padding: "var(--sp-5)" }}>
      <div className="dash-water-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "var(--sp-3)", marginBottom: "var(--sp-3)" }}>
        <div className="label text-gray">Хидратация</div>
        <button type="button" className="btn-ghost btn-sm" onClick={onAddWater}>+ Чаша</button>
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: "var(--sp-2)", marginBottom: "var(--sp-4)" }}>
        <span style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 900, color: "#0099FF", lineHeight: 1 }}>{consumed}</span>
        <span className="body-sm text-gray">от {target} чаши · {consumed * 250} мл</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(8,1fr)", gap: 4, marginBottom: "var(--sp-3)" }}>
        {Array.from({ length: target }, (_, i) => (
          <div key={i} style={{ height: 28, borderRadius: "4px 4px 2px 2px", position: "relative", overflow: "hidden", background: i < consumed ? "linear-gradient(to top,#0055CC,#0099FF)" : "rgba(255,255,255,0.06)", border: i < consumed ? "none" : "1px solid rgba(255,255,255,0.08)" }}>
            {i < consumed && <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "30%", background: "rgba(255,255,255,0.15)" }} />}
          </div>
        ))}
      </div>
      <div className="body-sm text-gray">Остават {(target - consumed) * 250} мл до дневната цел.</div>
    </div>
  );
}

// ─── GoalsCard ────────────────────────────────────────────────────────────────

function GoalsCard({ data }: { data: DashboardData }): JSX.Element {
  const { currentWeight, startWeight, targetWeight, activeGoals, isLoading } = data;

  if (isLoading) {
    return (
      <div className="card card-sm" style={{ padding: "var(--sp-5)" }}>
        <div className="label text-gray" style={{ marginBottom: "var(--sp-4)" }}>Прогрес към целта</div>
        <div className="body-sm text-gray">Зареждане…</div>
      </div>
    );
  }

  if (currentWeight == null) {
    return (
      <div className="card card-sm" style={{ padding: "var(--sp-5)" }}>
        <div className="label text-gray" style={{ marginBottom: "var(--sp-4)" }}>Прогрес към целта</div>
        <div style={{ textAlign: "center", padding: "var(--sp-4) 0", display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--sp-3)" }}>
          <span style={{ fontSize: "1.8rem" }}>🎯</span>
          <span className="body-sm text-gray">
            {activeGoals.length > 0
              ? `${activeGoals.length} активни цели · запиши тегло за прогрес`
              : "Запиши тегло, за да видиш прогреса"}
          </span>
        </div>
      </div>
    );
  }

  const sw = startWeight ?? currentWeight;
  const cw = currentWeight;
  const tw = targetWeight;

  if (tw == null) {
    return (
      <div className="card card-sm" style={{ padding: "var(--sp-5)" }}>
        <div className="label text-gray" style={{ marginBottom: "var(--sp-4)" }}>Текущо тегло</div>
        <div style={{ fontFamily: "var(--font-display)", fontSize: "2.2rem", fontWeight: 900, color: "var(--color-cream)", lineHeight: 1, marginBottom: "var(--sp-2)" }}>{cw} кг</div>
        <div className="body-sm text-gray">
          {activeGoals.length > 0 ? `${activeGoals.length} активни цели` : "Не е зададена целева стойност"}
        </div>
      </div>
    );
  }

  const totalToLose = sw - tw;
  const alreadyLost = sw - cw;
  const pct = totalToLose !== 0 ? Math.max(0, Math.min(1, alreadyLost / totalToLose)) : 0;
  const remaining = +(cw - tw).toFixed(1);

  return (
    <div className="card card-sm" style={{ padding: "var(--sp-5)" }}>
      <div className="label text-gray" style={{ marginBottom: "var(--sp-4)" }}>Прогрес към целта</div>
      <div className="dash-goals-summary" style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr auto 1fr", gap: "var(--sp-2)", alignItems: "center", marginBottom: "var(--sp-4)", textAlign: "center" }}>
        <div><div className="label text-gray">Начало</div><div style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 700, color: "var(--color-gray)" }}>{sw} кг</div></div>
        <span className="dash-goals-arrow" style={{ color: "rgba(255,255,255,0.15)" }}>→</span>
        <div><div className="label" style={{ color: "var(--c-electric,#0066FF)" }}>Сега</div><div style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 700, color: "var(--c-electric,#0066FF)" }}>{cw} кг</div></div>
        <span className="dash-goals-arrow" style={{ color: "rgba(255,255,255,0.15)" }}>→</span>
        <div><div className="label text-gray">Цел</div><div style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 700, color: "var(--c-acid,#C8FF00)" }}>{tw} кг</div></div>
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
      <div className="body-sm text-gray">
        {remaining > 0 ? (
          <>Остават <strong style={{ color: "var(--color-cream)" }}>{remaining} кг</strong> до целта · прибл. {Math.ceil(remaining / 0.5)} седмици</>
        ) : (
          <strong style={{ color: "#00E676" }}>Целта е постигната! 🎉</strong>
        )}
      </div>
      {activeGoals.length > 0 && (
        <div className="label text-gray" style={{ marginTop: "var(--sp-3)", borderTop: "1px solid var(--c-border,rgba(255,255,255,0.06))", paddingTop: "var(--sp-3)" }}>
          {activeGoals.length} активни {activeGoals.length === 1 ? "цел" : "цели"} в системата
        </div>
      )}
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

function Dashboard({ theme, onToggleTheme }: DashboardProps): JSX.Element {
  const data = useDashboardData();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [modal, setModal] = useState<ModalType>(null);
  const [activeMealType, setActiveMealType] = useState("Закуска");

  const openMealModal = (type: string) => { setActiveMealType(type); setModal("meal"); };

  return (
    <>
      <style>{DASH_CSS}</style>

      {modal === "weight" && (
        <LogWeightModal currentWeight={data.currentWeight} onClose={() => setModal(null)} onSuccess={data.refresh} />
      )}
      {modal === "meal" && (
        <AddMealModal initialType={activeMealType} onClose={() => setModal(null)} onSuccess={data.refresh} />
      )}
      {modal === "water" && (
        <AddWaterModal consumed={data.water.consumed} target={data.water.target} onClose={() => setModal(null)} onAdded={data.refresh} />
      )}

      {isSidebarOpen && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 299, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)", cursor: "pointer" }}
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className="dash-page">
        <DashboardSidebar theme={theme} onToggleTheme={onToggleTheme} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        <div className="dash-main">
          <DashHeader onLogWeight={() => setModal("weight")} onToggleSidebar={() => setIsSidebarOpen((v) => !v)} />

          <div className="dash-content">
            {data.error && (
              <div style={{ marginBottom: "var(--sp-4)", padding: "var(--sp-3) var(--sp-4)", borderRadius: "var(--r-md)", background: "rgba(255,61,87,0.1)", border: "1px solid rgba(255,61,87,0.25)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--sp-3)" }}>
                <span className="body-sm" style={{ color: "var(--c-error,#FF3D57)" }}>Грешка при зареждане: {data.error}</span>
                <button type="button" className="btn-ghost btn-sm" onClick={data.refresh}>Опитай отново</button>
              </div>
            )}

            <StatsRow data={data} onLogWeight={() => setModal("weight")} />

            <div className="dash-row3">
              <CalorieRingCard data={data} />
              <MacrosCard data={data} />
              <WeightChartCard data={data} />
            </div>

            <div className="dash-row2">
              <MealLogCard data={data} onAddMeal={openMealModal} />
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
                <BmiCard data={data} />
                <WaterCard consumed={data.water.consumed} target={data.water.target} onAddWater={() => setModal("water")} />
                <GoalsCard data={data} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
