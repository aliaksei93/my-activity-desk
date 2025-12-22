import { NxWelcome } from './nx-welcome';
import { Route } from '@angular/router';
import { loadRemote } from '@module-federation/enhanced/runtime';

export const appRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'shell',
  },
  {
    path: 'shell',
    component: NxWelcome,
  },
  {
    path: 'board',
    loadChildren: () =>
      loadRemote<typeof import('board/Routes')>('board/Routes')
        .then((m) => m?.remoteRoutes ?? [])
        .catch((err) => {
          console.error('[MF] Failed to load board', err);
          return [];
        }),
  },
];
