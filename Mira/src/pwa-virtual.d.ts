declare module "virtual:pwa-register" {
  export interface RegisterSWOptions {
    immediate?: boolean;
    onNeedRefresh?: () => void;
    onOfflineReady?: () => void;
    onRegistered?: (r: ServiceWorkerRegistration | undefined) => void;
    onRegisterError?: (e: unknown) => void;
  }
  export function registerSW(options?: RegisterSWOptions): (reload?: boolean) => Promise<void>;
}

declare module "virtual:pwa-register/react" {
  export interface RegisterSWOptions {
    immediate?: boolean;
    onNeedRefresh?: () => void;
    onOfflineReady?: () => void;
    onRegistered?: (r: ServiceWorkerRegistration | undefined) => void;
    onRegisterError?: (e: unknown) => void;
  }
  export function registerSW(options?: RegisterSWOptions): (reload?: boolean) => Promise<void>;
}
