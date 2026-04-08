import { useState } from "react";
import type { JSX } from "react";
import { Link } from "react-router-dom";

type Step1Data = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    terms: boolean;
};

type Step1Props = {
    data: Step1Data;
    onChange: (field: keyof Step1Data, value: string | boolean) => void;
    onNext: () => void;
    error: string | null;
};

function getPasswordStrength(password: string): number {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
}

const STRENGTH_COLORS = ["", "var(--color-error)", "var(--color-warning)", "var(--color-success)", "var(--color-success)"];

function Step1Account({ data, onChange, onNext, error }: Step1Props): JSX.Element {
    const [showPassword, setShowPassword] = useState(false);
    const strength = getPasswordStrength(data.password);

    return (
        <div>
            <div className="auth-form-header">
                <h1 className="auth-form-title">Създай акаунт</h1>
                <p className="auth-form-subtitle">
                    Вече имаш акаунт? <Link to="/login">Влез тук →</Link>
                </p>
            </div>

            {/* Social sign-up */}
            <div className="oauth-buttons" style={{ marginBottom: "var(--sp-5)" }}>
                <button type="button" className="oauth-btn">
                    <svg width="18" height="18" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Google
                </button>
                <button type="button" className="oauth-btn">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    Facebook
                </button>
            </div>

            <div className="form-divider" style={{ marginBottom: "var(--sp-5)" }}>или с имейл</div>

            <div className="auth-form">
                {/* Name row */}
                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label" htmlFor="firstName">Собствено</label>
                        <input
                            type="text"
                            id="firstName"
                            className="form-input"
                            placeholder="Иван"
                            autoComplete="given-name"
                            value={data.firstName}
                            onChange={(e) => onChange("firstName", e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="lastName">Фамилия</label>
                        <input
                            type="text"
                            id="lastName"
                            className="form-input"
                            placeholder="Петров"
                            autoComplete="family-name"
                            value={data.lastName}
                            onChange={(e) => onChange("lastName", e.target.value)}
                        />
                    </div>
                </div>

                {/* Email */}
                <div className="form-group">
                    <label className="form-label" htmlFor="regEmail">Имейл адрес</label>
                    <div className="input-wrapper">
                        <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                            <rect x="2" y="4" width="20" height="16" rx="2" />
                            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                        </svg>
                        <input
                            type="email"
                            id="regEmail"
                            className="form-input has-icon"
                            placeholder="ivan@example.com"
                            autoComplete="email"
                            value={data.email}
                            onChange={(e) => onChange("email", e.target.value)}
                        />
                    </div>
                </div>

                {/* Password */}
                <div className="form-group">
                    <label className="form-label" htmlFor="regPassword">Парола</label>
                    <div className="input-wrapper">
                        <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                            <rect x="3" y="11" width="18" height="11" rx="2" />
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                        <input
                            type={showPassword ? "text" : "password"}
                            id="regPassword"
                            className="form-input has-icon"
                            placeholder="Мин. 8 символа"
                            autoComplete="new-password"
                            value={data.password}
                            onChange={(e) => onChange("password", e.target.value)}
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

                    {/* Password strength bars */}
                    <div className="password-strength">
                        {[1, 2, 3, 4].map((bar) => (
                            <div
                                key={bar}
                                className="strength-bar"
                                style={
                                    data.password.length > 0 && bar <= strength
                                        ? { background: STRENGTH_COLORS[strength] }
                                        : undefined
                                }
                            />
                        ))}
                    </div>
                    <span className="form-hint">Използвай главни букви, цифри и символи</span>
                </div>

                {/* Terms */}
                <label className="form-checkbox-wrapper">
                    <input
                        type="checkbox"
                        className="form-checkbox"
                        checked={data.terms}
                        onChange={(e) => onChange("terms", e.target.checked)}
                    />
                    <span className="form-checkbox-label">
                        Съгласен съм с <Link to="/terms">Условията за ползване</Link> и{" "}
                        <Link to="/privacy">Политиката за поверителност</Link>
                    </span>
                </label>

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

                <button type="button" className="btn-primary btn-full btn-lg" onClick={onNext}>
                    Напред
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                        <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </div>
    );
}

export default Step1Account;
