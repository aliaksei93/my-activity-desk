
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

type RemoteErrorData = {
  remoteKey?: string;
  title?: string;
  error?: string;
};

@Component({
  selector: 'shell-remote-unavailable',
  standalone: true,
  imports: [],
  template: `
    <section class="remote-unavailable">
      <h2>{{ title }}</h2>
      <p><strong>Remote:</strong> {{ remoteKey }}</p>
      <pre class="error">{{ errorText }}</pre>
      <div class="actions">
        <button type="button" (click)="onRetry()">Retry</button>
        <button type="button" (click)="onHome()">Home</button>
      </div>
    </section>
  `,
  styles: [
    `
      .remote-unavailable {
        max-width: 560px;
        margin: 40px auto;
        padding: 24px;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
      }

      .error {
        background: #f7f7f7;
        padding: 12px;
        border-radius: 6px;
        white-space: pre-wrap;
        word-break: break-word;
      }

      .actions {
        display: flex;
        gap: 12px;
        margin-top: 16px;
      }
    `,
  ],
})
export class RemoteUnavailableComponent {
  private readonly route = inject(ActivatedRoute);

  private readonly router = inject(Router);

  private readonly data = this.route.snapshot.data as RemoteErrorData;

  readonly remoteKey = this.data.remoteKey ?? 'unknown';

  readonly title = this.data.title ?? 'Remote unavailable';

  readonly errorText = this.data.error ?? 'Unknown error';

  public onRetry(): void {
    const retryUrl = this.router.url || '/';
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => this.router.navigateByUrl(retryUrl));
  }

  public onHome(): void {
    this.router.navigateByUrl('/');
  }
}
