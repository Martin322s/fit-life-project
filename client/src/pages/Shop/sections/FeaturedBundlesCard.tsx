import type { JSX } from "react";
import { FEATURED_BUNDLES } from "./shopData";

export default function FeaturedBundlesCard(): JSX.Element {
    return (
        <div className="card sd-card" style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "var(--sp-3)", alignItems: "flex-start" }}>
                <div>
                    <div className="label text-gray">Подбрани оферти</div>
                    <div className="heading-sm" style={{ color: "var(--color-cream)", marginTop: 4 }}>Готови пакети за целта ти</div>
                </div>
                <span className="sd-pill" style={{ background: "rgba(200,255,0,0.1)", color: "var(--c-acid,#C8FF00)" }}>bundle deals</span>
            </div>

            <div className="sd-bundle-grid">
                {FEATURED_BUNDLES.map((bundle) => (
                    <div
                        key={bundle.id}
                        style={{
                            borderRadius: "var(--r-xl)",
                            padding: "var(--sp-5)",
                            background: bundle.gradient,
                            color: "#061018",
                            display: "flex",
                            flexDirection: "column",
                            gap: "var(--sp-4)",
                            minHeight: 210,
                        }}
                    >
                        <div>
                            <div className="label" style={{ color: "rgba(6,16,24,0.7)", marginBottom: 6 }}>FitLife Select</div>
                            <div style={{ fontFamily: "var(--font-display)", fontSize: "1.45rem", fontWeight: 900, lineHeight: 1.05 }}>{bundle.title}</div>
                            <div className="body-sm" style={{ color: "rgba(6,16,24,0.78)", marginTop: 8 }}>{bundle.subtitle}</div>
                        </div>

                        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--sp-2)" }}>
                            {bundle.bullets.map((bullet) => (
                                <span
                                    key={bullet}
                                    className="label"
                                    style={{
                                        background: "rgba(255,255,255,0.22)",
                                        color: "#061018",
                                        padding: "4px 8px",
                                        borderRadius: "999px",
                                    }}
                                >
                                    {bullet}
                                </span>
                            ))}
                        </div>

                        <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "var(--sp-3)" }}>
                            <div>
                                <div className="label" style={{ color: "rgba(6,16,24,0.7)" }}>{bundle.discount}</div>
                                <div style={{ fontFamily: "var(--font-display)", fontSize: "1.7rem", fontWeight: 900, lineHeight: 1.1 }}>{bundle.price}</div>
                            </div>
                            <button
                                type="button"
                                style={{
                                    border: "none",
                                    borderRadius: "var(--r-lg)",
                                    background: "rgba(6,16,24,0.9)",
                                    color: "white",
                                    padding: "10px 14px",
                                    fontWeight: 700,
                                    cursor: "pointer",
                                }}
                            >
                                Вземи пакета
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
