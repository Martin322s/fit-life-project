import type { JSX } from "react";

function StatsBand(): JSX.Element {
    return (
        <div className="about-stats">
            <div className="container">
                <div className="about-stats-grid">
                    <div>
                        <div className="about-stat-val">12 400+</div>
                        <div className="about-stat-lbl">Активни потребители</div>
                    </div>
                    <div>
                        <div className="about-stat-val">300+</div>
                        <div className="about-stat-lbl">Рецепти в базата</div>
                    </div>
                    <div>
                        <div className="about-stat-val">2 млн+</div>
                        <div className="about-stat-lbl">Записани измервания</div>
                    </div>
                    <div>
                        <div className="about-stat-val">4.9 ★</div>
                        <div className="about-stat-lbl">Средна оценка</div>
                    </div>
                </div>
            </div>
        </div>

    );
}

export default StatsBand;