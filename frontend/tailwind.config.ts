import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-public-sans)", "sans-serif"],
      },
      colors: {
        background: "var(--color-background)",
        foreground: "var(--color-text-primary)",
        white: "var(--color-surface)",
        black: "var(--color-text-primary)",
        primary: {
          50: "#f0f4ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "var(--color-primary)",
          600: "var(--color-primary)",
          700: "var(--color-primary-hover)",
          800: "var(--color-primary-hover)",
          900: "var(--color-background)", // used for Feature 2 background
          950: "#1e1b4b",
        },
        brand: {
          50: "var(--color-background)",
          100: "var(--color-background)",
          500: "var(--color-primary-hover)",
          600: "var(--color-primary)",
          700: "var(--color-primary-hover)",
          900: "var(--color-text-primary)",
        },
        neutral: {
          50: "var(--color-background)",
          100: "var(--color-background)",
          200: "var(--color-border)",
          300: "var(--color-border)",
          400: "var(--color-text-secondary)",
          500: "var(--color-text-secondary)",
          600: "var(--color-text-secondary)",
          700: "var(--color-text-primary)",
          800: "var(--color-text-primary)",
          900: "var(--color-text-primary)",
          950: "var(--color-text-primary)",
        },
        gray: {
          50: "var(--color-background)",
          100: "var(--color-background)",
          200: "var(--color-border)",
          300: "var(--color-border)",
          400: "var(--color-text-secondary)",
          500: "var(--color-text-secondary)",
          600: "var(--color-text-secondary)",
          700: "var(--color-text-primary)",
          800: "var(--color-text-primary)",
          900: "var(--color-text-primary)",
        },
        accent: {
          DEFAULT: "var(--color-primary)",
          hover: "var(--color-primary-hover)",
        },
        priority: {
          low: "#3b82f6",
          medium: "var(--color-warning)",
          high: "var(--color-error)",
        },
        green: {
          100: "var(--color-border)",
          500: "var(--color-success)",
          600: "var(--color-success)",
        },
        red: {
          50: "var(--color-background)",
          100: "var(--color-border)",
          500: "var(--color-warning)",
          600: "var(--color-warning)",
        },
      },
      boxShadow: {
        soft: "0 4px 40px rgba(0, 0, 0, 0.04)",
        "soft-md":
          "0 4px 16px -4px rgba(0, 0, 0, 0.05), 0 2px 8px -2px rgba(0, 0, 0, 0.02)",
        "soft-lg": "0 10px 50px rgba(0, 0, 0, 0.06)",
      },
      spacing: {
        "0.5": "0.25rem", // 4px
        "1": "0.5rem", // 8px
        "2": "1rem", // 16px
        "3": "1.5rem", // 24px
        "4": "2rem", // 32px
        "5": "2.5rem", // 40px
        "6": "3rem", // 48px
        "8": "4rem", // 64px
        "10": "5rem", // 80px
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
