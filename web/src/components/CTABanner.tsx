"use client";

import type { JSX } from "react";
import Link from "next/link";

function CTABanner(): JSX.Element {
    return (
        <section
            className="cta-banner py-20 px-4 text-center"
            id="cta"
        >
            <div className="container mx-auto max-w-3xl">
                <div className="cta-banner-inner flex flex-col items-center gap-6">
                    <span className="section-tag inline-block rounded-full px-4 py-1 text-sm font-semibold">
                        ⚡ Без кредитна карта
                    </span>
                    <h2 className="display-md text-3xl font-bold leading-tight">
                        Готов ли си да промениш
                        <br />
                        <span className="text-mustard">отношението си към тялото?</span>
                    </h2>
                    <p className="body-md text-gray max-w-md">
                        Присъедини се към над 12 000 потребители, които вече следят здравето си
                        с FitLife. Напълно безплатно за начало.
                    </p>
                    <div className="cta-banner-actions flex flex-wrap justify-center gap-4">
                        <Link href="/register" className="btn-primary btn-lg">
                            Регистрирай се безплатно
                        </Link>
                        <Link href="/about" className="btn-secondary btn-lg">
                            Научи повече за нас
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default CTABanner;