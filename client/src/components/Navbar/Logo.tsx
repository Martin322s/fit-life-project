import type { JSX } from "react";

function Logo(): JSX.Element {
    return (
        <a href="index-v2.html" className="navbar-logo">
            <div className="navbar-logo-icon">⚡</div>
            <span className="navbar-logo-text">
                Fit<span>Life</span>
            </span>
        </a>
    )
}

export default Logo;