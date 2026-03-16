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
          DEFAULT: "#7C3AED",
          50: "#F5F3FF",
          100: "#EDE9FE",
          200: "#DDD6FE",
          300: "#C4B5FD",
          400: "#A78BFA",
          500: "#8B5CF6",
          600: "#7C3AED",
          700: "#6D28D9",
          800: "#5B21B6",
          900: "#4C1D95",
        },
        accent: {
          DEFAULT: "#EC4899",
          50: "#FDF2F8",
          100: "#FCE7F3",
          200: "#FBCFE8",
          300: "#F9A8D4",
          400: "#F472B6",
          500: "#EC4899",
          600: "#DB2777",
          700: "#BE185D",
          800: "#9D174D",
          900: "#831843",
        },
        cyan: {
          DEFAULT: "#06B6D4",
          400: "#22D3EE",
          500: "#06B6D4",
          600: "#0891B2",
        },
        background: "#0F0F1A",
        surface: {
          DEFAULT: "#1A1A2E",
          secondary: "#16213E",
          tertiary: "#0D0D1F",
        },
      },
      fontFamily: {
        heading: ["var(--font-space-grotesk)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)",
        "gradient-purple-cyan": "linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)",
        "gradient-pink-purple": "linear-gradient(135deg, #EC4899 0%, #7C3AED 100%)",
        "gradient-radial-dark":
          "radial-gradient(ellipse at top, #1A1A2E 0%, #0F0F1A 100%)",
        "gradient-card":
          "linear-gradient(145deg, rgba(26,26,46,0.9) 0%, rgba(22,33,62,0.8) 100%)",
      },
      boxShadow: {
        glow: "0 0 20px rgba(124, 58, 237, 0.4)",
        "glow-pink": "0 0 20px rgba(236, 72, 153, 0.4)",
        "glow-cyan": "0 0 20px rgba(6, 182, 212, 0.4)",
        "glow-lg": "0 0 40px rgba(124, 58, 237, 0.3)",
        card: "0 4px 24px rgba(0,0,0,0.4)",
        "card-hover": "0 8px 32px rgba(0,0,0,0.5)",
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
          "0%, 100%": { boxShadow: "0 0 20px rgba(124, 58, 237, 0.4)" },
          "50%": { boxShadow: "0 0 40px rgba(236, 72, 153, 0.6)" },
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
