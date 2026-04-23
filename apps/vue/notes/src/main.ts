import './styles.scss';
import { createApp } from 'vue';
import type { PlatformContext } from '@my-activity-desk/platform/contracts';
import App from './app/App.vue';

const noopUnsubscribe = (): void => {
  return;
};

const standaloneContext: PlatformContext = {
  basePath: '/notes',
  routePath: window.location.pathname,
  flags: {
    standaloneMode: true,
    neutralBoundary: true,
  },
  session: {
    signedIn: false,
  },
  navigate: (to) => {
    window.history.pushState({}, '', to);
    window.dispatchEvent(new PopStateEvent('popstate'));
  },
  events: {
    emit: (type, payload) => console.info('[notes:standalone:event]', type, payload),
    on: () => noopUnsubscribe,
    onAny: () => noopUnsubscribe,
  },
  logger: {
    info: (message, details) => console.info(`[notes] ${message}`, details ?? ''),
    warn: (message, details) => console.warn(`[notes] ${message}`, details ?? ''),
    error: (message, details) => console.error(`[notes] ${message}`, details ?? ''),
  },
};

const app = createApp(App, { context: standaloneContext });
app.mount('#root');
