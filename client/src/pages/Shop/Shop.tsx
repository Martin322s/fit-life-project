import { useState } from "react";
import type { JSX } from "react";
import DashboardSidebar from "../../layout/DashboardLayout/DashboardSidebar";
import ProductStatCard from "../Products/sections/ProductStatCard";
import ShopHeader from "./sections/ShopHeader";
import FeaturedBundlesCard from "./sections/FeaturedBundlesCard";
import StoreCatalogCard from "./sections/StoreCatalogCard";
import CartSummaryCard from "./sections/CartSummaryCard";
import { STORE_STATS } from "./sections/shopData";
import useLocalStorageState from "../../hooks/useLocalStorageState";

type ShopProps = { theme: "dark" | "light"; onToggleTheme: () => void };

const SD_CSS = `
.dash-sidebar { position: sticky; top: 0; height: 100vh; overflow-y: auto; flex-shrink: 0; }
.dash-sidebar-close { display: none !important; }
.sd-page { display: flex; min-height: 100vh; background: var(--c-bg,#080C10); overflow-x: clip; }
.sd-main { flex: 1; min-width: 0; display: flex; flex-direction: column; overflow: auto; overflow-x: hidden; }
.sd-content { padding: var(--sp-5) var(--sp-6); display: flex; flex-direction: column; gap: var(--sp-4); }
.sd-header { padding: var(--sp-4) var(--sp-6); border-bottom: 1px solid var(--c-border,rgba(255,255,255,0.06)); display: flex; justify-content: space-between; align-items: center; gap: var(--sp-3); background: var(--c-surface-1,#0E1318); }
.sd-header-right { display: flex; align-items: center; gap: var(--sp-3); flex-shrink: 0; }
.sd-avatar { width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg,var(--c-electric,#0066FF),var(--c-acid,#C8FF00)); display: flex; align-items: center; justify-content: center; font-family: var(--font-display); font-size: 0.8rem; font-weight: 700; color: var(--c-bg,#080C10); flex-shrink: 0; }
.sd-hamburger { display: none; }
.sd-title { font-family: var(--font-display); font-size: 1.5rem; font-weight: 800; color: var(--color-cream); line-height: 1.15; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.sd-header-sub { margin-top: 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-transform: capitalize; }
.sd-cart-btn { display: flex; align-items: center; gap: var(--sp-2); padding: 8px 14px; border-radius: var(--r-md); background: rgba(0,102,255,0.1); border: 1px solid rgba(0,102,255,0.25); color: var(--c-electric,#0066FF); font-size: 0.82rem; font-weight: 700; cursor: pointer; transition: all 0.15s; white-space: nowrap; flex-shrink: 0; }
.sd-cart-btn:hover { background: rgba(0,102,255,0.18); }
.sd-top-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: var(--sp-3); }
.sd-main-grid { display: grid; grid-template-columns: 1.05fr 1fr; gap: var(--sp-4); align-items: start; }
.sd-bottom-grid { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: var(--sp-4); align-items: start; }
.sd-card { padding: var(--sp-5); box-sizing: border-box; min-width: 0; }
.sd-pill { padding: 5px 10px; border-radius: 999px; font-size: 0.72rem; letter-spacing: 0.03em; font-weight: 700; }
.sd-bundle-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--sp-3); }
.sd-tab-row { display: flex; gap: var(--sp-2); overflow-x: auto; padding-bottom: 2px; }
.sd-store-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--sp-3); min-width: 0; }
.sd-store-item { display: flex; flex-direction: column; gap: var(--sp-3); padding: var(--sp-4); border-radius: var(--r-xl); background: rgba(255,255,255,0.02); border: 1px solid var(--c-border,rgba(255,255,255,0.06)); min-width: 0; box-sizing: border-box; }
@media (max-width: 1350px) {
  .sd-top-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .sd-main-grid { grid-template-columns: 1fr; }
}
@media (max-width: 1100px) {
  .sd-bottom-grid { grid-template-columns: 1fr; }
  .sd-store-grid { grid-template-columns: 1fr; }
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
  .sd-hamburger {
    display: flex; align-items: center; justify-content: center;
    background: transparent; border: 1px solid rgba(255,255,255,0.1);
    border-radius: 8px; padding: 8px 10px; cursor: pointer;
    color: var(--color-cream); flex-shrink: 0;
  }
  .sd-header { padding: var(--sp-3) var(--sp-4); }
  .sd-content { padding: var(--sp-3) var(--sp-4); }
  .sd-title { font-size: 1rem !important; }
  .sd-header-sub { display: none; }
  .sd-avatar { display: none; }
  .sd-cart-btn span { display: none; }
  .sd-top-grid { grid-template-columns: 1fr 1fr; }
  .sd-bundle-grid { grid-template-columns: 1fr; }
}
@media (max-width: 480px) {
  .sd-top-grid { grid-template-columns: 1fr; }
  .sd-card { padding: var(--sp-4); }
  .sd-store-item { padding: 12px; }
}
`;

