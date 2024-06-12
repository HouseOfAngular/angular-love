import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoDirective } from '@ngneat/transloco';
import { LocalizeRouterModule } from '@penleychan/ngx-transloco-router';

@Component({
  selector: 'al-breadcrumb',
  standalone: true,
  imports: [TranslocoDirective, RouterLink, LocalizeRouterModule],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbComponent {
  pageName = input.required<string>();
}
