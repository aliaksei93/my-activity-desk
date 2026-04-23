import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="page-shell">
      <article class="page-card empty-state">
        <div class="page-kicker">Not found</div>
        <h2>This board route does not exist.</h2>
        <p>
          The Angular router is active, but the requested page is not registered in
          <code>app.routes.ts</code>.
        </p>
        <button type="button" class="page-link-button" [routerLink]="'/'">
          Return to overview
        </button>
      </article>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundPageComponent {}
