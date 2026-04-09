import type { JSX } from "react";
import AuthVisualPanel from "../Login/sections/AuthVisualPanel";
import ForgotPasswordForm from "./sections/ForgotPasswordForm";

type ForgotPasswordProps = {
    theme: "dark" | "light";
    onToggleTheme: () => void;
};

function ForgotPassword({ theme, onToggleTheme }: ForgotPasswordProps): JSX.Element {
    return (
        <div className="login-page">
            <AuthVisualPanel />
            <ForgotPasswordForm theme={theme} onToggleTheme={onToggleTheme} />
        </div>
    );
}

export default ForgotPassword;
