import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Electric Cobalt & Aurora Mint Modern Palette
        brand: {
          cobalt: "#2563EB",
          cobaltHover: "#1D4ED8",
          cobaltLight: "#EFF6FF",
          cobaltBorder: "rgba(37, 99, 235, 0.15)",
          mint: "#10B981",
          mintHover: "#059669",
          mintLight: "#ECFDF5",
          mintBorder: "rgba(16, 185, 129, 0.2)",
          amber: "#F59E0B",
          amberLight: "#FEF3C7",
          rose: "#F43F5E",
          roseLight: "#FFF1F2",
          slate: "#0F172A",
          slateMuted: "#64748B",
          // Backward-compatibility aliases
          purple: "#2563EB",
          purpleHover: "#1D4ED8",
          purpleLight: "#EFF6FF",
          purpleBorder: "rgba(37, 99, 235, 0.15)",
          coral: "#F43F5E",
          coralLight: "#FFF1F2",
          ink: "#0F172A",
          ink2: "#334155",
          muted: "#64748B",
        },
        primary: {
          DEFAULT: "#2563EB",
          foreground: "#FFFFFF",
          hover: "#1D4ED8",
          light: "#EFF6FF",
        },
        secondary: {
          DEFAULT: "#10B981",
          foreground: "#FFFFFF",
          hover: "#059669",
          light: "#ECFDF5",
        },
        accent: {
          coral: "#F43F5E",
          amber: "#F59E0B",
          mint: "#10B981",
          cobalt: "#2563EB",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          muted: "#F8FAFC",
          subtle: "#F1F5F9",
          dark: "#0F172A",
        },
        border: "rgba(37, 99, 235, 0.12)",
      },
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        heading: ["'Outfit'", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        classic: ["'Lora'", "'Newsreader'", "Georgia", "Cambria", "'Times New Roman'", "serif"],
        serif: ["'Lora'", "'Newsreader'", "Georgia", "serif"],
      },
      borderRadius: {
        "3xl": "24px",
        "2xl": "18px",
        xl: "14px",
        lg: "12px",
        full: "9999px",
      },
      boxShadow: {
        card: "0 4px 20px rgba(15, 23, 42, 0.06)",
        "card-hover": "0 12px 36px rgba(37, 99, 235, 0.12)",
        glow: "0 8px 30px rgba(37, 99, 235, 0.25)",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        marquee: "marquee 25s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
