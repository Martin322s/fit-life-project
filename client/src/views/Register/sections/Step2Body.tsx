import type { JSX } from "react";

type Step2Data = {
    gender: "male" | "female" | "";
    age: string;
    heightUnit: "cm" | "ft";
    height: string;
    weightUnit: "kg" | "lb";
    weight: string;
};

type Step2Props = {
    data: Step2Data;
    onChange: (field: keyof Step2Data, value: string) => void;
    onNext: () => void;
    onBack: () => void;
    error: string | null;
};

function UnitToggle({
    options,
    active,
    onSelect,
}: {
    options: [string, string];
    active: string;
    onSelect: (val: string) => void;
}): JSX.Element {
    return (
        <div
            style={{
                display: "flex",
                background: "var(--c-surface-2)",
                border: "1px solid var(--c-border)",
                borderRadius: "var(--r-sm)",
                padding: 3,
                gap: 3,
            }}
        >
            {options.map((opt) => (
                <button
                    key={opt}
                    type="button"
                    onClick={() => onSelect(opt)}
                    style={{
                        padding: "5px 14px",
                        borderRadius: "var(--r-xs)",
                        fontSize: "0.7rem",
                        border: "none",
                        cursor: "pointer",
                        background: active === opt ? "var(--c-electric)" : "transparent",
                        color: active === opt ? "#fff" : "var(--c-text-secondary)",
                        fontWeight: active === opt ? 700 : 400,
                    }}
                >
                    {opt}
                </button>
            ))}
        </div>
    );
}

function Step2Body({ data, onChange, onNext, onBack, error }: Step2Props): JSX.Element {
    return (
        <div>
            <div className="auth-form-header">
                <h2 className="auth-form-title">За теб</h2>
                <p className="auth-form-subtitle">Данните се използват за персонализирания ти план.</p>
            </div>

            <div className="auth-form">
                {/* Gender */}
                <div className="form-group">
                    <label className="form-label">Пол</label>
                    <div className="form-row">
                        {(
                            [
                                { value: "male", symbol: "♂", label: "Мъж" },
                                { value: "female", symbol: "♀", label: "Жена" },
                            ] as const
                        ).map((g) => {
                            const isSelected = data.gender === g.value;
                            return (
                                <button
                                    key={g.value}
                                    type="button"
                                    className="card card-sm"
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        gap: "var(--sp-2)",
                                        cursor: "pointer",
                                        borderColor: isSelected ? "var(--c-electric)" : undefined,
                                        background: isSelected ? "rgba(0,102,255,0.08)" : undefined,
                                        color: isSelected ? "var(--c-electric)" : "var(--c-text-secondary)",
                                    }}
                                    onClick={() => onChange("gender", g.value)}
                                >
                                    <span style={{ fontSize: "1.8rem", lineHeight: 1 }}>{g.symbol}</span>
                                    <span className={`label ${isSelected ? "text-electric" : ""}`}>{g.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Age */}
                <div className="form-group">
                    <label className="form-label" htmlFor="age">Възраст</label>
                    <div className="input-wrapper">
                        <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                        </svg>
                        <input
                            type="number"
                            id="age"
                            className="form-input has-icon"
                            placeholder="25"
                            min="12"
                            max="100"
                            value={data.age}
                            onChange={(e) => onChange("age", e.target.value)}
                        />
                    </div>
                </div>

                {/* Height */}
                <div className="form-group">
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--sp-1)" }}>
                        <label className="form-label" htmlFor="height">Ръст</label>
                        <UnitToggle
                            options={["см", "фт"]}
                            active={data.heightUnit === "cm" ? "см" : "фт"}
                            onSelect={(v) => onChange("heightUnit", v === "см" ? "cm" : "ft")}
                        />
                    </div>
                    <input
                        type="number"
                        id="height"
                        className="form-input"
                        placeholder={data.heightUnit === "cm" ? "175" : "5.9"}
                        value={data.height}
                        onChange={(e) => onChange("height", e.target.value)}
                    />
                </div>

                {/* Weight */}
                <div className="form-group">
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--sp-1)" }}>
                        <label className="form-label" htmlFor="weight">Тегло</label>
                        <UnitToggle
                            options={["кг", "лб"]}
                            active={data.weightUnit === "kg" ? "кг" : "лб"}
                            onSelect={(v) => onChange("weightUnit", v === "кг" ? "kg" : "lb")}
                        />
                    </div>
                    <input
                        type="number"
                        id="weight"
                        className="form-input"
                        placeholder={data.weightUnit === "kg" ? "75" : "165"}
                        value={data.weight}
                        onChange={(e) => onChange("weight", e.target.value)}
                    />
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
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                            <path d="M19 12H5M12 5l-7 7 7 7" />
                        </svg>
                    </button>
                    <button type="button" className="btn-primary btn-full btn-lg" onClick={onNext}>
                        Напред
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Step2Body;
