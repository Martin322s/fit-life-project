import type { JSX } from "react";
import Logo from "./Logo";

function Navbar(): JSX.Element {
    return (
        <nav className="navbar" id="navbar">
            <div className="container">
                <Logo />
                <ul className="navbar-links">
                    <li>
                        <a href="index-v2.html" className="navbar-link active">
                            Начало
                        </a>
                    </li>
                    <li>
                        <a href="about.html" className="navbar-link">
                            За нас
                        </a>
                    </li>
                    <li>
                        <a href="faq.html" className="navbar-link">
                            FAQ
                        </a>
                    </li>
                    <li>
                        <a href="contact.html" className="navbar-link">
                            Контакти
                        </a>
                    </li>
                </ul>
                <div className="navbar-actions">
                    <a href="login.html" className="btn-secondary btn-sm">
                        Вход
                    </a>
                    <a href="register.html" className="btn-primary btn-sm">
                        Започни безплатно
                    </a>
                    <button
                        className="theme-toggle"
                        id="themeToggle"
                        aria-label="Toggle theme"
                    >
                        <span className="theme-toggle-icon-dark">🌙</span>
                        <span className="theme-toggle-icon-light">☀️</span>
                    </button>
                </div>
                <button className="navbar-hamburger" id="hamburger" aria-label="Меню">
                    <span />
                    <span />
                    <span />
                </button>
            </div>
        </nav>
    );
}

export default Navbar;