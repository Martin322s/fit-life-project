import { useState } from "react";
import type { JSX } from "react";
import { Link } from "react-router-dom";

type FormData = {
    firstName: string;
    lastName: string;
    email: string;
    subject: string;
    message: string;
    privacyConsent: boolean;
};

type SubmitStatus = "idle" | "submitting" | "success" | "error";

const INITIAL_FORM: FormData = {
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
    privacyConsent: false,
};

function ContactForm(): JSX.Element {
    const [formData, setFormData] = useState<FormData>(INITIAL_FORM);
    const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");

    const charCount = formData.message.length;
    const charCountColor =
        charCount > 1000
            ? "var(--color-error)"
            : charCount > 900
              ? "var(--color-warning)"
              : "var(--color-gray)";

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, privacyConsent: e.target.checked }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitStatus("submitting");
        try {
            // TODO: replace with real POST /api/contact
            await new Promise((resolve) => setTimeout(resolve, 1500));
            setSubmitStatus("success");
        } catch {
            setSubmitStatus("error");
        }
    };

    const handleReset = () => {
        setFormData(INITIAL_FORM);
        setSubmitStatus("idle");
    };

    const isSubmitting = submitStatus === "submitting";

    if (submitStatus === "success") {
        return (
            <div className="contact-form-card">
                <div
                    style={{
                        textAlign: "center",
                        padding: "var(--space-2xl) var(--space-lg)",
                    }}
                >
                    <div
                        style={{
                            width: 72,
                            height: 72,
                            borderRadius: "50%",
                            background: "rgba(76,175,116,0.15)",
                            border: "2px solid var(--color-success)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "2rem",
                            margin: "0 auto var(--space-lg)",
                        }}
                    >
                        ✅
                    </div>
                    <h3
                        className="display-md"
                        style={{ fontSize: "1.4rem", marginBottom: "var(--space-md)" }}
                    >
                        Съобщението е изпратено!
                    </h3>
                    <p className="body-md text-gray" style={{ marginBottom: "var(--space-xl)" }}>
                        Благодарим ти, че се свърза с нас. Ще получиш отговор на{" "}
                        <strong style={{ color: "var(--color-cream)" }}>{formData.email}</strong> до 24
                        часа в работни дни.
                    </p>
                    <button type="button" className="btn-secondary" onClick={handleReset}>
                        ← Изпрати ново съобщение
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="contact-form-card">
            <div style={{ marginBottom: "var(--space-xl)" }}>
                <h2 className="contact-form-title">Изпрати съобщение</h2>
                <p className="body-sm text-gray">
                    Попълни формата и ще ти отговорим до 24 часа в работни дни. Всички полета са
                    задължителни.
                </p>
            </div>

            <form className="auth-form" noValidate onSubmit={handleSubmit}>
                {/* Name row */}
                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label" htmlFor="firstName">
                            Собствено име
                        </label>
                        <div className="input-wrapper">
                            <svg
                                className="input-icon"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                            </svg>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                className="form-input has-icon"
                                placeholder="Иван"
                                required
                                value={formData.firstName}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="lastName">
                            Фамилия
                        </label>
                        <div className="input-wrapper">
                            <svg
                                className="input-icon"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                            </svg>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                className="form-input has-icon"
                                placeholder="Петров"
                                required
                                value={formData.lastName}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </div>

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
                            required
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                {/* Subject */}
                <div className="form-group">
                    <label className="form-label" htmlFor="subject">
                        Тема
                    </label>
                    <select
                        id="subject"
                        name="subject"
                        className="form-select"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                    >
                        <option value="" disabled>
                            Избери тема...
                        </option>
                        <optgroup label="Поддръжка">
                            <option value="technical">⚙️ Технически проблем</option>
                            <option value="account">👤 Въпрос за акаунт</option>
                            <option value="data">🔒 Данни и поверителност</option>
                        </optgroup>
                        <optgroup label="Обратна връзка">
                            <option value="feedback">💡 Предложение за подобрение</option>
                            <option value="bug">🐛 Докладване на грешка</option>
                            <option value="feature">✨ Заявка за функция</option>
                        </optgroup>
                        <optgroup label="Друго">
                            <option value="press">📰 Медии и партньорства</option>
                            <option value="other">💬 Друго</option>
                        </optgroup>
                    </select>
                </div>

                {/* Message */}
                <div className="form-group">
                    <label className="form-label" htmlFor="message">
                        Съобщение
                    </label>
                    <textarea
                        id="message"
                        name="message"
                        className="form-textarea"
                        placeholder="Опиши въпроса или проблема си с възможно най-много детайли..."
                        rows={5}
                        required
                        maxLength={1000}
                        value={formData.message}
                        onChange={handleChange}
                    />
                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <span className="form-hint" style={{ color: charCountColor }}>
                            {charCount} / 1000
                        </span>
                    </div>
                </div>

                {/* Privacy consent */}
                <label className="form-checkbox-wrapper">
                    <input
                        type="checkbox"
                        className="form-checkbox"
                        name="privacyConsent"
                        required
                        checked={formData.privacyConsent}
                        onChange={handleCheckbox}
                    />
                    <span className="form-checkbox-label">
                        Съгласен съм с <Link to="/privacy">Политиката за поверителност</Link> и давам
                        съгласие FitLife да обработи данните ми с цел отговор на съобщението ми.
                    </span>
                </label>

                {/* Submit */}
                <button
                    type="submit"
                    className="btn-primary btn-full btn-lg"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
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
                                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                            </svg>
                            Изпрати съобщение
                        </>
                    )}
                </button>

                {/* Error state */}
                {submitStatus === "error" && (
                    <div className="alert alert-error">
                        <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            style={{ flexShrink: 0 }}
                        >
                            <circle cx="12" cy="12" r="10" />
                            <line x1="15" y1="9" x2="9" y2="15" />
                            <line x1="9" y1="9" x2="15" y2="15" />
                        </svg>
                        Нещо се обърка. Опитай отново или пиши директно на hello@fitlife.bg.
                    </div>
                )}
            </form>
        </div>
    );
}

export default ContactForm;
