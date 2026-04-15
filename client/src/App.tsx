import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Faq from "./pages/Faq/Faq";
import Contact from "./pages/Contact/Contact";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Privacy from "./pages/Privacy/Privacy";
import Terms from "./pages/Terms/Terms";
import Cookies from "./pages/Cookies/Cookies";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import Dashboard from "./pages/Dashboard/Dashboard";
import Calories from "./pages/Calories/Calories";
import Weight from "./pages/Weight/Weight";
import Recipes from "./pages/Recipes/Recipes";
import Diets from "./pages/Diets/Diets";

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
        <Routes>
            <Route element={<MainLayout theme={theme} onToggleTheme={toggleTheme} />}>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/faq" element={<Faq />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/cookies" element={<Cookies />} />
            </Route>
            <Route path="/login" element={<Login theme={theme} onToggleTheme={toggleTheme} />} />
            <Route path="/register" element={<Register theme={theme} onToggleTheme={toggleTheme} />} />
            <Route path="/forgot-password" element={<ForgotPassword theme={theme} onToggleTheme={toggleTheme} />} />
            <Route path="/dashboard" element={<Dashboard theme={theme} onToggleTheme={toggleTheme} />} />
            <Route path="/calories" element={<Calories theme={theme} onToggleTheme={toggleTheme} />} />
            <Route path="/weight" element={<Weight theme={theme} onToggleTheme={toggleTheme} />} />
            <Route path="/recipes" element={<Recipes theme={theme} onToggleTheme={toggleTheme} />} />
            <Route path="/diets" element={<Diets theme={theme} onToggleTheme={toggleTheme} />} />
        </Routes>
    );
}

export default App;
