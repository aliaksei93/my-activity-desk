import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
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
  }
}
