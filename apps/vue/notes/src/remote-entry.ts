import { createApp, type App as VueApp } from 'vue';
import type { MountedRemote, PlatformContext, RemoteMount } from '@my-activity-desk/platform/contracts';
import App from './app/App.vue';

const createRemoteApp = (context: PlatformContext): VueApp =>
  createApp(App, { context });

export const mount: RemoteMount = (
  container,
  context,
): MountedRemote => {
  let app = createRemoteApp(context);
  app.mount(container);
  context.logger.info('Notes remote mounted');

  return {
    unmount: () => {
      app.unmount();
    },
    update: (nextContext) => {
      app.unmount();
      container.innerHTML = '';
      app = createRemoteApp(nextContext);
      app.mount(container);
    },
  };
};
