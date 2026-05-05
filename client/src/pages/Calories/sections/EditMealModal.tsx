import { useState } from "react";
import type { JSX } from "react";
import { dashboardApi } from "../../../services/dashboardApi";
import type { ApiMeal } from "../../../services/dashboardApi";

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "10px 14px", borderRadius: "var(--r-lg)",
  background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
  color: "var(--color-cream)", fontSize: "0.9rem", outline: "none", boxSizing: "border-box",
};
const labelStyle: React.CSSProperties = {
  display: "block", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.06em",
  textTransform: "uppercase", color: "rgba(255,255,255,0.45)", marginBottom: 6,
};

type EditMealModalProps = {
  meal: ApiMeal;
  onClose: () => void;
  onSuccess: () => void;
};

export default function EditMealModal({ meal, onClose, onSuccess }: EditMealModalProps): JSX.Element {
  const [name, setName]       = useState(meal.title);
  const [kcal, setKcal]       = useState(String(meal.calories));
  const [protein, setProtein] = useState(meal.protein != null ? String(Math.round(meal.protein)) : "");
  const [carbs, setCarbs]     = useState(meal.carbs   != null ? String(Math.round(meal.carbs))   : "");
  const [fat, setFat]         = useState(meal.fat     != null ? String(Math.round(meal.fat))     : "");
  const [notes, setNotes]     = useState(meal.notes ?? "");
  const [status, setStatus]   = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errMsg, setErrMsg]   = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !kcal) return;
    setStatus("loading");
    setErrMsg("");
    try {
      await dashboardApi.updateMeal(meal.id, {
        title:    name.trim(),
        calories: Number(kcal),
        protein:  protein ? Number(protein) : null,
        carbs:    carbs   ? Number(carbs)   : null,
        fat:      fat     ? Number(fat)     : null,
        notes:    notes.trim() || null,
      });
      setStatus("success");
      onSuccess();
      setTimeout(onClose, 1200);
    } catch (err) {
      setErrMsg(err instanceof Error ? err.message : "Грешка. Опитай отново.");
      setStatus("error");
    }
  };

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 400, display: "flex", alignItems: "center", justifyContent: "center", padding: "var(--sp-4)", background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <div
        style={{ width: "100%", maxWidth: 480, background: "var(--c-surface-1,#0E1318)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "var(--r-xl,20px)", padding: "var(--sp-6)", display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {status === "success" ? (
          <div style={{ textAlign: "center", padding: "var(--sp-5) 0" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "var(--sp-3)" }}>✅</div>
            <div className="heading-sm" style={{ color: "var(--color-cream)" }}>Записано!</div>
            <div className="body-sm text-gray" style={{ marginTop: 8 }}>{name}</div>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div className="label text-gray">Редактирай запис</div>
                <div className="heading-sm" style={{ color: "var(--color-cream)", marginTop: 4 }}>{meal.title}</div>
              </div>
              <button type="button" onClick={onClose} style={{ background: "rgba(255,255,255,0.06)", border: "none", borderRadius: "50%", width: 32, height: 32, cursor: "pointer", color: "var(--color-cream)", fontSize: "1.1rem", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "var(--sp-3)" }}>
              <div>
                <label style={labelStyle}>Наименование</label>
                <input style={inputStyle} placeholder="напр. Пилешки гърди" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div>
                <label style={labelStyle}>Калории (kcal)</label>
                <input style={{ ...inputStyle, fontSize: "1.2rem", fontWeight: 700, textAlign: "center" }} type="number" min="0" placeholder="0" value={kcal} onChange={(e) => setKcal(e.target.value)} required />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "var(--sp-2)" }}>
                {[
                  { label: "Протеин (г)", val: protein, set: setProtein },
                  { label: "Въгл. (г)",   val: carbs,   set: setCarbs   },
                  { label: "Мазнини (г)", val: fat,     set: setFat     },
                ].map((m) => (
                  <div key={m.label}>
                    <label style={labelStyle}>{m.label}</label>
                    <input style={inputStyle} type="number" min="0" placeholder="0" value={m.val} onChange={(e) => m.set(e.target.value)} />
                  </div>
                ))}
              </div>
              <div>
                <label style={labelStyle}>Бележка (по желание)</label>
                <input style={inputStyle} placeholder="напр. след тренировка" value={notes} onChange={(e) => setNotes(e.target.value)} />
              </div>
              {status === "error" && (
                <div style={{ padding: "var(--sp-3)", borderRadius: "var(--r-md)", background: "rgba(255,61,87,0.1)", border: "1px solid rgba(255,61,87,0.2)" }}>
                  <span className="body-sm" style={{ color: "var(--c-error,#FF3D57)" }}>{errMsg}</span>
                </div>
              )}
              <button type="submit" className="btn-primary" style={{ marginTop: "var(--sp-2)" }} disabled={status === "loading"}>
                {status === "loading" ? "Записване…" : "Запази промените"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
