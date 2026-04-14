import type { JSX } from "react";

type WeightStatCardProps = {
    label: string;
    value: string;
    sub: string;
    accent?: string;
    accentColor?: string;
    trend?: "up" | "down" | "neutral";
};

export default function WeightStatCard({ label, value, sub, accent, accentColor, trend }: WeightStatCardProps): JSX.Element {
    const trendIcon = trend === "down" ? "↓" : trend === "up" ? "↑" : null;
    const trendColor = trend === "down" ? "#00E676" : trend === "up" ? "var(--c-error,#FF3D57)" : undefined;
    return (
        <div className="card card-sm wt-card">
            <div className="label text-gray" style={{ marginBottom: "var(--sp-1)" }}>{label}</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "var(--sp-2)", flexWrap: "wrap" }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 900, color: "var(--color-cream)", lineHeight: 1 }}>{value}</div>
                {trendIcon && <span style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 700, color: trendColor }}>{trendIcon}</span>}
                {accent && <span className="label" style={{ color: accentColor ?? "var(--c-acid,#C8FF00)" }}>{accent}</span>}
            </div>
            <div className="body-sm text-gray" style={{ marginTop: 6 }}>{sub}</div>
        </div>
    );
}
