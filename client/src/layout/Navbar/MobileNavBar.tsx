"use client";

import type { JSX } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

type MobileNavbarProps = {
    isOpen: boolean;
    onClose: () => void;
};

function MobileNavbar({ isOpen, onClose }: MobileNavbarProps): JSX.Element {
    const { user, logout } = useAuth();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        onClose();
        router.push("/");
    };

    return (
        <div className={`navbar-mobile-menu${isOpen ? " open" : ""}`} id="mobileMenu">
            <Link href="/" className="navbar-mobile-link" onClick={onClose}>
                Начало
            </Link>
            <Link href="/about" className="navbar-mobile-link" onClick={onClose}>
                За нас
            </Link>
            <Link href="/faq" className="navbar-mobile-link" onClick={onClose}>
                FAQ
            </Link>
            <Link href="/contact" className="navbar-mobile-link" onClick={onClose}>
                Контакти
            </Link>
            {user && (
                <Link href="/dashboard" className="navbar-mobile-link" onClick={onClose}>
                    Табло
                </Link>
            )}
            {user ? (
                <button
                    type="button"
                    className="btn-secondary btn-full"
                    style={{ textAlign: "center", marginTop: 16 }}
                    onClick={handleLogout}
                >
                    Изход ({user.firstName})
                </button>
            ) : (
                <>
                    <Link href="/login" className="btn-secondary btn-full" style={{ textAlign: "center", marginTop: 16 }} onClick={onClose}>
                        Вход
                    </Link>
                    <Link href="/register" className="btn-primary btn-full" style={{ textAlign: "center", marginTop: 8 }} onClick={onClose}>
                        Започни безплатно
                    </Link>
                </>
            )}
        </div>
    );
}

export default MobileNavbar;
