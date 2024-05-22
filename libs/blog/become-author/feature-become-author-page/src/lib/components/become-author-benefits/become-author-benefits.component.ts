import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { BecomeAuthorListItemComponent } from '../become-author-list-item/become-author-list-item.component';

@Component({
  selector: 'al-become-author-benefits',
  standalone: true,
  imports: [BecomeAuthorListItemComponent],
  templateUrl: './become-author-benefits.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BecomeAuthorBenefitsComponent {
  benefits = input.required<string[]>();
}
