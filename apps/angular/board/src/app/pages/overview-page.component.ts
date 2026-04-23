import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

type BoardMetric = {
  label: string;
  value: string;
  hint: string;
};

type BoardLane = {
  name: string;
  summary: string;
};

@Component({
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="page-shell">
      <header class="page-header">
        <div>
          <div class="page-kicker">Overview</div>
          <h2>See the day before you start clicking around.</h2>
          <p>
            The overview page gathers a few stable signals so the root app shell has an obvious
            default route instead of a single static splash block.
          </p>
        </div>

        <button type="button" class="page-link-button" [routerLink]="'/planning'">
          Open planning
        </button>
      </header>

      <section class="metric-grid">
        @for (metric of metrics; track metric.label) {
          <article class="metric-card">
            <span>{{ metric.label }}</span>
            <strong>{{ metric.value }}</strong>
            <p>{{ metric.hint }}</p>
          </article>
        }
      </section>

      <section class="page-grid">
        <article class="page-card">
          <h3>Priority lanes</h3>
          <div class="stack-list">
            @for (lane of lanes; track lane.name) {
              <div class="stack-item">
                <strong>{{ lane.name }}</strong>
                <p>{{ lane.summary }}</p>
              </div>
            }
          </div>
        </article>

        <article class="page-card">
          <h3>Next actions</h3>
          <div class="chip-row">
            @for (action of nextActions; track action) {
              <span class="page-chip">{{ action }}</span>
            }
          </div>
          <p class="page-note">
            Use the route buttons above to move between pages and confirm the Angular router is
            actually driving the screen.
          </p>
        </article>
      </section>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewPageComponent {
  protected readonly metrics: readonly BoardMetric[] = [
    {
      label: 'Focus blocks',
      value: '4 scheduled',
      hint: 'Two are already protected from meetings.',
    },
    {
      label: 'Open blockers',
      value: '2 active',
      hint: 'One needs a design decision, one needs review.',
    },
    {
      label: 'Upcoming handoffs',
      value: '3 queued',
      hint: 'Enough to plan sequencing before noon.',
    },
  ];

  protected readonly lanes: readonly BoardLane[] = [
    {
      name: 'Build',
      summary: 'Ship the app shell clean-up and keep the remote entry stable.',
    },
    {
      name: 'Review',
      summary: 'Collect PR feedback before the next routing change lands.',
    },
    {
      name: 'Ops',
      summary: 'Check host integration after any remote build tweak.',
    },
  ];

  protected readonly nextActions: readonly string[] = [
    'Confirm base path wiring',
    'Review planning page',
    'Verify remote route activation',
  ];
}
