import type { JSX } from "react";
import type { ApiProduct, ProductCategory } from "../../../services/productsApi";
import { PRODUCT_CATEGORY_OPTIONS, productCategoryLabel } from "../../../lib/productLabels";

type Props = {
    products: ApiProduct[];
    isLoading: boolean;
    total: number;
    page: number;
    totalPages: number;
    search: string;
    category: ProductCategory | "";
    highProtein: boolean;
    lowCalorie: boolean;
    lowCarb: boolean;
    onSearch: (value: string) => void;
    onCategory: (value: ProductCategory | "") => void;
    onHighProtein: (value: boolean) => void;
    onLowCalorie: (value: boolean) => void;
    onLowCarb: (value: boolean) => void;
    onPage: (value: number) => void;
    onOpen: (product: ApiProduct) => void;
};

function pageNumbers(page: number, totalPages: number): number[] {
    const start = Math.max(1, Math.min(page - 2, totalPages - 4));
    const end = Math.min(totalPages, start + 4);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

function ProductCard({ product, onOpen }: { product: ApiProduct; onOpen: (product: ApiProduct) => void }): JSX.Element {
    return (
        <button type="button" className="pd-product-card" onClick={() => onOpen(product)}>
            <div className="pd-product-card-info">
                <div style={{ display: "flex", justifyContent: "space-between", gap: "var(--sp-2)", alignItems: "flex-start" }}>
                    <div style={{ minWidth: 0 }}>
                        <div className="body-sm" style={{ color: "var(--color-cream)", fontWeight: 800, lineHeight: 1.3 }}>{product.name}</div>
                        <div className="body-sm text-gray" style={{ marginTop: 5, lineHeight: 1.45 }}>{product.description}</div>
                    </div>
                    <span className="pd-pill" style={{ background: "rgba(255,255,255,0.04)", color: "var(--c-acid,#C8FF00)", flexShrink: 0 }}>{product.calories} kcal</span>
                </div>
                <div style={{ display: "flex", gap: "var(--sp-2)", flexWrap: "wrap", marginTop: "var(--sp-3)" }}>
                    <span className="pd-pill" style={{ background: "rgba(0,102,255,0.08)", color: "var(--c-electric,#0066FF)" }}>{productCategoryLabel(product.category)}</span>
                    <span className="pd-pill" style={{ background: "rgba(200,255,0,0.08)", color: "var(--c-acid,#C8FF00)" }}>{product.servingSize} {product.servingUnit}</span>
                    {product.brand && <span className="pd-pill" style={{ background: "rgba(255,255,255,0.04)", color: "var(--color-cream)" }}>{product.brand}</span>}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "var(--sp-2)", marginTop: "var(--sp-3)" }}>
                    <div style={{ padding: "var(--sp-2)", borderRadius: "var(--r-md)", background: "rgba(255,255,255,0.025)" }}><div className="label text-gray">Протеин</div><div style={{ color: "var(--color-cream)", fontWeight: 800 }}>{product.protein} г</div></div>
                    <div style={{ padding: "var(--sp-2)", borderRadius: "var(--r-md)", background: "rgba(255,255,255,0.025)" }}><div className="label text-gray">Въглех.</div><div style={{ color: "var(--color-cream)", fontWeight: 800 }}>{product.carbs} г</div></div>
                    <div style={{ padding: "var(--sp-2)", borderRadius: "var(--r-md)", background: "rgba(255,255,255,0.025)" }}><div className="label text-gray">Мазнини</div><div style={{ color: "var(--color-cream)", fontWeight: 800 }}>{product.fat} г</div></div>
                </div>
            </div>
        </button>
    );
}

export default function ProductGridCard({ products, isLoading, total, page, totalPages, search, category, highProtein, lowCalorie, lowCarb, onSearch, onCategory, onHighProtein, onLowCalorie, onLowCarb, onPage, onOpen }: Props): JSX.Element {
    return (
        <div className="card pd-card" style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "var(--sp-3)", flexWrap: "wrap" }}>
                <div>
                    <div className="label text-gray">Хранителна база</div>
                    <div className="heading-sm" style={{ color: "var(--color-cream)", marginTop: 4 }}>{total} продукта</div>
                </div>
                <div className="body-sm text-gray">Страница {page} / {totalPages}</div>
            </div>
            <div className="pd-filter-grid">
                <input value={search} onChange={(e) => onSearch(e.target.value)} placeholder="Търси храна, марка или баркод..." style={{ width: "100%", padding: "10px 14px", borderRadius: "var(--r-lg)", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "var(--color-cream)", outline: "none", boxSizing: "border-box" }} />
                <select value={category} onChange={(e) => onCategory(e.target.value as ProductCategory | "")} style={{ padding: "10px 14px", borderRadius: "var(--r-lg)", background: "var(--c-surface-1,#0E1318)", border: "1px solid rgba(255,255,255,0.1)", color: "var(--color-cream)", outline: "none" }}>{PRODUCT_CATEGORY_OPTIONS.map((o) => <option key={o.value || "all"} value={o.value}>{o.label}</option>)}</select>
                <label className="body-sm" style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--color-cream)" }}><input type="checkbox" checked={highProtein} onChange={(e) => onHighProtein(e.target.checked)} /> Висок протеин</label>
                <label className="body-sm" style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--color-cream)" }}><input type="checkbox" checked={lowCalorie} onChange={(e) => onLowCalorie(e.target.checked)} /> Ниско kcal</label>
                <label className="body-sm" style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--color-cream)" }}><input type="checkbox" checked={lowCarb} onChange={(e) => onLowCarb(e.target.checked)} /> Ниско въглех.</label>
            </div>
            {isLoading && <div className="body-sm text-gray" style={{ padding: "var(--sp-6)", textAlign: "center" }}>Зареждане на продукти...</div>}
            {!isLoading && products.length === 0 && <div className="body-sm text-gray" style={{ padding: "var(--sp-6)", textAlign: "center" }}>Няма продукти по тези критерии.</div>}
            {!isLoading && products.length > 0 && <div className="pd-catalog-grid">{products.map((product) => <ProductCard key={product.id} product={product} onOpen={onOpen} />)}</div>}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "var(--sp-2)", flexWrap: "wrap" }}>
                <button type="button" className="btn-ghost btn-sm" disabled={page <= 1} onClick={() => onPage(page - 1)}>Назад</button>
                {pageNumbers(page, totalPages).map((n) => <button key={n} type="button" className={n === page ? "btn-primary btn-sm" : "btn-ghost btn-sm"} onClick={() => onPage(n)}>{n}</button>)}
                <button type="button" className="btn-ghost btn-sm" disabled={page >= totalPages} onClick={() => onPage(page + 1)}>Напред</button>
            </div>
        </div>
    );
}
