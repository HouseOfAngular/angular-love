import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LayoutComponent } from '@angular-love/blog/layouts/ui';

@Component({
  standalone: true,
  selector: 'angular-love-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LayoutComponent],
})
export class AppComponent {}
