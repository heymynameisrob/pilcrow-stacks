import tailwindcssAnimate from "tailwindcss-animate";

import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        primary: "var(--gray-12)",
        secondary: "var(--gray-11)",
        accent: "var(--accent)",
        ring: "var(--gray-12)",
        gray: {
          "1": "var(--gray-1)",
          "2": "var(--gray-2)",
          "3": "var(--gray-3)",
          "4": "var(--gray-4)",
          "5": "var(--gray-5)",
          "6": "var(--gray-6)",
          "7": "var(--gray-7)",
          "8": "var(--gray-8)",
          "9": "var(--gray-9)",
          "10": "var(--gray-10)",
          "11": "var(--gray-11",
          "12": "var(--gray-12)",
        },
      },
      boxShadow: {
        DEFAULT: "var(--shadow-flat)",
        flat: "var(--shadow-flat)",
        raised: "var(--shadow-raised)",
        floating: "var(--shadow-floating)",
      },
      borderColor: {
        DEFAULT: "var(--border)",
        primary: "var(--border)",
        secondary: "var(--border-secondary)",
        accent: "var(--border-accent)",
      },
      gridTemplateRows: {
        "app-layout": "minmax(auto,48px) 1fr", // header, content
      },
      gridTemplateColumns: {
        "sidebar-layout": "minmax(auto, 300px) 1fr", // Sidebar, content
      },
      zIndex: {
        max: "999999",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};
export default config;
