import type { Config } from "tailwindcss";

// Every colour here resolves to a CSS custom property declared in globals.css,
// so a theme change is a change to token values rather than to markup. The
// values are opaque strings, so Tailwind opacity modifiers (text-ink/60) must
// not be used on them.
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        paper: "var(--paper)",
        ink: "var(--ink)",
        "ink-muted": "var(--ink-muted)",
        "ink-faint": "var(--ink-faint)",
        accent: "var(--accent)",
        "accent-soft": "var(--accent-soft)",
        "accent-ink": "var(--accent-ink)",
        mark: "var(--mark)",
        "mark-soft": "var(--mark-soft)",
        "mark-border": "var(--mark-border)",
        "mark-ink": "var(--mark-ink)",
        panel: "var(--panel)",
        rule: "var(--rule)",
        chip: "var(--chip)",
        "chip-border": "var(--chip-border)",
        "chip-ink": "var(--chip-ink)",
        "type-chip": "var(--type-chip)",
        "type-chip-border": "var(--type-chip-border)",
        "type-chip-ink": "var(--type-chip-ink)",
        control: "var(--control)",
        "control-border": "var(--control-border)",
        "control-ink": "var(--control-ink)",
        "thumb-backdrop": "var(--thumb-backdrop)",
      },
      fontFamily: {
        display: "var(--font-display)",
      },
      borderRadius: {
        card: "var(--card-radius)",
        "card-outer": "var(--card-radius-outer)",
        "card-inner": "var(--card-radius-inner)",
      },
    },
  },
  plugins: [],
} satisfies Config;
