import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/features/**/*.{js,ts,jsx,tsx}", // 🔥 IMPORTANT (you’re using features folder)
  ],

  theme: {
    extend: {
      colors: {
        primary: "#953002",
        secondary: "#FFB401",
        info: "#2F80ED",
        success: "#27AE60",
        warning: "#E2B93B",
        error: "#EB5757",
        "black-1": "#000000",
        "black-2": "#1D1D1D",
        "black-3": "#282828",
        "gray-1": "#333333",
        "gray-2": "#4F4F4F",
        "gray-3": "#828282",
        "gray-4": "#B0B0B0",
        "gray-5": "#E0E0E0",
      },
      boxShadow: {
        glow: "0 0 20px rgba(255, 180, 1, 0.4)",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },
    },
  },

  plugins: [],
};

export default config;