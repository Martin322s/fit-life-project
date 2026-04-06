import type { JSX } from "react";
import { Link } from "react-router-dom";

function MobileNavbar(): JSX.Element {
    return (
        <div className="navbar-mobile-menu" id="mobileMenu">
            <Link to="/" className="navbar-mobile-link">
                Начало
            </Link>
            <Link to="/about" className="navbar-mobile-link">
                За нас
            </Link>
            <Link to="/faq" className="navbar-mobile-link">
                FAQ
            </Link>
            <Link to="/contact" className="navbar-mobile-link">
                Контакти
            </Link>
            <Link to="/register" className="btn-primary btn-full" style={{ textAlign: "center", marginTop: 16 }}>
                Започни безплатно
            </Link>
        </div>
    );
}

export default MobileNavbar;