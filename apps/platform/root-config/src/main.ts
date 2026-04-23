import './styles.scss';
import { addErrorHandler, navigateToUrl, registerApplication, start } from 'single-spa';
import type { PlatformEvent, RemoteManifestEntry } from '@my-activity-desk/platform/contracts';
import {
  createConsoleLogger,
  createEventBus,
  createSingleSpaRemoteApp,
  loadRemoteManifest,
  matchesRoute,
  preloadRemote,
} from '@my-activity-desk/platform/sdk';

const mode = import.meta.env.DEV ? 'development' : 'production';
const logger = createConsoleLogger('platform');
const eventBus = createEventBus();

const appRoot = document.querySelector('#app');

if (!(appRoot instanceof HTMLElement)) {
  throw new Error('Platform root element not found.');
}

const renderShell = (remotes: RemoteManifestEntry[]): HTMLElement => {
  appRoot.innerHTML = `
    <div class="platform-shell">
      <aside class="platform-rail">
        <a class="platform-mark" href="/">
          <span class="platform-mark-dot"></span>
          <span>
            <strong>My Activity Desk</strong>
            <span>Polyglot microfrontend platform</span>
          </span>
        </a>

        <nav class="platform-nav" aria-label="Remote navigation">
          <a class="platform-nav-link" data-route="/" href="/">Platform Home</a>
          ${remotes
            .map(
              (remote) => `
                <a class="platform-nav-link" data-route="${remote.routePath}" href="${remote.routePath}">
                  <span>${remote.displayName}</span>
                  <small>${remote.framework}</small>
                </a>
              `,
            )
            .join('')}
        </nav>

        <section class="platform-rail-panel">
          <div class="platform-panel-kicker">Neutral boundary</div>
          <p>
            Every remote is loaded through the same public contract:
            <code>mount(container, context)</code>.
          </p>
        </section>

        <section class="platform-rail-panel">
          <div class="platform-panel-kicker">Live event stream</div>
          <div id="platform-event-feed" class="platform-event-feed">
            <p class="platform-event-empty">No remote events yet.</p>
          </div>
        </section>
      </aside>

      <main class="platform-stage">
        <header class="platform-header">
          <div>
            <div class="platform-panel-kicker">Root Config</div>
            <h1>Framework-agnostic orchestration with single-spa</h1>
          </div>
          <div class="platform-header-badge">
            <span>Host</span>
            <strong>Vite + TypeScript</strong>
          </div>
        </header>

        <section id="platform-viewport" class="platform-viewport"></section>
      </main>
    </div>
  `;

  const viewport = document.querySelector('#platform-viewport');
  if (!(viewport instanceof HTMLElement)) {
    throw new Error('Platform viewport was not created.');
  }

  return viewport;
};

const updateActiveNavigation = (): void => {
  document.querySelectorAll<HTMLElement>('[data-route]').forEach((element) => {
    const route = element.dataset.route;
    const isActive = route
      ? (route === '/' ? window.location.pathname === '/' : matchesRoute(window.location.pathname, route))
      : false;

    element.dataset.active = isActive ? 'true' : 'false';
  });
};

const renderEvent = (event: PlatformEvent): void => {
  const feed = document.querySelector('#platform-event-feed');
  if (!(feed instanceof HTMLElement)) {
    return;
  }

  const eventLine = document.createElement('article');
  eventLine.className = 'platform-event-line';
  eventLine.innerHTML = `
    <div class="platform-event-meta">
      <strong>${event.type}</strong>
      <span>${new Date(event.timestamp).toLocaleTimeString()}</span>
    </div>
    <pre>${JSON.stringify(event.payload ?? {}, null, 2)}</pre>
  `;

  const empty = feed.querySelector('.platform-event-empty');
  empty?.remove();
  feed.prepend(eventLine);

  while (feed.children.length > 4) {
    feed.removeChild(feed.lastElementChild as ChildNode);
  }
};

const createStaticApp = (
  render: (container: HTMLElement) => void,
): {
  bootstrap: () => Promise<void>;
  mount: () => Promise<void>;
  unmount: () => Promise<void>;
} => {
  const container = document.querySelector('#platform-viewport');

  if (!(container instanceof HTMLElement)) {
    throw new Error('Platform viewport not available for static route.');
  }

  return {
    bootstrap: () => Promise.resolve(),
    mount: async () => {
      container.innerHTML = '';
      render(container);
    },
    unmount: async () => {
      container.innerHTML = '';
    },
  };
};

