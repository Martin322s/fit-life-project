import type { JSX } from "react";

function Mission(): JSX.Element {
    return (
        <section className="about-mission">
            <div className="container">
                <div className="about-mission-grid">
                    <div>
                        <span className="section-tag">✦ Нашата мисия</span>
                        <h2 className="display-md" style={{ marginBottom: "var(--space-lg)" }}>
                            Данните, които
                            <br />
                            <span className="text-mustard">ти липсваха</span>
                        </h2>
                        <p
                            className="body-md text-gray"
                            style={{ marginBottom: "var(--space-lg)" }}
                        >
                            Вярваме, че всеки човек заслужава достъп до персонализирана здравна
                            информация. Не ти трябва диетолог или личен треньор, за да разбереш
                            тялото си — нужен ти е правилният инструмент.
                        </p>
                        <p
                            className="body-md text-gray"
                            style={{ marginBottom: "var(--space-xl)" }}
                        >
                            FitLife превежда научните формули (BMR, TDEE, Mifflin-St Jeor) на
                            разбираем език и ги показва в контекста на твоя личен прогрес. Без
                            жаргон, без усложнения.
                        </p>
                        {/* Core principles list */}
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "var(--space-md)"
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    gap: "var(--space-md)",
                                    alignItems: "flex-start"
                                }}
                            >
                                <div
                                    style={{
                                        width: 32,
                                        height: 32,
                                        borderRadius: "var(--radius-sm)",
                                        background: "rgba(200,168,50,0.15)",
                                        border: "1px solid rgba(200,168,50,0.25)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        flexShrink: 0,
                                        fontSize: "0.875rem"
                                    }}
                                >
                                    🎯
                                </div>
                                <div>
                                    <div
                                        className="heading-sm"
                                        style={{ fontSize: "0.95rem", marginBottom: 4 }}
                                    >
                                        Точност пред красота
                                    </div>
                                    <div className="body-sm text-gray">
                                        Формулите ни са базирани на научна литература, не на маркетинг.
                                    </div>
                                </div>
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    gap: "var(--space-md)",
                                    alignItems: "flex-start"
                                }}
                            >
                                <div
                                    style={{
                                        width: 32,
                                        height: 32,
                                        borderRadius: "var(--radius-sm)",
                                        background: "rgba(74,92,47,0.2)",
                                        border: "1px solid rgba(74,92,47,0.3)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        flexShrink: 0,
                                        fontSize: "0.875rem"
                                    }}
                                >
                                    🔒
                                </div>
                                <div>
                                    <div
                                        className="heading-sm"
                                        style={{ fontSize: "0.95rem", marginBottom: 4 }}
                                    >
                                        Поверителност на първо място
                                    </div>
                                    <div className="body-sm text-gray">
                                        Данните ти са твои. Никога не ги продаваме на трети страни.
                                    </div>
                                </div>
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    gap: "var(--space-md)",
                                    alignItems: "flex-start"
                                }}
                            >
                                <div
                                    style={{
                                        width: 32,
                                        height: 32,
                                        borderRadius: "var(--radius-sm)",
                                        background: "rgba(200,168,50,0.15)",
                                        border: "1px solid rgba(200,168,50,0.25)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        flexShrink: 0,
                                        fontSize: "0.875rem"
                                    }}
                                >
                                    💡
                                </div>
                                <div>
                                    <div
                                        className="heading-sm"
                                        style={{ fontSize: "0.95rem", marginBottom: 4 }}
                                    >
                                        Простота е сила
                                    </div>
                                    <div className="body-sm text-gray">
                                        Сложните концепции са скрити зад прост интерфейс. Ти виждаш само
                                        важното.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="about-mission-visual">
                        <div className="about-value-card">
                            <div className="about-value-icon">⚖️</div>
                            <div className="about-value-title">Баланс</div>
                            <div className="about-value-desc">
                                Здравето е баланс — не само числа
                            </div>
                        </div>
                        <div className="about-value-card">
                            <div className="about-value-icon">📈</div>
                            <div className="about-value-title">Прогрес</div>
                            <div className="about-value-desc">
                                Малките стъпки водят до големи промени
                            </div>
                        </div>
                        <div className="about-value-card">
                            <div className="about-value-icon">🧪</div>
                            <div className="about-value-title">Наука</div>
                            <div className="about-value-desc">Базирани на доказани формули</div>
                        </div>
                        <div className="about-value-card">
                            <div className="about-value-icon">🤝</div>
                            <div className="about-value-title">Общност</div>
                            <div className="about-value-desc">
                                Растем заедно с потребителите ни
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Mission;