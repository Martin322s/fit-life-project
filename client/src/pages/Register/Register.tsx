import type { JSX } from "react";
import RegisterVisualPanel from "./sections/RegisterVisualPanel";
import RegisterForm from "./sections/RegisterForm";

type RegisterProps = {
    theme: "dark" | "light";
    onToggleTheme: () => void;
};

function Register({ theme, onToggleTheme }: RegisterProps): JSX.Element {
    return (
        <div className="auth-page">
            <RegisterVisualPanel />
            <RegisterForm theme={theme} onToggleTheme={onToggleTheme} />
        </div>
    );
}

export default Register;
