import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#059669",
          50: "#ECFDF5",
          100: "#D1FAE5",
          200: "#A7F3D0",
          300: "#6EE7B7",
          400: "#34D399",
          500: "#10B981",
          600: "#059669",
          700: "#047857",
          800: "#065F46",
          900: "#064E3B",
        },
        accent: {
          DEFAULT: "#F59E0B",
          50: "#FFFBEB",
          100: "#FEF3C7",
          200: "#FDE68A",
          300: "#FCD34D",
          400: "#FBBF24",
          500: "#F59E0B",
          600: "#D97706",
          700: "#B45309",
          800: "#92400E",
          900: "#78350F",
        },
        teal: {
          DEFAULT: "#0D9488",
          400: "#2DD4BF",
          500: "#14B8A6",
          600: "#0D9488",
        },
        background: "#FFFFFF",
        surface: {
          DEFAULT: "#F9FAFB",
          secondary: "#F3F4F6",
          tertiary: "#E5E7EB",
        },
      },
      fontFamily: {
        heading: ["var(--font-space-grotesk)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, #059669 0%, #0D9488 100%)",
        "gradient-green-amber": "linear-gradient(135deg, #059669 0%, #F59E0B 100%)",
        "gradient-emerald-teal": "linear-gradient(135deg, #10B981 0%, #0D9488 100%)",
        "gradient-radial-light":
          "radial-gradient(ellipse at top, #ECFDF5 0%, #FFFFFF 100%)",
        "gradient-card":
          "linear-gradient(145deg, rgba(249,250,251,0.9) 0%, rgba(243,244,246,0.8) 100%)",
      },
      boxShadow: {
        glow: "0 0 20px rgba(5, 150, 105, 0.35)",
        "glow-amber": "0 0 20px rgba(245, 158, 11, 0.35)",
        "glow-teal": "0 0 20px rgba(13, 148, 136, 0.35)",
        "glow-lg": "0 0 40px rgba(5, 150, 105, 0.25)",
        card: "0 4px 24px rgba(0,0,0,0.06)",
        "card-hover": "0 8px 32px rgba(0,0,0,0.1)",
      },
      animation: {
        "gradient-border": "gradient-border 3s linear infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "fade-in": "fade-in 0.3s ease-out",
        "slide-up": "slide-up 0.3s ease-out",
      },
      keyframes: {
        "gradient-border": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(5, 150, 105, 0.35)" },
          "50%": { boxShadow: "0 0 40px rgba(245, 158, 11, 0.5)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-up": {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
    },
  },
  plugins: [],
};

export default config;
