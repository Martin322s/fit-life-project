import { useState } from "react";
import type { JSX } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

type ResetPasswordFormProps = {
    theme: "dark" | "light";
    onToggleTheme: () => void;
};

function ResetPasswordForm({ theme, onToggleTheme }: ResetPasswordFormProps): JSX.Element {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { resetPassword } = useAuth();

    const token = searchParams.get("token") ?? "";

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!token) {
        return (
            <main className="login-form-panel">
                <div className="login-form-inner" style={{ textAlign: "center", paddingTop: "var(--sp-8)" }}>
                    <h1 className="login-form-title" style={{ fontSize: "1.8rem" }}>
                        Невалиден
                        <br />
                        линк
                    </h1>
                    <p className="login-form-subtitle" style={{ margin: "var(--sp-4) 0 var(--sp-6)" }}>
                        Линкът за нулиране е невалиден или липсва токен.
                    </p>
                    <Link to="/forgot-password" className="btn-primary btn-full" style={{ textDecoration: "none" }}>
                        Заяви нов линк
                    </Link>
                </div>
            </main>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password.length < 8) {
            setError("Паролата трябва да е поне 8 символа.");
            return;
        }
        if (password !== confirmPassword) {
            setError("Паролите не съвпадат.");
            return;
        }

        setIsLoading(true);
        try {
            await resetPassword(token, password);
            setSuccess(true);
            setTimeout(() => navigate("/login"), 3000);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Нещо се обърка. Опитай отново.");
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
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                        <path d="M19 12H5M12 5l-7 7 7 7" />
                    </svg>
                    Назад към вход
                </Link>

                {success ? (
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
                            ✓
                        </div>
                        <h1 className="login-form-title" style={{ fontSize: "1.8rem" }}>
                            Паролата е
                            <br />
                            сменена
                        </h1>
                        <p className="login-form-subtitle" style={{ margin: "var(--sp-3) 0 var(--sp-6)" }}>
                            Пренасочваме те към входа...
                        </p>
                        <Link to="/login" className="btn-primary btn-full" style={{ textDecoration: "none" }}>
                            Влез в акаунта
                        </Link>
                    </div>
                ) : (
                    <>
                        <h1 className="login-form-title">
                            Нова
                            <br />
                            парола
                        </h1>
                        <p className="login-form-subtitle">
                            Въведи новата си парола по-долу.
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

                        <form className="login-fields" noValidate onSubmit={handleSubmit}>
                            {/* New password */}
                            <div className="form-group">
                                <label className="form-label" htmlFor="password">
                                    Нова парола
                                </label>
                                <div className="input-wrapper">
                                    <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                        <rect x="3" y="11" width="18" height="11" rx="2" />
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                    </svg>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        name="password"
                                        className="form-input has-icon"
                                        placeholder="Мин. 8 символа"
                                        autoComplete="new-password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        className="input-toggle"
                                        aria-label={showPassword ? "Скрий паролата" : "Покажи паролата"}
                                        onClick={() => setShowPassword((v) => !v)}
                                    >
                                        {showPassword ? (
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19M1 1l22 22" />
                                            </svg>
                                        ) : (
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                <circle cx="12" cy="12" r="3" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm password */}
                            <div className="form-group">
                                <label className="form-label" htmlFor="confirmPassword">
                                    Потвърди парола
                                </label>
                                <div className="input-wrapper">
                                    <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                        <rect x="3" y="11" width="18" height="11" rx="2" />
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                    </svg>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        className="form-input has-icon"
                                        placeholder="••••••••"
                                        autoComplete="new-password"
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
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
                                        Запазване...
                                    </>
                                ) : (
                                    <>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                                            <path d="M20 6 9 17l-5-5" />
                                        </svg>
                                        Смени паролата
                                    </>
                                )}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </main>
    );
}

export default ResetPasswordForm;
