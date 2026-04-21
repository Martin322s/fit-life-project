import { useEffect, useState } from "react";
import type { JSX } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar/Navbar";
import MobileNavbar from "./Navbar/MobileNavbar";
import Footer from "./Footer/Footer";

type MainLayoutProps = {
    theme: "dark" | "light";
    onToggleTheme: () => void;
};

function MainLayout({ theme, onToggleTheme }: MainLayoutProps): JSX.Element {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        setIsMenuOpen(false);
    }, [location.pathname]);

    return (
        <>
            <Navbar
                theme={theme}
                onToggleTheme={onToggleTheme}
                isMenuOpen={isMenuOpen}
                onToggleMenu={() => setIsMenuOpen((v) => !v)}
            />
            <MobileNavbar isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
            <div className="page-wrapper">
                <Outlet />
            </div>
            <Footer />
        </>
    );
}

export default MainLayout;
