import type { JSX } from "react";
import { Link } from "react-router-dom";

function FaqTeaserBanner(): JSX.Element {
    return (
        <div style={{ padding: "var(--space-2xl) 0", borderTop: "1px solid var(--color-border)" }}>
            <div className="container">
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: "var(--space-lg)",
                    }}
                >
                    <div>
                        <div className="heading-sm" style={{ marginBottom: 4 }}>
                            Прегледа ли нашите FAQ?
                        </div>
                        <p className="body-sm text-gray">
                            Може би отговорът вече е там — проверихме най-честите въпроси.
                        </p>
                    </div>
                    <Link to="/faq" className="btn-ghost">
                        Разгледай FAQ
                        <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2.5}
                        >
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default FaqTeaserBanner;
