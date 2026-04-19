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

import "./Products.css";

type ProductsProps = { theme: "dark" | "light"; onToggleTheme: () => void };

function Products({ theme, onToggleTheme }: ProductsProps): JSX.Element {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(PRODUCTS[0]);
    const [notice, setNotice] = useState("");

    function handleAddToLog(p: Product, g: number) {
        const existing = window.localStorage.getItem("fitlife-food-log");
        const log = existing ? (JSON.parse(existing) as { id: string; grams: number; addedAt: string }[]) : [];
        log.unshift({ id: p.id, grams: g, addedAt: new Date().toISOString() });
        window.localStorage.setItem("fitlife-food-log", JSON.stringify(log.slice(0, 50)));
        setNotice(`${p.name} (${g}г) е добавен локално към дневника.`);
    }

    return (
        <>
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
                        onScan={() => setNotice("Barcode scan flow е подготвен client-side. След сървърната част ще вържем реално разчитане и търсене.")}
                    />
                    <div className="pd-content">
                        {notice && (
                            <div className="card pd-card" style={{ padding: "14px 16px", background: "rgba(0,102,255,0.08)", border: "1px solid rgba(0,102,255,0.18)", color: "var(--color-cream)" }}>
                                {notice}
                            </div>
                        )}

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
