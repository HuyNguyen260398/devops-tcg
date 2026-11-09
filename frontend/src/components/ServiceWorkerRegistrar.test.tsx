import { render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import * as serviceWorker from "@/lib/serviceWorker";
import { ServiceWorkerRegistrar } from "./ServiceWorkerRegistrar";

afterEach(() => vi.restoreAllMocks());

describe("ServiceWorkerRegistrar", () => {
  it("renders nothing and registers once the page has loaded", () => {
    const register = vi
      .spyOn(serviceWorker, "registerServiceWorker")
      .mockResolvedValue(null);

    const { container } = render(<ServiceWorkerRegistrar />);

    expect(container).toBeEmptyDOMElement();
    // jsdom has finished loading by the time a test runs, and has no
    // navigator.serviceWorker; vitest is not a production build.
    expect(register).toHaveBeenCalledWith(undefined, false);
  });

  it("waits for load when the page is still loading", () => {
    const register = vi
      .spyOn(serviceWorker, "registerServiceWorker")
      .mockResolvedValue(null);
    const readyState = vi
      .spyOn(document, "readyState", "get")
      .mockReturnValue("loading");

    const { unmount } = render(<ServiceWorkerRegistrar />);
    expect(register).not.toHaveBeenCalled();

    readyState.mockReturnValue("complete");
    window.dispatchEvent(new Event("load"));
    expect(register).toHaveBeenCalledTimes(1);
    unmount();
  });
});
