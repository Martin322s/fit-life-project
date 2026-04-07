import type { JSX } from "react";

function StoryTimeline(): JSX.Element {
    return (
        <section
            style={{
                padding: "var(--space-3xl) 0",
                background:
                    "linear-gradient(180deg, transparent, rgba(22,32,51,0.5), transparent)"
            }}
        >
            <div className="container">
                <div className="section-header text-center">
                    <span className="section-tag">✦ Нашата история</span>
                    <h2 className="display-md" style={{ marginBottom: "var(--space-md)" }}>
                        От идея до <span className="text-mustard">12 000+ потребители</span>
                    </h2>
                </div>
                <div style={{ maxWidth: 680, margin: "0 auto", position: "relative" }}>
                    <div
                        style={{
                            position: "absolute",
                            left: "50%",
                            top: 0,
                            bottom: 0,
                            width: 1,
                            background: "var(--color-border)",
                            transform: "translateX(-50%)"
                        }}
                    ></div>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "var(--space-2xl)"
                        }}
                    >
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "1fr 40px 1fr",
                                gap: "var(--space-md)",
                                alignItems: "center"
                            }}
                        >
                            <div className="card card-sm" style={{ textAlign: "right" }}>
                                <div className="label text-mustard" style={{ marginBottom: 8 }}>
                                    Юни 2021
                                </div>
                                <div
                                    className="heading-sm"
                                    style={{ fontSize: "0.9rem", marginBottom: 4 }}
                                >
                                    Идеята се ражда
                                </div>
                                <p className="body-sm text-gray">
                                    Александър пише първата версия на калкулатора в Google Sheets за
                                    лично ползване.
                                </p>
                            </div>
                            <div
                                style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: "50%",
                                    background: "var(--color-navy-mid)",
                                    border: "2px solid var(--color-mustard)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "1rem",
                                    zIndex: 1
                                }}
                            >
                                💡
                            </div>
                            <div />
                        </div>
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "1fr 40px 1fr",
                                gap: "var(--space-md)",
                                alignItems: "center"
                            }}
                        >
                            <div />
                            <div
                                style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: "50%",
                                    background: "var(--color-navy-mid)",
                                    border: "2px solid var(--color-olive-light)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "1rem",
                                    zIndex: 1
                                }}
                            >
                                🚀
                            </div>
                            <div className="card card-sm">
                                <div className="label text-olive" style={{ marginBottom: 8 }}>
                                    Март 2022
                                </div>
                                <div
                                    className="heading-sm"
                                    style={{ fontSize: "0.9rem", marginBottom: 4 }}
                                >
                                    Публичен launch
                                </div>
                                <p className="body-sm text-gray">
                                    Първата публична версия на FitLife достига 500 потребители за 2
                                    седмици.
                                </p>
                            </div>
                        </div>
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "1fr 40px 1fr",
                                gap: "var(--space-md)",
                                alignItems: "center"
                            }}
                        >
                            <div className="card card-sm" style={{ textAlign: "right" }}>
                                <div className="label text-mustard" style={{ marginBottom: 8 }}>
                                    Септември 2023
                                </div>
                                <div
                                    className="heading-sm"
                                    style={{ fontSize: "0.9rem", marginBottom: 4 }}
                                >
                                    Каталог рецепти
                                </div>
                                <p className="body-sm text-gray">
                                    Добавени 300+ рецепти с пълни макроси след партньорство с диетолог
                                    Николета.
                                </p>
                            </div>
                            <div
                                style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: "50%",
                                    background: "var(--color-navy-mid)",
                                    border: "2px solid var(--color-mustard)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "1rem",
                                    zIndex: 1
                                }}
                            >
                                🥗
                            </div>
                            <div />
                        </div>
                        {/* 2025 */}
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "1fr 40px 1fr",
                                gap: "var(--space-md)",
                                alignItems: "center"
                            }}
                        >
                            <div />
                            <div
                                style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: "50%",
                                    background: "var(--color-mustard)",
                                    border: "2px solid var(--color-mustard)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "1rem",
                                    zIndex: 1,
                                    color: "var(--color-navy)"
                                }}
                            >
                                ⚡
                            </div>
                            <div
                                className="card card-sm"
                                style={{ borderColor: "rgba(200,168,50,0.3)" }}
                            >
                                <div className="label text-mustard" style={{ marginBottom: 8 }}>
                                    Април 2025
                                </div>
                                <div
                                    className="heading-sm"
                                    style={{ fontSize: "0.9rem", marginBottom: 4 }}
                                >
                                    FitLife 2.0
                                </div>
                                <p className="body-sm text-gray">
                                    Пълно преосмисляне на платформата. 12 400+ потребители, нов
                                    дизайн, нови функции.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default StoryTimeline;