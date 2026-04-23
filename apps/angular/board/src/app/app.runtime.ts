import { InjectionToken } from '@angular/core';
import type { PlatformContext } from '@my-activity-desk/platform/contracts';

export type BoardAppMode = 'standalone' | 'remote';

export type BoardAppRuntime = {
  mode: BoardAppMode;
  basePath: string;
  platformContext?: PlatformContext;
};

export const defaultBoardAppRuntime: BoardAppRuntime = {
  mode: 'standalone',
  basePath: '/',
};

export const BOARD_APP_RUNTIME = new InjectionToken<BoardAppRuntime>(
  'BOARD_APP_RUNTIME',
  {
    factory: () => defaultBoardAppRuntime,
  },
);
