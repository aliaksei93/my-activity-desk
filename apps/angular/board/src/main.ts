import '@angular/compiler';
import 'zone.js';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { createAppConfig } from './app/app.config';

export { mount } from './remote-entry';

const standaloneHost = document.querySelector('app-board-root');

if (standaloneHost instanceof HTMLElement) {
  void bootstrapApplication(
    AppComponent,
    createAppConfig({
      mode: 'standalone',
      basePath: '/',
    }),
  ).catch((error) => {
    console.error('Failed to bootstrap the board application.', error);
  });
}
