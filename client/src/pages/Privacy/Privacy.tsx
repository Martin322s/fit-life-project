import type { JSX } from "react";
import { Link } from "react-router-dom";

const LAST_UPDATED = "9 април 2026 г.";

function Privacy(): JSX.Element {
    return (
        <>
            {/* Hero */}
            <section style={{ padding: "var(--space-2xl) 0 var(--space-lg)", borderBottom: "1px solid var(--color-border)" }}>
                <div className="container">
                    <div className="page-hero-breadcrumb">
                        <Link to="/">Начало</Link>
                        <span>›</span>
                        <span style={{ color: "var(--color-cream)" }}>Поверителност</span>
                    </div>
                    <span className="section-tag">✦ Правна информация</span>
                    <h1 className="display-md" style={{ marginBottom: "var(--space-md)", marginTop: "var(--space-md)" }}>
                        Политика за <span className="text-mustard">поверителност</span>
                    </h1>
                    <p className="body-md text-gray">
                        Последна актуализация: <strong style={{ color: "var(--color-cream)" }}>{LAST_UPDATED}</strong>
                    </p>
                </div>
            </section>

            {/* Content */}
            <section style={{ padding: "var(--space-2xl) 0" }}>
                <div className="container">
                    <div style={{ maxWidth: 760, margin: "0 auto", display: "flex", flexDirection: "column", gap: "var(--space-xl)" }}>

                        {/* Intro */}
                        <div className="card card-sm" style={{ padding: "var(--space-lg)", borderColor: "rgba(0,102,255,0.3)", background: "rgba(0,102,255,0.05)" }}>
                            <p className="body-md">
                                FitLife („ние", „нас") се ангажира да защитава личните ти данни в пълно съответствие с
                                Общия регламент за защита на данните (<strong>GDPR</strong>, Регламент (ЕС) 2016/679).
                                Тази политика обяснява какви данни събираме, как ги използваме и какви са твоите права.
                            </p>
                        </div>

                        {/* 1. Who we are */}
                        <div>
                            <h2 className="heading-sm" style={{ marginBottom: "var(--space-md)", color: "var(--color-cream)" }}>1. Администратор на данните</h2>
                            <p className="body-md text-gray" style={{ marginBottom: "var(--space-md)" }}>
                                Администратор на личните ти данни е <strong style={{ color: "var(--color-cream)" }}>FitLife ЕООД</strong>,
                                вписано в Търговския регистър на Република България, с ЕИК 207000000,
                                с адрес: бул. Витоша 45, ет. 3, 1000 София, България.
                            </p>
                            <p className="body-md text-gray">
                                За въпроси, свързани с личните данни: <a href="mailto:privacy@fitlife.bg" style={{ color: "var(--color-mustard)" }}>privacy@fitlife.bg</a>
                            </p>
                        </div>

                        {/* 2. What we collect */}
                        <div>
                            <h2 className="heading-sm" style={{ marginBottom: "var(--space-md)", color: "var(--color-cream)" }}>2. Какви данни събираме</h2>
                            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
                                {[
                                    { title: "Данни за акаунт", desc: "Собствено и фамилно име, имейл адрес, хеширана парола — събирани при регистрация." },
                                    { title: "Физически данни", desc: "Ръст, тегло, възраст, пол и ниво на активност — предоставени доброволно за изчисляване на персонализиран план." },
                                    { title: "История на теглото", desc: 'Записите, които ти сам въвеждаш в секцията „Проследяване на тегло".' },
                                    { title: "Цел и активност", desc: "Избраната от теб цел (отслабване / поддържане / качване на маса) и ниво на физическа активност." },
                                    { title: "Технически данни", desc: "IP адрес, тип браузър, операционна система и страниците, които посещаваш — за целите на сигурността и аналитиката." },
                                ].map((item) => (
                                    <div key={item.title} className="card card-sm" style={{ padding: "var(--space-md)" }}>
                                        <div className="label" style={{ color: "var(--color-cream)", marginBottom: 4 }}>{item.title}</div>
                                        <p className="body-sm text-gray">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 3. How we use */}
                        <div>
                            <h2 className="heading-sm" style={{ marginBottom: "var(--space-md)", color: "var(--color-cream)" }}>3. За какво използваме данните</h2>
                            <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
                                {[
                                    "Предоставяне и персонализиране на услугата (калорийни планове, BMI, TDEE)",
                                    "Управление на акаунта и сигурност на влизането",
                                    "Изпращане на транзакционни имейли (потвърждение, нулиране на парола)",
                                    "Анализ на използването с цел подобряване на продукта",
                                    "Изпълнение на законови задължения",
                                ].map((item) => (
                                    <li key={item} style={{ display: "flex", gap: "var(--space-sm)", alignItems: "flex-start" }} className="body-md text-gray">
                                        <span style={{ color: "var(--color-mustard)", flexShrink: 0, marginTop: 2 }}>✓</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* 4. Storage & security */}
                        <div>
                            <h2 className="heading-sm" style={{ marginBottom: "var(--space-md)", color: "var(--color-cream)" }}>4. Съхранение и сигурност</h2>
                            <p className="body-md text-gray" style={{ marginBottom: "var(--space-md)" }}>
                                Данните се съхраняват на криптирани сървъри, физически намиращи се в рамките на
                                Европейския съюз. Прилагаме следните мерки за сигурност:
                            </p>
                            <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
                                {[
                                    "Паролите се хешират с bcrypt (cost factor ≥ 12) — никога не се съхраняват в четим вид",
                                    "Целият трафик е криптиран чрез HTTPS / TLS 1.3",
                                    "Достъпът до производствената база данни е ограничен по IP и изисква двуфакторна автентикация",
                                    "Редовни резервни копия, криптирани с AES-256",
                                ].map((item) => (
                                    <li key={item} style={{ display: "flex", gap: "var(--space-sm)", alignItems: "flex-start" }} className="body-sm text-gray">
                                        <span style={{ color: "var(--color-electric, #0066ff)", flexShrink: 0, marginTop: 2 }}>🔒</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <p className="body-sm text-gray" style={{ marginTop: "var(--space-md)" }}>
                                Данните се съхраняват за срока на съществуване на акаунта, плюс 30 дни след изтриването му.
                            </p>
                        </div>

                        {/* 5. Your rights */}
                        <div>
                            <h2 className="heading-sm" style={{ marginBottom: "var(--space-md)", color: "var(--color-cream)" }}>5. Твоите права (GDPR)</h2>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-sm)" }}>
                                {[
                                    { right: "Право на достъп", desc: "Можеш да поискаш копие на всички данни, свързани с теб." },
                                    { right: "Право на коригиране", desc: 'Можеш да коригираш неточни данни от страницата „Профил".' },
                                    { right: "Право на изтриване", desc: 'Можеш да изтриеш акаунта си от Настройки → „Изтрий акаунт".' },
                                    { right: "Право на преносимост", desc: "Данните ти се изпращат в JSON/CSV формат до 48 часа." },
                                    { right: "Право на ограничаване", desc: "Можеш да поискаш спиране на обработката докато разглеждаме искане." },
                                    { right: "Право на оплакване", desc: "Можеш да се обърнеш към КЗЛД (Комисия за защита на личните данни)." },
                                ].map((item) => (
                                    <div key={item.right} className="card card-sm" style={{ padding: "var(--space-md)" }}>
                                        <div className="label" style={{ color: "var(--color-mustard)", marginBottom: 4 }}>{item.right}</div>
                                        <p className="body-sm text-gray">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 6. Third parties */}
                        <div>
                            <h2 className="heading-sm" style={{ marginBottom: "var(--space-md)", color: "var(--color-cream)" }}>6. Трети страни</h2>
                            <p className="body-md text-gray" style={{ marginBottom: "var(--space-md)" }}>
                                <strong style={{ color: "var(--color-cream)" }}>Не продаваме и не споделяме</strong> личните ти данни с трети страни за маркетингови цели.
                                Работим само с доверени доставчици, необходими за работата на услугата:
                            </p>
                            <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
                                {[
                                    { name: "Хостинг доставчик (EU)", purpose: "Съхранение на данни и изпълнение на приложението" },
                                    { name: "Имейл доставчик (EU)", purpose: "Изпращане на транзакционни имейли" },
                                    { name: "Аналитичен инструмент (self-hosted)", purpose: "Анализ на трафика без бисквитки на трети страни" },
                                ].map((item) => (
                                    <li key={item.name} className="body-sm text-gray" style={{ display: "flex", gap: "var(--space-md)", padding: "var(--space-sm) 0", borderBottom: "1px solid var(--color-border)" }}>
                                        <span style={{ color: "var(--color-cream)", minWidth: 200 }}>{item.name}</span>
                                        {item.purpose}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* 7. Cookies */}
                        <div>
                            <h2 className="heading-sm" style={{ marginBottom: "var(--space-md)", color: "var(--color-cream)" }}>7. Бисквитки</h2>
                            <p className="body-md text-gray">
                                Използваме минимален брой бисквитки, необходими за работата на услугата.
                                Подробности в нашата{" "}
                                <Link to="/cookies" style={{ color: "var(--color-mustard)" }}>Политика за бисквитки</Link>.
                            </p>
                        </div>

                        {/* 8. Contact */}
                        <div className="card card-sm" style={{ padding: "var(--space-lg)" }}>
                            <h2 className="heading-sm" style={{ marginBottom: "var(--space-md)", color: "var(--color-cream)" }}>8. Контакт за лични данни</h2>
                            <p className="body-md text-gray" style={{ marginBottom: "var(--space-md)" }}>
                                За упражняване на правата си или при въпроси относно обработката на личните ти данни:
                            </p>
                            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
                                <p className="body-sm text-gray">📧 <a href="mailto:privacy@fitlife.bg" style={{ color: "var(--color-mustard)" }}>privacy@fitlife.bg</a></p>
                                <p className="body-sm text-gray">📍 бул. Витоша 45, ет. 3, 1000 София, България</p>
                                <p className="body-sm text-gray">Отговаряме до <strong style={{ color: "var(--color-cream)" }}>30 дни</strong> от получаване на искането.</p>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </>
    );
}

export default Privacy;
