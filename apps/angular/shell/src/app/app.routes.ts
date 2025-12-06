import { NxWelcome } from './nx-welcome';
import { Route } from '@angular/router';
import { loadRemote } from '@module-federation/enhanced/runtime'

export const appRoutes: Route[] = [
  {
    path: 'shell',
    component: NxWelcome,
  },
  {
    path: 'board',
    loadChildren: () =>
      loadRemote<typeof import('board/Routes')>('board/Routes').then(m => m?.remoteRoutes ?? []),
  },
];
