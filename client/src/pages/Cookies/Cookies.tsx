import type { JSX } from "react";
import { Link } from "react-router-dom";

const LAST_UPDATED = "9 април 2026 г.";

type CookieRow = {
    name: string;
    purpose: string;
    duration: string;
    type: "essential" | "functional" | "analytics";
};

const COOKIE_TABLE: CookieRow[] = [
    { name: "fitlife_session", purpose: "Поддържа активната потребителска сесия", duration: "До излизане", type: "essential" },
    { name: "fitlife_csrf", purpose: "Защита срещу CSRF атаки", duration: "До излизане", type: "essential" },
    { name: "fitlife-theme", purpose: "Запомня избраната светла/тъмна тема (localStorage)", duration: "Без изтичане", type: "functional" },
    { name: "_fla_visitor", purpose: "Анонимна аналитика — брой уникални посетители (self-hosted)", duration: "1 година", type: "analytics" },
];

const TYPE_COLORS: Record<CookieRow["type"], string> = {
    essential: "rgba(76,175,116,0.15)",
    functional: "rgba(0,102,255,0.12)",
    analytics: "rgba(200,168,50,0.15)",
};

const TYPE_LABELS: Record<CookieRow["type"], string> = {
    essential: "Задължителна",
    functional: "Функционална",
    analytics: "Аналитична",
};

const TYPE_TEXT_COLORS: Record<CookieRow["type"], string> = {
    essential: "var(--color-success)",
    functional: "var(--c-electric, #0066ff)",
    analytics: "var(--color-mustard)",
};

