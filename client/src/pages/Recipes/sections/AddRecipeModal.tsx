import { useState } from "react";
import type { JSX } from "react";
import { recipesApi } from "../../../services/recipesApi";
import type { RecipeCategory, RecipeDifficulty } from "../../../services/recipesApi";
import { CATEGORY_OPTIONS, DIFFICULTY_OPTIONS } from "../../../lib/recipeLabels";

type Props = {
    onClose: () => void;
    onSuccess: () => void;
};

function lines(value: string): string[] {
    return value.split("\n").map((line) => line.trim()).filter(Boolean);
}

export default function AddRecipeModal({ onClose, onSuccess }: Props): JSX.Element {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState<RecipeCategory>("breakfast");
    const [difficulty, setDifficulty] = useState<RecipeDifficulty>("easy");
    const [calories, setCalories] = useState("");
    const [protein, setProtein] = useState("");
    const [carbs, setCarbs] = useState("");
    const [fat, setFat] = useState("");
    const [prepMinutes, setPrepMinutes] = useState("");
    const [ingredients, setIngredients] = useState("");
    const [instructions, setInstructions] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errMsg, setErrMsg] = useState("");

    const inputStyle: React.CSSProperties = {
        width: "100%", padding: "10px 14px", borderRadius: "var(--r-lg)",
        background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
        color: "var(--color-cream)", fontSize: "0.9rem", outline: "none", boxSizing: "border-box",
    };
    const labelStyle: React.CSSProperties = {
        display: "block", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.06em",
        textTransform: "uppercase", color: "rgba(255,255,255,0.45)", marginBottom: 6,
    };

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setStatus("loading");
        setErrMsg("");
        try {
            await recipesApi.create({
                title,
                description,
                category,
                difficulty,
                calories: Number(calories),
                protein: Number(protein),
                carbs: Number(carbs),
                fat: Number(fat),
                prepMinutes: Number(prepMinutes),
                ingredients: lines(ingredients),
                instructions: lines(instructions),
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
            <div style={{ width: "100%", maxWidth: 720, maxHeight: "90vh", overflowY: "auto", background: "var(--c-surface-1,#0E1318)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "var(--r-xl,20px)", padding: "var(--sp-6)", display: "flex", flexDirection: "column", gap: "var(--sp-4)" }} onClick={(e) => e.stopPropagation()}>
                {status === "success" ? (
                    <div style={{ textAlign: "center", padding: "var(--sp-5) 0" }}>
                        <div style={{ fontSize: "2.5rem", marginBottom: "var(--sp-3)" }}>✓</div>
                        <div className="heading-sm" style={{ color: "var(--color-cream)" }}>Рецептата е добавена!</div>
                    </div>
                ) : (
                    <>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div>
                                <div className="label text-gray">Администрация</div>
                                <div className="heading-sm" style={{ color: "var(--color-cream)", marginTop: 4 }}>Нова рецепта</div>
                            </div>
                            <button type="button" onClick={onClose} style={{ background: "rgba(255,255,255,0.06)", border: "none", borderRadius: "50%", width: 32, height: 32, cursor: "pointer", color: "var(--color-cream)", fontSize: "1.1rem", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
                        </div>

                        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "var(--sp-3)" }}>
                            <div>
                                <label style={labelStyle}>Име</label>
                                <input style={inputStyle} value={title} onChange={(e) => setTitle(e.target.value)} required />
                            </div>
                            <div>
                                <label style={labelStyle}>Описание</label>
                                <input style={inputStyle} value={description} onChange={(e) => setDescription(e.target.value)} required />
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "var(--sp-3)" }}>
                                <div>
                                    <label style={labelStyle}>Категория</label>
                                    <select style={inputStyle} value={category} onChange={(e) => setCategory(e.target.value as RecipeCategory)}>
                                        {CATEGORY_OPTIONS.filter((option) => option.value).map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label style={labelStyle}>Трудност</label>
                                    <select style={inputStyle} value={difficulty} onChange={(e) => setDifficulty(e.target.value as RecipeDifficulty)}>
                                        {DIFFICULTY_OPTIONS.filter((option) => option.value).map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label style={labelStyle}>Минути</label>
                                    <input style={inputStyle} type="number" min="1" value={prepMinutes} onChange={(e) => setPrepMinutes(e.target.value)} required />
                                </div>
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "var(--sp-3)" }}>
                                {[["Калории", calories, setCalories], ["Протеин", protein, setProtein], ["Въглехидрати", carbs, setCarbs], ["Мазнини", fat, setFat]].map(([label, value, setter]) => (
                                    <div key={label as string}>
                                        <label style={labelStyle}>{label as string}</label>
                                        <input style={inputStyle} type="number" min="0" step="0.1" value={value as string} onChange={(e) => (setter as (v: string) => void)(e.target.value)} required />
                                    </div>
                                ))}
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--sp-3)" }}>
                                <div>
                                    <label style={labelStyle}>Продукти - по един на ред</label>
                                    <textarea style={{ ...inputStyle, minHeight: 120, resize: "vertical" }} value={ingredients} onChange={(e) => setIngredients(e.target.value)} required />
                                </div>
                                <div>
                                    <label style={labelStyle}>Стъпки - по една на ред</label>
                                    <textarea style={{ ...inputStyle, minHeight: 120, resize: "vertical" }} value={instructions} onChange={(e) => setInstructions(e.target.value)} required />
                                </div>
                            </div>
                            {status === "error" && (
                                <div style={{ padding: "var(--sp-3)", borderRadius: "var(--r-md)", background: "rgba(255,61,87,0.1)", border: "1px solid rgba(255,61,87,0.2)" }}>
                                    <span className="body-sm" style={{ color: "var(--c-error,#FF3D57)" }}>{errMsg}</span>
                                </div>
                            )}
                            <button type="submit" className="btn-primary" disabled={status === "loading"}>
                                {status === "loading" ? "Записване..." : "Запази рецептата"}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}
