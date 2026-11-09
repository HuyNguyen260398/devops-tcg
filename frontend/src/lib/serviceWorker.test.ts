import { describe, expect, it, vi } from "vitest";
import { SERVICE_WORKER_URL, registerServiceWorker } from "./serviceWorker";

const container = (register: ServiceWorkerContainer["register"]) =>
  ({ register }) as unknown as ServiceWorkerContainer;

describe("registerServiceWorker", () => {
  it("registers the generated worker for the whole site", async () => {
    const registration = {} as ServiceWorkerRegistration;
    const register = vi.fn().mockResolvedValue(registration);

    await expect(
      registerServiceWorker(container(register), true),
    ).resolves.toBe(registration);
    expect(register).toHaveBeenCalledWith(SERVICE_WORKER_URL, { scope: "/" });
  });

  it("does nothing outside a production build", async () => {
    const register = vi.fn();

    await expect(
      registerServiceWorker(container(register), false),
    ).resolves.toBeNull();
    expect(register).not.toHaveBeenCalled();
  });

  it("does nothing where the browser has no service workers", async () => {
    await expect(registerServiceWorker(undefined, true)).resolves.toBeNull();
  });

  it("leaves the site online-only when registration is refused", async () => {
    const register = vi.fn().mockRejectedValue(new Error("SecurityError"));

    await expect(
      registerServiceWorker(container(register), true),
    ).resolves.toBeNull();
  });
});
