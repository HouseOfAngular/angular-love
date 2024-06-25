import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';

import { BecomeAuthorListItemComponent } from '../become-author-list-item/become-author-list-item.component';

@Component({
  selector: 'al-become-author-improvements',
  standalone: true,
  imports: [BecomeAuthorListItemComponent, TranslocoDirective],
  templateUrl: './become-author-improvements.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BecomeAuthorImprovementsComponent {
  improvements = input.required<string[]>();
}
