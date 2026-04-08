import type { JSX } from "react";
import { Link } from "react-router-dom";

function Logo(): JSX.Element {
    return (
        <Link to="/" className="navbar-logo">
            <div className="navbar-logo-icon">⚡</div>
            <span className="navbar-logo-text">
                Fit<span>Life</span>
            </span>
        </Link>
    )
}

export default Logo;