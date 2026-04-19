import { useState } from "react";
import type { JSX } from "react";
import { Link } from "react-router-dom";

type ForgotPasswordFormProps = {
    theme: "dark" | "light";
    onToggleTheme: () => void;
};

function ForgotPasswordForm({ theme, onToggleTheme }: ForgotPasswordFormProps): JSX.Element {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 1500));
            window.localStorage.setItem(
                "fitlife-password-reset-request",
                JSON.stringify({
                    email,
                    requestedAt: new Date().toISOString(),
                }),
            );
            setSubmitted(true);
        } catch {
            setError("Нещо се обърка. Моля, опитай отново.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="login-form-panel">
            {/* Theme toggle */}
            <div className="login-theme-toggle-wrap">
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

            <div className="login-form-inner">
                {/* Back link */}
                <Link to="/login" className="login-back">
                    <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2.5}
                    >
                        <path d="M19 12H5M12 5l-7 7 7 7" />
                    </svg>
                    Назад към вход
                </Link>

                {submitted ? (
                    /* Success state */
                    <div style={{ textAlign: "center", paddingTop: "var(--sp-4)" }}>
                        <div
                            style={{
                                width: 72,
                                height: 72,
                                borderRadius: "50%",
                                background: "rgba(200,255,0,0.1)",
                                border: "2px solid var(--c-acid)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "1.8rem",
                                margin: "0 auto var(--sp-5)",
                                boxShadow: "var(--glow-acid)",
                            }}
                        >
                            📧
                        </div>
                        <h1 className="login-form-title" style={{ fontSize: "1.8rem" }}>
                            Провери
                            <br />
                            имейла си
                        </h1>
                        <p className="login-form-subtitle" style={{ marginTop: "var(--sp-3)", marginBottom: "var(--sp-6)" }}>
                            Изпратихме линк за нулиране на паролата на{" "}
                            <strong style={{ color: "var(--c-cream, var(--color-cream))" }}>{email}</strong>.
                            Линкът е валиден 30 минути.
                        </p>
                        <p className="login-form-subtitle" style={{ marginBottom: "var(--sp-6)" }}>
                            Не виждаш имейла? Провери папката Спам.
                        </p>
                        <Link to="/login" className="btn-primary btn-full" style={{ textDecoration: "none" }}>
                            Назад към вход
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Title */}
                        <h1 className="login-form-title">
                            Забравена
                            <br />
                            парола
                        </h1>
                        <p className="login-form-subtitle">
                            Въведи имейла си и ще ти изпратим линк за нулиране.
                        </p>

                        {/* Error */}
                        {error && (
                            <div className="login-error">
                                <svg
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    style={{ flexShrink: 0, marginTop: 1 }}
                                >
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="12" y1="8" x2="12" y2="12" />
                                    <line x1="12" y1="16" x2="12.01" y2="16" />
                                </svg>
                                <span>{error}</span>
                            </div>
                        )}

                        {/* Form */}
                        <form className="login-fields" noValidate onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label" htmlFor="email">
                                    Имейл адрес
                                </label>
                                <div className="input-wrapper">
                                    <svg
                                        className="input-icon"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                    >
                                        <rect x="2" y="4" width="20" height="16" rx="2" />
                                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                                    </svg>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        className="form-input has-icon"
                                        placeholder="ivan@example.com"
                                        autoComplete="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <button type="submit" className="login-submit" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <svg
                                            width="18"
                                            height="18"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth={2.5}
                                            style={{ animation: "spin 1s linear infinite" }}
                                        >
                                            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                                        </svg>
                                        Изпращане...
                                    </>
                                ) : (
                                    <>
                                        <svg
                                            width="18"
                                            height="18"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth={2.5}
                                        >
                                            <path d="M22 2 11 13M22 2 15 22l-4-9-9-4 20-7z" />
                                        </svg>
                                        Изпрати линк
                                    </>
                                )}
                            </button>
                        </form>

                        <p className="login-register-prompt">
                            Спомни си паролата?{" "}
                            <Link to="/login">Влез в акаунта</Link>
                        </p>
                    </>
                )}
            </div>
        </main>
    );
}

export default ForgotPasswordForm;
