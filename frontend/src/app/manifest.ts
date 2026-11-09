import type { MetadataRoute } from "next";
import { THEME_COLORS } from "@/lib/theme";

// Emitted at build time as /manifest.webmanifest. The colours are the neon
// paper: the splash screen and the installed window's frame show before any
// stored theme choice can be read.
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "DevOps TCG — Concept Study Deck",
    short_name: "DevOps TCG",
    description:
      "Learn DevOps concepts through an accessible trading-card-inspired study deck.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: THEME_COLORS.neon,
    theme_color: THEME_COLORS.neon,
    categories: ["education", "productivity"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
