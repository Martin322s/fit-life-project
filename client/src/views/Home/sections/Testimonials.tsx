import type { JSX } from "react";

function TestimonialsSection(): JSX.Element {
    return (
        <section className="testimonials" id="testimonials">
            <div className="container">
                <div className="section-header text-center">
                    <span className="section-tag">✦ Отзиви</span>
                    <h2 className="display-md" style={{ marginBottom: "var(--space-md)" }}>
                        Какво казват
                        <br />
                        <span className="text-mustard">нашите потребители</span>
                    </h2>
                </div>
                <div className="testimonials-grid">
                    <div className="testimonial-card">
                        <div className="testimonial-stars">★★★★★</div>
                        <p className="testimonial-quote">
                            "За 3 месеца свалих 8 кг, следейки теглото всеки ден. Графиките ме
                            мотивираха невероятно — виждаш прогреса нагледно."
                        </p>
                        <div className="testimonial-author">
                            <div className="testimonial-avatar">МГ</div>
                            <div>
                                <div className="testimonial-name">Мария Георгиева</div>
                                <div className="testimonial-role">Потребителка от 8 месеца</div>
                            </div>
                        </div>
                    </div>
                    <div className="testimonial-card">
                        <div className="testimonial-stars">★★★★★</div>
                        <p className="testimonial-quote">
                            "Калкулаторът за TDEE е изключително точен. Следвам препоръките за
                            калории и резултатите дойдоха много по-бързо от очакваното."
                        </p>
                        <div className="testimonial-author">
                            <div
                                className="testimonial-avatar"
                                style={{ background: "linear-gradient(135deg, #2C5282, #4A5C2F)" }}
                            >
                                ИП
                            </div>
                            <div>
                                <div className="testimonial-name">Иван Петров</div>
                                <div className="testimonial-role">Качване на маса, 6 месеца</div>
                            </div>
                        </div>
                    </div>
                    <div className="testimonial-card">
                        <div className="testimonial-stars">★★★★★</div>
                        <p className="testimonial-quote">
                            "Базата с рецепти е огромна и всяка има пълни макроси. Вече не се
                            налага да смятам ръчно — просто избирам рецепта и готово."
                        </p>
                        <div className="testimonial-author">
                            <div
                                className="testimonial-avatar"
                                style={{ background: "linear-gradient(135deg, #C8A832, #6B7F45)" }}
                            >
                                СД
                            </div>
                            <div>
                                <div className="testimonial-name">Стефани Димова</div>
                                <div className="testimonial-role">Поддържане на тегло, 1 г.</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default TestimonialsSection;