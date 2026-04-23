import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

type ActivityEvent = {
  time: string;
  title: string;
  detail: string;
};

@Component({
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="page-shell">
      <header class="page-header">
        <div>
          <div class="page-kicker">Activity</div>
          <h2>Keep a simple event trail close to the work surface.</h2>
          <p>
            A third page makes route changes easier to verify in both standalone mode and the
            embedded remote shell.
          </p>
        </div>

        <button type="button" class="page-link-button" [routerLink]="'/'">
          Back to overview
        </button>
      </header>

      <article class="page-card">
        <h3>Recent updates</h3>
        <div class="timeline">
          @for (event of events; track event.time) {
            <section class="timeline-item">
              <span>{{ event.time }}</span>
              <div>
                <strong>{{ event.title }}</strong>
                <p>{{ event.detail }}</p>
              </div>
            </section>
          }
        </div>
      </article>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivityPageComponent {
  protected readonly events: readonly ActivityEvent[] = [
    {
      time: '09:10',
      title: 'Board shell simplified',
      detail: 'The app now boots through a conventional AppComponent.',
    },
    {
      time: '10:25',
      title: 'Routes restored',
      detail: 'Overview, planning and activity all live in app.routes.ts.',
    },
    {
      time: '11:40',
      title: 'Remote mount preserved',
      detail: 'The host still imports a plain ESM entry and calls mount().',
    },
  ];
}
