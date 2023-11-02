import { Component } from '@angular/core';
import { NxWelcomeComponent } from './nx-welcome.component';
import { LayoutComponent } from "@angular-love/blog/layouts/ui";

@Component({
  standalone: true,
  imports: [NxWelcomeComponent, LayoutComponent],
  selector: 'angular-love-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'blog';
}
