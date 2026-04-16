import { useState } from "react";
import type { JSX } from "react";
import DashboardSidebar from "../../layout/DashboardLayout/DashboardSidebar";
import { PRODUCTS_STATS, PRODUCTS } from "./sections/productsData";
import type { Product } from "./sections/productsData";
import ProductsHeader from "./sections/ProductsHeader";
import ProductStatCard from "./sections/ProductStatCard";
import ProductCatalogCard from "./sections/ProductCatalogCard";
import ProductDetailCard from "./sections/ProductDetailCard";
import NutritionCompareCard from "./sections/NutritionCompareCard";
import FavoritesCard from "./sections/FavoritesCard";

type ProductsProps = { theme: "dark" | "light"; onToggleTheme: () => void };

const PD_CSS = `
.dash-sidebar { position: sticky; top: 0; height: 100vh; overflow-y: auto; flex-shrink: 0; }
.dash-sidebar-close { display: none !important; }
.pd-page { display: flex; min-height: 100vh; background: var(--c-bg,#080C10); overflow-x: clip; }
.pd-main { flex: 1; min-width: 0; display: flex; flex-direction: column; overflow: auto; overflow-x: hidden; }
.pd-content { padding: var(--sp-5) var(--sp-6); display: flex; flex-direction: column; gap: var(--sp-4); }
.pd-header { padding: var(--sp-4) var(--sp-6); border-bottom: 1px solid var(--c-border,rgba(255,255,255,0.06)); display: flex; justify-content: space-between; align-items: center; gap: var(--sp-3); background: var(--c-surface-1,#0E1318); }
.pd-header-right { display: flex; align-items: center; gap: var(--sp-3); flex-shrink: 0; }
.pd-avatar { width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg,var(--c-electric,#0066FF),var(--c-acid,#C8FF00)); display: flex; align-items: center; justify-content: center; font-family: var(--font-display); font-size: 0.8rem; font-weight: 700; color: var(--c-bg,#080C10); flex-shrink: 0; }
.pd-hamburger { display: none; }
.pd-title { font-family: var(--font-display); font-size: 1.5rem; font-weight: 800; color: var(--color-cream); line-height: 1.15; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.pd-header-sub { margin-top: 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.pd-scan-btn { display: flex; align-items: center; gap: var(--sp-2); padding: 8px 14px; border-radius: var(--r-md); background: rgba(0,102,255,0.1); border: 1px solid rgba(0,102,255,0.25); color: var(--c-electric,#0066FF); font-size: 0.82rem; font-weight: 700; cursor: pointer; transition: all 0.15s; white-space: nowrap; flex-shrink: 0; }
.pd-scan-btn:hover { background: rgba(0,102,255,0.18); }
.pd-top-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: var(--sp-3); }
.pd-main-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--sp-4); align-items: start; }
.pd-bottom-grid { display: grid; grid-template-columns: 1.4fr 1fr; gap: var(--sp-4); align-items: start; }
.pd-card { padding: var(--sp-5); }
.pd-pill { padding: 5px 10px; border-radius: 999px; font-size: 0.72rem; letter-spacing: 0.03em; font-weight: 700; }
.pd-catalog-grid { display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap: var(--sp-3); }
@media (max-width: 1400px) {
  .pd-catalog-grid { grid-template-columns: repeat(3, minmax(0,1fr)); }
}
@media (max-width: 1250px) {
  .pd-top-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .pd-main-grid { grid-template-columns: 1fr; }
  .pd-bottom-grid { grid-template-columns: 1fr; }
  .pd-catalog-grid { grid-template-columns: repeat(3, minmax(0,1fr)); }
}
@media (max-width: 768px) {
  .dash-sidebar {
    position: fixed; left: 0; top: 0; bottom: 0; height: 100%;
    z-index: 300; transform: translateX(-100%);
    transition: transform 0.28s cubic-bezier(0.4,0,0.2,1);
  }
  .dash-sidebar.dash-sidebar--open {
    transform: translateX(0);
    box-shadow: 8px 0 48px rgba(0,0,0,0.85);
  }
  .dash-sidebar-close { display: flex !important; }
  .pd-hamburger {
    display: flex; align-items: center; justify-content: center;
    background: transparent; border: 1px solid rgba(255,255,255,0.1);
    border-radius: 8px; padding: 8px 10px; cursor: pointer;
    color: var(--color-cream); flex-shrink: 0;
  }
  .pd-header { padding: var(--sp-3) var(--sp-4); }
  .pd-content { padding: var(--sp-3) var(--sp-4); }
  .pd-title { font-size: 1rem !important; }
  .pd-header-sub { display: none; }
  .pd-avatar { display: none; }
  .pd-top-grid { grid-template-columns: 1fr 1fr; }
  .pd-catalog-grid { grid-template-columns: repeat(2, minmax(0,1fr)); }
}
@media (max-width: 480px) {
  .pd-top-grid { grid-template-columns: 1fr; }
  .pd-card { padding: var(--sp-4); }
  .pd-catalog-grid { grid-template-columns: 1fr 1fr; }
}
`;

function Products({ theme, onToggleTheme }: ProductsProps): JSX.Element {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(PRODUCTS[0]);

    function handleAddToLog(_p: Product, _g: number) {
        // In a real app this would persist to the food diary
    }

    return (
        <>
            <style>{PD_CSS}</style>
            {isSidebarOpen && (
                <div
                    style={{ position: "fixed", inset: 0, zIndex: 299, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)", cursor: "pointer" }}
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
            <div className="pd-page">
                <DashboardSidebar theme={theme} onToggleTheme={onToggleTheme} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
                <div className="pd-main">
                    <ProductsHeader
                        onToggleSidebar={() => setIsSidebarOpen((o) => !o)}
                        onScan={() => {}}
                    />
                    <div className="pd-content">

                        {/* Row 1 — 4 stat cards */}
                        <div className="pd-top-grid">
                            <ProductStatCard label="Продукта в базата" value={PRODUCTS_STATS.totalProducts.toLocaleString()} sub="хранителна база данни" accent="↑ 120 нови" accentColor="var(--c-acid,#C8FF00)" />
                            <ProductStatCard label="Категории" value={String(PRODUCTS_STATS.categories)} sub="типа храни и напитки" accent="пълно покритие" accentColor="rgba(255,255,255,0.3)" />
                            <ProductStatCard label="Прегледани днес" value={String(PRODUCTS_STATS.scannedToday)} sub="продукта разгледани" accent="днес" accentColor="var(--c-electric,#0066FF)" />
                            <ProductStatCard label="Любими" value={String(PRODUCTS_STATS.favorites)} sub="запазени продукта" accent="❤️" accentColor="#FF5D73" />
                        </div>

                        {/* Row 2 — Catalog (left) + Detail (right) */}
                        <div className="pd-main-grid">
                            <ProductCatalogCard
                                onSelect={(p) => setSelectedProduct(p)}
                                selectedId={selectedProduct?.id ?? null}
                            />
                            <ProductDetailCard
                                product={selectedProduct}
                                onAddToLog={handleAddToLog}
                            />
                        </div>

                        {/* Row 3 — Compare + Favorites */}
                        <div className="pd-bottom-grid">
                            <NutritionCompareCard />
                            <FavoritesCard
                                onSelect={(p) => setSelectedProduct(p)}
                                selectedId={selectedProduct?.id ?? null}
                            />
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}

export default Products;
