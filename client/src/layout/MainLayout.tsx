"use client";

import { useEffect, useState } from "react";
import type { JSX, ReactNode } from "react";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar/Navbar";
import MobileNavbar from "./Navbar/MobileNavbar";
import Footer from "./Footer/Footer";

type MainLayoutProps = {
    children: ReactNode;
};

function MainLayout({ children }: MainLayoutProps): JSX.Element {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        setIsMenuOpen(false);
    }, [pathname]);

    return (
        <>
            <Navbar
                isMenuOpen={isMenuOpen}
                onToggleMenu={() => setIsMenuOpen((v) => !v)}
            />
            <MobileNavbar isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
            <div className="page-wrapper">
                {children}
            </div>
            <Footer />
        </>
    );
}

export default MainLayout;
