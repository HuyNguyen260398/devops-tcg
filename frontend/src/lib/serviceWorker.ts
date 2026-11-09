// The worker is generated into the static export by scripts/build-sw.mjs, so it
// exists only in a production build; `next dev` has no /sw.js to register.
export const SERVICE_WORKER_URL = "/sw.js";

export const registerServiceWorker = async (
  container: ServiceWorkerContainer | undefined,
  enabled: boolean,
): Promise<ServiceWorkerRegistration | null> => {
  if (!enabled || container === undefined) return null;

  try {
    return await container.register(SERVICE_WORKER_URL, { scope: "/" });
  } catch {
    // A refused registration (private mode, a blocked origin) leaves the site
    // exactly as it was before it was installable: online-only.
    return null;
  }
};
