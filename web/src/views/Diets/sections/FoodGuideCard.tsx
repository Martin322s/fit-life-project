import { useState } from "react";
import type { JSX } from "react";
import { DIETS_DATA } from "./dietsData";

type Tab = "allowed" | "limited" | "avoid";
const TABS: { key: Tab; label: string; color: string }[] = [
    { key: "allowed",  label: "Разрешено",  color: "#00E676" },
    { key: "limited",  label: "Ограничено", color: "#FFB300" },
    { key: "avoid",    label: "Избягвай",   color: "var(--c-error,#FF3D57)" },
];

export default function FoodGuideCard(): JSX.Element {
    const [tab, setTab] = useState<Tab>("allowed");
    const guide = DIETS_DATA.foodGuide;

    return (
        <div className="card dt-card" style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
            <div>
                <div className="label text-gray">Хранително ръководство</div>
                <div className="heading-sm" style={{ color: "var(--color-cream)", marginTop: 4 }}>Какво да ядеш и какво да избягваш</div>
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", gap: "var(--sp-2)" }}>
                {TABS.map((t) => (
                    <button key={t.key} type="button" onClick={() => setTab(t.key)} style={{
                        flex: 1, padding: "7px 0", borderRadius: "var(--r-md)", fontSize: "0.78rem", fontWeight: 700,
                        cursor: "pointer", border: "1px solid", transition: "all 0.15s",
                        background: tab === t.key ? `${t.color}18` : "transparent",
                        borderColor: tab === t.key ? t.color : "rgba(255,255,255,0.08)",
                        color: tab === t.key ? t.color : "rgba(255,255,255,0.4)",
                    }}>{t.label}</button>
                ))}
            </div>

            {/* Content */}
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-2)" }}>
                {tab === "allowed" && guide.allowed.map((item) => (
                    <div key={item.food} style={{ display: "flex", alignItems: "center", gap: "var(--sp-3)", padding: "var(--sp-3) var(--sp-4)", borderRadius: "var(--r-lg)", background: "rgba(0,230,118,0.04)", border: "1px solid rgba(0,230,118,0.1)" }}>
                        <span style={{ fontSize: "1.2rem", flexShrink: 0 }}>{item.icon}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div className="body-sm" style={{ color: "var(--color-cream)", fontWeight: 600 }}>{item.food}</div>
                        </div>
                        <span className="dt-pill" style={{ background: "rgba(0,230,118,0.08)", color: "#00E676", flexShrink: 0, fontSize: "0.65rem" }}>{item.freq}</span>
                    </div>
                ))}

                {tab === "limited" && guide.limited.map((item) => (
                    <div key={item.food} style={{ display: "flex", alignItems: "center", gap: "var(--sp-3)", padding: "var(--sp-3) var(--sp-4)", borderRadius: "var(--r-lg)", background: "rgba(255,179,0,0.04)", border: "1px solid rgba(255,179,0,0.12)" }}>
                        <span style={{ fontSize: "1.2rem", flexShrink: 0 }}>{item.icon}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div className="body-sm" style={{ color: "var(--color-cream)", fontWeight: 600 }}>{item.food}</div>
                        </div>
                        <span className="dt-pill" style={{ background: "rgba(255,179,0,0.08)", color: "#FFB300", flexShrink: 0, fontSize: "0.65rem" }}>{item.freq}</span>
                    </div>
                ))}

                {tab === "avoid" && guide.avoid.map((item) => (
                    <div key={item.food} style={{ display: "flex", alignItems: "center", gap: "var(--sp-3)", padding: "var(--sp-3) var(--sp-4)", borderRadius: "var(--r-lg)", background: "rgba(255,61,87,0.04)", border: "1px solid rgba(255,61,87,0.12)" }}>
                        <span style={{ fontSize: "1.2rem", flexShrink: 0 }}>{item.icon}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div className="body-sm" style={{ color: "var(--color-cream)", fontWeight: 600 }}>{item.food}</div>
                            <div className="label text-gray" style={{ marginTop: 2 }}>{item.reason}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
