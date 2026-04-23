export type PlatformEvent = {
  type: string;
  payload?: unknown;
  timestamp: string;
};

export type PlatformEventListener = (event: PlatformEvent) => void;
export type PlatformUnsubscribe = () => void;

export type PlatformEventBus = {
  emit: (type: string, payload?: unknown) => void;
  on: (type: string, listener: PlatformEventListener) => PlatformUnsubscribe;
  onAny: (listener: PlatformEventListener) => PlatformUnsubscribe;
};

export type PlatformLogger = {
  info: (message: string, details?: unknown) => void;
  warn: (message: string, details?: unknown) => void;
  error: (message: string, details?: unknown) => void;
};

export type PlatformSession = {
  signedIn: boolean;
  userId?: string;
};

export type PlatformContext = {
  basePath: string;
  routePath: string;
  flags: Record<string, boolean>;
  session: PlatformSession;
  navigate: (to: string) => void;
  events: PlatformEventBus;
  logger: PlatformLogger;
};

export type MountedRemote = {
  unmount: () => void | Promise<void>;
  update?: (context: PlatformContext) => void | Promise<void>;
};

export type RemoteMount = (
  container: HTMLElement,
  context: PlatformContext,
) => MountedRemote | Promise<MountedRemote>;

export type RemoteManifestEntry = {
  key: string;
  displayName: string;
  description: string;
  framework: 'angular' | 'react' | 'vue' | 'agnostic';
  routePath: string;
  preload?: boolean;
  entry: string;
  devEntry?: string;
  exportName?: string;
};

export type RemoteManifest = Record<string, RemoteManifestEntry>;
