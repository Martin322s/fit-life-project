import type { JSX } from "react";
import Logo from "../Logo/Logo";
import { Link, NavLink } from "react-router-dom";

type NavbarProps = {
    theme: "dark" | "light";
    onToggleTheme: () => void;
    isMenuOpen: boolean;
    onToggleMenu: () => void;
};

function Navbar({ theme, onToggleTheme, isMenuOpen, onToggleMenu }: NavbarProps): JSX.Element {
    return (
        <nav className="navbar" id="navbar">
            <div className="container">
                <Logo />
                <ul className="navbar-links">
                    <li>
                        <NavLink to="/" end className={({ isActive }) => `navbar-link${isActive ? " active" : ""}`}>
                            Начало
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/about" className={({ isActive }) => `navbar-link${isActive ? " active" : ""}`}>
                            За нас
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/faq" className={({ isActive }) => `navbar-link${isActive ? " active" : ""}`}>
                            FAQ
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/contact" className={({ isActive }) => `navbar-link${isActive ? " active" : ""}`}>
                            Контакти
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/dashboard" className={({ isActive }) => `navbar-link${isActive ? " active" : ""}`}>
                            Табло
                        </NavLink>
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
                <button
                    className={`navbar-hamburger${isMenuOpen ? " open" : ""}`}
                    id="hamburger"
                    aria-label="Меню"
                    aria-expanded={isMenuOpen}
                    type="button"
                    onClick={onToggleMenu}
                >
                    <span />
                    <span />
                    <span />
                </button>
            </div>
        </nav>
    );
}

export default Navbar;