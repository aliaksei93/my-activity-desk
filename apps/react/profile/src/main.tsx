import './styles.scss';
import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import type { PlatformContext } from '@my-activity-desk/platform/contracts';
import { ProfileApp } from './app/app';

const noopUnsubscribe = (): void => {
  return;
};

const container = document.getElementById('root');

if (!(container instanceof HTMLElement)) {
  throw new Error('Profile root element not found.');
}

const standaloneContext: PlatformContext = {
  basePath: '/profile',
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
    emit: (type, payload) => console.info('[profile:standalone:event]', type, payload),
    on: () => noopUnsubscribe,
    onAny: () => noopUnsubscribe,
  },
  logger: {
    info: (message, details) => console.info(`[profile] ${message}`, details ?? ''),
    warn: (message, details) => console.warn(`[profile] ${message}`, details ?? ''),
    error: (message, details) => console.error(`[profile] ${message}`, details ?? ''),
  },
};

const root = ReactDOM.createRoot(container);
root.render(
  <StrictMode>
    <ProfileApp context={standaloneContext} />
  </StrictMode>,
);
