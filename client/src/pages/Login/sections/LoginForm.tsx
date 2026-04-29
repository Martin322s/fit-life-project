import { useState } from "react";
import type { JSX } from "react";
import { Link, useNavigate } from "react-router-dom";

type LoginFormProps = {
    theme: "dark" | "light";
    onToggleTheme: () => void;
};

function LoginForm({ theme, onToggleTheme }: LoginFormProps): JSX.Element {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 1500));
            const storedProfileRaw = window.localStorage.getItem("fitlife-profile");
            const storedProfile = storedProfileRaw
                ? (JSON.parse(storedProfileRaw) as { email?: string })
                : null;

            if (storedProfile?.email && storedProfile.email !== email) {
                throw new Error("invalid_credentials");
            }

            window.localStorage.setItem(
                "fitlife-auth",
                JSON.stringify({
                    email,
                    rememberMe,
                    loggedInAt: new Date().toISOString(),
                }),
            );
            navigate("/dashboard");
        } catch {
            setError("Грешен имейл или парола. Опитай отново.");
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
                <Link to="/" className="login-back">
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
                    Назад към сайта
                </Link>

                {/* Title */}
                <h1 className="login-form-title">
                    Добре
                    <br />
                    дошъл
                </h1>
                <p className="login-form-subtitle">
                    Нямаш акаунт?{" "}
                    <Link to="/register">Регистрирай се безплатно →</Link>
                </p>
                {/* Divider */}
                <div className="login-divider">
                    <span>или с имейл</span>
                </div>

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
                    {/* Email */}
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

                    {/* Password */}
                    <div className="form-group">
                        <div className="login-field-row">
                            <label className="form-label" htmlFor="password">
                                Парола
                            </label>
                            <Link to="/forgot-password" className="login-forgot">
                                Забравена парола?
                            </Link>
                        </div>
                        <div className="input-wrapper">
                            <svg
                                className="input-icon"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <rect x="3" y="11" width="18" height="11" rx="2" />
                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            </svg>
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                className="form-input has-icon"
                                placeholder="••••••••"
                                autoComplete="current-password"
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
                                    <svg
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                    >
                                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19M1 1l22 22" />
                                    </svg>
                                ) : (
                                    <svg
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                    >
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                        <circle cx="12" cy="12" r="3" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Remember me */}
                    <div className="login-bottom-strip">
                        <label className="form-checkbox-wrapper">
                            <input
                                type="checkbox"
                                className="form-checkbox"
                                name="rememberMe"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                            />
                            <span className="form-checkbox-label">Запомни ме</span>
                        </label>
                    </div>

                    {/* Submit */}
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
                                Влизане...
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
                                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M13 12H3" />
                                </svg>
                                Влез в акаунта
                            </>
                        )}
                    </button>
                </form>

                {/* Register prompt */}
                <p className="login-register-prompt">
                    Нямаш акаунт?{" "}
                    <Link to="/register">Създай безплатен акаунт</Link>
                </p>
            </div>
        </main>
    );
}

export default LoginForm;
