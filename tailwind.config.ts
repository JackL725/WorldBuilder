import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── Dark Fantasy Palette ──────────────────────────────
        forge: {
          // Backgrounds
          void:    "#08080f",   // deepest bg
          base:    "#0d0d17",   // main bg
          surface: "#11111e",   // cards
          raised:  "#161625",   // raised panels
          border:  "#1e1e32",   // borders
          // Text
          parchment: "#e8dfc8", // primary text
          muted:     "#6b6380", // secondary text
          dim:       "#3a3650", // placeholder
          // Brand — Gold/Amber
          gold:    "#d4a843",
          "gold-dark": "#b8892a",
          "gold-light": "#e8c06a",
          // Accent — Purple
          arcane:  "#7c3aed",
          "arcane-light": "#a855f7",
          // Module colors
          crimson: "#c0392b",   // quests / danger
          teal:    "#0d9488",   // lore / magic
          slate:   "#334155",   // items
        },
      },
      fontFamily: {
        serif: ["Palatino Linotype", "Palatino", "Book Antiqua", "Georgia", "serif"],
        display: ["Cinzel", "Palatino", "serif"],
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "flicker": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.85" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(4px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-left": {
          from: { opacity: "0", transform: "translateX(-8px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "flicker": "flicker 3s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
        "fade-in": "fade-in 0.3s ease-out",
        "slide-in-left": "slide-in-left 0.25s ease-out",
      },
      backgroundImage: {
        "forge-gradient": "linear-gradient(135deg, #0d0d17 0%, #13132a 100%)",
        "gold-gradient": "linear-gradient(135deg, #d4a843 0%, #b8892a 100%)",
        "arcane-gradient": "linear-gradient(135deg, #7c3aed 0%, #4f1db5 100%)",
        "shimmer-gradient": "linear-gradient(90deg, transparent 0%, rgba(212,168,67,0.1) 50%, transparent 100%)",
      },
    },
  },
  plugins: [animate],
};

export default config;
