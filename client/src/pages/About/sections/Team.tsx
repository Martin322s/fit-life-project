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
                <div
                    className="team-grid"
                    style={{
                        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 320px))",
                        justifyContent: "center",
                    }}
                >
                    <div className="team-card">
                        <div className="team-avatar"><img src="/profile.jpg" alt="profile" /></div>
                        <div className="team-name">Мартин Софрониев</div>
                        <div className="team-role">Founder &amp; CEO</div>
                        <p className="team-bio">
                            Софтуерен инженер с реален опит в проследяване на прогрес и трансформация.
                            Създава FitLife като инструмент за контрол, дисциплина и резултати.
                            Фокусира се върху изграждане на интелигентна платформа, която превръща данните в реални действия и устойчив начин на живот.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Team;