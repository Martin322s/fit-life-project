import type { JSX } from "react";
import { Link } from "react-router-dom";

const FEATURES = [
    "Персонализиран дневен калориен план",
    "BMI и TDEE изчислени автоматично",
    "300+ рецепти с верифицирани макроси",
    "Пълна история на теглото с графики",
];

function RegisterVisualPanel(): JSX.Element {
    return (
        <aside className="auth-panel-visual" aria-hidden="true">
            <div className="auth-panel-visual-content">
                <Link to="/" className="auth-visual-logo">
                    <div className="auth-visual-logo-icon">⚡</div>
                    Fit<span>Life</span>
                </Link>

                <h2 className="auth-visual-headline">
                    Стъпка 1<br />
                    от <span>хилядата.</span>
                    <br />
                    Сега.
                </h2>

                <p className="auth-visual-desc">
                    2 минути. 3 стъпки. Напълно безплатно. Получаваш персонализиран план — само за теб.
                </p>

                <div className="auth-visual-features">
                    {FEATURES.map((feature) => (
                        <div key={feature} className="auth-visual-feature">
                            <div className="auth-visual-feature-icon">✓</div>
                            {feature}
                        </div>
                    ))}
                </div>
            </div>
        </aside>
    );
}

export default RegisterVisualPanel;