function Shop({ theme, onToggleTheme }: ShopProps): JSX.Element {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [cartItems, setCartItems] = useLocalStorageState<{ id: string; qty: number }[]>("fitlife-shop-cart", [
        { id: "impact-whey", qty: 1 },
        { id: "shaker-pro", qty: 1 },
    ]);
    const [checkoutNotice, setCheckoutNotice] = useState("");

    function handleAddToCart(id: string) {
        setCartItems((prev) => {
            const existing = prev.find((item) => item.id === id);
            if (existing) {
                return prev.map((item) => item.id === id ? { ...item, qty: item.qty + 1 } : item);
            }
            return [...prev, { id, qty: 1 }];
        });
        setCheckoutNotice("Продуктът е добавен в количката.");
    }

    function handleChangeQty(id: string, delta: number) {
        setCartItems((prev) =>
            prev
                .map((item) => item.id === id ? { ...item, qty: item.qty + delta } : item)
                .filter((item) => item.qty > 0),
        );
    }

    function handleCheckout() {
        setCheckoutNotice("Checkout flow е подготвен локално. След сървърната част ще свържем реално плащане и поръчка.");
    }

    return (
        <>
            <style>{SD_CSS}</style>
            {isSidebarOpen && (
                <div
                    style={{ position: "fixed", inset: 0, zIndex: 299, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)", cursor: "pointer" }}
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
            <div className="sd-page">
                <DashboardSidebar theme={theme} onToggleTheme={onToggleTheme} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
                <div className="sd-main">
                    <ShopHeader onToggleSidebar={() => setIsSidebarOpen((open) => !open)} onOpenCart={() => setCheckoutNotice("Количката е отворена по-долу в summary панела.")} />

                    <div className="sd-content">
                        {checkoutNotice && (
                            <div className="card sd-card" style={{ padding: "14px 16px", background: "rgba(0,102,255,0.08)", border: "1px solid rgba(0,102,255,0.18)", color: "var(--color-cream)" }}>
                                {checkoutNotice}
                            </div>
                        )}
                        <div className="sd-top-grid">
                            <ProductStatCard label="Активни оферти" value={String(STORE_STATS.activeDeals)} sub="седмични промо предложения" accent="live" accentColor="var(--c-acid,#C8FF00)" />
                            <ProductStatCard label="Експресна доставка" value={STORE_STATS.fastDelivery} sub="за София и големите градове" accent="без чакане" accentColor="var(--c-electric,#0066FF)" />
                            <ProductStatCard label="Партньорски марки" value={String(STORE_STATS.topBrands)} sub="подбрани спортни и health брандове" accent="trusted" accentColor="rgba(255,255,255,0.45)" />
                            <ProductStatCard label="Среден рейтинг" value={STORE_STATS.avgRating} sub="от реални клиентски поръчки" accent="проверени мнения" accentColor="var(--c-acid,#C8FF00)" />
                        </div>

                        <div className="sd-main-grid">
                            <FeaturedBundlesCard />
                            <CartSummaryCard cartItems={cartItems} onChangeQty={handleChangeQty} onCheckout={handleCheckout} />
                        </div>

                        <div className="sd-bottom-grid">
                            <StoreCatalogCard onAddToCart={handleAddToCart} />
                            <div className="card sd-card" style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
                                <div>
                                    <div className="label text-gray">Покупка с увереност</div>
                                    <div className="heading-sm" style={{ color: "var(--color-cream)", marginTop: 4 }}>Защо store tab-ът работи добре</div>
                                </div>

                                <div style={{ display: "grid", gap: "var(--sp-3)" }}>
                                    {[
                                        ["Безплатна доставка", "за поръчки над 79 лв и автоматична калкулация в количката"],
                                        ["Подбрани продукти", "само категории, които се връзват с калории, рецепти и тренировки"],
                                        ["Ясни наличности", "статус за stock и доставка директно в каталога"],
                                    ].map(([title, text]) => (
                                        <div key={title} style={{ padding: "12px", borderRadius: "var(--r-lg)", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                                            <div className="body-sm" style={{ color: "var(--color-cream)", fontWeight: 700 }}>{title}</div>
                                            <div className="label text-gray" style={{ marginTop: 6, lineHeight: 1.5 }}>{text}</div>
                                        </div>
                                    ))}
                                </div>

                                <div style={{ borderRadius: "var(--r-xl)", padding: "var(--sp-4)", background: "linear-gradient(135deg,rgba(0,102,255,0.16),rgba(200,255,0,0.12))", border: "1px solid rgba(0,102,255,0.18)" }}>
                                    <div className="label" style={{ color: "var(--c-electric,#0066FF)" }}>FitLife+</div>
                                    <div style={{ fontFamily: "var(--font-display)", fontSize: "1.35rem", fontWeight: 900, color: "var(--color-cream)", marginTop: 6 }}>Членски отстъпки до 12%</div>
                                    <div className="body-sm text-gray" style={{ marginTop: 8 }}>Свързваме магазина с персоналния ти режим, за да виждаш по-релевантни предложения.</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Shop;
