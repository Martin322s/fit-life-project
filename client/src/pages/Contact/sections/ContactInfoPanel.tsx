import type { JSX } from "react";

const HOURS = [
    { day: "Понеделник – Петък", time: "09:00 – 18:00", closed: false },
    { day: "Събота", time: "10:00 – 14:00", closed: false },
    { day: "Неделя", time: "Почивен ден", closed: true },
];

const SOCIALS = [
    { icon: "📸", name: "Instagram", handle: "@fitlife.bg", href: "#" },
    { icon: "👥", name: "Facebook", handle: "FitLife България", href: "#" },
    { icon: "🎵", name: "TikTok", handle: "@fitlifebg", href: "#" },
];

function ContactInfoPanel(): JSX.Element {
    return (
        <div className="contact-info">
            {/* Email */}
            <a href="mailto:hello@fitlife.bg" className="contact-info-card" style={{ textDecoration: "none" }}>
                <div className="contact-info-icon">✉️</div>
                <div>
                    <div className="contact-info-label">Имейл</div>
                    <div className="contact-info-value">hello@fitlife.bg</div>
                    <div className="contact-info-sub">За общи въпроси</div>
                </div>
            </a>

            {/* Support email */}
            <a href="mailto:support@fitlife.bg" className="contact-info-card" style={{ textDecoration: "none" }}>
                <div className="contact-info-icon">🛠️</div>
                <div>
                    <div className="contact-info-label">Техническа поддръжка</div>
                    <div className="contact-info-value">support@fitlife.bg</div>
                    <div className="contact-info-sub">За технически проблеми</div>
                </div>
            </a>

            {/* Location */}
            <div className="contact-info-card">
                <div className="contact-info-icon">📍</div>
                <div>
                    <div className="contact-info-label">Локация</div>
                    <div className="contact-info-value">София, България</div>
                    <div className="contact-info-sub">бул. Витоша 45, ет. 3</div>
                </div>
            </div>

            {/* Working hours */}
            <div className="card card-sm" style={{ padding: "var(--space-lg)" }}>
                <div className="label text-gray" style={{ marginBottom: "var(--space-md)" }}>
                    🕐 Работно време
                </div>
                {HOURS.map((row) => (
                    <div
                        key={row.day}
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "var(--space-sm) 0",
                            borderBottom: "1px solid var(--color-border)",
                            fontSize: "0.875rem",
                        }}
                    >
                        <span style={{ color: "var(--color-gray-light)" }}>{row.day}</span>
                        <span
                            style={{
                                color: row.closed ? "var(--color-gray)" : "var(--color-cream)",
                                fontWeight: row.closed ? 400 : 500,
                                fontStyle: row.closed ? "italic" : "normal",
                            }}
                        >
                            {row.time}
                        </span>
                    </div>
                ))}
                <p className="body-sm text-gray" style={{ marginTop: "var(--space-md)" }}>
                    Извън работно време отговаряме на следващия работен ден.
                </p>
            </div>

            {/* Social links */}
            <div className="card card-sm" style={{ padding: "var(--space-lg)" }}>
                <div className="label text-gray" style={{ marginBottom: "var(--space-md)" }}>
                    🌐 Следи ни
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
                    {SOCIALS.map((s) => (
                        <a
                            key={s.name}
                            href={s.href}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "var(--space-md)",
                                padding: "var(--space-sm) 0",
                                color: "var(--color-gray-light)",
                                fontSize: "0.875rem",
                                textDecoration: "none",
                            }}
                        >
                            <span style={{ fontSize: "1.1rem" }}>{s.icon}</span>
                            <div>
                                <div style={{ fontWeight: 500 }}>{s.name}</div>
                                <div className="body-sm text-gray">{s.handle}</div>
                            </div>
                            <svg
                                style={{ marginLeft: "auto" }}
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </a>
                    ))}
                </div>
            </div>

            {/* Map placeholder */}
            <div
                style={{
                    background: "var(--color-navy-mid)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "var(--radius-lg)",
                    height: 180,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "var(--space-sm)",
                    color: "var(--color-gray)",
                    fontSize: "0.875rem",
                    marginTop: "var(--space-lg)",
                }}
            >
                <div
                    style={{
                        width: 48,
                        height: 48,
                        borderRadius: "50% 50% 50% 0",
                        background: "var(--color-mustard)",
                        transform: "rotate(-45deg)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "var(--shadow-mustard)",
                    }}
                >
                    <span style={{ transform: "rotate(45deg)", fontSize: "1.1rem" }}>⚡</span>
                </div>
                <span>бул. Витоша 45, София</span>
            </div>
        </div>
    );
}

export default ContactInfoPanel;
