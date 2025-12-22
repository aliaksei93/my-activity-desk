import {
  ApplicationConfig,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { initModuleFederation } from '@my-activity-desk/shell/mf';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAppInitializer(() => initModuleFederation()),
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
  ],
};
