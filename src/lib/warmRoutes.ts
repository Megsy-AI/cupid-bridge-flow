/**
 * Warm every page chunk in the background so switching screens never shows a
 * loading state. Runs after first paint, one module at a time, and pauses while
 * the tab is hidden or the connection reports itself as slow / data-saving.
 */

const PAGE_MODULES = import.meta.glob("/src/pages/**/*.tsx");

let started = false;

function connectionAllowsWarming(): boolean {
  const conn = (navigator as unknown as { connection?: { saveData?: boolean; effectiveType?: string } })
    .connection;
  if (!conn) return true;
  if (conn.saveData) return false;
  return !/(^|-)2g$/.test(conn.effectiveType ?? "");
}

export function warmRoutes(): void {
  if (started || typeof window === "undefined") return;
  started = true;
  if (!connectionAllowsWarming()) return;

  const loaders = Object.values(PAGE_MODULES);
  let index = 0;

  const step = () => {
    if (index >= loaders.length) return;
    if (document.visibilityState === "hidden") {
      window.setTimeout(step, 1500);
      return;
    }
    const load = loaders[index++];
    void Promise.resolve()
      .then(load)
      .catch(() => {})
      .then(() => {
        // Yield between modules so warming never competes with user input.
        const ric = (window as unknown as { requestIdleCallback?: (cb: () => void, o?: unknown) => void })
          .requestIdleCallback;
        if (typeof ric === "function") ric(step, { timeout: 800 });
        else window.setTimeout(step, 60);
      });
  };

  step();
}
