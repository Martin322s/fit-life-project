import type { JSX } from "react";
import AuthVisualPanel from "./sections/AuthVisualPanel";
import LoginForm from "./sections/LoginForm";

type LoginProps = {
    theme: "dark" | "light";
    onToggleTheme: () => void;
};

function Login({ theme, onToggleTheme }: LoginProps): JSX.Element {
    return (
        <div className="login-page">
            <AuthVisualPanel />
            <LoginForm theme={theme} onToggleTheme={onToggleTheme} />
        </div>
    );
}

export default Login;
