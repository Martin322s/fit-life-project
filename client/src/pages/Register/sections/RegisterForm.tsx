import { useState } from "react";
import type { JSX } from "react";
import { Link } from "react-router-dom";
import StepIndicator from "./StepIndicator";
import Step1Account from "./Step1Account";
import Step2Body from "./Step2Body";
import Step3Goal from "./Step3Goal";
import StepSuccess from "./StepSuccess";

type Step = 1 | 2 | 3 | "success";

type FormData = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    terms: boolean;
    gender: "male" | "female" | "";
    age: string;
    heightUnit: "cm" | "ft";
    height: string;
    weightUnit: "kg" | "lb";
    weight: string;
    goal: "lose" | "maintain" | "gain" | "";
    activity: "sedentary" | "light" | "moderate" | "very" | "";
};

type SuccessResults = {
    firstName: string;
    bmi: number;
    bmr: number;
    tdee: number;
    goalCalories: number;
};

const ACTIVITY_FACTORS = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    very: 1.725,
};

const INITIAL_FORM: FormData = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    terms: false,
    gender: "",
    age: "",
    heightUnit: "cm",
    height: "",
    weightUnit: "kg",
    weight: "",
    goal: "",
    activity: "",
};

function calculateResults(data: FormData): SuccessResults {
    const weightKg =
        data.weightUnit === "lb"
            ? parseFloat(data.weight) * 0.453592
            : parseFloat(data.weight);
    const heightCm =
        data.heightUnit === "ft"
            ? parseFloat(data.height) * 30.48
            : parseFloat(data.height);
    const age = parseFloat(data.age);

    const bmi = weightKg / Math.pow(heightCm / 100, 2);
    const bmr =
        data.gender === "female"
            ? 10 * weightKg + 6.25 * heightCm - 5 * age - 161
            : 10 * weightKg + 6.25 * heightCm - 5 * age + 5;

    const factor = ACTIVITY_FACTORS[data.activity as keyof typeof ACTIVITY_FACTORS] ?? 1.2;
    const tdee = bmr * factor;

    const goalCalories =
        data.goal === "lose" ? tdee - 500 : data.goal === "gain" ? tdee + 300 : tdee;

    return {
        firstName: data.firstName,
        bmi: Math.round(bmi * 10) / 10,
        bmr: Math.round(bmr),
        tdee: Math.round(tdee),
        goalCalories: Math.round(goalCalories),
    };
}

type RegisterFormProps = {
    theme: "dark" | "light";
    onToggleTheme: () => void;
};

