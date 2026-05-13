import type { JSX } from "react";
import { CALORIES_DATA } from "./caloriesData";

export default function SuggestionsCard(): JSX.Element {
    return (
        <div className="card cal-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "var(--sp-3)", marginBottom: "var(--sp-4)" }}>
                <div>
                    <div className="label text-gray">Умни препоръки</div>
                    <div className="heading-sm" style={{ color: "var(--color-cream)", marginTop: 2 }}>Какво има смисъл да направиш сега</div>
                </div>
                <span className="cal-pill" style={{ background: "rgba(200,255,0,0.08)", color: "var(--c-acid,#C8FF00)" }}>Практични насоки</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-3)" }}>
                {CALORIES_DATA.suggestions.map((item) => (
                    <div key={item.title} style={{ padding: "var(--sp-4)", borderRadius: "var(--r-lg)", background: "linear-gradient(180deg, rgba(255,255,255,0.035), rgba(255,255,255,0.02))", border: "1px solid var(--c-border,rgba(255,255,255,0.06))" }}>
                        <div className="body-sm" style={{ color: "var(--color-cream)", fontWeight: 700, marginBottom: 6 }}>{item.title}</div>
                        <div className="body-sm text-gray">{item.text}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
