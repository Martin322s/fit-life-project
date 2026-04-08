import type { JSX, ReactNode } from "react";

type FaqItemProps = {
    question: string;
    answer: ReactNode;
    isOpen: boolean;
    onToggle: () => void;
};

function FaqItem({ question, answer, isOpen, onToggle }: FaqItemProps): JSX.Element {
    return (
        <div className={`faq-item${isOpen ? " open" : ""}`}>
            <button type="button" className="faq-question" onClick={onToggle}>
                {question}
                <svg
                    className="faq-chevron"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                >
                    <path d="M6 9l6 6 6-6" />
                </svg>
            </button>
            <div className="faq-answer">
                <div className="faq-answer-inner">{answer}</div>
            </div>
        </div>
    );
}

export default FaqItem;
