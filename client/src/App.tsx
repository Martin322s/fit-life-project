import { useEffect, useState } from "react";
import type { JSX } from "react";
import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import GuestRoute from "./components/GuestRoute";
import AdminRoute from "./components/AdminRoute";
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
import ResetPassword from "./pages/ResetPassword/ResetPassword";
import Dashboard from "./pages/Dashboard/Dashboard";
import Calories from "./pages/Calories/Calories";
import Weight from "./pages/Weight/Weight";
import Recipes from "./pages/Recipes/Recipes";
import Diets from "./pages/Diets/Diets";
import TrainingPlans from "./pages/TrainingPlans/TrainingPlans";
import Products from "./pages/Products/Products";
import Shop from "./pages/Shop/Shop";
import Challenges from "./pages/Challenges/Challenges";
import Calculators from "./pages/Calculators/Calculators";
import Profile from "./pages/Profile/Profile";
import Admin from "./pages/Admin/Admin";

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

    const pr = (el: JSX.Element) => <PrivateRoute>{el}</PrivateRoute>;

    return (
        <AuthProvider>
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
                <Route path="/login" element={<GuestRoute><Login theme={theme} onToggleTheme={toggleTheme} /></GuestRoute>} />
                <Route path="/register" element={<GuestRoute><Register theme={theme} onToggleTheme={toggleTheme} /></GuestRoute>} />
                <Route path="/forgot-password" element={<ForgotPassword theme={theme} onToggleTheme={toggleTheme} />} />
                <Route path="/reset-password" element={<ResetPassword theme={theme} onToggleTheme={toggleTheme} />} />
                <Route path="/dashboard" element={pr(<Dashboard theme={theme} onToggleTheme={toggleTheme} />)} />
                <Route path="/calories" element={pr(<Calories theme={theme} onToggleTheme={toggleTheme} />)} />
                <Route path="/weight" element={pr(<Weight theme={theme} onToggleTheme={toggleTheme} />)} />
                <Route path="/recipes" element={pr(<Recipes theme={theme} onToggleTheme={toggleTheme} />)} />
                <Route path="/diets" element={pr(<Diets theme={theme} onToggleTheme={toggleTheme} />)} />
                <Route path="/training-plans" element={pr(<TrainingPlans theme={theme} onToggleTheme={toggleTheme} />)} />
                <Route path="/products" element={pr(<Products theme={theme} onToggleTheme={toggleTheme} />)} />
                <Route path="/shop" element={pr(<Shop theme={theme} onToggleTheme={toggleTheme} />)} />
                <Route path="/challenges" element={pr(<Challenges theme={theme} onToggleTheme={toggleTheme} />)} />
                <Route path="/calculators" element={pr(<Calculators theme={theme} onToggleTheme={toggleTheme} />)} />
                <Route path="/profile" element={pr(<Profile theme={theme} onToggleTheme={toggleTheme} />)} />
                <Route path="/admin" element={<AdminRoute><Admin theme={theme} onToggleTheme={toggleTheme} /></AdminRoute>} />
            </Routes>
        </AuthProvider>
    );
}

export default App;
