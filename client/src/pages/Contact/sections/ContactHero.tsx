import type { JSX } from "react";
import { Link } from "react-router-dom";

function ContactHero(): JSX.Element {
    return (
        <section className="contact-hero">
            <div className="container">
                <div className="page-hero-breadcrumb">
                    <Link to="/">Начало</Link>
                    <span>›</span>
                    <span style={{ color: "var(--color-cream)" }}>Контакти</span>
                </div>

                <span className="section-tag">✦ Свържи се с нас</span>

                <h1
                    className="display-md"
                    style={{
                        marginBottom: "var(--space-md)",
                        maxWidth: 580,
                        marginLeft: "auto",
                        marginRight: "auto",
                    }}
                >
                    Тук сме, за да
                    <br />
                    <span className="text-mustard">помогнем</span>
                </h1>

                <p
                    className="body-md text-gray"
                    style={{ maxWidth: 480, margin: "0 auto" }}
                >
                    Въпрос, предложение или просто искаш да кажеш здравей?
                    Пиши ни — отговаряме до 24 часа в работни дни.
                </p>

                <div
                    style={{
                        display: "flex",
                        gap: "var(--space-md)",
                        justifyContent: "center",
                        marginTop: "var(--space-lg)",
                        flexWrap: "wrap",
                    }}
                >
                    <span className="badge badge-mustard">⚡ Отговор до 24ч</span>
                    <span className="badge badge-olive">🌍 Работим от ЕС</span>
                    <span className="badge badge-navy">🔒 Поверително</span>
                </div>
            </div>
        </section>
    );
}

export default ContactHero;
