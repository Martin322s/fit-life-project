import type { JSX } from "react";

function HowItWorksSection(): JSX.Element {
    return (
        <section className="how-it-works" id="how-it-works">
            <div className="container">
                <div className="section-header text-center">
                    <span className="section-tag">✦ Как работи</span>
                    <h2 className="display-md" style={{ marginBottom: "var(--space-md)" }}>
                        Само 4 стъпки до
                        <br />
                        <span className="text-mustard">по-добра форма</span>
                    </h2>
                </div>
                <div className="steps-grid">
                    <div className="step-card">
                        <div className="step-number">1</div>
                        <h3 className="step-title">Създай профил</h3>
                        <p className="step-desc">
                            Въведи ръст, тегло, възраст и цел. Регистрацията отнема под 2 минути.
                        </p>
                    </div>
                    <div className="step-card">
                        <div className="step-number">2</div>
                        <h3 className="step-title">Виж нормите си</h3>
                        <p className="step-desc">
                            Автоматично изчисляване на дневни калории, BMI и препоръчителни
                            макроси.
                        </p>
                    </div>
                    <div className="step-card">
                        <div className="step-number">3</div>
                        <h3 className="step-title">Следи прогреса</h3>
                        <p className="step-desc">
                            Записвай теглото си редовно и гледай как кривата тръгва в желаната
                            посока.
                        </p>
                    </div>
                    <div className="step-card">
                        <div className="step-number">4</div>
                        <h3 className="step-title">Достигни целта</h3>
                        <p className="step-desc">
                            С ясна визия и данни в реално време — целта ти е само въпрос на
                            последователност.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default HowItWorksSection;