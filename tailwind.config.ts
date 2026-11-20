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
        game: {
          bg: "#0d0f17",
          panel: "#151824",
          "panel-light": "#1e2235",
          border: "#2e344d",
          "border-gold": "#c89b3c",
          gold: "#f0b232",
          void: "#7c3aed",
          arcane: "#38bdf8",
          health: "#dc2626",
          mana: "#2563eb",
          energy: "#16a34a",
          stamina: "#eab308",
        },
        rarity: {
          common: "#9ca3af",
          uncommon: "#22c55e",
          rare: "#3b82f6",
          epic: "#a855f7",
          legendary: "#f97316",
          mythic: "#ef4444",
        },
      },
      fontFamily: {
        fantasy: ["Cinzel", "Cinzel Decorative", "Georgia", "serif"],
        pixel: ["Courier New", "monospace"],
      },
      boxShadow: {
        rpg: "0 0 15px rgba(0, 0, 0, 0.7), inset 0 0 10px rgba(200, 155, 60, 0.15)",
        "gold-glow": "0 0 20px rgba(200, 155, 60, 0.4)",
        "void-glow": "0 0 20px rgba(124, 58, 237, 0.4)",
      },
    },
  },
  plugins: [],
};
export default config;
