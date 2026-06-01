import type { JSX } from "react";

const STATS = [
    { value: "12 400+", label: "Активни потребители" },
    { value: "300+", label: "Рецепти в базата" },
    { value: "2 млн+", label: "Записани измервания" },
    { value: "4.9 ★", label: "Средна оценка" },
];

// Tailwind: responsive stats strip
function StatsBand(): JSX.Element {
    return (
        <div className="bg-[#0f3460] py-12 px-4">
            <div className="mx-auto max-w-5xl">
                <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
                    {STATS.map((stat) => (
                        <div key={stat.label}>
                            <p className="text-3xl font-extrabold text-[#ff6b35]">{stat.value}</p>
                            <p className="mt-1 text-sm text-[#9ca3af]">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default StatsBand;
