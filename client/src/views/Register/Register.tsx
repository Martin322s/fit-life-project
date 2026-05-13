"use client";

import type { JSX } from "react";
import RegisterVisualPanel from "./sections/RegisterVisualPanel";
import RegisterForm from "./sections/RegisterForm";

function Register(): JSX.Element {
    return (
        <div className="auth-page">
            <RegisterVisualPanel />
            <RegisterForm />
        </div>
    );
}

export default Register;
