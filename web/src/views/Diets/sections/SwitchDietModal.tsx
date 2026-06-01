import { useState } from "react";
import type { JSX } from "react";
import { DIETS_DATA } from "./dietsData";

const DIFF_COLOR: Record<string, string> = {
    "Лесно": "#00E676",
    "Средно": "#FFB300",
    "Трудно": "var(--c-error,#FF3D57)",
};

export default function SwitchDietModal({ onClose }: { onClose: () => void }): JSX.Element {
    const [selected, setSelected] = useState<string | null>(null);
    const [confirmed, setConfirmed] = useState(false);

    const chosen = DIETS_DATA.availableDiets.find((d) => d.id === selected);

    function handleConfirm() {
        if (!selected || selected === DIETS_DATA.activeDiet.id) return;
        window.localStorage.setItem(
            "fitlife-active-diet",
            JSON.stringify({
                dietId: selected,
                switchedAt: new Date().toISOString(),
            }),
        );
        setConfirmed(true);
        setTimeout(onClose, 1800);
    }

    return (
        <div
            style={{ position: "fixed", inset: 0, zIndex: 500, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "var(--sp-4)" }}
            onClick={onClose}
        >
            <div
                style={{ width: "100%", maxWidth: 560, maxHeight: "90vh", overflowY: "auto", background: "var(--c-surface-1,#0E1318)", borderRadius: "var(--r-xl,16px)", border: "1px solid var(--c-border,rgba(255,255,255,0.08))", padding: "var(--sp-6)", display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}
                onClick={(e) => e.stopPropagation()}
            >
                {confirmed ? (
                    <div style={{ textAlign: "center", padding: "var(--sp-6) 0" }}>
                        <div style={{ fontSize: "2.5rem", marginBottom: 16 }}>✅</div>
                        <div className="heading-sm" style={{ color: "var(--color-cream)" }}>Диетата е сменена!</div>
                        <div className="body-sm text-gray" style={{ marginTop: 8 }}>
                            Преминаваш към{" "}
                            <span style={{ color: "var(--c-electric,#0066FF)", fontWeight: 700 }}>{chosen?.name}</span>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Header */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div>
                                <div className="heading-sm" style={{ color: "var(--color-cream)" }}>Смени диетен план</div>
                                <div className="body-sm text-gray" style={{ marginTop: 4 }}>Избери нов план за хранене</div>
                            </div>
                            <button type="button" onClick={onClose} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "6px 10px", cursor: "pointer", color: "rgba(255,255,255,0.5)", fontSize: "1rem" }}>✕</button>
                        </div>

                        {/* Diet options */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-2)" }}>
                            {DIETS_DATA.availableDiets.map((diet) => {
                                const isActive = diet.id === DIETS_DATA.activeDiet.id;
                                const isSelected = diet.id === selected;
                                return (
                                    <button
                                        key={diet.id}
                                        type="button"
                                        disabled={isActive}
                                        onClick={() => setSelected(diet.id)}
                                        style={{
                                            display: "flex", alignItems: "center", gap: "var(--sp-3)",
                                            padding: "var(--sp-3) var(--sp-4)",
                                            borderRadius: "var(--r-lg)", textAlign: "left", cursor: isActive ? "default" : "pointer",
                                            background: isSelected ? "rgba(0,102,255,0.07)" : "rgba(255,255,255,0.025)",
                                            border: `1px solid ${isSelected ? "var(--c-electric,#0066FF)" : isActive ? "rgba(255,255,255,0.04)" : "var(--c-border,rgba(255,255,255,0.06))"}`,
                                            opacity: isActive ? 0.5 : 1,
                                            transition: "all 0.15s",
                                            width: "100%",
                                        }}
                                    >
                                        {/* Color band left */}
                                        <div style={{ width: 4, alignSelf: "stretch", borderRadius: 4, background: diet.gradient, flexShrink: 0 }} />

                                        <span style={{ fontSize: "1.3rem", flexShrink: 0 }}>{diet.icon}</span>

                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: "var(--sp-2)" }}>
                                                <div className="body-sm" style={{ color: "var(--color-cream)", fontWeight: 700 }}>{diet.name}</div>
                                                {isActive && <span className="dt-pill" style={{ background: "rgba(0,102,255,0.1)", color: "var(--c-electric,#0066FF)", fontSize: "0.6rem" }}>Активна</span>}
                                            </div>
                                            <div className="label" style={{ color: DIFF_COLOR[diet.difficulty], marginTop: 2 }}>{diet.difficulty} · {diet.calorieTarget} kcal</div>
                                            <div className="label text-gray" style={{ marginTop: 4, fontSize: "0.65rem" }}>
                                                В{diet.macroSplit.carbs}% · П{diet.macroSplit.protein}% · М{diet.macroSplit.fat}%
                                            </div>
                                        </div>

                                        {/* Select indicator */}
                                        {!isActive && (
                                            <div style={{
                                                width: 18, height: 18, borderRadius: "50%", flexShrink: 0,
                                                border: `2px solid ${isSelected ? "var(--c-electric,#0066FF)" : "rgba(255,255,255,0.2)"}`,
                                                background: isSelected ? "var(--c-electric,#0066FF)" : "transparent",
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                            }}>
                                                {isSelected && <div style={{ width: 6, height: 6, borderRadius: "50%", background: "white" }} />}
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Warning */}
                        {selected && selected !== DIETS_DATA.activeDiet.id && (
                            <div style={{ padding: "var(--sp-3) var(--sp-4)", borderRadius: "var(--r-lg)", background: "rgba(255,179,0,0.05)", border: "1px solid rgba(255,179,0,0.15)" }}>
                                <div className="body-sm" style={{ color: "#FFB300", fontWeight: 600 }}>⚠ Промяна на диетата</div>
                                <div className="label text-gray" style={{ marginTop: 4 }}>
                                    Прогресът по настоящата диета ще бъде запазен, но ще преминеш към нов план от утре.
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div style={{ display: "flex", gap: "var(--sp-3)" }}>
                            <button type="button" onClick={onClose} className="btn-ghost btn-sm" style={{ flex: 1 }}>Откажи</button>
                            <button
                                type="button"
                                onClick={handleConfirm}
                                disabled={!selected || selected === DIETS_DATA.activeDiet.id}
                                style={{
                                    flex: 2, padding: "10px 0", borderRadius: "var(--r-md)", fontSize: "0.88rem", fontWeight: 700,
                                    cursor: selected && selected !== DIETS_DATA.activeDiet.id ? "pointer" : "not-allowed",
                                    background: selected && selected !== DIETS_DATA.activeDiet.id ? "var(--c-electric,#0066FF)" : "rgba(255,255,255,0.06)",
                                    color: selected && selected !== DIETS_DATA.activeDiet.id ? "white" : "rgba(255,255,255,0.3)",
                                    border: "none", transition: "all 0.2s",
                                }}
                            >
                                Потвърди смяна
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
