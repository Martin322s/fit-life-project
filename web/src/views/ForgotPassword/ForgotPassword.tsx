"use client";

import type { JSX } from "react";
import AuthVisualPanel from "../Login/sections/AuthVisualPanel";
import ForgotPasswordForm from "./sections/ForgotPasswordForm";

function ForgotPassword(): JSX.Element {
    return (
        <div className="login-page">
            <AuthVisualPanel />
            <ForgotPasswordForm />
        </div>
    );
}

export default ForgotPassword;
