import React from "react";

interface LogoProps {
  size?: number;
  className?: string;
  variant?: "color" | "white" | "dark";
}

export default function Logo({ size = 40, className = "", variant = "color" }: LogoProps) {
  const colors = {
    color: {
      doc: "#2563EB",
      docLight: "#3B82F6",
      star: "#F59E0B",
      starLight: "#FBBF24",
      wing: "#10B981",
      accent: "#6366F1",
    },
    white: {
      doc: "#ffffff",
      docLight: "#e2e8f0",
      star: "#ffffff",
      starLight: "#e2e8f0",
      wing: "#ffffff",
      accent: "#ffffff",
    },
    dark: {
      doc: "#1e293b",
      docLight: "#334155",
      star: "#b45309",
      starLight: "#d97706",
      wing: "#047857",
      accent: "#4338ca",
    },
  };

  const c = colors[variant];
  const s = size;

  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Passport / Document base */}
      <rect
        x="6"
        y="4"
        width="22"
        height="28"
        rx="3"
        fill={c.doc}
        opacity="0.15"
      />
      <rect
        x="8"
        y="6"
        width="18"
        height="24"
        rx="2"
        stroke={c.doc}
        strokeWidth="2"
        fill="none"
      />
      {/* Inner document lines */}
      <line x1="12" y1="12" x2="22" y2="12" stroke={c.docLight} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="12" y1="17" x2="20" y2="17" stroke={c.docLight} strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <line x1="12" y1="21" x2="18" y2="21" stroke={c.docLight} strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />

      {/* Globe arc - representing global visas */}
      <path
        d="M10 26C10 26 13 22 17 22C21 22 24 26 24 26"
        stroke={c.accent}
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.7"
      />

      {/* Star / Dream symbol */}
      <path
        d="M28 8L29.5 12.5H34L30.25 15.5L31.75 20L28 17L24.25 20L25.75 15.5L22 12.5H26.5L28 8Z"
        fill={c.star}
        stroke={c.starLight}
        strokeWidth="1"
        strokeLinejoin="round"
      />

      {/* Wing / flight path - representing dreams taking flight */}
      <path
        d="M30 24C30 24 33 22 34 24C35 26 32 28 30 30C28 32 26 33 26 33"
        stroke={c.wing}
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M28 26C28 26 30 25 31 26.5C32 28 30 29 28 30.5"
        stroke={c.wing}
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
        opacity="0.6"
      />
    </svg>
  );
}
