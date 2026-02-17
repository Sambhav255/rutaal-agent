import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        rutaal: {
          green: "#006847",
          yellow: "#e39f2e",
          red: "#CE1126",
          navy: "#003893",
        },
      },
      keyframes: {
        "slide-in-top": {
          "0%": { transform: "translateY(-100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "slide-out-right": {
          "0%": { transform: "translateX(0)", opacity: "1" },
          "100%": { transform: "translateX(100%)", opacity: "0" },
        },
        "green-pulse": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(0, 104, 71, 0.4)" },
          "50%": { boxShadow: "0 0 0 8px rgba(0, 104, 71, 0)" },
        },
        "red-pulse": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(206, 17, 38, 0.6)" },
          "50%": { boxShadow: "0 0 0 8px rgba(206, 17, 38, 0)" },
        },
        "stat-flash": {
          "0%": { transform: "scale(1)", color: "inherit" },
          "50%": { transform: "scale(1.05)", color: "#e39f2e" },
          "100%": { transform: "scale(1)", color: "inherit" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        "slide-in-top": "slide-in-top 0.3s ease-out",
        "slide-out-right": "slide-out-right 0.3s ease-out",
        "green-pulse": "green-pulse 2s ease-in-out infinite",
        "red-pulse": "red-pulse 1s ease-in-out infinite",
        "stat-flash": "stat-flash 0.4s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
