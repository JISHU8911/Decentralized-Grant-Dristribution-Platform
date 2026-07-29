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
        background: "var(--background)",
        foreground: "var(--foreground)",
        brand: {
          primary: "#4F46E5", // Royal Indigo
          secondary: "#06B6D4", // Cyan
          accent: "#7C3AED", // Violet
          success: "#059669", // Emerald
          warning: "#D97706", // Amber
          error: "#DC2626", // Rose
          lightBg: "#F8FAFC", // Soft Slate White
          cardBg: "#FFFFFF", // Pure White
          border: "#E2E8F0", // Slate 200
          heading: "#0F172A", // Slate 900
          muted: "#475569", // Slate 600
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["Fira Code", "monospace"],
      },
      boxShadow: {
        'fintech': '0 4px 20px -2px rgba(15, 23, 42, 0.05), 0 2px 6px -1px rgba(15, 23, 42, 0.03)',
        'fintech-lg': '0 10px 30px -4px rgba(15, 23, 42, 0.08), 0 4px 12px -2px rgba(15, 23, 42, 0.04)',
      }
    },
  },
  plugins: [],
};

export default config;
