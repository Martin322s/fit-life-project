import type { JSX } from "react";

function Team(): JSX.Element {
    return (
        <section className="about-team" style={{ padding: "var(--space-3xl) 0" }}>
            <div className="container">
                <div className="section-header text-center">
                    <span className="section-tag">✦ Екипът</span>
                    <h2 className="display-md" style={{ marginBottom: "var(--space-md)" }}>
                        Хората зад <span className="text-mustard">FitLife</span>
                    </h2>
                    <p
                        className="body-md text-gray"
                        style={{ maxWidth: 500, margin: "0 auto" }}
                    >
                        Малък, но страстен екип от разработчици, диетолози и дизайнери,
                        обединени от обща цел.
                    </p>
                </div>
                <div className="team-grid">
                    <div className="team-card">
                        <div className="team-avatar">АС</div>
                        <div className="team-name">Александър Стоянов</div>
                        <div className="team-role">Co-founder &amp; CEO</div>
                        <p className="team-bio">
                            Бивш спортист и софтуерен инженер. Създаде FitLife след 5 години лично
                            проследяване в Excel.
                        </p>
                    </div>
                    <div className="team-card">
                        <div
                            className="team-avatar"
                            style={{ background: "linear-gradient(135deg,#2C5282,#4A5C2F)" }}
                        >
                            НВ
                        </div>
                        <div className="team-name">Николета Василева</div>
                        <div className="team-role">Head of Nutrition</div>
                        <p className="team-bio">
                            Регистриран диетолог с 8 г. клиничен опит. Отговаря за точността на
                            всички формули и рецепти.
                        </p>
                    </div>
                    <div className="team-card">
                        <div
                            className="team-avatar"
                            style={{ background: "linear-gradient(135deg,#C8A832,#0D1B2A)" }}
                        >
                            МТ
                        </div>
                        <div className="team-name">Мартин Тодоров</div>
                        <div className="team-role">Lead Developer</div>
                        <p className="team-bio">
                            Full-stack разработчик с фокус върху performance и user experience.
                            Архитект на платформата.
                        </p>
                    </div>
                    <div className="team-card">
                        <div
                            className="team-avatar"
                            style={{ background: "linear-gradient(135deg,#6B7F45,#C8A832)" }}
                        >
                            ЕИ
                        </div>
                        <div className="team-name">Елена Иванова</div>
                        <div className="team-role">UX / Product Design</div>
                        <p className="team-bio">
                            Product designer с 6 г. опит в здравни приложения. Вярва, че добрият
                            дизайн е невидим.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Team;