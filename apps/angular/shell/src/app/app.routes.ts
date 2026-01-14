import { NxWelcome } from './nx-welcome';
import { Route } from '@angular/router';
import { loadRemoteRoutes, REMOTES } from '@my-activity-desk/shell/mf';

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
  ...REMOTES.map((remote): Route => ({
    path: remote.path,
    loadChildren: loadRemoteRoutes(remote),
  })),
];
