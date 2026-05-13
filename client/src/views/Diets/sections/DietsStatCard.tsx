import type { JSX } from "react";

type DietsStatCardProps = { label: string; value: string; sub: string; accent?: string; accentColor?: string };

export default function DietsStatCard({ label, value, sub, accent, accentColor }: DietsStatCardProps): JSX.Element {
    const isNumeric = /^[\d.,+\-% ]+$/.test(value.trim());
    const fontSize = isNumeric ? "2rem" : value.length > 10 ? "1.1rem" : "1.4rem";

    return (
        <div className="card card-sm dt-card">
            <div className="label text-gray" style={{ marginBottom: "var(--sp-1)" }}>{label}</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "var(--sp-2)", flexWrap: "wrap", minWidth: 0 }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize, fontWeight: 900, color: "var(--color-cream)", lineHeight: 1.1, wordBreak: "break-word" }}>{value}</div>
                {accent && <span className="label" style={{ color: accentColor ?? "var(--c-acid,#C8FF00)", flexShrink: 0 }}>{accent}</span>}
            </div>
            <div className="body-sm text-gray" style={{ marginTop: 6 }}>{sub}</div>
        </div>
    );
}
