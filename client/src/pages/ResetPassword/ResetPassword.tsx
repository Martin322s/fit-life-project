import type { JSX } from "react";
import AuthVisualPanel from "../Login/sections/AuthVisualPanel";
import ResetPasswordForm from "./sections/ResetPasswordForm";

type ResetPasswordProps = {
    theme: "dark" | "light";
    onToggleTheme: () => void;
};

function ResetPassword({ theme, onToggleTheme }: ResetPasswordProps): JSX.Element {
    return (
        <div className="login-page">
            <AuthVisualPanel />
            <ResetPasswordForm theme={theme} onToggleTheme={onToggleTheme} />
        </div>
    );
}

export default ResetPassword;
