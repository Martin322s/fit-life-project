import type { JSX } from "react";

type Goal = "lose" | "maintain" | "gain" | "";
type Activity = "sedentary" | "light" | "moderate" | "very" | "";

type Step3Data = {
    goal: Goal;
    activity: Activity;
};

type Step3Props = {
    data: Step3Data;
    onChange: (field: keyof Step3Data, value: string) => void;
    onSubmit: () => void;
    onBack: () => void;
    isLoading: boolean;
    error: string | null;
};

const GOALS = [
    { value: "lose" as Goal, icon: "📉", label: "Отслабване", desc: "Искам да намаля теглото си здравословно" },
    { value: "maintain" as Goal, icon: "⚖️", label: "Поддържане", desc: "Доволен съм от теглото, искам да го задържа" },
    { value: "gain" as Goal, icon: "💪", label: "Качване на маса", desc: "Искам да изградя мускули и да напълнея" },
];

const ACTIVITIES = [
    { value: "sedentary" as Activity, icon: "🪑", label: "Заседнал", desc: "Офис работа, малко движение" },
    { value: "light" as Activity, icon: "🚶", label: "Леко активен", desc: "1–3 дни физическа активност/седмица" },
    { value: "moderate" as Activity, icon: "🏃", label: "Умерено активен", desc: "3–5 дни физическа активност/седмица" },
    { value: "very" as Activity, icon: "🏋️", label: "Много активен", desc: "Интензивни тренировки 6–7 дни/седмица" },
];

function Step3Goal({ data, onChange, onSubmit, onBack, isLoading, error }: Step3Props): JSX.Element {
    return (
        <div>
            <div className="auth-form-header">
                <h2 className="auth-form-title">Твоята цел</h2>
                <p className="auth-form-subtitle">Какво искаш да постигнеш с FitLife?</p>
            </div>

            <div className="auth-form">
                {/* Goal selection */}
                <div className="form-group">
                    <label className="form-label">Избери цел</label>
                    {GOALS.map((g) => {
                        const isSelected = data.goal === g.value;
                        return (
                            <div
                                key={g.value}
                                className="card card-sm"
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "var(--sp-4)",
                                    cursor: "pointer",
                                    marginBottom: "var(--sp-3)",
                                    borderColor: isSelected ? "var(--c-electric)" : undefined,
                                    background: isSelected ? "rgba(0,102,255,0.06)" : undefined,
                                }}
                                onClick={() => onChange("goal", g.value)}
                            >
                                <div className="feature-icon" style={{ margin: 0, flexShrink: 0 }}>{g.icon}</div>
                                <div style={{ flex: 1 }}>
                                    <div className="heading-sm" style={{ fontSize: "0.9rem", marginBottom: 2 }}>{g.label}</div>
                                    <div className="body-sm text-gray">{g.desc}</div>
                                </div>
                                <div
                                    style={{
                                        width: 20,
                                        height: 20,
                                        borderRadius: "50%",
                                        border: `2px solid ${isSelected ? "var(--c-electric)" : "var(--c-border-strong)"}`,
                                        flexShrink: 0,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    {isSelected && (
                                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--c-electric)" }} />
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Activity level */}
                <div className="form-group">
                    <label className="form-label">Ниво на активност</label>
                    <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-2)" }}>
                        {ACTIVITIES.map((a) => {
                            const isSelected = data.activity === a.value;
                            return (
                                <div
                                    key={a.value}
                                    className="card card-sm"
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "var(--sp-3)",
                                        cursor: "pointer",
                                        borderColor: isSelected ? "rgba(200,255,0,0.35)" : undefined,
                                        background: isSelected ? "rgba(200,255,0,0.04)" : undefined,
                                    }}
                                    onClick={() => onChange("activity", a.value)}
                                >
                                    <span style={{ fontSize: "1.2rem", width: 28, textAlign: "center", flexShrink: 0 }}>
                                        {a.icon}
                                    </span>
                                    <div>
                                        <div className={`label ${isSelected ? "text-mustard" : "text-gray"}`}>{a.label}</div>
                                        <div className="body-sm text-gray">{a.desc}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <div className="alert alert-error">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ flexShrink: 0 }}>
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                        {error}
                    </div>
                )}

                {/* Navigation */}
                <div style={{ display: "flex", gap: "var(--sp-3)" }}>
                    <button
                        type="button"
                        className="btn-secondary"
                        style={{ width: 52, flexShrink: 0, padding: 0, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "var(--r-md)" }}
                        aria-label="Назад"
                        onClick={onBack}
                        disabled={isLoading}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                            <path d="M19 12H5M12 5l-7 7 7 7" />
                        </svg>
                    </button>
                    <button type="button" className="btn-primary btn-full btn-lg" onClick={onSubmit} disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} style={{ animation: "spin 1s linear infinite" }}>
                                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                                </svg>
                                Създаване...
                            </>
                        ) : (
                            <>
                                Създай акаунт
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Step3Goal;
