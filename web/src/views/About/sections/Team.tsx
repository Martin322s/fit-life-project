import type { JSX } from "react";

function Team(): JSX.Element {
    return (
        // Tailwind: section padding + centered layout
        <section className="py-20 px-4">
            <div className="mx-auto max-w-5xl">
                {/* Section header */}
                <div className="mb-12 text-center">
                    <span className="section-tag mb-3 inline-block rounded-full px-4 py-1 text-sm font-semibold">
                        ✦ Екипът
                    </span>
                    <h2 className="mb-4 text-3xl font-bold leading-tight">
                        Хората зад <span className="text-[#f5a623]">FitLife</span>
                    </h2>
                    <p className="mx-auto max-w-md text-base leading-relaxed text-[#9ca3af]">
                        Малък, но страстен екип от разработчици, диетолози и дизайнери,
                        обединени от обща цел.
                    </p>
                </div>

                {/* Team grid */}
                <div className="flex flex-wrap justify-center gap-8">
                    {/* Team card — Tailwind */}
                    <div className="flex w-full max-w-sm flex-col items-center gap-4 rounded-2xl bg-[#1a1a2e] p-8 text-center shadow-lg">
                        <div className="h-20 w-20 overflow-hidden rounded-full">
                            <img
                                src="/profile.jpg"
                                alt="Мартин Софрониев"
                                className="h-full w-full object-cover"
                            />
                        </div>
                        <div>
                            <p className="text-lg font-bold">Мартин Софрониев</p>
                            <p className="text-sm text-[#f5a623]">Founder &amp; CEO</p>
                        </div>
                        <p className="text-sm leading-relaxed text-[#9ca3af]">
                            Софтуерен инженер с реален опит в проследяване на прогрес и
                            трансформация. Създава FitLife като инструмент за контрол,
                            дисциплина и резултати. Фокусира се върху изграждане на
                            интелигентна платформа, която превръща данните в реални действия
                            и устойчив начин на живот.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Team;
