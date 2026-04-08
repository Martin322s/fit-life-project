import type { JSX } from "react";

type StepIndicatorProps = {
    currentStep: 1 | 2 | 3;
};

const STEPS = [
    { num: 1, label: "Акаунт" },
    { num: 2, label: "Тяло" },
    { num: 3, label: "Цел" },
] as const;

function StepIndicator({ currentStep }: StepIndicatorProps): JSX.Element {
    return (
        <div
            style={{ display: "flex", alignItems: "center", marginBottom: "var(--sp-8)" }}
            role="list"
            aria-label="Стъпки на регистрация"
        >
            {STEPS.map((step, index) => {
                const isDone = step.num < currentStep;
                const isActive = step.num === currentStep;

                return (
                    <div
                        key={step.num}
                        style={{ display: "contents" }}
                        role="listitem"
                    >
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: "var(--sp-2)",
                            }}
                        >
                            <div
                                style={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: "50%",
                                    border: `2px solid ${isDone ? "var(--c-acid)" : isActive ? "var(--c-electric)" : "var(--c-border-strong)"}`,
                                    background: isDone
                                        ? "rgba(200,255,0,0.1)"
                                        : isActive
                                          ? "rgba(0,102,255,0.1)"
                                          : "var(--c-surface-1)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontFamily: "var(--font-display)",
                                    fontSize: "0.85rem",
                                    fontWeight: 800,
                                    color: isDone
                                        ? "var(--c-acid)"
                                        : isActive
                                          ? "var(--c-electric)"
                                          : "var(--c-text-muted)",
                                    boxShadow: isActive
                                        ? "0 0 0 4px rgba(0,102,255,0.1)"
                                        : undefined,
                                }}
                                aria-current={isActive ? "step" : undefined}
                            >
                                {isDone ? "✓" : step.num}
                            </div>
                            <span
                                className={`label ${isActive ? "text-electric" : isDone ? "" : "text-gray"}`}
                                style={isDone ? { color: "var(--c-acid)" } : undefined}
                            >
                                {step.label}
                            </span>
                        </div>

                        {index < STEPS.length - 1 && (
                            <div
                                style={{
                                    flex: 1,
                                    height: 2,
                                    background:
                                        step.num < currentStep
                                            ? "var(--c-acid)"
                                            : "var(--c-border)",
                                    marginBottom: 22,
                                }}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
}

export default StepIndicator;
