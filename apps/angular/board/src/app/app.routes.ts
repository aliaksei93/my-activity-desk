import { Routes } from '@angular/router';
import { ActivityPageComponent } from './pages/activity-page.component';
import { NotFoundPageComponent } from './pages/not-found-page.component';
import { OverviewPageComponent } from './pages/overview-page.component';
import { PlanningPageComponent } from './pages/planning-page.component';

export const appRoutes: Routes = [
  {
    path: '',
    component: OverviewPageComponent,
    title: 'Board | Overview',
  },
  {
    path: 'planning',
    component: PlanningPageComponent,
    title: 'Board | Planning',
  },
  {
    path: 'activity',
    component: ActivityPageComponent,
    title: 'Board | Activity',
  },
  {
    path: '**',
    component: NotFoundPageComponent,
    title: 'Board | Not Found',
  },
];
