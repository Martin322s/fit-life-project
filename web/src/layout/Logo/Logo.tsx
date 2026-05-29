"use client";

import type { JSX } from "react";
import Link from "next/link";

function Logo(): JSX.Element {
    return (
        <Link href="/" className="navbar-logo">
            <div className="navbar-logo-icon">⚡</div>
            <span className="navbar-logo-text">
                Fit<span>Life</span>
            </span>
        </Link>
    );
}

export default Logo;
