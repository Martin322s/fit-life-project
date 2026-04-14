import { useState } from "react";
import type { JSX } from "react";

const CATEGORIES = ["Закуска", "Обяд", "Вечеря", "Снак", "Десерт"];

type AddRecipeModalProps = { onClose: () => void };

export default function AddRecipeModal({ onClose }: AddRecipeModalProps): JSX.Element {
    const [category, setCategory] = useState("Обяд");
    const [name, setName] = useState("");
    const [kcal, setKcal] = useState("");
    const [protein, setProtein] = useState("");
    const [carbs, setCarbs] = useState("");
    const [fat, setFat] = useState("");
    const [prepTime, setPrepTime] = useState("");
    const [servings, setServings] = useState("1");
    const [success, setSuccess] = useState(false);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
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
            style={{ position: "fixed", inset: 0, zIndex: 400, display: "flex", alignItems: "center", justifyContent: "center", padding: "var(--sp-4)", background: "rgba(0,0,0,0.72)", backdropFilter: "blur(6px)" }}
            onClick={onClose}
        >
            <div
                style={{ width: "100%", maxWidth: 520, maxHeight: "90vh", overflowY: "auto", background: "var(--c-surface-1,#0E1318)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "var(--r-xl,20px)", padding: "var(--sp-6)", display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}
                onClick={(e) => e.stopPropagation()}
            >
                {success ? (
                    <div style={{ textAlign: "center", padding: "var(--sp-5) 0" }}>
                        <div style={{ fontSize: "2.5rem", marginBottom: "var(--sp-3)" }}>✅</div>
                        <div className="heading-sm" style={{ color: "var(--color-cream)" }}>Рецептата е запазена!</div>
                        <div className="body-sm text-gray" style={{ marginTop: 8 }}>Добавена към твоята библиотека.</div>
                    </div>
                ) : (
                    <>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div>
                                <div className="label text-gray">Библиотека с рецепти</div>
                                <div className="heading-sm" style={{ color: "var(--color-cream)", marginTop: 4 }}>Нова рецепта</div>
                            </div>
                            <button type="button" onClick={onClose} style={{ background: "rgba(255,255,255,0.06)", border: "none", borderRadius: "50%", width: 32, height: 32, cursor: "pointer", color: "var(--color-cream)", fontSize: "1.1rem", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
                        </div>

                        {/* Category */}
                        <div style={{ display: "flex", gap: "var(--sp-2)", flexWrap: "wrap" }}>
                            {CATEGORIES.map((cat) => (
                                <button key={cat} type="button" onClick={() => setCategory(cat)} style={{
                                    padding: "6px 14px", borderRadius: "var(--r-full)", fontSize: "0.78rem", fontWeight: 700, cursor: "pointer", border: "1px solid", transition: "all 0.15s",
                                    background: category === cat ? "rgba(0,102,255,0.15)" : "transparent",
                                    borderColor: category === cat ? "var(--c-electric,#0066FF)" : "rgba(255,255,255,0.1)",
                                    color: category === cat ? "var(--c-electric,#0066FF)" : "rgba(255,255,255,0.45)",
                                }}>{cat}</button>
                            ))}
                        </div>

                        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "var(--sp-3)" }}>
                            <div>
                                <label style={labelStyle}>Наименование на рецептата</label>
                                <input style={inputStyle} placeholder="напр. Пилешки гърди с ориз" value={name} onChange={(e) => setName(e.target.value)} required />
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--sp-3)" }}>
                                <div>
                                    <label style={labelStyle}>Калории (kcal)</label>
                                    <input style={inputStyle} type="number" min="0" placeholder="0" value={kcal} onChange={(e) => setKcal(e.target.value)} required />
                                </div>
                                <div>
                                    <label style={labelStyle}>Порции</label>
                                    <input style={inputStyle} type="number" min="1" max="20" value={servings} onChange={(e) => setServings(e.target.value)} />
                                </div>
                            </div>

                            <div>
                                <div className="label text-gray" style={{ marginBottom: 8 }}>Макронутриенти на порция</div>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "var(--sp-2)" }}>
                                    {[
                                        { label: "Протеин (г)", value: protein, onChange: setProtein },
                                        { label: "Въгл. (г)",   value: carbs,   onChange: setCarbs },
                                        { label: "Мазнини (г)", value: fat,     onChange: setFat },
                                    ].map((f) => (
                                        <div key={f.label}>
                                            <label style={labelStyle}>{f.label}</label>
                                            <input style={inputStyle} type="number" min="0" placeholder="0" value={f.value} onChange={(e) => f.onChange(e.target.value)} />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label style={labelStyle}>Време за приготвяне (мин.)</label>
                                <input style={inputStyle} type="number" min="1" max="300" placeholder="15" value={prepTime} onChange={(e) => setPrepTime(e.target.value)} />
                            </div>

                            <button type="submit" className="btn-primary" style={{ marginTop: "var(--sp-2)" }}>Запази рецептата</button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}
