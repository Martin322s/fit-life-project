import { useState } from "react";
import type { JSX } from "react";
import { WEIGHT_DATA } from "./weightData";

type Period = "7" | "30" | "90";

const PERIOD_LABELS: Record<Period, string> = { "7": "7 дни", "30": "30 дни", "90": "90 дни" };
const PERIOD_SLICE: Record<Period, number> = { "7": 7, "30": 20, "90": 999 };

function WeightChart({ data, goal }: { data: { label: string; weight: number }[]; goal: number }): JSX.Element | null {
    if (data.length < 2) return null;

    const W = 700, H = 230;
    const PAD = { l: 52, r: 24, t: 24, b: 34 };
    const plotW = W - PAD.l - PAD.r;
    const plotH = H - PAD.t - PAD.b;

    const weights = data.map((d) => d.weight);
    const minW = Math.min(...weights, goal) - 0.8;
    const maxW = Math.max(...weights) + 0.8;
    const range = maxW - minW;

    const xOf = (i: number) => PAD.l + (i / (data.length - 1)) * plotW;
    const yOf = (w: number) => PAD.t + plotH - ((w - minW) / range) * plotH;

    const ptStr = data.map((d, i) => `${xOf(i).toFixed(1)},${yOf(d.weight).toFixed(1)}`).join(" ");
    const areaPath = [
        `M ${xOf(0).toFixed(1)} ${(H - PAD.b).toFixed(1)}`,
        ...data.map((d, i) => `L ${xOf(i).toFixed(1)} ${yOf(d.weight).toFixed(1)}`),
        `L ${xOf(data.length - 1).toFixed(1)} ${(H - PAD.b).toFixed(1)} Z`,
    ].join(" ");

    const goalY = yOf(goal);
    const labelStep = Math.max(1, Math.floor(data.length / 6));

    const yTicks: number[] = [];
    for (let i = 0; i <= 4; i++) yTicks.push(+(minW + (range / 4) * i).toFixed(1));

    return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ display: "block", width: "100%", height: "auto" }}>
            <defs>
                <linearGradient id="wtAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0066FF" stopOpacity="0.22" />
                    <stop offset="100%" stopColor="#0066FF" stopOpacity="0" />
                </linearGradient>
            </defs>

            {/* Y-axis grid + labels */}
            {yTicks.map((tick) => (
                <g key={tick}>
                    <line x1={PAD.l} y1={yOf(tick)} x2={W - PAD.r} y2={yOf(tick)} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                    <text x={PAD.l - 6} y={yOf(tick) + 4} textAnchor="end" fontSize="10" fill="rgba(255,255,255,0.3)">{tick}</text>
                </g>
            ))}

            {/* Goal dashed line */}
            <line x1={PAD.l} y1={goalY} x2={W - PAD.r} y2={goalY} stroke="#C8FF00" strokeWidth="1.5" strokeDasharray="5 4" opacity="0.65" />
            <text x={W - PAD.r - 4} y={goalY - 6} textAnchor="end" fontSize="10" fill="#C8FF00" opacity="0.8">Цел {goal} кг</text>

            {/* Area */}
            <path d={areaPath} fill="url(#wtAreaGrad)" />

            {/* Line */}
            <polyline points={ptStr} fill="none" stroke="#0066FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

            {/* Dots */}
            {data.map((d, i) => {
                const isLast = i === data.length - 1;
                return (
                    <circle key={i} cx={xOf(i)} cy={yOf(d.weight)}
                        r={isLast ? 5.5 : 2.5}
                        fill={isLast ? "#0066FF" : "var(--c-bg,#080C10)"}
                        stroke="#0066FF" strokeWidth={isLast ? 0 : 1.5}
                        opacity={isLast ? 1 : 0.8}
                    />
                );
            })}

            {/* Current weight label on last dot */}
            <text
                x={xOf(data.length - 1)}
                y={yOf(data[data.length - 1].weight) - 10}
                textAnchor="middle" fontSize="11" fontWeight="700" fill="#5AA3FF"
            >{data[data.length - 1].weight} кг</text>

            {/* X-axis labels */}
            {data.map((d, i) => {
                if (i % labelStep !== 0 && i !== data.length - 1) return null;
                return (
                    <text key={i} x={xOf(i)} y={H - 6} textAnchor="middle" fontSize="10" fill="rgba(255,255,255,0.3)">{d.label}</text>
                );
            })}
        </svg>
    );
}

export default function WeightChartCard(): JSX.Element {
    const [period, setPeriod] = useState<Period>("30");
    const all = WEIGHT_DATA.chartData;
    const sliceCount = PERIOD_SLICE[period];
    const data = all.slice(-sliceCount);

    const first = data[0].weight;
    const last = data[data.length - 1].weight;
    const delta = +(last - first).toFixed(1);

    return (
        <div className="card wt-card" style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "var(--sp-3)", flexWrap: "wrap" }}>
                <div>
                    <div className="label text-gray">Тренд на теглото</div>
                    <div className="heading-sm" style={{ color: "var(--color-cream)", marginTop: 4 }}>
                        {delta <= 0
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

            <WeightChart data={data} goal={WEIGHT_DATA.stats.goal} />

            <div style={{ display: "flex", gap: "var(--sp-4)", flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 20, height: 3, background: "#0066FF", borderRadius: 2 }} />
                    <span className="label text-gray">Реално тегло</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 20, height: 2, borderTop: "2px dashed #C8FF00", opacity: 0.7 }} />
                    <span className="label text-gray">Целево тегло</span>
                </div>
            </div>
        </div>
    );
}
