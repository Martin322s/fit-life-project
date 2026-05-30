"use client";

import type { JSX } from "react";
import AuthVisualPanel from "./sections/AuthVisualPanel";
import LoginForm from "./sections/LoginForm";

function Login(): JSX.Element {
    return (
        // Tailwind: full-viewport two-column layout (visual panel left, form right)
        <div className="login-page flex min-h-screen w-full">
            <AuthVisualPanel />
            <LoginForm />
        </div>
    );
}

export default Login;
