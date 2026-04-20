import { useState } from "react";
import type { JSX } from "react";

const MEAL_TYPES = ["Закуска", "Обяд", "Следобедна закуска", "Вечеря"] as const;

type AddFoodModalProps = { onClose: () => void };

export default function AddFoodModal({ onClose }: AddFoodModalProps): JSX.Element {
    const [mealType, setMealType] = useState<string>("Закуска");
    const [name, setName] = useState("");
    const [kcal, setKcal] = useState("");
    const [protein, setProtein] = useState("");
    const [carbs, setCarbs] = useState("");
    const [fat, setFat] = useState("");
    const [success, setSuccess] = useState(false);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const existing = window.localStorage.getItem("fitlife-food-log");
        const entries = existing ? (JSON.parse(existing) as Array<Record<string, unknown>>) : [];

        entries.unshift({
            id: `manual-food-${Date.now()}`,
            source: "manual",
            mealType,
            name,
            kcal: Number(kcal) || 0,
            protein: Number(protein) || 0,
            carbs: Number(carbs) || 0,
            fat: Number(fat) || 0,
            addedAt: new Date().toISOString(),
        });

        window.localStorage.setItem("fitlife-food-log", JSON.stringify(entries.slice(0, 100)));
        setSuccess(true);
        setTimeout(onClose, 1800);
    }

    const inputStyle: React.CSSProperties = {
        width: "100%", padding: "10px 14px", borderRadius: "var(--r-lg)",
        background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
        color: "var(--color-cream)", fontSize: "0.9rem", outline: "none", boxSizing: "border-box",
    };
    const labelStyle: React.CSSProperties = {
        display: "block", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.06em",
        textTransform: "uppercase", color: "rgba(255,255,255,0.45)", marginBottom: 6,
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
                {success ? (
                    <div style={{ textAlign: "center", padding: "var(--sp-5) 0" }}>
                        <div style={{ fontSize: "2.5rem", marginBottom: "var(--sp-3)" }}>✅</div>
                        <div className="heading-sm" style={{ color: "var(--color-cream)" }}>Храната е добавена!</div>
                        <div className="body-sm text-gray" style={{ marginTop: 8 }}>Записано към {mealType.toLowerCase()}.</div>
                    </div>
                ) : (
                    <>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div>
                                <div className="label text-gray">Добави към дневника</div>
                                <div className="heading-sm" style={{ color: "var(--color-cream)", marginTop: 4 }}>Нова храна</div>
                            </div>
                            <button type="button" onClick={onClose} style={{ background: "rgba(255,255,255,0.06)", border: "none", borderRadius: "50%", width: 32, height: 32, cursor: "pointer", color: "var(--color-cream)", fontSize: "1.1rem", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
                        </div>

                        <div style={{ display: "flex", gap: "var(--sp-2)", flexWrap: "wrap" }}>
                            {MEAL_TYPES.map((type) => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => setMealType(type)}
                                    style={{ padding: "6px 14px", borderRadius: "var(--r-full)", fontSize: "0.78rem", fontWeight: 700, cursor: "pointer", border: "1px solid", transition: "all 0.15s", background: mealType === type ? "rgba(0,102,255,0.15)" : "transparent", borderColor: mealType === type ? "var(--c-electric,#0066FF)" : "rgba(255,255,255,0.1)", color: mealType === type ? "var(--c-electric,#0066FF)" : "rgba(255,255,255,0.45)" }}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>

                        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "var(--sp-3)" }}>
                            <div>
                                <label style={labelStyle}>Наименование</label>
                                <input style={inputStyle} placeholder="напр. Пилешки гърди" value={name} onChange={(e) => setName(e.target.value)} required />
                            </div>
                            <div>
                                <label style={labelStyle}>Калории (kcal)</label>
                                <input style={inputStyle} type="number" min="0" placeholder="0" value={kcal} onChange={(e) => setKcal(e.target.value)} required />
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "var(--sp-2)" }}>
                                <div>
                                    <label style={labelStyle}>Протеин (г)</label>
                                    <input style={inputStyle} type="number" min="0" placeholder="0" value={protein} onChange={(e) => setProtein(e.target.value)} />
                                </div>
                                <div>
                                    <label style={labelStyle}>Въгл. (г)</label>
                                    <input style={inputStyle} type="number" min="0" placeholder="0" value={carbs} onChange={(e) => setCarbs(e.target.value)} />
                                </div>
                                <div>
                                    <label style={labelStyle}>Мазнини (г)</label>
                                    <input style={inputStyle} type="number" min="0" placeholder="0" value={fat} onChange={(e) => setFat(e.target.value)} />
                                </div>
                            </div>
                            <button type="submit" className="btn-primary" style={{ marginTop: "var(--sp-2)" }}>Запиши храната</button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}
