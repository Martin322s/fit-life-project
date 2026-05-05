import { useState } from "react";
import type { JSX } from "react";
import { trainingPlansApi } from "../../../services/trainingPlansApi";
import type { TrainingEquipment, TrainingGoalType, TrainingLevel } from "../../../services/trainingPlansApi";
import { TRAINING_EQUIPMENT_OPTIONS, TRAINING_GOAL_OPTIONS, TRAINING_LEVEL_OPTIONS } from "../../../lib/trainingPlanLabels";

type Props = { onClose: () => void; onSuccess: () => void };

function lines(value: string): string[] {
    return value.split("\n").map((line) => line.trim()).filter(Boolean);
}

export default function AddTrainingPlanModal({ onClose, onSuccess }: Props): JSX.Element {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [goalType, setGoalType] = useState<TrainingGoalType>("general_fitness");
    const [level, setLevel] = useState<TrainingLevel>("beginner");
    const [equipment, setEquipment] = useState<TrainingEquipment>("none");
    const [durationWeeks, setDurationWeeks] = useState("");
    const [sessionsPerWeek, setSessionsPerWeek] = useState("");
    const [averageSessionMinutes, setAverageSessionMinutes] = useState("");
    const [caloriesBurnEstimate, setCaloriesBurnEstimate] = useState("");
    const [targetMuscles, setTargetMuscles] = useState("");
    const [planStructure, setPlanStructure] = useState("");
    const [weeklySchedule, setWeeklySchedule] = useState("");
    const [safetyNotes, setSafetyNotes] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errMsg, setErrMsg] = useState("");
    const inputStyle: React.CSSProperties = { width: "100%", padding: "10px 14px", borderRadius: "var(--r-lg)", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "var(--color-cream)", outline: "none", boxSizing: "border-box" };
    const labelStyle: React.CSSProperties = { display: "block", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", marginBottom: 6 };

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setStatus("loading");
        setErrMsg("");
        try {
            await trainingPlansApi.create({
                title,
                description,
                goalType,
                level,
                durationWeeks: Number(durationWeeks),
                sessionsPerWeek: Number(sessionsPerWeek),
                averageSessionMinutes: Number(averageSessionMinutes),
                equipment: [equipment],
                targetMuscles: lines(targetMuscles),
                caloriesBurnEstimate: caloriesBurnEstimate ? Number(caloriesBurnEstimate) : null,
                planStructure: lines(planStructure),
                weeklySchedule: lines(weeklySchedule),
                safetyNotes: lines(safetyNotes),
            });
            setStatus("success");
            onSuccess();
            setTimeout(onClose, 1200);
        } catch (err) {
            setErrMsg(err instanceof Error ? err.message : "Грешка при записването.");
            setStatus("error");
        }
    }

    return (
        <div style={{ position: "fixed", inset: 0, zIndex: 400, display: "flex", alignItems: "center", justifyContent: "center", padding: "var(--sp-4)", background: "rgba(0,0,0,0.72)", backdropFilter: "blur(6px)" }} onClick={onClose}>
            <div style={{ width: "100%", maxWidth: 820, maxHeight: "90vh", overflowY: "auto", background: "var(--c-surface-1,#0E1318)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "var(--r-xl,20px)", padding: "var(--sp-6)", display: "flex", flexDirection: "column", gap: "var(--sp-4)" }} onClick={(e) => e.stopPropagation()}>
                {status === "success" ? <div className="heading-sm" style={{ color: "var(--color-cream)", textAlign: "center", padding: "var(--sp-5)" }}>Планът е добавен!</div> : (
                    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "var(--sp-3)" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div><div className="label text-gray">Администрация</div><div className="heading-sm" style={{ color: "var(--color-cream)", marginTop: 4 }}>Нов тренировъчен план</div></div>
                            <button type="button" onClick={onClose} style={{ background: "rgba(255,255,255,0.06)", border: "none", borderRadius: "50%", width: 32, height: 32, cursor: "pointer", color: "var(--color-cream)", fontSize: "1.1rem" }}>×</button>
                        </div>
                        <div><label style={labelStyle}>Име</label><input style={inputStyle} value={title} onChange={(e) => setTitle(e.target.value)} required /></div>
                        <div><label style={labelStyle}>Описание</label><input style={inputStyle} value={description} onChange={(e) => setDescription(e.target.value)} required /></div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: "var(--sp-3)" }}>
                            <div><label style={labelStyle}>Цел</label><select style={inputStyle} value={goalType} onChange={(e) => setGoalType(e.target.value as TrainingGoalType)}>{TRAINING_GOAL_OPTIONS.filter((o) => o.value).map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select></div>
                            <div><label style={labelStyle}>Ниво</label><select style={inputStyle} value={level} onChange={(e) => setLevel(e.target.value as TrainingLevel)}>{TRAINING_LEVEL_OPTIONS.filter((o) => o.value).map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select></div>
                            <div><label style={labelStyle}>Оборудване</label><select style={inputStyle} value={equipment} onChange={(e) => setEquipment(e.target.value as TrainingEquipment)}>{TRAINING_EQUIPMENT_OPTIONS.filter((o) => o.value).map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select></div>
                            <div><label style={labelStyle}>Седмици</label><input style={inputStyle} type="number" min="1" value={durationWeeks} onChange={(e) => setDurationWeeks(e.target.value)} required /></div>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: "var(--sp-3)" }}>
                            <div><label style={labelStyle}>Сесии/сед.</label><input style={inputStyle} type="number" min="1" value={sessionsPerWeek} onChange={(e) => setSessionsPerWeek(e.target.value)} required /></div>
                            <div><label style={labelStyle}>Минути</label><input style={inputStyle} type="number" min="1" value={averageSessionMinutes} onChange={(e) => setAverageSessionMinutes(e.target.value)} required /></div>
                            <div><label style={labelStyle}>kcal разход</label><input style={inputStyle} type="number" min="0" value={caloriesBurnEstimate} onChange={(e) => setCaloriesBurnEstimate(e.target.value)} /></div>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "var(--sp-3)" }}>
                            <div><label style={labelStyle}>Мускули - по едно на ред</label><textarea style={{ ...inputStyle, minHeight: 100 }} value={targetMuscles} onChange={(e) => setTargetMuscles(e.target.value)} required /></div>
                            <div><label style={labelStyle}>Структура - по едно на ред</label><textarea style={{ ...inputStyle, minHeight: 100 }} value={planStructure} onChange={(e) => setPlanStructure(e.target.value)} required /></div>
                            <div><label style={labelStyle}>График - по едно на ред</label><textarea style={{ ...inputStyle, minHeight: 100 }} value={weeklySchedule} onChange={(e) => setWeeklySchedule(e.target.value)} required /></div>
                            <div><label style={labelStyle}>Безопасност - по едно на ред</label><textarea style={{ ...inputStyle, minHeight: 100 }} value={safetyNotes} onChange={(e) => setSafetyNotes(e.target.value)} required /></div>
                        </div>
                        {status === "error" && <div style={{ color: "var(--c-error,#FF3D57)" }} className="body-sm">{errMsg}</div>}
                        <button type="submit" className="btn-primary" disabled={status === "loading"}>{status === "loading" ? "Записване..." : "Запази плана"}</button>
                    </form>
                )}
            </div>
        </div>
    );
}
