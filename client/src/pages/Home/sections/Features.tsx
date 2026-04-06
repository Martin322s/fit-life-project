import type { JSX } from "react";

function FeaturesSection(): JSX.Element {
    return (
        <section className="features-section" id="features">
            <div className="container">
                <div className="section-header text-center">
                    <span className="section-tag">✦ Функционалности</span>
                    <h2 className="display-md" style={{ marginBottom: "var(--space-md)" }}>
                        Всичко, от което се нуждаеш,
                        <br />
                        <span className="text-mustard">на едно място</span>
                    </h2>
                    <p
                        className="body-md text-gray"
                        style={{ maxWidth: 520, margin: "0 auto" }}
                    >
                        От проследяване на теглото до пълни хранителни профили на продукти —
                        FitLife покрива целия ти фитнес живот.
                    </p>
                </div>
                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon">⚖️</div>
                        <h3 className="feature-title">Проследяване на тегло</h3>
                        <p className="feature-desc">
                            Записвай теглото си всеки ден и следи прогреса си с визуални графики.
                            Автоматично изчисляване на BMI и тренд анализ.
                        </p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon mustard-bg">🍽️</div>
                        <h3 className="feature-title">Калкулатор на калории</h3>
                        <p className="feature-desc">
                            Персонализирани дневни норми базирани на твоите данни. TDEE, BMR и
                            макро разпределение изчислени автоматично.
                        </p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🥗</div>
                        <h3 className="feature-title">Каталог рецепти</h3>
                        <p className="feature-desc">
                            Над 300 рецепти с пълни хранителни стойности. Филтрирай по калории,
                            цел или тип хранене.
                        </p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon mustard-bg">🛒</div>
                        <h3 className="feature-title">База продукти</h3>
                        <p className="feature-desc">
                            Търси и намирай хранителните стойности на хиляди продукти. Белтъчини,
                            мазнини, въглехидрати, фибри и още.
                        </p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">📊</div>
                        <h3 className="feature-title">Лично табло</h3>
                        <p className="feature-desc">
                            Централен dashboard с всички твои ключови показатели — бърз преглед и
                            лесен достъп до всяка функция.
                        </p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon mustard-bg">🎯</div>
                        <h3 className="feature-title">Цели и прогрес</h3>
                        <p className="feature-desc">
                            Задай цел — отслабване, качване на маса или поддържане. FitLife
                            адаптира препоръките специално за теб.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default FeaturesSection;