import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { environment } from '../environments/environment';
import { BOARD_APP_RUNTIME } from './app.runtime';

type BoardNavItem = {
  path: string;
  label: string;
  description: string;
};

type BoardHighlight = {
  label: string;
  value: string;
  hint: string;
};

@Component({
  selector: 'app-board-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  protected readonly environment = environment;
  protected readonly runtime = inject(BOARD_APP_RUNTIME);

  protected readonly navItems: readonly BoardNavItem[] = [
    {
      path: '/',
      label: 'Overview',
      description: 'Daily snapshot and entry points',
    },
    {
      path: '/planning',
      label: 'Planning',
      description: 'Current priorities and sequencing',
    },
    {
      path: '/activity',
      label: 'Activity',
      description: 'Recent signals and follow-ups',
    },
  ];

  protected readonly highlights: readonly BoardHighlight[] = [
    {
      label: 'Runtime',
      value: this.runtime.mode === 'remote' ? 'Embedded remote' : 'Standalone app',
      hint:
        this.runtime.mode === 'remote'
          ? 'Bootstrapped through mount(container, context).'
          : 'Bootstrapped by the shared main.ts browser bundle.',
    },
    {
      label: 'Base path',
      value: this.runtime.basePath,
      hint: 'Used by Angular Router for local navigation.',
    },
    {
      label: 'Routes',
      value: '3 primary pages',
      hint: 'Overview, planning and activity all live in app.routes.ts.',
    },
  ];
}
