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

      const validRemotes: { name: string; entry: string }[] = [];

      for (const [name, entry] of Object.entries(remotes)) {
        try {
          const head = await fetch(entry, { method: 'HEAD' });
          if (head.ok) {
            validRemotes.push({ name, entry });
          } else {
            console.warn(`[MF] Remote ${name} not reachable`);
          }
        } catch {
          console.warn(`[MF] Remote ${name} failed`);
        }
      }

      if (validRemotes.length) {
        registerRemotes(validRemotes);
        console.info(
          '[MF] Registered remotes:',
          validRemotes.map((r) => r.name),
        );
      }
    } catch (err) {
      console.error('[MF] Init failed', err);
    }
  })();

  return mfInitPromise;
};
