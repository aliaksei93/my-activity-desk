import { registerRemotes } from '@module-federation/enhanced/runtime';

(async () => {
  try {
    const res = await fetch('/module-federation.manifest.json');
    if (!res.ok) {
      console.warn(`MF manifest HTTP ${res.status}, skip remotes`);
      return;
    }

    const remotes: Record<string, string> = await res.json();
    const remoteEntries = Object.entries(remotes).map(([name, entry]) => ({
      name,
      entry,
    }));

    try {
      registerRemotes(remoteEntries);
    } catch (err) {
      console.error('[MF] registerRemotes failed, continue without remotes:', err);
    }
  } catch (err) {
    console.error('[MF] Failed to init remotes, continue with shell only:', err);
  }
})();

import('./bootstrap').catch((err) => console.error('[Bootstrap] Failed to start Angular:', err));
