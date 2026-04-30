import type { JSX } from "react";

export default function LoadingScreen(): JSX.Element {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "#080C10",
      }}
    >
      <style>{`@keyframes _spin { to { transform: rotate(360deg); } }`}</style>
      <svg
        width="36"
        height="36"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#0066FF"
        strokeWidth={2.5}
        strokeLinecap="round"
        style={{ animation: "_spin 0.9s linear infinite" }}
      >
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
    </div>
  );
}
