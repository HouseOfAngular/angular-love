import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';

import { BecomeAuthorListItemComponent } from '../become-author-list-item/become-author-list-item.component';

@Component({
  selector: 'al-become-author-benefits',
  standalone: true,
  imports: [BecomeAuthorListItemComponent, TranslocoDirective],
  templateUrl: './become-author-benefits.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BecomeAuthorBenefitsComponent {
  benefits = input.required<string[]>();
}
