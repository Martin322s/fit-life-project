import { useState } from "react";
import type { JSX } from "react";
import { WEIGHT_DATA } from "./weightData";

type LogWeightModalProps = { onClose: () => void };

export default function LogWeightModal({ onClose }: LogWeightModalProps): JSX.Element {
    const today = new Date().toISOString().split("T")[0];
    const [weight, setWeight] = useState(String(WEIGHT_DATA.stats.current));
    const [date, setDate] = useState(today);
    const [note, setNote] = useState("");
    const [success, setSuccess] = useState(false);

    const prev = WEIGHT_DATA.stats.current;
    const entered = parseFloat(weight);
    const diff = isNaN(entered) ? null : +(entered - prev).toFixed(1);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const existing = window.localStorage.getItem("fitlife-weight-log");
        const entries = existing ? (JSON.parse(existing) as Array<Record<string, unknown>>) : [];

        entries.unshift({
            value: Number(weight),
            date,
            note,
            addedAt: new Date().toISOString(),
        });

        window.localStorage.setItem("fitlife-weight-log", JSON.stringify(entries.slice(0, 100)));
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
                style={{ width: "100%", maxWidth: 440, background: "var(--c-surface-1,#0E1318)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "var(--r-xl,20px)", padding: "var(--sp-6)", display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}
                onClick={(e) => e.stopPropagation()}
            >
                {success ? (
                    <div style={{ textAlign: "center", padding: "var(--sp-5) 0" }}>
                        <div style={{ fontSize: "2.5rem", marginBottom: "var(--sp-3)" }}>✅</div>
                        <div className="heading-sm" style={{ color: "var(--color-cream)" }}>Теглото е записано!</div>
                        <div className="body-sm text-gray" style={{ marginTop: 8 }}>
                            {entered} кг · {diff !== null && diff !== 0 && (
                                <span style={{ color: diff < 0 ? "#00E676" : "var(--c-error,#FF3D57)", fontWeight: 700 }}>
                                    {diff > 0 ? "+" : ""}{diff} кг
                                </span>
                            )}
                        </div>
                    </div>
                ) : (
                    <>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div>
                                <div className="label text-gray">Дневник на теглото</div>
                                <div className="heading-sm" style={{ color: "var(--color-cream)", marginTop: 4 }}>Ново измерване</div>
                            </div>
                            <button type="button" onClick={onClose} style={{ background: "rgba(255,255,255,0.06)", border: "none", borderRadius: "50%", width: 32, height: 32, cursor: "pointer", color: "var(--color-cream)", fontSize: "1.1rem", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
                        </div>

                        {/* Previous weight context */}
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "var(--sp-3) var(--sp-4)", borderRadius: "var(--r-lg)", background: "rgba(255,255,255,0.03)", border: "1px solid var(--c-border,rgba(255,255,255,0.06))" }}>
                            <span className="body-sm text-gray">Последно измерване</span>
                            <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--color-cream)" }}>{prev} кг</span>
                        </div>

                        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "var(--sp-3)" }}>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--sp-3)" }}>
                                <div>
                                    <label style={labelStyle}>Тегло (кг)</label>
                                    <input
                                        style={{ ...inputStyle, fontSize: "1.4rem", fontFamily: "var(--font-display)", fontWeight: 800, textAlign: "center" }}
                                        type="number" step="0.1" min="30" max="300"
                                        value={weight}
                                        onChange={(e) => setWeight(e.target.value)}
                                        required
                                    />
                                    {diff !== null && diff !== 0 && (
                                        <div className="label" style={{ textAlign: "center", marginTop: 6, color: diff < 0 ? "#00E676" : "var(--c-error,#FF3D57)", fontWeight: 700 }}>
                                            {diff > 0 ? "+" : ""}{diff} кг от последното
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label style={labelStyle}>Дата</label>
                                    <input style={inputStyle} type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                                </div>
                            </div>
                            <div>
                                <label style={labelStyle}>Бележка (по желание)</label>
                                <input style={inputStyle} placeholder="напр. след тренировка, сутринта…" value={note} onChange={(e) => setNote(e.target.value)} />
                            </div>
                            <button type="submit" className="btn-primary" style={{ marginTop: "var(--sp-1)" }}>Запиши измерването</button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}
