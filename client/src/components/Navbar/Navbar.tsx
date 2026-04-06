import type { JSX } from "react";
import Logo from "./Logo";
import { Link } from "react-router-dom";

type NavbarProps = {
    theme: "dark" | "light";
    onToggleTheme: () => void;
};

function Navbar({ theme, onToggleTheme }: NavbarProps): JSX.Element {
    return (
        <nav className="navbar" id="navbar">
            <div className="container">
                <Logo />
                <ul className="navbar-links">
                    <li>
                        <Link to="/" className="navbar-link active">
                            Начало
                        </Link>
                    </li>
                    <li>
                        <Link to="/about" className="navbar-link">
                            За нас
                        </Link>
                    </li>
                    <li>
                        <Link to="/faq" className="navbar-link">
                            FAQ
                        </Link>
                    </li>
                    <li>
                        <Link to="/contact" className="navbar-link">
                            Контакти
                        </Link>
                    </li>
                </ul>
                <div className="navbar-actions">
                    <Link to="/login" className="btn-secondary btn-sm">
                        Вход
                    </Link>
                    <Link to="/register" className="btn-primary btn-sm">
                        Започни безплатно
                    </Link>
                    <button
                        className="theme-toggle"
                        type="button"
                        aria-label="Toggle theme"
                        aria-pressed={theme === "light"}
                        onClick={onToggleTheme}
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