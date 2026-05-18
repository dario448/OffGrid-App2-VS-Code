import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        forest:     "#F2F8EE",
        "forest-2": "#FFFFFF",
        "forest-3": "#C8E0BC",
        solar:      "#A8FF3E",
        "solar-dim":"#6DB82A",
        bark:       "#637A6E",
        snow:       "#0D1F14",
        gold:       "#F59E0B",
        mystic:     "#8B5CF6",
        sky:        "#38BDF8",
      },
      fontFamily: {
        syne:  ["var(--font-syne)", "sans-serif"],
        inter: ["var(--font-inter)", "sans-serif"],
        space: ["var(--font-space)", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
