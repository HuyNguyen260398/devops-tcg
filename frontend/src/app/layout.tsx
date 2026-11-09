import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { ServiceWorkerRegistrar } from "@/components/ServiceWorkerRegistrar";
import { THEME_COLORS, THEME_STORAGE_KEY } from "@/lib/theme";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://tcg.nghuy.link"),
  title: "DevOps TCG | Concept Study Deck",
  description:
    "Learn DevOps concepts through an accessible trading-card-inspired study deck.",
  applicationName: "DevOps TCG",
  // iOS ignores the manifest's icons and display mode; these are its own
  // spelling of the same thing. The status bar style is read once at launch,
  // so it cannot follow the theme: black-translucent lets the neon paper run
  // under it, and the shell's safe-area padding keeps the title clear.
  appleWebApp: {
    capable: true,
    title: "DevOps TCG",
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icons/apple-touch-icon.png",
  },
  formatDetection: { telephone: false },
};

// viewport-fit=cover lets an installed app paint behind the notch and the home
// indicator; globals.css pads the shell by the safe-area insets so nothing
// interactive sits there. Zoom stays enabled.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: THEME_COLORS.neon,
};

// The static export ships markup with no data-theme, so a stored sketch choice
// would otherwise appear only once React hydrates — a visible flash of the neon
// card first. This runs before the body paints. The CSP already allows inline
// scripts ('unsafe-inline'), which the RSC payload depends on too.
// It also repaints the browser chrome (theme-color) to match.
const themeScript = `(function(){try{var t=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY,
)})==="sketch"?"sketch":"neon";document.documentElement.setAttribute("data-theme",t);var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute("content",${JSON.stringify(
  THEME_COLORS,
)}[t])}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    // The script below mutates this element before hydration.
    <html lang="en" suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {children}
        <ServiceWorkerRegistrar />
      </body>
    </html>
  );
}
