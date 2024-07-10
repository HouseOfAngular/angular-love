import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';

import { Partner } from '@angular-love/blog/shared/types';

import { PartnersListComponent } from '../partners-list/partners-list.component';

@Component({
  selector: 'al-partners',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [PartnersListComponent, TranslocoDirective],
  templateUrl: './partners.component.html',
})
export class PartnersComponent {
  readonly title = input.required<string>();
  readonly partnerList = input.required<Partner[]>();
}
