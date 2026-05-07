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