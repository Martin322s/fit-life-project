import type { JSX } from "react";
import { Link } from "react-router-dom";

type MobileNavbarProps = {
    isOpen: boolean;
    onClose: () => void;
};

function MobileNavbar({ isOpen, onClose }: MobileNavbarProps): JSX.Element {
    return (
        <div className={`navbar-mobile-menu${isOpen ? " open" : ""}`} id="mobileMenu">
            <Link to="/" className="navbar-mobile-link" onClick={onClose}>
                Начало
            </Link>
            <Link to="/about" className="navbar-mobile-link" onClick={onClose}>
                За нас
            </Link>
            <Link to="/faq" className="navbar-mobile-link" onClick={onClose}>
                FAQ
            </Link>
            <Link to="/contact" className="navbar-mobile-link" onClick={onClose}>
                Контакти
            </Link>
            <Link to="/dashboard" className="navbar-mobile-link" onClick={onClose}>
                Табло
            </Link>
            <Link to="/login" className="btn-secondary btn-full" style={{ textAlign: "center", marginTop: 16 }} onClick={onClose}>
                Вход
            </Link>
            <Link to="/register" className="btn-primary btn-full" style={{ textAlign: "center", marginTop: 8 }} onClick={onClose}>
                Започни безплатно
            </Link>
        </div>
    );
}

export default MobileNavbar;