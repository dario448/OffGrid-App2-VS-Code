import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        forest:     "#060D08",   // body background (dark)
        "forest-2": "#0E1C0B",   // card surface
        "forest-3": "#1E3219",   // borders / dividers
        solar:      "#A8FF3E",   // neon solar green
        "solar-dim":"#6DB82A",   // muted solar green
        bark:       "#7EA87E",   // secondary text (visible on dark)
        snow:       "#E6F5E0",   // primary text (near-white)
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
