import type { JSX } from "react";
import { Link } from "react-router-dom";

function Footer(): JSX.Element {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    <div>
                        <Link
                            to="/"
                            className="navbar-logo"
                            style={{ display: "inline-flex", marginBottom: "var(--space-md)" }}
                        >
                            <div className="navbar-logo-icon">⚡</div>
                            <span className="navbar-logo-text">
                                Fit<span>Life</span>
                            </span>
                        </Link>
                        <p className="footer-brand-tagline">
                            Твоята персонална платформа за здравословен начин на живот.
                            Проследявай, анализирай, постигай.
                        </p>
                        <div className="footer-social">
                            <Link to="#" className="footer-social-link" aria-label="Instagram">
                                <svg
                                    width={16}
                                    height={16}
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <rect x={2} y={2} width={20} height={20} rx={5} ry={5} />
                                    <circle cx={12} cy={12} r={3} />
                                    <circle cx="17.5" cy="6.5" r={1} fill="currentColor" />
                                </svg>
                            </Link>
                            <Link to="#" className="footer-social-link" aria-label="Facebook">
                                <svg
                                    width={16}
                                    height={16}
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                                </svg>
                            </Link>
                            <Link to="#" className="footer-social-link" aria-label="TikTok">
                                <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                    <div>
                        <div className="footer-col-title">Компания</div>
                        <ul className="footer-links">
                            <li>
                                <Link to="/about" className="footer-link">
                                    За нас
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact" className="footer-link">
                                    Контакти
                                </Link>
                            </li>
                            <li>
                                <Link to="/faq" className="footer-link">
                                    FAQ
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <div className="footer-col-title">Правно</div>
                        <ul className="footer-links">
                            <li>
                                <Link to="/privacy" className="footer-link">
                                    Поверителност
                                </Link>
                            </li>
                            <li>
                                <Link to="/terms" className="footer-link">
                                    Условия за ползване
                                </Link>
                            </li>
                            <li>
                                <Link to="/cookies" className="footer-link">
                                    Бисквитки
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p className="footer-copyright">© 2026 FitLife. Всички права запазени.</p>
                    <div className="footer-bottom-links">
                        <Link to="/privacy" className="footer-bottom-link">
                            Поверителност
                        </Link>
                        <Link to="/terms" className="footer-bottom-link">
                            Условия
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;