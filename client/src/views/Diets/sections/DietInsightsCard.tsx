import type { JSX } from "react";
import { DIETS_DATA } from "./dietsData";

export default function DietInsightsCard(): JSX.Element {
    return (
        <div className="card dt-card" style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
            <div>
                <div className="label text-gray">Научни данни</div>
                <div className="heading-sm" style={{ color: "var(--color-cream)", marginTop: 4 }}>Защо тази диета работи</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-3)" }}>
                {DIETS_DATA.insights.map((ins) => (
                    <div key={ins.title} style={{ padding: "var(--sp-4)", borderRadius: "var(--r-lg)", background: "rgba(255,255,255,0.025)", border: "1px solid var(--c-border,rgba(255,255,255,0.06))" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "var(--sp-2)", marginBottom: 8 }}>
                            <span style={{ fontSize: "1rem" }}>{ins.icon}</span>
                            <div className="body-sm" style={{ color: ins.color, fontWeight: 700 }}>{ins.title}</div>
                        </div>
                        <div className="body-sm text-gray" style={{ lineHeight: 1.6 }}>{ins.text}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
