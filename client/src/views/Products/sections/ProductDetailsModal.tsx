import type { JSX } from "react";
import type { ApiProduct } from "../../../services/productsApi";
import { productCategoryLabel } from "../../../lib/productLabels";

type Props = { product: ApiProduct; isAdmin: boolean; onClose: () => void; onDelete: (id: string) => void };

function NutritionBox({ label, value }: { label: string; value: string }): JSX.Element {
    return <div style={{ padding: "var(--sp-3)", borderRadius: "var(--r-lg)", background: "rgba(255,255,255,0.025)" }}><div className="label text-gray">{label}</div><div style={{ color: "var(--color-cream)", fontWeight: 800 }}>{value}</div></div>;
}

export default function ProductDetailsModal({ product, isAdmin, onClose, onDelete }: Props): JSX.Element {
    return (
        <div style={{ position: "fixed", inset: 0, zIndex: 400, display: "flex", alignItems: "center", justifyContent: "center", padding: "var(--sp-4)", background: "rgba(0,0,0,0.72)", backdropFilter: "blur(6px)" }} onClick={onClose}>
            <div style={{ width: "100%", maxWidth: 820, maxHeight: "90vh", overflowY: "auto", background: "var(--c-surface-1,#0E1318)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "var(--r-xl,20px)", padding: "var(--sp-6)", display: "flex", flexDirection: "column", gap: "var(--sp-4)" }} onClick={(e) => e.stopPropagation()}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "var(--sp-3)", alignItems: "flex-start" }}>
                    <div>
                        <div style={{ display: "flex", gap: "var(--sp-2)", flexWrap: "wrap", marginBottom: 10 }}>
                            <span className="pd-pill" style={{ background: "rgba(0,102,255,0.08)", color: "var(--c-electric,#0066FF)" }}>{productCategoryLabel(product.category)}</span>
                            <span className="pd-pill" style={{ background: "rgba(200,255,0,0.08)", color: "var(--c-acid,#C8FF00)" }}>{product.servingSize} {product.servingUnit}</span>
                            {product.brand && <span className="pd-pill" style={{ background: "rgba(255,255,255,0.04)", color: "var(--color-cream)" }}>{product.brand}</span>}
                        </div>
                        <h2 className="heading-md" style={{ color: "var(--color-cream)", margin: 0 }}>{product.name}</h2>
                        <p className="body-sm text-gray" style={{ margin: "8px 0 0", lineHeight: 1.6 }}>{product.description}</p>
                    </div>
                    <button type="button" onClick={onClose} style={{ background: "rgba(255,255,255,0.06)", border: "none", borderRadius: "50%", width: 34, height: 34, cursor: "pointer", color: "var(--color-cream)", fontSize: "1.1rem", flexShrink: 0 }}>×</button>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(130px,1fr))", gap: "var(--sp-3)" }}>
                    <NutritionBox label="Калории" value={`${product.calories} kcal`} />
                    <NutritionBox label="Протеин" value={`${product.protein} г`} />
                    <NutritionBox label="Въглехидрати" value={`${product.carbs} г`} />
                    <NutritionBox label="Мазнини" value={`${product.fat} г`} />
                    <NutritionBox label="Захар" value={product.sugar === null ? "-" : `${product.sugar} г`} />
                    <NutritionBox label="Фибри" value={product.fiber === null ? "-" : `${product.fiber} г`} />
                    <NutritionBox label="Сол" value={product.salt === null ? "-" : `${product.salt} г`} />
                    <NutritionBox label="Баркод" value={product.barcode ?? "-"} />
                </div>
                <div style={{ padding: "var(--sp-4)", borderRadius: "var(--r-lg)", background: "rgba(200,255,0,0.055)", border: "1px solid rgba(200,255,0,0.14)" }}>
                    <div className="label text-gray" style={{ marginBottom: 8 }}>Тагове</div>
                    <div style={{ display: "flex", gap: "var(--sp-2)", flexWrap: "wrap" }}>{product.tags.map((tag) => <span key={tag} className="pd-pill" style={{ background: "rgba(255,255,255,0.05)", color: "var(--color-cream)" }}>{tag}</span>)}</div>
                </div>
                <div className="body-sm text-gray">Добавяне към хранения ще бъде вързано в следващ етап чрез малка форма за количество и POST към `/api/meals`.</div>
                {isAdmin && <div style={{ display: "flex", justifyContent: "flex-end", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "var(--sp-4)" }}><button type="button" className="btn-ghost" onClick={() => onDelete(product.id)} style={{ color: "var(--c-error,#FF3D57)" }}>Изтрий продукта</button></div>}
            </div>
        </div>
    );
}
