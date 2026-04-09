import type { JSX } from "react";

type StatCardProps = { label: string; value: string; sub: string; accent?: string };

export default function StatCard({ label, value, sub, accent }: StatCardProps): JSX.Element {
    return (
        <div className="card card-sm cal-card">
            <div className="label text-gray" style={{ marginBottom: "var(--sp-1)" }}>{label}</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "var(--sp-2)" }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 900, color: "var(--color-cream)", lineHeight: 1 }}>{value}</div>
                {accent && <span className="label" style={{ color: "var(--c-acid,#C8FF00)" }}>{accent}</span>}
            </div>
            <div className="body-sm text-gray" style={{ marginTop: 6 }}>{sub}</div>
        </div>
    );
}
