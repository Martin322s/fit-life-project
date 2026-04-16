import { useState } from "react";
import type { JSX } from "react";

const WORKOUT_TYPES = [
    { key: "push",  label: "Пуш",       color: "#FF6B35" },
    { key: "pull",  label: "Пул",       color: "var(--c-electric,#0066FF)" },
    { key: "legs",  label: "Крака",     color: "var(--c-acid,#C8FF00)" },
    { key: "upper", label: "Горна",     color: "#A855F7" },
    { key: "lower", label: "Долна",     color: "#00CEC9" },
    { key: "full",  label: "Цяло тяло", color: "#00E676" },
    { key: "cardio",label: "Кардио",    color: "#FF5D73" },
];

export default function LogWorkoutModal({ onClose }: { onClose: () => void }): JSX.Element {
    const [type, setType] = useState("push");
    const [name, setName] = useState("");
    const [duration, setDuration] = useState("60");
    const [volume, setVolume] = useState("");
    const [note, setNote] = useState("");
    const [saved, setSaved] = useState(false);

    const chosen = WORKOUT_TYPES.find((t) => t.key === type)!;

    function handleSave() {
        setSaved(true);
        setTimeout(onClose, 1800);
    }

    return (
        <div
            style={{ position: "fixed", inset: 0, zIndex: 500, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "var(--sp-4)" }}
            onClick={onClose}
        >
            <div
                style={{ width: "100%", maxWidth: 480, maxHeight: "90vh", overflowY: "auto", background: "var(--c-surface-1,#0E1318)", borderRadius: "var(--r-xl,16px)", border: "1px solid var(--c-border,rgba(255,255,255,0.08))", padding: "var(--sp-6)", display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}
                onClick={(e) => e.stopPropagation()}
            >
                {saved ? (
                    <div style={{ textAlign: "center", padding: "var(--sp-6) 0" }}>
                        <div style={{ fontSize: "2.5rem", marginBottom: 16 }}>💪</div>
                        <div className="heading-sm" style={{ color: "var(--color-cream)" }}>Тренировката е записана!</div>
                        <div className="body-sm text-gray" style={{ marginTop: 8 }}>Продължавай така — серията продължава.</div>
                    </div>
                ) : (
                    <>
                        {/* Header */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div>
                                <div className="heading-sm" style={{ color: "var(--color-cream)" }}>Запиши тренировка</div>
                                <div className="body-sm text-gray" style={{ marginTop: 4 }}>Добави сесия към дневника</div>
                            </div>
                            <button type="button" onClick={onClose} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "6px 10px", cursor: "pointer", color: "rgba(255,255,255,0.5)", fontSize: "1rem" }}>✕</button>
                        </div>

                        {/* Workout type */}
                        <div>
                            <div className="label text-gray" style={{ marginBottom: 8 }}>Тип тренировка</div>
                            <div style={{ display: "flex", gap: "var(--sp-2)", flexWrap: "wrap" }}>
                                {WORKOUT_TYPES.map((t) => (
                                    <button key={t.key} type="button" onClick={() => setType(t.key)} style={{
                                        padding: "6px 12px", borderRadius: "var(--r-md)", fontSize: "0.78rem", fontWeight: 700,
                                        cursor: "pointer", border: "1px solid", transition: "all 0.15s",
                                        background: type === t.key ? `${t.color}18` : "transparent",
                                        borderColor: type === t.key ? t.color : "rgba(255,255,255,0.08)",
                                        color: type === t.key ? t.color : "rgba(255,255,255,0.4)",
                                    }}>{t.label}</button>
                                ))}
                            </div>
                        </div>

                        {/* Name */}
                        <div>
                            <label className="label text-gray" style={{ display: "block", marginBottom: 8 }}>Название (по избор)</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder={`${chosen.label} ден А`}
                                style={{ width: "100%", padding: "10px 14px", borderRadius: "var(--r-md)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "var(--color-cream)", fontSize: "0.88rem", boxSizing: "border-box", outline: "none" }}
                            />
                        </div>

                        {/* Duration + Volume */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--sp-3)" }}>
                            <div>
                                <label className="label text-gray" style={{ display: "block", marginBottom: 8 }}>Продължителност (мин.)</label>
                                <input
                                    type="number"
                                    value={duration}
                                    onChange={(e) => setDuration(e.target.value)}
                                    min="1" max="300"
                                    style={{ width: "100%", padding: "10px 14px", borderRadius: "var(--r-md)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "var(--color-cream)", fontSize: "0.88rem", boxSizing: "border-box", outline: "none" }}
                                />
                            </div>
                            <div>
                                <label className="label text-gray" style={{ display: "block", marginBottom: 8 }}>Обем (кг)</label>
                                <input
                                    type="number"
                                    value={volume}
                                    onChange={(e) => setVolume(e.target.value)}
                                    placeholder="3500"
                                    min="0"
                                    style={{ width: "100%", padding: "10px 14px", borderRadius: "var(--r-md)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "var(--color-cream)", fontSize: "0.88rem", boxSizing: "border-box", outline: "none" }}
                                />
                            </div>
                        </div>

                        {/* Note */}
                        <div>
                            <label className="label text-gray" style={{ display: "block", marginBottom: 8 }}>Бележка</label>
                            <textarea
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                rows={3}
                                placeholder="Как се чувстваш? Лични рекорди?"
                                style={{ width: "100%", padding: "10px 14px", borderRadius: "var(--r-md)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "var(--color-cream)", fontSize: "0.88rem", boxSizing: "border-box", outline: "none", resize: "vertical", fontFamily: "inherit" }}
                            />
                        </div>

                        {/* Actions */}
                        <div style={{ display: "flex", gap: "var(--sp-3)" }}>
                            <button type="button" onClick={onClose} className="btn-ghost btn-sm" style={{ flex: 1 }}>Откажи</button>
                            <button
                                type="button"
                                onClick={handleSave}
                                style={{
                                    flex: 2, padding: "10px 0", borderRadius: "var(--r-md)", fontSize: "0.88rem", fontWeight: 700,
                                    cursor: "pointer", background: chosen.color, color: "#000", border: "none", transition: "opacity 0.2s",
                                }}
                            >
                                Запиши тренировката
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
