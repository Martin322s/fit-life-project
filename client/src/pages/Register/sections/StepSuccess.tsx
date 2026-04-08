import type { JSX } from "react";
import { Link } from "react-router-dom";

type SuccessResults = {
    firstName: string;
    bmi: number;
    bmr: number;
    tdee: number;
    goalCalories: number;
};

type StepSuccessProps = {
    results: SuccessResults;
};

function StepSuccess({ results }: StepSuccessProps): JSX.Element {
    return (
        <div style={{ textAlign: "center" }}>
            <div
                style={{
                    width: 88,
                    height: 88,
                    borderRadius: "50%",
                    background: "rgba(200,255,0,0.1)",
                    border: "3px solid var(--c-acid)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "2.4rem",
                    margin: "0 auto var(--sp-5)",
                    boxShadow: "var(--glow-acid)",
                }}
            >
                ⚡
            </div>

            <h2 className="auth-form-title" style={{ marginBottom: "var(--sp-2)" }}>
                Добре дошъл,
                <br />
                <span className="text-mustard">{results.firstName}!</span>
            </h2>

            <p className="auth-form-subtitle" style={{ marginBottom: "var(--sp-7)" }}>
                Акаунтът ти е създаден. Ето твоите персонализирани показатели:
            </p>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "var(--sp-3)",
                    marginBottom: "var(--sp-7)",
                }}
            >
                {[
                    { value: results.bmi.toFixed(1), label: "BMI" },
                    { value: results.bmr.toLocaleString("bg-BG"), label: "BMR kcal/ден" },
                    { value: results.tdee.toLocaleString("bg-BG"), label: "TDEE kcal/ден" },
                    { value: results.goalCalories.toLocaleString("bg-BG"), label: "Твоята цел kcal", highlight: true },
                ].map((stat) => (
                    <div
                        key={stat.label}
                        className="card card-sm"
                        style={{
                            textAlign: "center",
                            borderColor: stat.highlight ? "rgba(200,255,0,0.3)" : undefined,
                        }}
                    >
                        <div
                            style={{
                                fontFamily: "var(--font-display)",
                                fontSize: "1.8rem",
                                fontWeight: 900,
                                color: stat.highlight ? "var(--c-acid)" : "var(--c-electric)",
                                lineHeight: 1,
                            }}
                        >
                            {stat.value}
                        </div>
                        <div className="body-sm text-gray" style={{ marginTop: 4 }}>
                            {stat.label}
                        </div>
                    </div>
                ))}
            </div>

            <Link to="/dashboard" className="btn-primary btn-full btn-lg" style={{ textDecoration: "none" }}>
                Към таблото ми
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                    <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
            </Link>
        </div>
    );
}

export default StepSuccess;
