import { useState } from "react";
import type { JSX } from "react";
import type { ApiProgressEntry } from "../../../services/dashboardApi";
import { formatShortDate } from "../../../lib/progressUtils";

type Period = "7" | "30" | "90";
type ChartPoint = { label: string; weight: number };

const PERIOD_LABELS: Record<Period, string> = { "7": "7 дни", "30": "30 дни", "90": "90 дни" };
const PERIOD_SLICE: Record<Period, number> = { "7": 7, "30": 20, "90": 999 };

function WeightChart({ data, goal }: { data: ChartPoint[]; goal: number | null }): JSX.Element | null {
    if (data.length < 2) return null;

    const W = 700, H = 230;
    const PAD = { l: 52, r: 24, t: 24, b: 34 };
    const plotW = W - PAD.l - PAD.r;
    const plotH = H - PAD.t - PAD.b;

    const weights = data.map((d) => d.weight);
    const minW = Math.min(...weights, ...(goal != null ? [goal] : [])) - 0.8;
    const maxW = Math.max(...weights) + 0.8;
    const range = maxW - minW || 1;

    const xOf = (i: number) => PAD.l + (i / (data.length - 1)) * plotW;
    const yOf = (w: number) => PAD.t + plotH - ((w - minW) / range) * plotH;

    const ptStr = data.map((d, i) => `${xOf(i).toFixed(1)},${yOf(d.weight).toFixed(1)}`).join(" ");
    const areaPath = [
        `M ${xOf(0).toFixed(1)} ${(H - PAD.b).toFixed(1)}`,
        ...data.map((d, i) => `L ${xOf(i).toFixed(1)} ${yOf(d.weight).toFixed(1)}`),
        `L ${xOf(data.length - 1).toFixed(1)} ${(H - PAD.b).toFixed(1)} Z`,
    ].join(" ");
    const labelStep = Math.max(1, Math.floor(data.length / 6));
    const goalY = goal != null ? yOf(goal) : null;
    const yTicks = Array.from({ length: 5 }, (_, i) => +(minW + (range / 4) * i).toFixed(1));

    return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ display: "block", width: "100%", height: "auto" }}>
            <defs>
                <linearGradient id="wtAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0066FF" stopOpacity="0.22" />
                    <stop offset="100%" stopColor="#0066FF" stopOpacity="0" />
                </linearGradient>
            </defs>

            {yTicks.map((tick) => (
                <g key={tick}>
                    <line x1={PAD.l} y1={yOf(tick)} x2={W - PAD.r} y2={yOf(tick)} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                    <text x={PAD.l - 6} y={yOf(tick) + 4} textAnchor="end" fontSize="10" fill="rgba(255,255,255,0.3)">{tick}</text>
                </g>
            ))}

            {goalY != null && (
                <>
                    <line x1={PAD.l} y1={goalY} x2={W - PAD.r} y2={goalY} stroke="#C8FF00" strokeWidth="1.5" strokeDasharray="5 4" opacity="0.65" />
                    <text x={W - PAD.r - 4} y={goalY - 6} textAnchor="end" fontSize="10" fill="#C8FF00" opacity="0.8">Цел {goal} кг</text>
                </>
            )}

            <path d={areaPath} fill="url(#wtAreaGrad)" />
            <polyline points={ptStr} fill="none" stroke="#0066FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

            {data.map((d, i) => {
                const isLast = i === data.length - 1;
                return (
                    <circle key={`${d.label}-${i}`} cx={xOf(i)} cy={yOf(d.weight)}
                        r={isLast ? 5.5 : 2.5}
                        fill={isLast ? "#0066FF" : "var(--c-bg,#080C10)"}
                        stroke="#0066FF" strokeWidth={isLast ? 0 : 1.5}
                        opacity={isLast ? 1 : 0.8}
                    />
                );
            })}

            <text
                x={xOf(data.length - 1)}
                y={yOf(data[data.length - 1].weight) - 10}
                textAnchor="middle" fontSize="11" fontWeight="700" fill="#5AA3FF"
            >{data[data.length - 1].weight} кг</text>

            {data.map((d, i) => {
                if (i % labelStep !== 0 && i !== data.length - 1) return null;
                return (
                    <text key={`${d.label}-${i}`} x={xOf(i)} y={H - 6} textAnchor="middle" fontSize="10" fill="rgba(255,255,255,0.3)">{d.label}</text>
                );
            })}
        </svg>
    );
}

type Props = {
    entries: ApiProgressEntry[];
    goalWeight: number | null;
    isLoading: boolean;
};

export default function WeightChartCard({ entries, goalWeight, isLoading }: Props): JSX.Element {
    const [period, setPeriod] = useState<Period>("30");
    const all = entries.map((entry) => ({ label: formatShortDate(entry.createdAt), weight: entry.weightKg }));
    const data = all.slice(-PERIOD_SLICE[period]);
    const delta = data.length >= 2 ? +(data[data.length - 1].weight - data[0].weight).toFixed(1) : null;

    return (
        <div className="card wt-card" style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "var(--sp-3)", flexWrap: "wrap" }}>
                <div>
                    <div className="label text-gray">Тренд на теглото</div>
                    <div className="heading-sm" style={{ color: "var(--color-cream)", marginTop: 4 }}>
                        {isLoading
                            ? "Зареждане..."
                            : delta == null
                                ? "Нужни са поне 2 записа"
                                : delta <= 0
                                    ? <span style={{ color: "#00E676" }}>−{Math.abs(delta)} кг за периода</span>
                                    : <span style={{ color: "var(--c-error,#FF3D57)" }}>+{delta} кг за периода</span>
                        }
                    </div>
                </div>
                <div style={{ display: "flex", gap: "var(--sp-2)", flexShrink: 0 }}>
                    {(Object.keys(PERIOD_LABELS) as Period[]).map((p) => (
                        <button key={p} type="button" onClick={() => setPeriod(p)} style={{
                            padding: "5px 12px", borderRadius: "var(--r-full)", fontSize: "0.78rem", fontWeight: 700,
                            cursor: "pointer", border: "1px solid", transition: "all 0.15s",
                            background: period === p ? "rgba(0,102,255,0.15)" : "transparent",
                            borderColor: period === p ? "var(--c-electric,#0066FF)" : "rgba(255,255,255,0.1)",
                            color: period === p ? "var(--c-electric,#0066FF)" : "rgba(255,255,255,0.4)",
                        }}>{PERIOD_LABELS[p]}</button>
                    ))}
                </div>
            </div>

            {data.length >= 2 ? (
                <WeightChart data={data} goal={goalWeight} />
            ) : (
                <div className="body-sm text-gray" style={{ minHeight: 230, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", borderRadius: "var(--r-lg)", background: "rgba(255,255,255,0.025)", border: "1px solid var(--c-border,rgba(255,255,255,0.06))" }}>
                    {isLoading ? "Зареждане на графиката..." : "Добави поне 2 записа, за да видиш линия на прогреса."}
                </div>
            )}

            <div style={{ display: "flex", gap: "var(--sp-4)", flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 20, height: 3, background: "#0066FF", borderRadius: 2 }} />
                    <span className="label text-gray">Реално тегло</span>
                </div>
                {goalWeight != null && (
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <div style={{ width: 20, height: 2, borderTop: "2px dashed #C8FF00", opacity: 0.7 }} />
                        <span className="label text-gray">Целево тегло</span>
                    </div>
                )}
            </div>
        </div>
    );
}
