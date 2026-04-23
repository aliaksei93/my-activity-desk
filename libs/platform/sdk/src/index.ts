import type { LifeCycles } from 'single-spa';
import type {
  MountedRemote,
  PlatformContext,
  PlatformEvent,
  PlatformEventBus,
  PlatformEventListener,
  PlatformLogger,
  RemoteManifest,
  RemoteManifestEntry,
  RemoteMount,
} from '@my-activity-desk/platform/contracts';

type SingleSpaProps = Record<string, never>;

const remoteMountCache = new Map<string, Promise<RemoteMount>>();

const toEvent = (type: string, payload?: unknown): PlatformEvent => ({
  type,
  payload,
  timestamp: new Date().toISOString(),
});

const getRemoteEntryUrl = (
  entry: RemoteManifestEntry,
  mode: 'development' | 'production',
): string => {
  if (mode === 'development' && entry.devEntry) {
    return entry.devEntry;
  }

  return entry.entry;
};

const invariantMount = (
  candidate: unknown,
  entry: RemoteManifestEntry,
): RemoteMount => {
  if (typeof candidate !== 'function') {
    throw new Error(`Remote "${entry.key}" does not expose a valid mount function.`);
  }

  return candidate as RemoteMount;
};

const normalizeError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  try {
    return JSON.stringify(error);
  } catch {
    return 'Unknown error';
  }
};

export const createEventBus = (): PlatformEventBus => {
  const anyListeners = new Set<PlatformEventListener>();
  const listenersByType = new Map<string, Set<PlatformEventListener>>();

  return {
    emit(type, payload) {
      const event = toEvent(type, payload);

      listenersByType.get(type)?.forEach((listener) => listener(event));
      anyListeners.forEach((listener) => listener(event));
    },
    on(type, listener) {
      const listeners = listenersByType.get(type) ?? new Set<PlatformEventListener>();
      listeners.add(listener);
      listenersByType.set(type, listeners);

      return () => {
        listeners.delete(listener);
        if (listeners.size === 0) {
          listenersByType.delete(type);
        }
      };
    },
    onAny(listener) {
      anyListeners.add(listener);

      return () => {
        anyListeners.delete(listener);
      };
    },
  };
};

export const createConsoleLogger = (scope: string): PlatformLogger => ({
  info(message, details) {
    console.info(`[${scope}] ${message}`, details ?? '');
  },
  warn(message, details) {
    console.warn(`[${scope}] ${message}`, details ?? '');
  },
  error(message, details) {
    console.error(`[${scope}] ${message}`, details ?? '');
  },
});

export const loadRemoteManifest = async (
  url = '/platform.manifest.json',
): Promise<RemoteManifestEntry[]> => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch manifest from ${url}: ${response.status}`);
  }

  const manifest = (await response.json()) as RemoteManifest;
  return Object.values(manifest);
};

export const matchesRoute = (pathname: string, routePath: string): boolean => {
  const normalizedRoute = routePath.endsWith('/') && routePath !== '/'
    ? routePath.slice(0, -1)
    : routePath;

  if (normalizedRoute === '/') {
    return pathname === '/';
  }

  return pathname === normalizedRoute || pathname.startsWith(`${normalizedRoute}/`);
};

export const loadRemoteMount = async (
  entry: RemoteManifestEntry,
  mode: 'development' | 'production',
): Promise<RemoteMount> => {
  const cacheKey = `${mode}:${entry.key}`;
  const cached = remoteMountCache.get(cacheKey);

  if (cached) {
    return cached;
  }

  const remoteMountPromise = (async () => {
    const remoteModule = (await import(
      /* @vite-ignore */ getRemoteEntryUrl(entry, mode)
    )) as Record<string, unknown>;

    return invariantMount(remoteModule[entry.exportName ?? 'mount'], entry);
  })();

  remoteMountCache.set(cacheKey, remoteMountPromise);
  return remoteMountPromise;
};

export const preloadRemote = async (
  entry: RemoteManifestEntry,
  mode: 'development' | 'production',
  logger: PlatformLogger,
): Promise<void> => {
  try {
    await loadRemoteMount(entry, mode);
    logger.info(`Prefetched remote ${entry.key}`);
  } catch (error) {
    logger.warn(`Prefetch failed for ${entry.key}`, error);
  }
};

export const renderRemoteError = (
  container: HTMLElement,
  entry: RemoteManifestEntry,
  error: unknown,
): void => {
  container.innerHTML = `
    <section class="platform-card platform-card-error">
      <div class="platform-card-kicker">${entry.framework} remote unavailable</div>
      <h2>${entry.displayName}</h2>
      <p>${entry.description}</p>
      <pre>${normalizeError(error)}</pre>
    </section>
  `;
};

export const createSingleSpaRemoteApp = ({
  container,
  entry,
  mode,
  createContext,
}: {
  container: HTMLElement;
  entry: RemoteManifestEntry;
  mode: 'development' | 'production';
  createContext: (entry: RemoteManifestEntry) => PlatformContext;
}): LifeCycles<SingleSpaProps> => {
  let mountedRemote: MountedRemote | null = null;

  return {
    bootstrap: async () => undefined,
    async mount() {
      const context = createContext(entry);
      context.logger.info(`Mounting ${entry.key}`);
      container.dataset.remoteKey = entry.key;
      container.innerHTML = '';

      try {
        const mount = await loadRemoteMount(entry, mode);
        mountedRemote = await mount(container, context);
      } catch (error) {
        renderRemoteError(container, entry, error);
        context.logger.error(`Failed to mount ${entry.key}`, error);
      }
    },
    async unmount() {
      if (mountedRemote) {
        await mountedRemote.unmount();
      }

      mountedRemote = null;
      container.innerHTML = '';
      container.removeAttribute('data-remote-key');
    },
    async update() {
      if (mountedRemote?.update) {
        await mountedRemote.update(createContext(entry));
      }
    },
  };
};
