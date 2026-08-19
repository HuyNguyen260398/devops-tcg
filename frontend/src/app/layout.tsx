import type { Metadata } from "next";
import type { ReactNode } from "react";
import { THEME_STORAGE_KEY } from "@/lib/theme";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://tcg.nghuy.link"),
  title: "DevOps TCG | Concept Study Deck",
  description:
    "Learn DevOps concepts through an accessible trading-card-inspired study deck.",
};

// The static export ships markup with no data-theme, so a stored sketch choice
// would otherwise appear only once React hydrates — a visible flash of the neon
// card first. This runs before the body paints. The CSP already allows inline
// scripts ('unsafe-inline'), which the RSC payload depends on too.
const themeScript = `(function(){try{var t=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY,
)});document.documentElement.setAttribute("data-theme",t==="sketch"?"sketch":"neon")}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    // The script below mutates this element before hydration.
    <html lang="en" suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {children}
      </body>
    </html>
  );
}
