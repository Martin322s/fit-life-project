import type { JSX } from "react";
import { Link } from "react-router-dom";

const LAST_UPDATED = "9 април 2026 г.";

function Terms(): JSX.Element {
    return (
        <>
            {/* Hero */}
            <section style={{ padding: "var(--space-2xl) 0 var(--space-lg)", borderBottom: "1px solid var(--color-border)" }}>
                <div className="container">
                    <div className="page-hero-breadcrumb">
                        <Link to="/">Начало</Link>
                        <span>›</span>
                        <span style={{ color: "var(--color-cream)" }}>Условия за ползване</span>
                    </div>
                    <span className="section-tag">✦ Правна информация</span>
                    <h1 className="display-md" style={{ marginBottom: "var(--space-md)", marginTop: "var(--space-md)" }}>
                        Условия за <span className="text-mustard">ползване</span>
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
                        <div className="card card-sm" style={{ padding: "var(--space-lg)", borderColor: "rgba(200,168,50,0.3)", background: "rgba(200,168,50,0.05)" }}>
                            <p className="body-md">
                                Добре дошъл в FitLife. Моля, прочети внимателно тези Условия за ползване, преди да
                                използваш нашата платформа. С достъпа до услугата или регистрацията на акаунт приемаш
                                тези условия в тяхната цялост.
                            </p>
                        </div>

                        {/* 1. Definitions */}
                        <div>
                            <h2 className="heading-sm" style={{ marginBottom: "var(--space-md)", color: "var(--color-cream)" }}>1. Дефиниции</h2>
                            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
                                {[
                                    { term: '„Платформа"', def: "Уебсайтът fitlife.bg и всички свързани с него уеб приложения и услуги." },
                                    { term: '„Потребител"', def: "Всяко физическо лице, което е създало акаунт в платформата." },
                                    { term: '„Съдържание"', def: "Всички текстове, данни, графики, рецепти, калкулатори и функционалности, предоставени от FitLife." },
                                    { term: '„Потребителски данни"', def: "Данните, въведени от теб — тегло, цел, физически параметри и т.н." },
                                ].map((item) => (
                                    <div key={item.term} style={{ display: "flex", gap: "var(--space-md)", padding: "var(--space-sm) 0", borderBottom: "1px solid var(--color-border)" }}>
                                        <span className="body-md" style={{ color: "var(--color-cream)", minWidth: 160, flexShrink: 0 }}>{item.term}</span>
                                        <span className="body-md text-gray">{item.def}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 2. Account */}
                        <div>
                            <h2 className="heading-sm" style={{ marginBottom: "var(--space-md)", color: "var(--color-cream)" }}>2. Регистрация и акаунт</h2>
                            <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
                                {[
                                    "Трябва да си на поне 16 години, за да се регистрираш в платформата.",
                                    "Длъжен си да предоставиш точни и актуални данни при регистрацията.",
                                    "Отговорен си за поверителността на паролата си. При съмнение за неоторизиран достъп незабавно ни уведоми.",
                                    "Забранено е създаването на повече от един акаунт за едно и също лице.",
                                    "Имаме право да прекратим акаунт, при доказано нарушение на тези условия.",
                                ].map((item) => (
                                    <li key={item} style={{ display: "flex", gap: "var(--space-sm)", alignItems: "flex-start" }} className="body-md text-gray">
                                        <span style={{ color: "var(--color-mustard)", flexShrink: 0 }}>→</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* 3. Acceptable use */}
                        <div>
                            <h2 className="heading-sm" style={{ marginBottom: "var(--space-md)", color: "var(--color-cream)" }}>3. Допустимо използване</h2>
                            <p className="body-md text-gray" style={{ marginBottom: "var(--space-md)" }}>Забранено е да използваш платформата за:</p>
                            <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
                                {[
                                    "Незаконни дейности или нарушаване на правата на трети лица",
                                    "Разпространяване на зловреден код, спам или фишинг",
                                    "Автоматизиран масов достъп (crawling, scraping) без изрично писмено разрешение",
                                    "Опити за нарушаване на сигурността или достъп до данни на други потребители",
                                    "Препродажба или комерсиално използване на платформата без лиценз",
                                ].map((item) => (
                                    <li key={item} style={{ display: "flex", gap: "var(--space-sm)", alignItems: "flex-start" }} className="body-md text-gray">
                                        <span style={{ color: "var(--color-error, #f44)", flexShrink: 0 }}>✕</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* 4. IP */}
                        <div>
                            <h2 className="heading-sm" style={{ marginBottom: "var(--space-md)", color: "var(--color-cream)" }}>4. Интелектуална собственост</h2>
                            <p className="body-md text-gray" style={{ marginBottom: "var(--space-md)" }}>
                                Всички права върху съдържанието на платформата — включително рецептите, дизайна,
                                кода, графиките и текстовете — принадлежат на FitLife ЕООД и са защитени от
                                авторското право.
                            </p>
                            <p className="body-md text-gray">
                                Данните, които ти въвеждаш (потребителски данни), остават твоя собственост.
                                Предоставяш ни ограничен лиценз за обработката им с единствената цел да ти
                                предоставяме услугата.
                            </p>
                        </div>

                        {/* 5. Medical disclaimer */}
                        <div className="card card-sm" style={{ padding: "var(--space-lg)", borderColor: "rgba(255,150,0,0.4)", background: "rgba(255,150,0,0.05)" }}>
                            <h2 className="heading-sm" style={{ marginBottom: "var(--space-md)", color: "var(--color-cream)" }}>5. Отказ от медицинска отговорност ⚠️</h2>
                            <p className="body-md text-gray" style={{ marginBottom: "var(--space-md)" }}>
                                <strong style={{ color: "var(--color-cream)" }}>FitLife не е медицинска услуга.</strong>{" "}
                                Предоставената информация — включително изчисления на BMI, калории и хранителни стойности —
                                е с информационен характер и <strong style={{ color: "var(--color-cream)" }}>не замества медицинска консултация</strong>.
                            </p>
                            <p className="body-md text-gray">
                                Преди да предприемаш съществена промяна в диетата или физическата активност, особено
                                при наличие на здравословни проблеми, се консултирай с лекар или лицензиран диетолог.
                            </p>
                        </div>

                        {/* 6. Limitation of liability */}
                        <div>
                            <h2 className="heading-sm" style={{ marginBottom: "var(--space-md)", color: "var(--color-cream)" }}>6. Ограничаване на отговорността</h2>
                            <p className="body-md text-gray" style={{ marginBottom: "var(--space-md)" }}>
                                Платформата се предоставя „такава каквато е" и „каквато е налична". Не гарантираме
                                непрекъснат или безгрешен достъп. Не носим отговорност за:
                            </p>
                            <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
                                {[
                                    "Преки или косвени вреди, произтичащи от използването на платформата",
                                    "Загуба на данни вследствие на технически проблеми извън нашия контрол",
                                    "Действия на трети страни, включително хакерски атаки",
                                    "Неточности в изчисленията, дължащи се на грешно въведени от потребителя данни",
                                ].map((item) => (
                                    <li key={item} style={{ display: "flex", gap: "var(--space-sm)", alignItems: "flex-start" }} className="body-md text-gray">
                                        <span style={{ color: "var(--color-mustard)", flexShrink: 0, marginTop: 2 }}>–</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* 7. Service availability */}
                        <div>
                            <h2 className="heading-sm" style={{ marginBottom: "var(--space-md)", color: "var(--color-cream)" }}>7. Наличност на услугата</h2>
                            <p className="body-md text-gray">
                                Стремим се към наличност от 99.5% на месечна база. Плановата поддръжка се обявява
                                предварително по имейл и в платформата. При непланирани прекъсвания се свързваме с
                                потребителите в рамките на 2 часа.
                            </p>
                        </div>

                        {/* 8. Changes */}
                        <div>
                            <h2 className="heading-sm" style={{ marginBottom: "var(--space-md)", color: "var(--color-cream)" }}>8. Промени в Условията</h2>
                            <p className="body-md text-gray">
                                Можем да актуализираме тези Условия по всяко време. При съществени промени ще те
                                уведомим по имейл минимум <strong style={{ color: "var(--color-cream)" }}>14 дни предварително</strong>.
                                Продължаването на използването на платформата след влизането в сила на новите условия
                                се счита за приемането им.
                            </p>
                        </div>

                        {/* 9. Law */}
                        <div>
                            <h2 className="heading-sm" style={{ marginBottom: "var(--space-md)", color: "var(--color-cream)" }}>9. Приложимо право</h2>
                            <p className="body-md text-gray">
                                Тези Условия се уреждат от законодателството на Република България.
                                Споровете се отнасят до компетентния съд в гр. София, освен ако приложимото
                                потребителско право изисква друго.
                            </p>
                        </div>

                        {/* Contact */}
                        <div className="card card-sm" style={{ padding: "var(--space-lg)" }}>
                            <p className="body-md text-gray">
                                За въпроси относно тези Условия:{" "}
                                <a href="mailto:hello@fitlife.bg" style={{ color: "var(--color-mustard)" }}>hello@fitlife.bg</a>
                                {" "}или чрез{" "}
                                <Link to="/contact" style={{ color: "var(--color-mustard)" }}>формата за контакт</Link>.
                            </p>
                        </div>

                    </div>
                </div>
            </section>
        </>
    );
}

export default Terms;
