import type { JSX } from "react";
import { Link } from "react-router-dom";

type FaqHeroProps = {
    searchQuery: string;
    onSearchChange: (value: string) => void;
};

function FaqHero({ searchQuery, onSearchChange }: FaqHeroProps): JSX.Element {
    return (
        <section className="faq-hero">
            <div className="container">
                <div className="page-hero-breadcrumb">
                    <Link to="/">Начало</Link>
                    <span>›</span>
                    <span style={{ color: "var(--color-cream)" }}>FAQ</span>
                </div>

                <span className="section-tag">✦ Помощен център</span>

                <h1 className="display-md" style={{ marginBottom: "var(--space-md)" }}>
                    Как можем да <span className="text-mustard">помогнем?</span>
                </h1>

                <p className="body-md text-gray">Намери отговор на най-честите въпроси за FitLife.</p>

                <div className="faq-search-wrapper">
                    <span className="faq-search-icon">
                        <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.35-4.35" />
                        </svg>
                    </span>
                    <input
                        type="text"
                        className="faq-search-input"
                        placeholder='Търси въпрос... (напр. "калкулатор")'
                        autoComplete="off"
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>
            </div>
        </section>
    );
}

export default FaqHero;
