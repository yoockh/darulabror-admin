import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "da-green": "var(--da-green)",
        "da-green-2": "var(--da-green-2)",
        "da-accent": "var(--da-accent)",
        "da-bg": "var(--da-bg)",
        "da-text-primary": "var(--da-text-primary)",
        "da-text-secondary": "var(--da-text-secondary)",
        "da-border": "var(--da-border)",
      },
      boxShadow: {
        "da-card": "var(--da-card-shadow)",
        "da-hover": "var(--da-hover-shadow)",
      },
    },
  },
  plugins: [],
} satisfies Config;