function RegisterForm({ theme, onToggleTheme }: RegisterFormProps): JSX.Element {
    const [step, setStep] = useState<Step>(1);
    const [formData, setFormData] = useState<FormData>(INITIAL_FORM);
    const [stepError, setStepError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState<SuccessResults | null>(null);

    const handleChange = (field: keyof FormData, value: string | boolean) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        setStepError(null);
    };

    const handleNext1 = () => {
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
            setStepError("Моля попълни всички задължителни полета.");
            return;
        }
        if (formData.password.length < 8) {
            setStepError("Паролата трябва да е поне 8 символа.");
            return;
        }
        if (!formData.terms) {
            setStepError("Трябва да се съгласиш с Условията за ползване.");
            return;
        }
        setStepError(null);
        setStep(2);
    };

    const handleNext2 = () => {
        if (!formData.gender || !formData.age || !formData.height || !formData.weight) {
            setStepError("Моля попълни всички физически данни.");
            return;
        }
        setStepError(null);
        setStep(3);
    };

    const handleSubmit = async () => {
        if (!formData.goal || !formData.activity) {
            setStepError("Моля избери цел и ниво на активност.");
            return;
        }
        setStepError(null);
        setIsLoading(true);
        try {
            // TODO: POST /api/auth/register → store token → navigate('/dashboard')
            await new Promise((resolve) => setTimeout(resolve, 1500));
            window.localStorage.setItem(
                "fitlife-profile",
                JSON.stringify({
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    age: formData.age,
                    height: formData.height,
                    heightUnit: formData.heightUnit,
                    weight: formData.weight,
                    weightUnit: formData.weightUnit,
                    gender: formData.gender,
                    goal: formData.goal,
                    activity: formData.activity,
                }),
            );
            window.localStorage.setItem(
                "fitlife-profile-page",
                JSON.stringify({
                    name: `${formData.firstName} ${formData.lastName}`.trim(),
                    email: formData.email,
                    phone: "+359 88 123 4567",
                    city: "София",
                    age: Number(formData.age) || 29,
                    height: Number(formData.height) || 178,
                    weight: Number(formData.weight) || 82.4,
                    goalWeight: formData.goal === "lose" ? Math.max(Number(formData.weight) - 5, 45) : formData.goal === "gain" ? Number(formData.weight) + 3 : Number(formData.weight),
                    bodyFat: 18,
                    plan: "FitLife Free",
                    joined: new Date().toLocaleDateString("bg-BG", { month: "long", year: "numeric" }),
                    goal: formData.goal === "lose" ? "Релеф" : formData.goal === "gain" ? "Покачване" : "Поддръжка",
                    activity: formData.activity === "sedentary" ? "Заседнал" : formData.activity === "light" ? "Леко активен" : formData.activity === "moderate" ? "Умерено активен" : "Много активен",
                    training: "Нов профил · без шаблон",
                    calories: calculateResults(formData).goalCalories,
                    protein: Math.round((Number(formData.weight) || 82) * 2),
                    water: 2.8,
                    streak: 1,
                    checkins: 1,
                    badges: 1,
                    privacy: "Само за мен",
                }),
            );
            window.localStorage.setItem(
                "fitlife-auth",
                JSON.stringify({
                    email: formData.email,
                    rememberMe: true,
                    loggedInAt: new Date().toISOString(),
                }),
            );
            setResults(calculateResults(formData));
            setStep("success");
        } catch {
            setStepError("Нещо се обърка. Опитай отново.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="auth-panel-form">
            {/* Theme toggle */}
            <div style={{ position: "absolute", top: "var(--sp-5)", right: "var(--sp-5)" }}>
                <button
                    type="button"
                    className="theme-toggle"
                    aria-label="Смени тема"
                    aria-pressed={theme === "light"}
                    onClick={onToggleTheme}
                >
                    <span className="theme-toggle-icon-dark">🌙</span>
                    <span className="theme-toggle-icon-light">☀️</span>
                </button>
            </div>

            <div className="auth-form-wrapper">
                {/* Back link */}
                <Link
                    to="/"
                    className="navbar-link"
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        marginBottom: "var(--sp-8)",
                        fontSize: "0.72rem",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                    }}
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                        <path d="M19 12H5M12 5l-7 7 7 7" />
                    </svg>
                    Назад
                </Link>

                {/* Step indicator (only during steps 1-3) */}
                {step !== "success" && <StepIndicator currentStep={step as 1 | 2 | 3} />}

                {/* Step content */}
                {step === 1 && (
                    <Step1Account
                        data={{
                            firstName: formData.firstName,
                            lastName: formData.lastName,
                            email: formData.email,
                            password: formData.password,
                            terms: formData.terms,
                        }}
                        onChange={handleChange}
                        onNext={handleNext1}
                        error={stepError}
                    />
                )}

                {step === 2 && (
                    <Step2Body
                        data={{
                            gender: formData.gender,
                            age: formData.age,
                            heightUnit: formData.heightUnit,
                            height: formData.height,
                            weightUnit: formData.weightUnit,
                            weight: formData.weight,
                        }}
                        onChange={handleChange}
                        onNext={handleNext2}
                        onBack={() => setStep(1)}
                        error={stepError}
                    />
                )}

                {step === 3 && (
                    <Step3Goal
                        data={{ goal: formData.goal, activity: formData.activity }}
                        onChange={handleChange}
                        onSubmit={handleSubmit}
                        onBack={() => setStep(2)}
                        isLoading={isLoading}
                        error={stepError}
                    />
                )}

                {step === "success" && results && <StepSuccess results={results} />}

                {/* Login prompt */}
                <p
                    className="auth-form-subtitle"
                    style={{
                        textAlign: "center",
                        marginTop: "var(--sp-7)",
                        paddingTop: "var(--sp-5)",
                        borderTop: "1px solid var(--c-border)",
                    }}
                >
                    Вече имаш акаунт? <Link to="/login">Влез тук</Link>
                </p>
            </div>
        </main>
    );
}

export default RegisterForm;
