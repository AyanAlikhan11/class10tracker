import React from "react";
import Link from "next/link";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showWordmark?: boolean;
  variant?: "default" | "white";
}

export function Logo({
  className = "",
  size = "md",
  showWordmark = true,
  variant = "default",
}: LogoProps) {
  const iconSizes = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  const isWhite = variant === "white";

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* AWESOME EMBLEM: The Ascension Book & North Star */}
      <div
        className={`relative ${iconSizes[size]} shrink-0 flex items-center justify-center rounded-2xl p-1.5 transition-transform duration-200 hover:scale-105 shadow-md ${
          isWhite
            ? "bg-white shadow-black/10"
            : "bg-gradient-to-br from-[#2563EB] via-[#1D4ED8] to-[#0D9488] shadow-blue-500/25"
        }`}
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <defs>
            {/* Gradients */}
            <linearGradient id="bookLeft" x1="20" y1="35" x2="50" y2="85" gradientUnits="userSpaceOnUse">
              <stop stopColor={isWhite ? "#2563EB" : "#FFFFFF"} stopOpacity="0.95" />
              <stop stopColor={isWhite ? "#1D4ED8" : "#93C5FD"} />
            </linearGradient>

            <linearGradient id="bookRight" x1="80" y1="35" x2="50" y2="85" gradientUnits="userSpaceOnUse">
              <stop stopColor={isWhite ? "#06B6D4" : "#FFFFFF"} stopOpacity="0.85" />
              <stop stopColor={isWhite ? "#0D9488" : "#67E8F9"} />
            </linearGradient>

            <linearGradient id="goldStar" x1="50" y1="10" x2="50" y2="35" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F59E0B" />
              <stop stopColor="#FBBF24" />
            </linearGradient>

            <filter id="glow" x="25" y="5" width="50" height="50" filterUnits="userSpaceOnUse">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Left Wing / Book Page (Ascending chevron) */}
          <path
            d="M50 48L22 62C18 64 16 68 16 72V76C16 80 20 83 24 81L50 68V48Z"
            fill="url(#bookLeft)"
          />

          {/* Right Wing / Book Page (Ascending chevron) */}
          <path
            d="M50 48L78 62C82 64 84 68 84 72V76C84 80 80 83 76 81L50 68V48Z"
            fill="url(#bookRight)"
          />

          {/* Center Spine Glow */}
          <path
            d="M50 42L47 69L50 71L53 69L50 42Z"
            fill={isWhite ? "#1D4ED8" : "#FFFFFF"}
            fillOpacity="0.7"
          />

          {/* Golden North Star / Excellence Spark */}
          <path
            d="M50 14L53.5 24.5L64 28L53.5 31.5L50 42L46.5 31.5L36 28L46.5 24.5L50 14Z"
            fill="url(#goldStar)"
            filter="url(#glow)"
          />
        </svg>
      </div>

      {/* WORDMARK */}
      {showWordmark && (
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-sans font-black tracking-tight leading-none ${textSizes[size]} ${
                isWhite ? "text-white" : "text-[#0F172A]"
              }`}
            >
              Board<span className="text-[#2563EB]">Prep</span>
            </span>
            <span className="text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-[#2563EB]/10 text-[#2563EB] border border-[#2563EB]/20">
              10th
            </span>
          </div>
          <span
            className={`text-[10px] font-bold tracking-wide mt-0.5 ${
              isWhite ? "text-blue-100/70" : "text-[#64748B]"
            }`}
          >
            CBSE Class 10 Companion
          </span>
        </div>
      )}
    </div>
  );
}
