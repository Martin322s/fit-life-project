import type { JSX } from "react";
import type { ApiProgressEntry } from "../../../services/dashboardApi";
import { formatDay, formatShortDate, round1 } from "../../../lib/progressUtils";

type Props = {
    entries: ApiProgressEntry[];
    isLoading: boolean;
    onDelete: (id: string) => void;
};

export default function HistoryCard({ entries, isLoading, onDelete }: Props): JSX.Element {
    return (
        <div className="card wt-card" style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
            <div>
                <div className="label text-gray">История на измерванията</div>
                <div className="heading-sm" style={{ color: "var(--color-cream)", marginTop: 4 }}>Последни записи</div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-1)" }}>
                <div style={{ display: "grid", gridTemplateColumns: "70px 1fr 72px 60px 32px", gap: "var(--sp-3)", padding: "0 var(--sp-2)", marginBottom: 4 }}>
                    {["Дата", "Детайли", "Тегло", "Талия", ""].map((h) => (
                        <div key={h} className="label" style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.65rem", letterSpacing: "0.06em" }}>{h}</div>
                    ))}
                </div>

                {isLoading && <div className="body-sm text-gray" style={{ padding: "var(--sp-4)", textAlign: "center" }}>Зареждане...</div>}
                {!isLoading && entries.length === 0 && <div className="body-sm text-gray" style={{ padding: "var(--sp-4)", textAlign: "center" }}>Няма записано тегло.</div>}

                {entries.map((entry, i) => {
                    const previous = entries[i + 1];
                    const change = previous ? round1(entry.weightKg - previous.weightKg) : null;
                    const changeColor = change == null || change === 0 ? "rgba(255,255,255,0.3)" : change < 0 ? "#00E676" : "var(--c-error,#FF3D57)";
                    const changeStr = change == null || change === 0 ? "—" : `${change > 0 ? "+" : ""}${change} кг`;
                    const isFirst = i === 0;
                    return (
                        <div key={entry.id} style={{
                            display: "grid", gridTemplateColumns: "70px 1fr 72px 60px 32px",
                            gap: "var(--sp-3)", padding: "var(--sp-3) var(--sp-2)",
                            borderRadius: "var(--r-lg)",
                            background: isFirst ? "rgba(0,102,255,0.06)" : "rgba(255,255,255,0.015)",
                            border: `1px solid ${isFirst ? "rgba(0,102,255,0.15)" : "var(--c-border,rgba(255,255,255,0.04))"}`,
                            alignItems: "center",
                        }}>
                            <div className="label" style={{ color: isFirst ? "var(--c-electric,#0066FF)" : "rgba(255,255,255,0.45)" }}>{formatShortDate(entry.createdAt)}</div>
                            <div className="body-sm" style={{ color: "var(--color-cream)", fontWeight: isFirst ? 600 : 400, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {formatDay(entry.createdAt)} · {changeStr}{entry.notes ? ` · ${entry.notes}` : ""}
                            </div>
                            <div style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 700, color: isFirst ? "var(--color-cream)" : "rgba(255,255,255,0.7)" }}>{entry.weightKg} кг</div>
                            <div className="label" style={{ color: changeColor, fontWeight: 700 }}>{entry.waistCm != null ? `${entry.waistCm} см` : "—"}</div>
                            <button type="button" className="btn-ghost btn-sm" onClick={() => onDelete(entry.id)} aria-label="Изтрий запис" style={{ minWidth: 32, padding: "4px 0" }}>×</button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