const renderHome = (container: HTMLElement, remotes: RemoteManifestEntry[]): void => {
  container.innerHTML = `
    <section class="platform-card-grid">
      <article class="platform-card platform-card-hero">
        <div class="platform-card-kicker">Why this host exists</div>
        <h2>One shell, multiple frameworks, one public contract</h2>
        <p>
          The host owns routing, telemetry and shared context. Angular, React and Vue
          remotes stay independent and only conform to <code>mount/unmount</code>.
        </p>
      </article>

      ${remotes
        .map(
          (remote) => `
            <article class="platform-card">
              <div class="platform-card-kicker">${remote.framework} remote</div>
              <h2>${remote.displayName}</h2>
              <p>${remote.description}</p>
              <a href="${remote.routePath}">Open ${remote.displayName}</a>
            </article>
          `,
        )
        .join('')}
    </section>
  `;
};

const renderNotFound = (container: HTMLElement): void => {
  container.innerHTML = `
    <section class="platform-card platform-card-error">
      <div class="platform-card-kicker">Route not found</div>
      <h2>This path is not registered in the root config.</h2>
      <p>The host only activates remotes declared in the platform manifest.</p>
      <a href="/">Return to platform home</a>
    </section>
  `;
};

const bootstrap = async (): Promise<void> => {
  const remotes = await loadRemoteManifest();
  const viewport = renderShell(remotes);

  eventBus.onAny((event) => renderEvent(event));
  updateActiveNavigation();

  document.addEventListener('click', (event) => {
    const target = event.target;

    if (!(target instanceof HTMLElement)) {
      return;
    }

    const anchor = target.closest('a[href^="/"]');
    if (!(anchor instanceof HTMLAnchorElement)) {
      return;
    }

    event.preventDefault();
    navigateToUrl(anchor.getAttribute('href') ?? '/');
  });

  window.addEventListener('popstate', updateActiveNavigation);
  window.addEventListener('single-spa:routing-event', updateActiveNavigation as EventListener);

  registerApplication({
    name: 'platform-home',
    app: async () => createStaticApp((container) => renderHome(container, remotes)),
    activeWhen: (location) => location.pathname === '/',
  });

  for (const entry of remotes) {
    registerApplication({
      name: entry.key,
      app: async () =>
        createSingleSpaRemoteApp({
          container: viewport,
          entry,
          mode,
          createContext: (remote) => ({
            basePath: remote.routePath,
            routePath: window.location.pathname,
            flags: {
              neutralBoundary: true,
              polyglotRemotes: true,
            },
            session: {
              signedIn: false,
            },
            navigate: (to) => navigateToUrl(to),
            events: eventBus,
            logger: createConsoleLogger(remote.key),
          }),
        }),
      activeWhen: (location) => matchesRoute(location.pathname, entry.routePath),
    });
  }

  registerApplication({
    name: 'platform-not-found',
    app: async () => createStaticApp((container) => renderNotFound(container)),
    activeWhen: (location) =>
      location.pathname !== '/' &&
      !remotes.some((entry) => matchesRoute(location.pathname, entry.routePath)),
  });

  addErrorHandler((error) => {
    logger.error('single-spa runtime error', error);
  });

  start();

  const schedulePrefetch = window.requestIdleCallback
    ? window.requestIdleCallback.bind(window)
    : (callback: IdleRequestCallback) => window.setTimeout(() => callback({} as IdleDeadline), 250);

  schedulePrefetch(() => {
    remotes
      .filter((remote) => remote.preload)
      .forEach((remote) => void preloadRemote(remote, mode, logger));
  });
};

void bootstrap().catch((error) => {
  logger.error('platform bootstrap failed', error);
  appRoot.innerHTML = `
    <section class="platform-card platform-card-error">
      <div class="platform-card-kicker">Bootstrap failed</div>
      <h2>The root config could not start.</h2>
      <pre>${error instanceof Error ? error.message : String(error)}</pre>
    </section>
  `;
});
