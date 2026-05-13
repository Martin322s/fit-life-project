import { useState } from "react";
import type { JSX } from "react";
import { TRAINING_DATA } from "./trainingPlansData";

export default function StrengthProgressCard(): JSX.Element {
    const lifts = TRAINING_DATA.strengthProgress;
    const [selected, setSelected] = useState(0);
    const lift = lifts[selected];

    const max = Math.max(...lift.data);
    const min = Math.min(...lift.data) - 5;
    const range = max - min || 1;

    const W = 400;
    const H = 100;
    const pts = lift.data.map((v, i) => {
        const x = (i / (lift.data.length - 1)) * W;
        const y = H - ((v - min) / range) * H;
        return `${x},${y}`;
    });

    const pctDone = Math.round(((lift.current - lift.start) / (lift.goal - lift.start)) * 100);

    return (
        <div className="card tp-card" style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
            <div>
                <div className="label text-gray">Прогрес на сила</div>
                <div className="heading-sm" style={{ color: "var(--color-cream)", marginTop: 4 }}>Основни вдигания</div>
            </div>

            {/* Lift selector tabs */}
            <div style={{ display: "flex", gap: "var(--sp-2)", flexWrap: "wrap" }}>
                {lifts.map((l, i) => (
                    <button key={l.name} type="button" onClick={() => setSelected(i)} style={{
                        padding: "6px 12px", borderRadius: "var(--r-md)", fontSize: "0.78rem", fontWeight: 700,
                        cursor: "pointer", border: "1px solid", transition: "all 0.15s",
                        background: selected === i ? `${l.color}18` : "transparent",
                        borderColor: selected === i ? l.color : "rgba(255,255,255,0.08)",
                        color: selected === i ? l.color : "rgba(255,255,255,0.4)",
                    }}>
                        {l.icon} {l.name}
                    </button>
                ))}
            </div>

            {/* Current stats row */}
            <div style={{ display: "flex", gap: "var(--sp-4)", flexWrap: "wrap" }}>
                {[
                    { label: "Начало",  value: `${lift.start} ${lift.unit}`, color: "rgba(255,255,255,0.4)" },
                    { label: "Сега",    value: `${lift.current} ${lift.unit}`, color: lift.color },
                    { label: "Цел",     value: `${lift.goal} ${lift.unit}`, color: "var(--c-acid,#C8FF00)" },
                    { label: "Прогрес", value: `+${lift.current - lift.start} ${lift.unit}`, color: "#00E676" },
                ].map((s) => (
                    <div key={s.label}>
                        <div className="label text-gray" style={{ marginBottom: 3 }}>{s.label}</div>
                        <div style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 800, color: s.color }}>{s.value}</div>
                    </div>
                ))}
            </div>

            {/* Progress to goal */}
            <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span className="label text-gray">Към целта</span>
                    <span className="label" style={{ color: lift.color }}>{pctDone}%</span>
                </div>
                <div style={{ height: 6, borderRadius: "var(--r-full)", background: "rgba(255,255,255,0.06)" }}>
                    <div style={{ width: `${pctDone}%`, height: "100%", borderRadius: "var(--r-full)", background: lift.color, transition: "width 0.4s" }} />
                </div>
            </div>

            {/* SVG line chart */}
            <div>
                <div className="label text-gray" style={{ marginBottom: 8 }}>Прогресия (последните {lift.data.length} сесии)</div>
                <svg viewBox={`0 0 ${W} ${H + 10}`} style={{ display: "block", width: "100%", height: "auto" }} preserveAspectRatio="none">
                    {/* Area fill */}
                    <defs>
                        <linearGradient id={`tpg-${selected}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={lift.color} stopOpacity="0.25" />
                            <stop offset="100%" stopColor={lift.color} stopOpacity="0" />
                        </linearGradient>
                    </defs>
                    <polygon
                        points={`0,${H} ${pts.join(" ")} ${W},${H}`}
                        fill={`url(#tpg-${selected})`}
                    />
                    {/* Line */}
                    <polyline
                        points={pts.join(" ")}
                        fill="none"
                        stroke={lift.color}
                        strokeWidth="2.5"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                    />
                    {/* Last dot */}
                    {lift.data.length > 0 && (() => {
                        const lastX = W;
                        const lastY = H - ((lift.data[lift.data.length - 1] - min) / range) * H;
                        return (
                            <>
                                <circle cx={lastX} cy={lastY} r="5" fill={lift.color} />
                                <circle cx={lastX} cy={lastY} r="9" fill={lift.color} fillOpacity="0.2" />
                            </>
                        );
                    })()}
                </svg>
            </div>
        </div>
    );
}
