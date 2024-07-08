import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';

import { AlLocalizePipe } from '@angular-love/blog/i18n/util';

@Component({
  selector: 'al-breadcrumb',
  standalone: true,
  imports: [TranslocoDirective, RouterLink, AlLocalizePipe],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbComponent {
  pageName = input.required<string>();
}
