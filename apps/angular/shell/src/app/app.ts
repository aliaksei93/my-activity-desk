import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { loadRemote } from '@module-federation/enhanced/runtime';
import { REMOTES } from '@my-activity-desk/shell/mf';
import { environment } from '../environments/environment';
import { buildDate, commitHash } from '../environments/version';

@Component({
  imports: [RouterModule],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  protected title = 'shell';

  public env = environment;

  public ngOnInit(): void {
    console.log(`MyActivityBoard [shell] build commit: ${commitHash}, built at: ${buildDate}`);
    this.prefetchRemotes();
  }

  private prefetchRemotes(): void {
    REMOTES.filter((remote) => remote.preload).forEach((remote) => {
      const remoteId = `${remote.key}/${remote.exposed}`;
      loadRemote(remoteId)
        .then(() => {
          console.info(`[MF] Prefetch remote ${remote.key} ok`);
        })
        .catch((err) => {
          console.warn(`[MF] Prefetch remote ${remote.key} failed`, err);
        });
    });
  }
}
