"use client";

import { useEffect } from "react";
import { registerServiceWorker } from "@/lib/serviceWorker";

// Registered after `load` so precaching the export never competes with the
// first paint or the loading intro for bandwidth.
export function ServiceWorkerRegistrar() {
  useEffect(() => {
    const container =
      "serviceWorker" in navigator ? navigator.serviceWorker : undefined;
    const enabled = process.env.NODE_ENV === "production";
    const register = () => void registerServiceWorker(container, enabled);

    if (document.readyState === "complete") {
      register();
      return;
    }

    window.addEventListener("load", register, { once: true });
    return () => window.removeEventListener("load", register);
  }, []);

  return null;
}
