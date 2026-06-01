"use client";

import type { JSX } from "react";
import AuthVisualPanel from "../Login/sections/AuthVisualPanel";
import ResetPasswordForm from "./sections/ResetPasswordForm";

function ResetPassword(): JSX.Element {
    return (
        <div className="login-page">
            <AuthVisualPanel />
            <ResetPasswordForm />
        </div>
    );
}

export default ResetPassword;
