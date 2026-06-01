import { useState } from "react";
import type { JSX } from "react";
import { productsApi } from "../../../services/productsApi";
import type { ProductCategory } from "../../../services/productsApi";
import { PRODUCT_CATEGORY_OPTIONS } from "../../../lib/productLabels";

type Props = { onClose: () => void; onSuccess: () => void };

function tags(value: string): string[] {
    return value.split("\n").map((line) => line.trim()).filter(Boolean);
}

export default function AddProductModal({ onClose, onSuccess }: Props): JSX.Element {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState<ProductCategory>("dairy");
    const [brand, setBrand] = useState("");
    const [servingSize, setServingSize] = useState("100");
    const [servingUnit, setServingUnit] = useState("g");
    const [calories, setCalories] = useState("");
    const [protein, setProtein] = useState("");
    const [carbs, setCarbs] = useState("");
    const [fat, setFat] = useState("");
    const [sugar, setSugar] = useState("");
    const [fiber, setFiber] = useState("");
    const [salt, setSalt] = useState("");
    const [barcode, setBarcode] = useState("");
    const [tagText, setTagText] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errMsg, setErrMsg] = useState("");
    const inputStyle: React.CSSProperties = { width: "100%", padding: "10px 14px", borderRadius: "var(--r-lg)", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "var(--color-cream)", outline: "none", boxSizing: "border-box" };
    const labelStyle: React.CSSProperties = { display: "block", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", marginBottom: 6 };

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setStatus("loading");
        setErrMsg("");
        try {
            await productsApi.create({
                name,
                description,
                category,
                brand: brand || null,
                servingSize: Number(servingSize),
                servingUnit,
                calories: Number(calories),
                protein: Number(protein),
                carbs: Number(carbs),
                fat: Number(fat),
                sugar: sugar ? Number(sugar) : null,
                fiber: fiber ? Number(fiber) : null,
                salt: salt ? Number(salt) : null,
                barcode: barcode || null,
                imageUrl: null,
                tags: tags(tagText),
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
            <div style={{ width: "100%", maxWidth: 760, maxHeight: "90vh", overflowY: "auto", background: "var(--c-surface-1,#0E1318)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "var(--r-xl,20px)", padding: "var(--sp-6)" }} onClick={(e) => e.stopPropagation()}>
                {status === "success" ? <div className="heading-sm" style={{ color: "var(--color-cream)", textAlign: "center", padding: "var(--sp-5)" }}>Продуктът е добавен!</div> : (
                    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "var(--sp-3)" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div><div className="label text-gray">Администрация</div><div className="heading-sm" style={{ color: "var(--color-cream)", marginTop: 4 }}>Нов хранителен продукт</div></div>
                            <button type="button" onClick={onClose} style={{ background: "rgba(255,255,255,0.06)", border: "none", borderRadius: "50%", width: 32, height: 32, cursor: "pointer", color: "var(--color-cream)", fontSize: "1.1rem" }}>×</button>
                        </div>
                        <div><label style={labelStyle}>Име</label><input style={inputStyle} value={name} onChange={(e) => setName(e.target.value)} required /></div>
                        <div><label style={labelStyle}>Описание</label><input style={inputStyle} value={description} onChange={(e) => setDescription(e.target.value)} required /></div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: "var(--sp-3)" }}>
                            <div><label style={labelStyle}>Категория</label><select style={inputStyle} value={category} onChange={(e) => setCategory(e.target.value as ProductCategory)}>{PRODUCT_CATEGORY_OPTIONS.filter((o) => o.value).map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select></div>
                            <div><label style={labelStyle}>Марка</label><input style={inputStyle} value={brand} onChange={(e) => setBrand(e.target.value)} /></div>
                            <div><label style={labelStyle}>Порция</label><input style={inputStyle} type="number" min="0" value={servingSize} onChange={(e) => setServingSize(e.target.value)} required /></div>
                            <div><label style={labelStyle}>Единица</label><input style={inputStyle} value={servingUnit} onChange={(e) => setServingUnit(e.target.value)} required /></div>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))", gap: "var(--sp-3)" }}>
                            {[["Калории", calories, setCalories], ["Протеин", protein, setProtein], ["Въглехидрати", carbs, setCarbs], ["Мазнини", fat, setFat], ["Захар", sugar, setSugar], ["Фибри", fiber, setFiber], ["Сол", salt, setSalt]].map(([label, value, setter]) => <div key={label as string}><label style={labelStyle}>{label as string}</label><input style={inputStyle} type="number" min="0" step="0.1" value={value as string} onChange={(e) => (setter as (v: string) => void)(e.target.value)} required={["Калории", "Протеин", "Въглехидрати", "Мазнини"].includes(label as string)} /></div>)}
                        </div>
                        <div><label style={labelStyle}>Баркод</label><input style={inputStyle} value={barcode} onChange={(e) => setBarcode(e.target.value)} /></div>
                        <div><label style={labelStyle}>Тагове - по един на ред</label><textarea style={{ ...inputStyle, minHeight: 90 }} value={tagText} onChange={(e) => setTagText(e.target.value)} required /></div>
                        {status === "error" && <div style={{ color: "var(--c-error,#FF3D57)" }} className="body-sm">{errMsg}</div>}
                        <button type="submit" className="btn-primary" disabled={status === "loading"}>{status === "loading" ? "Записване..." : "Запази продукта"}</button>
                    </form>
                )}
            </div>
        </div>
    );
}
