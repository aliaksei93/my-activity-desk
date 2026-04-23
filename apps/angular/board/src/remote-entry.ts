import { ApplicationRef } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import type { MountedRemote, RemoteMount } from '@my-activity-desk/platform/contracts';
import { AppComponent } from './app/app.component';
import { createAppConfig } from './app/app.config';

const BOARD_HOST_TAG = 'app-board-root';

const createHostElement = (container: HTMLElement): HTMLElement => {
  container.innerHTML = '';

  const host = document.createElement(BOARD_HOST_TAG);
  container.appendChild(host);
  return host;
};

export const mount: RemoteMount = async (
  container,
  context,
): Promise<MountedRemote> => {
  createHostElement(container);
  context.events.emit('remote:board:ping', {
    remote: 'board',
    route: context.routePath,
    transport: 'esm',
  });

  const appRef: ApplicationRef = await bootstrapApplication(
    AppComponent,
    createAppConfig({
      mode: 'remote',
      basePath: context.basePath,
      platformContext: context,
    }),
  );
  context.logger.info('Board remote mounted');

  return {
    unmount: () => {
      appRef.destroy();
      container.innerHTML = '';
    },
    update: (nextContext) => {
      nextContext.logger.info('Board remote context updated');
    },
  };
};
