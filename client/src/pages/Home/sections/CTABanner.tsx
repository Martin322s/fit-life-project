import type { JSX } from "react";
import { Link } from "react-router-dom";

function CTABanner(): JSX.Element {
    return (
        <section className="cta-banner" id="cta">
            <div className="container">
                <div className="cta-banner-inner">
                    <span className="section-tag">⚡ Без кредитна карта</span>
                    <h2 className="display-md" style={{ marginBottom: "var(--space-md)" }}>
                        Готов ли си да промениш
                        <br />
                        <span className="text-mustard">отношението си към тялото?</span>
                    </h2>
                    <p
                        className="body-md text-gray"
                        style={{ maxWidth: 480, margin: "0 auto" }}
                    >
                        Присъедини се към над 12 000 потребители, които вече следят здравето си
                        с FitLife. Напълно безплатно за начало.
                    </p>
                    <div className="cta-banner-actions">
                        <Link to="/register" className="btn-primary btn-lg">
                            Регистрирай се безплатно
                        </Link>
                        <Link to="/about" className="btn-secondary btn-lg">
                            Научи повече за нас
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default CTABanner;