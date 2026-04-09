import type { JSX } from "react";
import { Link } from "react-router-dom";

function HeroSection(): JSX.Element {
    return (
        <section className="hero" id="hero">
            <div className="container">
                <div className="hero-grid">
                    <div className="hero-content">
                        <div className="hero-eyebrow">
                            <span className="hero-dot" />
                            <span className="hero-eyebrow-text">Версия 2.0 — вече е тук</span>
                        </div>
                        <h1 className="hero-title">
                            Контролирай
                            <br />
                            <span className="hero-title-accent">тялото си.</span>
                            Постигни целта.
                        </h1>
                        <p className="hero-subtitle">
                            FitLife е твоята персонална платформа за проследяване на тегло,
                            хранене и физическа форма. Умни калкулатори, детайлна история и
                            рецепти — всичко на едно място.
                        </p>
                        <div className="hero-actions">
                            <Link to="/register" className="btn-primary btn-lg">
                                <svg
                                    width={18}
                                    height={18}
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                >
                                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                                </svg>
                                Стартирай безплатно
                            </Link>
                            <a href="#how-it-works" className="btn-secondary btn-lg">
                                Как работи?
                                <svg
                                    width={16}
                                    height={16}
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path d="M9 18l6-6-6-6" />
                                </svg>
                            </a>
                        </div>
                        <div className="hero-stats">
                            <div>
                                <div className="hero-stat-value">12 400+</div>
                                <div className="hero-stat-label">Активни потребители</div>
                            </div>
                            <div>
                                <div className="hero-stat-value">4.9 ★</div>
                                <div className="hero-stat-label">Средна оценка</div>
                            </div>
                            <div>
                                <div className="hero-stat-value">98%</div>
                                <div className="hero-stat-label">Достигнали целта си</div>
                            </div>
                        </div>
                    </div>
                    <div className="hero-visual" aria-hidden="true">
                        <div className="hero-float-card hero-float-card-1">
                            <div className="float-card-icon mustard">🔥</div>
                            <div>
                                <div className="float-card-label">Изгорени калории</div>
                                <div className="float-card-value text-mustard">–480 kcal</div>
                            </div>
                        </div>
                        <div className="hero-card-main">
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    marginBottom: 20
                                }}
                            >
                                <div>
                                    <div className="label text-gray" style={{ marginBottom: 4 }}>
                                        Дневен прогрес
                                    </div>
                                    <div className="heading-sm">Вторник, 6 Апр.</div>
                                </div>
                                <span className="badge badge-mustard">⚡ На цел</span>
                            </div>
                            <div className="progress-ring-wrapper">
                                <svg width={160} height={160} viewBox="0 0 160 160">
                                    <circle
                                        cx={80}
                                        cy={80}
                                        r={66}
                                        fill="none"
                                        stroke="rgba(255,255,255,0.05)"
                                        strokeWidth={12}
                                    />
                                    <circle
                                        cx={80}
                                        cy={80}
                                        r={66}
                                        fill="none"
                                        stroke="var(--color-olive-light)"
                                        strokeWidth={12}
                                        strokeLinecap="round"
                                        strokeDasharray="414.69"
                                        strokeDashoffset="124.4"
                                        transform="rotate(-90 80 80)"
                                        style={{ transition: "stroke-dashoffset 1s ease" }}
                                    />
                                    <circle
                                        cx={80}
                                        cy={80}
                                        r={52}
                                        fill="none"
                                        stroke="var(--color-mustard)"
                                        strokeWidth={10}
                                        strokeLinecap="round"
                                        strokeDasharray="326.73"
                                        strokeDashoffset="78.4"
                                        transform="rotate(-90 80 80)"
                                        style={{ transition: "stroke-dashoffset 1s ease" }}
                                    />
                                </svg>
                                <div className="progress-ring-label">
                                    <div className="value">76%</div>
                                    <div className="unit">от целта</div>
                                </div>
                            </div>
                            <div className="hero-metrics-row">
                                <div className="hero-metric">
                                    <div className="hero-metric-val">1 840</div>
                                    <div className="hero-metric-lbl">kcal приети</div>
                                </div>
                                <div className="hero-metric">
                                    <div className="hero-metric-val">74.2</div>
                                    <div className="hero-metric-lbl">кг тегло</div>
                                </div>
                                <div className="hero-metric">
                                    <div className="hero-metric-val">22.4</div>
                                    <div className="hero-metric-lbl">BMI</div>
                                </div>
                            </div>
                        </div>
                        <div className="hero-float-card hero-float-card-2">
                            <div className="float-card-icon olive">📉</div>
                            <div>
                                <div className="float-card-label">Тази седмица</div>
                                <div
                                    className="float-card-value"
                                    style={{ color: "var(--color-olive-light)" }}
                                >
                                    –0.6 кг
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default HeroSection;