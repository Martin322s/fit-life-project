import type { JSX } from "react";

type Category = {
    id: string;
    icon: string;
    label: string;
};

type FaqSidebarProps = {
    categories: Category[];
    activeCategory: string;
    onCategoryChange: (id: string) => void;
};

function FaqSidebar({ categories, activeCategory, onCategoryChange }: FaqSidebarProps): JSX.Element {
    return (
        <aside className="faq-sidebar">
            <div
                className="label text-gray"
                style={{ marginBottom: "var(--space-md)", padding: "0 var(--space-sm)" }}
            >
                Категории
            </div>
            <div className="faq-category-list">
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        type="button"
                        className={`faq-category-btn${activeCategory === cat.id ? " active" : ""}`}
                        onClick={() => onCategoryChange(cat.id)}
                    >
                        {cat.icon} {cat.label}
                    </button>
                ))}
            </div>
        </aside>
    );
}

export default FaqSidebar;
