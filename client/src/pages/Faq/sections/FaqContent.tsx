import type { JSX, ReactNode } from "react";
import { Link } from "react-router-dom";
import FaqSection from "./FaqSection";

type FaqEntry = {
    id: string;
    category: string;
    question: string;
    answer: ReactNode;
};

type FaqSectionMeta = {
    id: string;
    icon: string;
    label: string;
};

type FaqContentProps = {
    sections: FaqSectionMeta[];
    faqItems: FaqEntry[];
    activeCategory: string;
    openItemId: string | null;
    onToggle: (id: string) => void;
    searchQuery: string;
};

function FaqContent({ sections, faqItems, activeCategory, openItemId, onToggle, searchQuery }: FaqContentProps): JSX.Element {
    const filteredItems = faqItems.filter((item) => {
        const matchesCategory = activeCategory === "all" || item.category === activeCategory;
        const matchesSearch =
            searchQuery === "" || item.question.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const visibleSections = sections.filter(
        (section) =>
            (activeCategory === "all" || activeCategory === section.id) &&
            filteredItems.some((item) => item.category === section.id),
    );

    return (
        <main className="faq-content" id="faqContent">
            {visibleSections.length === 0 ? (
                <p className="body-md text-gray" style={{ padding: "var(--space-lg) 0" }}>
                    Няма резултати за „{searchQuery}".
                </p>
            ) : (
                visibleSections.map((section) => (
                    <FaqSection
                        key={section.id}
                        sectionId={section.id}
                        icon={section.icon}
                        label={section.label}
                        items={filteredItems.filter((item) => item.category === section.id)}
                        openItemId={openItemId}
                        onToggle={onToggle}
                    />
                ))
            )}

            <div className="alert alert-info" style={{ marginTop: "var(--space-xl)" }}>
                <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    style={{ flexShrink: 0, marginTop: 2 }}
                >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 16v-4M12 8h.01" />
                </svg>
                <div>
                    <div style={{ fontWeight: 600, marginBottom: 4 }}>Не намери отговор?</div>
                    <div>
                        Пиши ни директно —{" "}
                        <Link
                            to="/contact"
                            style={{ color: "var(--color-mustard)", textDecoration: "underline" }}
                        >
                            свържи се с нас
                        </Link>{" "}
                        и ще ти отговорим до 24 часа.
                    </div>
                </div>
            </div>
        </main>
    );
}

export default FaqContent;
