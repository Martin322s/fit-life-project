import type { JSX } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar/Navbar";
import MobileNavbar from "./Navbar/MobileNavbar";
import Footer from "./Footer/Footer";

type MainLayoutProps = {
    theme: "dark" | "light";
    onToggleTheme: () => void;
};

function MainLayout({ theme, onToggleTheme }: MainLayoutProps): JSX.Element {
    return (
        <>
            <Navbar theme={theme} onToggleTheme={onToggleTheme} />
            <MobileNavbar />
            <div className="page-wrapper">
                <Outlet />
            </div>
            <Footer />
        </>
    );
}

export default MainLayout;
