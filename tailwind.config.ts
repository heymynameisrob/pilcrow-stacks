import tailwindcssAnimate from "tailwindcss-animate";
import tailwindTypography from "@tailwindcss/typography";

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
      typography: () => ({
        DEFAULT: {
          css: {
            "--tw-prose-body": "var(--gray-11)",
            "--tw-prose-headings": "var(--gray-12)",
            "--tw-prose-lead": "var(--gray-12)",
            "--tw-prose-links": "var(--gray-12)",
            "--tw-prose-bold": "var(--gray-12)",
            "--tw-prose-counters": "var(--gray-11)",
            "--tw-prose-bullets": "var(--gray-9)",
            "--tw-prose-hr": "var(--color-border)",
            "--tw-prose-quotes": "var(--gray-12)",
            "--tw-prose-quote-borders": "var(--color-border)",
            "--tw-prose-captions": "var(--gray-11)",
            "--tw-prose-code": "var(--gray-12)",
            "--tw-prose-pre-code": "var(--gray-12)",
            "--tw-prose-pre-bg": "var(--gray-1)",
            "--tw-prose-th-borders": "var(--color-border)",
            "--tw-prose-td-borders": "var(--color-border)",
          },
        },
      }),
    },
  },
  plugins: [tailwindcssAnimate, tailwindTypography],
};
export default config;
