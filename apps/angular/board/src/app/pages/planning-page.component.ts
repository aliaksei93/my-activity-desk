import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

type PlanningColumn = {
  title: string;
  items: readonly string[];
};

@Component({
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="page-shell">
      <header class="page-header">
        <div>
          <div class="page-kicker">Planning</div>
          <h2>Break current work into something you can actually sequence.</h2>
          <p>
            This page exists mainly to make routing obvious, but it also gives the shell a more
            realistic second screen than a placeholder paragraph.
          </p>
        </div>

        <button type="button" class="page-link-button" [routerLink]="'/activity'">
          Open activity
        </button>
      </header>

      <section class="page-grid page-grid-compact">
        @for (column of columns; track column.title) {
          <article class="page-card">
            <h3>{{ column.title }}</h3>
            <div class="stack-list">
              @for (item of column.items; track item) {
                <div class="stack-item">
                  <strong>{{ item }}</strong>
                  <p>Sequence this with the route-aware app shell in mind.</p>
                </div>
              }
            </div>
          </article>
        }
      </section>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanningPageComponent {
  protected readonly columns: readonly PlanningColumn[] = [
    {
      title: 'Ready now',
      items: [
        'Wire up app.routes.ts',
        'Replace the splash entry with AppComponent',
        'Keep the ESM remote mount contract intact',
      ],
    },
    {
      title: 'Needs follow-up',
      items: [
        'Decide how much standalone vs remote UI should diverge',
        'Document the single canonical dev command',
      ],
    },
    {
      title: 'Later',
      items: [
        'Add route-level tests',
        'Introduce route data for breadcrumbs',
      ],
    },
  ];
}
