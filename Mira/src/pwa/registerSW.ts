// Mira PWA service worker registration.
// Registers only in production and when service workers are supported.
export async function registerPWA() {
  if (typeof window === "undefined") return;
  if (!import.meta.env.PROD) return;
  if (!("serviceWorker" in navigator)) return;
  if (new URLSearchParams(window.location.search).get("sw") === "off") return;

  try {
    const { registerSW } = await import("virtual:pwa-register/react");
    registerSW({ immediate: true });
  } catch {
    /* noop */
  }
}
