import type { JSX } from "react";
import type { ApiProgressEntry } from "../../../services/dashboardApi";
import { formatDate } from "../../../lib/progressUtils";

type Props = {
    latest: ApiProgressEntry | null;
    firstWithWaist: ApiProgressEntry | null;
};

export default function MeasurementsCard({ latest, firstWithWaist }: Props): JSX.Element {
    const waistChange = latest?.waistCm != null && firstWithWaist?.waistCm != null
        ? +(latest.waistCm - firstWithWaist.waistCm).toFixed(1)
        : null;

    return (
        <div className="card wt-card" style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "var(--sp-3)" }}>
                <div>
                    <div className="label text-gray">Телесни мерки</div>
                    <div className="heading-sm" style={{ color: "var(--color-cream)", marginTop: 4 }}>Талия от записите</div>
                </div>
                <span className="wt-pill" style={{ background: "rgba(0,102,255,0.1)", color: "var(--c-electric,#0066FF)" }}>см</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--sp-3)" }}>
                <div style={{ padding: "var(--sp-3)", borderRadius: "var(--r-lg)", background: "rgba(255,255,255,0.025)", border: "1px solid var(--c-border,rgba(255,255,255,0.06))" }}>
                    <div className="label text-gray">Последна талия</div>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", fontWeight: 800, color: "var(--color-cream)", marginTop: 4 }}>
                        {latest?.waistCm != null ? `${latest.waistCm} см` : "—"}
                    </div>
                    <div className="body-sm text-gray" style={{ marginTop: 4 }}>{latest ? formatDate(latest.createdAt) : "няма запис"}</div>
                </div>
                <div style={{ padding: "var(--sp-3)", borderRadius: "var(--r-lg)", background: "rgba(255,255,255,0.025)", border: "1px solid var(--c-border,rgba(255,255,255,0.06))" }}>
                    <div className="label text-gray">Промяна</div>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", fontWeight: 800, color: waistChange == null ? "rgba(255,255,255,0.45)" : waistChange <= 0 ? "#00E676" : "var(--c-error,#FF3D57)", marginTop: 4 }}>
                        {waistChange != null ? `${waistChange > 0 ? "+" : ""}${waistChange} см` : "—"}
                    </div>
                    <div className="body-sm text-gray" style={{ marginTop: 4 }}>
                        {firstWithWaist ? `спрямо ${formatDate(firstWithWaist.createdAt)}` : "добави талия за сравнение"}
                    </div>
                </div>
            </div>
        </div>
    );
}
