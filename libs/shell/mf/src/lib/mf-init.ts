import { registerRemotes } from '@module-federation/enhanced/runtime';

let mfInitPromise: Promise<void> | null = null;

export const initModuleFederation: () => Promise<void> = async (): Promise<void> => {
  if (mfInitPromise) {
    return mfInitPromise;
  }

  mfInitPromise = (async (): Promise<void> => {
    try {
      const res = await fetch('/module-federation.manifest.json');

      if (!res.ok) {
        console.warn('[MF] Manifest not found');
        return; // resolve(void)
      }

      const remotes: Record<string, string> = await res.json();

      registerRemotes(Object.entries(remotes).map(([name, entry]) => ({ name, entry })));
    } catch (err) {
      console.error('[MF] Init failed', err);
    }
  })();

  return mfInitPromise;
};
