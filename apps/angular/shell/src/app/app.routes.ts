import { NxWelcome } from './nx-welcome';
import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: 'shell',
    component: NxWelcome,
  },
  {
    path: 'board',
    loadChildren: () => import('board/Routes').then((m) => m.remoteRoutes),
  },
];
