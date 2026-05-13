"use client";

import type { JSX } from "react";
import AuthVisualPanel from "./sections/AuthVisualPanel";
import LoginForm from "./sections/LoginForm";

function Login(): JSX.Element {
    return (
        <div className="login-page">
            <AuthVisualPanel />
            <LoginForm />
        </div>
    );
}

export default Login;
