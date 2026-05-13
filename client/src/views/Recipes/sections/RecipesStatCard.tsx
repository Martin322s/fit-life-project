import type { JSX } from "react";

type RecipesStatCardProps = { label: string; value: string; sub: string; accent?: string; accentColor?: string };

export default function RecipesStatCard({ label, value, sub, accent, accentColor }: RecipesStatCardProps): JSX.Element {
    return (
        <div className="card card-sm rc-card">
            <div className="label text-gray" style={{ marginBottom: "var(--sp-1)" }}>{label}</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "var(--sp-2)", flexWrap: "wrap" }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 900, color: "var(--color-cream)", lineHeight: 1 }}>{value}</div>
                {accent && <span className="label" style={{ color: accentColor ?? "var(--c-acid,#C8FF00)" }}>{accent}</span>}
            </div>
            <div className="body-sm text-gray" style={{ marginTop: 6 }}>{sub}</div>
        </div>
    );
}
