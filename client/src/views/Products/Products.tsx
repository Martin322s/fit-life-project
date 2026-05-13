"use client";

import { useState } from "react";
import type { JSX } from "react";
import DashboardSidebar from "../../layout/DashboardLayout/DashboardSidebar";
import { getInitials, useAuth } from "../../context/AuthContext";
import { useProductsData } from "../../hooks/useProductsData";
import { productsApi } from "../../services/productsApi";
import type { ApiProduct } from "../../services/productsApi";
import ProductsHeader from "./sections/ProductsHeader";
import ProductStatCard from "./sections/ProductStatCard";
import ProductGridCard from "./sections/ProductGridCard";
import ProductDetailsModal from "./sections/ProductDetailsModal";
import AddProductModal from "./sections/AddProductModal";
import { productCategoryLabel } from "../../lib/productLabels";

import "./Products.css";

function Products(): JSX.Element {
    const { user } = useAuth();
    const data = useProductsData();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<ApiProduct | null>(null);

    const isAdmin = user?.role === "admin";
    const initials = user ? getInitials(user) : "FL";
    const firstProduct = data.items[0] ?? null;
    const categoryCount = new Set(data.items.map((product) => product.category)).size;
    const avgCalories = data.items.length ? Math.round(data.items.reduce((sum, product) => sum + product.calories, 0) / data.items.length) : 0;
    const avgProtein = data.items.length ? Math.round(data.items.reduce((sum, product) => sum + product.protein, 0) / data.items.length) : 0;

    const handleDelete = async (id: string) => {
        if (!window.confirm("Сигурен ли си, че искаш да изтриеш този продукт?")) return;
        try {
            await productsApi.delete(id);
            setSelectedProduct(null);
            data.refresh();
        } catch (err) {
            console.error("Delete product failed:", err);
        }
    };

    return (
        <>
            {showModal && <AddProductModal onClose={() => setShowModal(false)} onSuccess={data.refresh} />}
            {selectedProduct && <ProductDetailsModal product={selectedProduct} isAdmin={isAdmin} onClose={() => setSelectedProduct(null)} onDelete={handleDelete} />}
            {isSidebarOpen && (
                <div style={{ position: "fixed", inset: 0, zIndex: 299, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)", cursor: "pointer" }} onClick={() => setIsSidebarOpen(false)} />
            )}
            <div className="pd-page">
                <DashboardSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
                <div className="pd-main">
                    <ProductsHeader initials={initials} total={data.total} isAdmin={isAdmin} onToggleSidebar={() => setIsSidebarOpen((o) => !o)} onAddProduct={() => setShowModal(true)} />
                    <div className="pd-content">
                        {data.error && (
                            <div style={{ padding: "var(--sp-3) var(--sp-4)", borderRadius: "var(--r-md)", background: "rgba(255,61,87,0.1)", border: "1px solid rgba(255,61,87,0.25)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--sp-3)" }}>
                                <span className="body-sm" style={{ color: "var(--c-error,#FF3D57)" }}>Грешка при зареждане: {data.error}</span>
                                <button type="button" className="btn-ghost btn-sm" onClick={data.refresh}>Опитай отново</button>
                            </div>
                        )}

                        <div className="pd-top-grid">
                            <ProductStatCard label="Общо продукти" value={data.isLoading ? "-" : String(data.total)} sub="хранителна база" accent={`${data.limit}/стр.`} accentColor="var(--c-electric,#0066FF)" />
                            <ProductStatCard label="Категории" value={data.isLoading ? "-" : String(categoryCount)} sub="на текущата страница" accent="храни" accentColor="var(--c-acid,#C8FF00)" />
                            <ProductStatCard label="Средно kcal" value={data.isLoading ? "-" : String(avgCalories)} sub="за показаните продукти" accent="kcal" accentColor="#00CEC9" />
                            <ProductStatCard label="Среден протеин" value={data.isLoading ? "-" : `${avgProtein} г`} sub="за показаните продукти" accent="P" accentColor="#FFB300" />
                        </div>

                        <div className="pd-main-grid">
                            <div className="card pd-card" style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
                                <div style={{ borderRadius: "var(--r-lg)", background: "linear-gradient(135deg,#0066FF,#00CEC9)", padding: "var(--sp-5)", position: "relative", overflow: "hidden", minHeight: 110 }}>
                                    <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.22)" }} />
                                    <div style={{ position: "relative" }}>
                                        <span className="pd-pill" style={{ background: "rgba(255,255,255,0.18)", color: "#fff" }}>Акцент от базата</span>
                                        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 900, color: "#fff", margin: "10px 0 4px" }}>{firstProduct?.name ?? "Хранителен каталог"}</h2>
                                        <div style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.85rem" }}>{firstProduct ? `${firstProduct.calories} kcal · P ${firstProduct.protein} г · C ${firstProduct.carbs} г · F ${firstProduct.fat} г` : "Разгледай храни и отвори детайли."}</div>
                                    </div>
                                </div>
                                <p className="body-sm" style={{ color: "var(--color-cream)", margin: 0, lineHeight: 1.6 }}>{firstProduct?.description ?? "Продуктите тук са хранителна база с калории и макроси. Магазин, количка и поръчки не са част от този таб."}</p>
                                {firstProduct && (
                                    <div style={{ display: "flex", gap: "var(--sp-2)", flexWrap: "wrap" }}>
                                        <span className="pd-pill" style={{ background: "rgba(0,102,255,0.08)", color: "var(--c-electric,#0066FF)" }}>{productCategoryLabel(firstProduct.category)}</span>
                                        <span className="pd-pill" style={{ background: "rgba(200,255,0,0.08)", color: "var(--c-acid,#C8FF00)" }}>{firstProduct.servingSize} {firstProduct.servingUnit}</span>
                                    </div>
                                )}
                                {firstProduct && <button type="button" className="btn-primary" onClick={() => setSelectedProduct(firstProduct)} style={{ alignSelf: "flex-start" }}>Отвори детайли</button>}
                            </div>
                            <div className="card pd-card" style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
                                <div>
                                    <div className="label text-gray">Как работи</div>
                                    <div className="heading-sm" style={{ color: "var(--color-cream)", marginTop: 4 }}>Хранителна база, не магазин</div>
                                </div>
                                <div className="body-sm text-gray">Този таб показва калории, протеин, въглехидрати и мазнини за хранителни продукти. Добавяне към хранения ще бъде отделен следващ етап.</div>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--sp-3)" }}>
                                    <div style={{ padding: "var(--sp-3)", borderRadius: "var(--r-lg)", background: "rgba(255,255,255,0.025)", border: "1px solid var(--c-border,rgba(255,255,255,0.06))" }}><div className="label text-gray">Резултати</div><div style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 800, color: "var(--color-cream)" }}>{data.items.length}</div></div>
                                    <div style={{ padding: "var(--sp-3)", borderRadius: "var(--r-lg)", background: "rgba(255,255,255,0.025)", border: "1px solid var(--c-border,rgba(255,255,255,0.06))" }}><div className="label text-gray">Страница</div><div style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 800, color: "var(--color-cream)" }}>{data.page}</div></div>
                                </div>
                                {isAdmin && <div className="body-sm text-gray">Администраторите могат да добавят и изтриват продукти. Редакция е налична през API.</div>}
                            </div>
                        </div>

                        <ProductGridCard
                            products={data.items}
                            isLoading={data.isLoading}
                            total={data.total}
                            page={data.page}
                            totalPages={data.totalPages}
                            search={data.search}
                            category={data.category}
                            highProtein={data.highProtein}
                            lowCalorie={data.lowCalorie}
                            lowCarb={data.lowCarb}
                            onSearch={data.setSearch}
                            onCategory={data.setCategory}
                            onHighProtein={data.setHighProtein}
                            onLowCalorie={data.setLowCalorie}
                            onLowCarb={data.setLowCarb}
                            onPage={data.setPage}
                            onOpen={setSelectedProduct}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

export default Products;


