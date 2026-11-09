export interface Precache {
  readonly urls: readonly string[];
  readonly version: string;
}

export function toUrl(outDir: string, file: string): string;
export function collectPrecache(outDir: string): Promise<Precache>;
export function renderServiceWorker(
  template: string,
  precache: Precache,
): string;
export function buildServiceWorker(outDir: string): Promise<Precache>;
