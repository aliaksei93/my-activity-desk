import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import {
  BOARD_APP_RUNTIME,
  BoardAppRuntime,
  defaultBoardAppRuntime,
} from './app.runtime';

export const createAppConfig = (
  runtime: Partial<BoardAppRuntime> = {},
): ApplicationConfig => {
  const resolvedRuntime: BoardAppRuntime = {
    ...defaultBoardAppRuntime,
    ...runtime,
  };

  return {
    providers: [
      provideBrowserGlobalErrorListeners(),
      provideZoneChangeDetection({ eventCoalescing: true }),
      provideRouter(appRoutes),
      {
        provide: APP_BASE_HREF,
        useValue: resolvedRuntime.basePath,
      },
      {
        provide: BOARD_APP_RUNTIME,
        useValue: resolvedRuntime,
      },
    ],
  };
};

export const appConfig = createAppConfig();
