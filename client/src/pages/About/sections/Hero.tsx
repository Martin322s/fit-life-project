import type { JSX } from "react";

function Hero(): JSX.Element {
    return (
        <section className="about-hero">
            <div className="container">
                <div className="page-hero-breadcrumb">
                    <a href="index-v2.html">Начало</a>
                    <span>›</span>
                    <span style={{ color: "var(--color-cream)" }}>За нас</span>
                </div>
                <span className="section-tag">✦ Нашата история</span>
                <h1
                    className="display-lg"
                    style={{
                        marginBottom: "var(--space-lg)",
                        maxWidth: 700,
                        marginLeft: "auto",
                        marginRight: "auto"
                    }}
                >
                    Създадено от хора,
                    <br />
                    <span className="text-mustard">които са минали пътя</span>
                </h1>
                <p
                    className="body-lg text-gray"
                    style={{ maxWidth: 560, margin: "0 auto" }}
                >
                    FitLife се роди от реална нужда — да имаш прост, честен инструмент, който
                    следи прогреса ти без излишна сложност или скрити такси.
                </p>
            </div>
        </section>
    );
}

export default Hero;