function Cookies(): JSX.Element {
    return (
        <>
            {/* Hero */}
            <section style={{ padding: "var(--space-2xl) 0 var(--space-lg)", borderBottom: "1px solid var(--color-border)" }}>
                <div className="container">
                    <div className="page-hero-breadcrumb">
                        <Link to="/">Начало</Link>
                        <span>›</span>
                        <span style={{ color: "var(--color-cream)" }}>Бисквитки</span>
                    </div>
                    <span className="section-tag">✦ Правна информация</span>
                    <h1 className="display-md" style={{ marginBottom: "var(--space-md)", marginTop: "var(--space-md)" }}>
                        Политика за <span className="text-mustard">бисквитки</span>
                    </h1>
                    <p className="body-md text-gray">
                        Последна актуализация: <strong style={{ color: "var(--color-cream)" }}>{LAST_UPDATED}</strong>
                    </p>
                </div>
            </section>

            {/* Content */}
            <section style={{ padding: "var(--space-2xl) 0" }}>
                <div className="container">
                    <div style={{ maxWidth: 760, margin: "0 auto", display: "flex", flexDirection: "column", gap: "var(--space-xl)" }}>

                        {/* Intro */}
                        <div className="card card-sm" style={{ padding: "var(--space-lg)", borderColor: "rgba(200,255,0,0.2)", background: "rgba(200,255,0,0.03)" }}>
                            <p className="body-md">
                                FitLife използва минимален брой бисквитки. Стараем се да ограничим тяхното количество
                                до абсолютно необходимото — нямаме рекламни или маркетингови бисквитки.
                                Тази политика обяснява какво използваме и защо.
                            </p>
                        </div>

                        {/* 1. What are cookies */}
                        <div>
                            <h2 className="heading-sm" style={{ marginBottom: "var(--space-md)", color: "var(--color-cream)" }}>1. Какво са бисквитки</h2>
                            <p className="body-md text-gray" style={{ marginBottom: "var(--space-md)" }}>
                                Бисквитките (cookies) са малки текстови файлове, записвани в браузъра ти при
                                посещение на уебсайт. Те позволяват на сайта да „запомни" информация между
                                различните ти посещения — например, че си влязъл в акаунта си.
                            </p>
                            <p className="body-md text-gray">
                                Освен традиционни бисквитки, използваме и{" "}
                                <strong style={{ color: "var(--color-cream)" }}>localStorage</strong> на браузъра за
                                съхранение на предпочитания, които не изискват изпращане до сървъра (напр. тема).
                            </p>
                        </div>

                        {/* 2. Types */}
                        <div>
                            <h2 className="heading-sm" style={{ marginBottom: "var(--space-md)", color: "var(--color-cream)" }}>2. Видове бисквитки, които използваме</h2>

                            {/* Legend */}
                            <div style={{ display: "flex", gap: "var(--space-md)", flexWrap: "wrap", marginBottom: "var(--space-md)" }}>
                                {(Object.keys(TYPE_LABELS) as CookieRow["type"][]).map((type) => (
                                    <span
                                        key={type}
                                        style={{
                                            padding: "4px 12px",
                                            borderRadius: 4,
                                            background: TYPE_COLORS[type],
                                            color: TYPE_TEXT_COLORS[type],
                                            fontSize: "0.8rem",
                                            fontWeight: 600,
                                        }}
                                    >
                                        {TYPE_LABELS[type]}
                                    </span>
                                ))}
                            </div>

                            {/* Cookie table */}
                            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
                                {COOKIE_TABLE.map((row) => (
                                    <div
                                        key={row.name}
                                        className="card card-sm"
                                        style={{ padding: "var(--space-md)", display: "grid", gridTemplateColumns: "1fr auto", gap: "var(--space-sm)" }}
                                    >
                                        <div>
                                            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)", marginBottom: 6 }}>
                                                <code style={{ fontFamily: "monospace", fontSize: "0.85rem", color: "var(--color-cream)", background: "rgba(255,255,255,0.06)", padding: "2px 8px", borderRadius: 4 }}>
                                                    {row.name}
                                                </code>
                                                <span
                                                    style={{
                                                        padding: "2px 8px",
                                                        borderRadius: 4,
                                                        background: TYPE_COLORS[row.type],
                                                        color: TYPE_TEXT_COLORS[row.type],
                                                        fontSize: "0.72rem",
                                                        fontWeight: 600,
                                                    }}
                                                >
                                                    {TYPE_LABELS[row.type]}
                                                </span>
                                            </div>
                                            <p className="body-sm text-gray">{row.purpose}</p>
                                        </div>
                                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                                            <div className="label text-gray">Срок</div>
                                            <div className="body-sm" style={{ color: "var(--color-cream)" }}>{row.duration}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 3. Essential */}
                        <div>
                            <h2 className="heading-sm" style={{ marginBottom: "var(--space-md)", color: "var(--color-cream)" }}>3. Задължителни бисквитки</h2>
                            <p className="body-md text-gray">
                                Задължителните бисквитки са необходими за нормалното функциониране на платформата —
                                поддържане на сесията ти и защита на сигурността. Те <strong style={{ color: "var(--color-cream)" }}>не могат да бъдат изключени</strong>,
                                тъй като без тях платформата не може да работи. Не съдържат лична идентифицираща
                                информация.
                            </p>
                        </div>

                        {/* 4. Functional */}
                        <div>
                            <h2 className="heading-sm" style={{ marginBottom: "var(--space-md)", color: "var(--color-cream)" }}>4. Функционални бисквитки</h2>
                            <p className="body-md text-gray">
                                Функционалните бисквитки запомнят твоите предпочитания, за да подобрят
                                изживяването ти. Например, избраната от теб тема (тъмна/светла) се съхранява в
                                <strong style={{ color: "var(--color-cream)" }}> localStorage</strong> на браузъра ти
                                и не се изпраща до нашите сървъри.
                            </p>
                        </div>

                        {/* 5. Analytics */}
                        <div>
                            <h2 className="heading-sm" style={{ marginBottom: "var(--space-md)", color: "var(--color-cream)" }}>5. Аналитични бисквитки</h2>
                            <p className="body-md text-gray" style={{ marginBottom: "var(--space-md)" }}>
                                Използваме <strong style={{ color: "var(--color-cream)" }}>self-hosted</strong> аналитичен
                                инструмент (данните остават на нашите сървъри в ЕС). Събираме анонимна статистика:
                                брой посещения, популярни страници, тип устройство. Никакви данни не се споделят с
                                Google Analytics или Facebook Pixel.
                            </p>
                            <div className="card card-sm" style={{ padding: "var(--space-md)", background: "rgba(200,168,50,0.05)", borderColor: "rgba(200,168,50,0.2)" }}>
                                <p className="body-sm text-gray">
                                    🍃 <strong style={{ color: "var(--color-cream)" }}>Без Google Analytics, без Facebook Pixel, без рекламни мрежи.</strong>{" "}
                                    Само анонимна статистика на собствен сървър.
                                </p>
                            </div>
                        </div>

                        {/* 6. Third-party */}
                        <div>
                            <h2 className="heading-sm" style={{ marginBottom: "var(--space-md)", color: "var(--color-cream)" }}>6. Бисквитки на трети страни</h2>
                            <p className="body-md text-gray">
                                FitLife <strong style={{ color: "var(--color-cream)" }}>не поставя бисквитки на трети страни</strong> за
                                рекламни или маркетингови цели. Ако в бъдеще интегрираме услуги на трети страни
                                (напр. социален вход с Google), ще актуализираме тази политика и ще поискаме
                                твоето изрично съгласие.
                            </p>
                        </div>

                        {/* 7. How to manage */}
                        <div>
                            <h2 className="heading-sm" style={{ marginBottom: "var(--space-md)", color: "var(--color-cream)" }}>7. Управление на бисквитките</h2>
                            <p className="body-md text-gray" style={{ marginBottom: "var(--space-md)" }}>
                                Можеш да управляваш или изтриеш бисквитките от настройките на браузъра си:
                            </p>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-sm)" }}>
                                {[
                                    { browser: "Chrome", path: "Настройки → Поверителност → Бисквитки" },
                                    { browser: "Firefox", path: "Настройки → Поверителност → Бисквитки" },
                                    { browser: "Safari", path: "Предпочитания → Поверителност" },
                                    { browser: "Edge", path: "Настройки → Бисквитки и разрешения" },
                                ].map((b) => (
                                    <div key={b.browser} className="card card-sm" style={{ padding: "var(--space-md)" }}>
                                        <div className="label" style={{ color: "var(--color-cream)", marginBottom: 4 }}>{b.browser}</div>
                                        <p className="body-sm text-gray">{b.path}</p>
                                    </div>
                                ))}
                            </div>
                            <p className="body-sm text-gray" style={{ marginTop: "var(--space-md)" }}>
                                Забележка: изключването на задължителните бисквитки ще попречи на нормалното
                                функциониране на платформата (например влизането в акаунта).
                            </p>
                        </div>

                        {/* 8. Contact */}
                        <div className="card card-sm" style={{ padding: "var(--space-lg)" }}>
                            <p className="body-md text-gray">
                                За въпроси относно използването на бисквитки:{" "}
                                <a href="mailto:privacy@fitlife.bg" style={{ color: "var(--color-mustard)" }}>privacy@fitlife.bg</a>
                                {" "}или виж нашата пълна{" "}
                                <Link to="/privacy" style={{ color: "var(--color-mustard)" }}>Политика за поверителност</Link>.
                            </p>
                        </div>

                    </div>
                </div>
            </section>
        </>
    );
}

export default Cookies;
