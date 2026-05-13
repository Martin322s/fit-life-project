"use client";

import type { JSX } from "react";
import Logo from "../Logo/Logo";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

type NavbarProps = {
    isMenuOpen: boolean;
    onToggleMenu: () => void;
};

function NavLink({ href, children, end }: { href: string; children: React.ReactNode; end?: boolean }): JSX.Element {
    const pathname = usePathname();
    const isActive = end ? pathname === href : pathname.startsWith(href);
    return (
        <Link href={href} className={`navbar-link${isActive ? " active" : ""}`}>
            {children}
        </Link>
    );
}

function Navbar({ isMenuOpen, onToggleMenu }: NavbarProps): JSX.Element {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push("/");
    };

    return (
        <nav className="navbar" id="navbar">
            <div className="container">
                <Logo />
                <ul className="navbar-links">
                    <li>
                        <NavLink href="/" end>Начало</NavLink>
                    </li>
                    <li>
                        <NavLink href="/about">За нас</NavLink>
                    </li>
                    <li>
                        <NavLink href="/faq">FAQ</NavLink>
                    </li>
                    <li>
                        <NavLink href="/contact">Контакти</NavLink>
                    </li>
                    {user && (
                        <li>
                            <NavLink href="/dashboard">Табло</NavLink>
                        </li>
                    )}
                </ul>
                <div className="navbar-actions">
                    {user ? (
                        <>
                            <span className="navbar-link" style={{ cursor: "default" }}>
                                {user.firstName}
                            </span>
                            <button type="button" className="btn-secondary btn-sm" onClick={handleLogout}>
                                Изход
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="btn-secondary btn-sm">
                                Вход
                            </Link>
                            <Link href="/register" className="btn-primary btn-sm">
                                Започни безплатно
                            </Link>
                        </>
                    )}
                    <button
                        className="theme-toggle"
                        type="button"
                        aria-label="Toggle theme"
                        aria-pressed={theme === "light"}
                        onClick={toggleTheme}
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
