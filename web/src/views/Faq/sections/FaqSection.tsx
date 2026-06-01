import type { JSX, ReactNode } from "react";
import FaqItem from "./FaqItem";

type FaqEntry = {
    id: string;
    question: string;
    answer: ReactNode;
};

type FaqSectionProps = {
    sectionId: string;
    icon: string;
    label: string;
    items: FaqEntry[];
    openItemId: string | null;
    onToggle: (id: string) => void;
};

function FaqSection({ sectionId, icon, label, items, openItemId, onToggle }: FaqSectionProps): JSX.Element {
    return (
        <>
            <div className="faq-section-title" data-section={sectionId}>
                {icon} {label}
            </div>
            {items.map((item) => (
                <FaqItem
                    key={item.id}
                    question={item.question}
                    answer={item.answer}
                    isOpen={openItemId === item.id}
                    onToggle={() => onToggle(item.id)}
                />
            ))}
        </>
    );
}

export default FaqSection;
