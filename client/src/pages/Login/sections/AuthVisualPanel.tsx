import type { JSX } from "react";
import { Link } from "react-router-dom";

const FEATURES = [
    "Персонализиран дневен калориен план",
    "Пълна история на теглото с графики",
    "300+ рецепти с верифицирани макроси",
    "BMI и TDEE изчислени за теб",
];

const STATS = [
    { val: "12 400+", lbl: "Активни потребители" },
    { val: "4.9 ★", lbl: "Средна оценка" },
    { val: "Безплатно", lbl: "Без скрити такси" },
];

function AuthVisualPanel(): JSX.Element {
    return (
        <aside className="login-visual" aria-hidden="true">
            <div className="login-visual-acid" />

            <div className="login-visual-top">
                <Link to="/" className="navbar-logo">
                    <div className="navbar-logo-icon">⚡</div>
                    <span className="navbar-logo-text">
                        Fit<span>Life</span>
                    </span>
                </Link>
            </div>

            <div className="login-visual-content">
                <h2 className="login-visual-headline">
                    Данни.
                    <br />
                    <span className="accent">Цели.</span>
                    <br />
                    <span className="acid">Резултати.</span>
                </h2>

                <p className="login-visual-desc">
                    Влез в акаунта си и продължи напред. Всичките ти данни те чакат точно там, където
                    ги остави.
                </p>

                <div className="login-features">
                    {FEATURES.map((feature) => (
                        <div key={feature} className="login-feature-item">
                            <span className="login-feature-check">✓</span>
                            {feature}
                        </div>
                    ))}
                </div>
            </div>

            <div className="login-visual-bottom">
                {STATS.map((stat) => (
                    <div key={stat.lbl}>
                        <div className="login-stat-val">{stat.val}</div>
                        <div className="login-stat-lbl">{stat.lbl}</div>
                    </div>
                ))}
            </div>
        </aside>
    );
}

export default AuthVisualPanel;
