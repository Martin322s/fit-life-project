import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import MobileNavbar from "./layout/Navbar/MobileNavbar";
import Navbar from "./layout/Navbar/Navbar";
import Home from "./pages/Home/Home";
import Footer from "./layout/Footer/Footer";
import About from "./pages/About/About";

type Theme = "dark" | "light";

function App() {
    const [theme, setTheme] = useState<Theme>(() => {
        if (typeof window === "undefined") {
            return "dark";
        }

        return localStorage.getItem("fitlife-theme") === "light" ? "light" : "dark";
    });

    useEffect(() => {
        if (theme === "light") {
            document.documentElement.setAttribute("data-theme", "light");
        } else {
            document.documentElement.removeAttribute("data-theme");
        }

        localStorage.setItem("fitlife-theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((current) => (current === "light" ? "dark" : "light"));
    };

    return (
        <>
            <Navbar theme={theme} onToggleTheme={toggleTheme} />
            <MobileNavbar />

            <div className="page-wrapper">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about/" element={<About />} />
                </Routes>
            </div>

            <Footer />
        </>
    );
}

export default App;
