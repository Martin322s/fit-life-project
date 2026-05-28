import type { JSX } from "react";

export default function LoadingScreen(): JSX.Element {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#080C10]">
      <svg
        className="animate-spin"
        width="36"
        height="36"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#0066FF"
        strokeWidth={2.5}
        strokeLinecap="round"
      >
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
    </div>
  );
}
