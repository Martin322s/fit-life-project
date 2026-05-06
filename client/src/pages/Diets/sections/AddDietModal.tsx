import { useState } from "react";
import type { JSX } from "react";
import { dietsApi } from "../../../services/dietsApi";
import type { DietCategory, DietDifficulty, DietGoalType } from "../../../services/dietsApi";
import { DIET_CATEGORY_OPTIONS, DIET_DIFFICULTY_OPTIONS, DIET_GOAL_OPTIONS } from "../../../lib/dietLabels";

type Props = { onClose: () => void; onSuccess: () => void };

function lines(value: string): string[] {
    return value.split("\n").map((line) => line.trim()).filter(Boolean);
}

export default function AddDietModal({ onClose, onSuccess }: Props): JSX.Element {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState<DietCategory>("balanced");
    const [goalType, setGoalType] = useState<DietGoalType>("lose_weight");
    const [difficulty, setDifficulty] = useState<DietDifficulty>("easy");
    const [durationDays, setDurationDays] = useState("");
    const [caloriesPerDay, setCaloriesPerDay] = useState("");
    const [proteinTarget, setProteinTarget] = useState("");
    const [carbsTarget, setCarbsTarget] = useState("");
    const [fatTarget, setFatTarget] = useState("");
    const [rules, setRules] = useState("");
    const [sampleMenu, setSampleMenu] = useState("");
    const [suitableFor, setSuitableFor] = useState("");
    const [notSuitableFor, setNotSuitableFor] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errMsg, setErrMsg] = useState("");
    const inputStyle: React.CSSProperties = { width: "100%", padding: "10px 14px", borderRadius: "var(--r-lg)", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "var(--color-cream)", outline: "none", boxSizing: "border-box" };
    const labelStyle: React.CSSProperties = { display: "block", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", marginBottom: 6 };

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setStatus("loading");
        setErrMsg("");
        try {
            await dietsApi.create({
                title,
                description,
                category,
                goalType,
                difficulty,
                durationDays: Number(durationDays),
                caloriesPerDay: Number(caloriesPerDay),
                proteinTarget: Number(proteinTarget),
                carbsTarget: Number(carbsTarget),
                fatTarget: Number(fatTarget),
                rules: lines(rules),
                sampleMenu: lines(sampleMenu),
                suitableFor: lines(suitableFor),
                notSuitableFor: lines(notSuitableFor),
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
                {status === "success" ? <div className="heading-sm" style={{ color: "var(--color-cream)", textAlign: "center", padding: "var(--sp-5)" }}>Диетата е добавена!</div> : (
                    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "var(--sp-3)" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div><div className="label text-gray">Администрация</div><div className="heading-sm" style={{ color: "var(--color-cream)", marginTop: 4 }}>Нова диета</div></div>
                            <button type="button" onClick={onClose} style={{ background: "rgba(255,255,255,0.06)", border: "none", borderRadius: "50%", width: 32, height: 32, cursor: "pointer", color: "var(--color-cream)", fontSize: "1.1rem" }}>×</button>
                        </div>
                        <div><label style={labelStyle}>Име</label><input style={inputStyle} value={title} onChange={(e) => setTitle(e.target.value)} required /></div>
                        <div><label style={labelStyle}>Описание</label><input style={inputStyle} value={description} onChange={(e) => setDescription(e.target.value)} required /></div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "var(--sp-3)" }}>
                            <div><label style={labelStyle}>Категория</label><select style={inputStyle} value={category} onChange={(e) => setCategory(e.target.value as DietCategory)}>{DIET_CATEGORY_OPTIONS.filter((o) => o.value).map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select></div>
                            <div><label style={labelStyle}>Цел</label><select style={inputStyle} value={goalType} onChange={(e) => setGoalType(e.target.value as DietGoalType)}>{DIET_GOAL_OPTIONS.filter((o) => o.value).map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select></div>
                            <div><label style={labelStyle}>Трудност</label><select style={inputStyle} value={difficulty} onChange={(e) => setDifficulty(e.target.value as DietDifficulty)}>{DIET_DIFFICULTY_OPTIONS.filter((o) => o.value).map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select></div>
                            <div><label style={labelStyle}>Дни</label><input style={inputStyle} type="number" min="1" value={durationDays} onChange={(e) => setDurationDays(e.target.value)} required /></div>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "var(--sp-3)" }}>
                            {[["Калории", caloriesPerDay, setCaloriesPerDay], ["Протеин", proteinTarget, setProteinTarget], ["Въглехидрати", carbsTarget, setCarbsTarget], ["Мазнини", fatTarget, setFatTarget]].map(([label, value, setter]) => <div key={label as string}><label style={labelStyle}>{label as string}</label><input style={inputStyle} type="number" min="0" step="0.1" value={value as string} onChange={(e) => (setter as (v: string) => void)(e.target.value)} required /></div>)}
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--sp-3)" }}>
                            <div><label style={labelStyle}>Правила - по едно на ред</label><textarea style={{ ...inputStyle, minHeight: 100 }} value={rules} onChange={(e) => setRules(e.target.value)} required /></div>
                            <div><label style={labelStyle}>Меню - по едно на ред</label><textarea style={{ ...inputStyle, minHeight: 100 }} value={sampleMenu} onChange={(e) => setSampleMenu(e.target.value)} required /></div>
                            <div><label style={labelStyle}>Подходяща за</label><textarea style={{ ...inputStyle, minHeight: 100 }} value={suitableFor} onChange={(e) => setSuitableFor(e.target.value)} required /></div>
                            <div><label style={labelStyle}>Не е подходяща за</label><textarea style={{ ...inputStyle, minHeight: 100 }} value={notSuitableFor} onChange={(e) => setNotSuitableFor(e.target.value)} required /></div>
                        </div>
                        {status === "error" && <div style={{ color: "var(--c-error,#FF3D57)" }} className="body-sm">{errMsg}</div>}
                        <button type="submit" className="btn-primary" disabled={status === "loading"}>{status === "loading" ? "Записване..." : "Запази диетата"}</button>
                    </form>
                )}
            </div>
        </div>
    );
}
