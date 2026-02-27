import { loadRemote } from '@module-federation/enhanced/runtime';
import { Route } from '@angular/router';
import { RemoteDefinition } from './remotes.registry';
import { RemoteUnavailableComponent } from './remote-unavailable.component';

type RemoteRoutesModule = {
  remoteRoutes: Route[];
};

const normalizeError = (err: unknown): string => {
  if (err instanceof Error) {
    return err.message;
  }

  if (typeof err === 'string') {
    return err;
  }

  try {
    return JSON.stringify(err);
  } catch {
    return 'Unknown error';
  }
};

const buildFallbackRoute = (remote: RemoteDefinition, err: unknown): Route => ({
  path: '',
  component: RemoteUnavailableComponent,
  data: {
    remoteKey: remote.key,
    title: remote.title,
    error: normalizeError(err),
  },
});

export const loadRemoteRoutes = (
  remote: RemoteDefinition,
): (() => Promise<Route[]>) => {
  const remoteId = `${remote.key}/${remote.exposed}`;

  return () =>
    loadRemote<RemoteRoutesModule>(remoteId)
      .then((m) => m?.remoteRoutes ?? [])
      .catch((err) => {
        console.error(`[MF] Failed to load ${remote.key}`, err);
        return [buildFallbackRoute(remote, err)];
      });
};
