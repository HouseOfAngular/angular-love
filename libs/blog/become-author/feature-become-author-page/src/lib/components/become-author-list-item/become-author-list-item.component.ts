import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { IconComponent } from '@angular-love/blog/shared/ui-icon';

export type Layout = 'curved' | 'normal';

@Component({
  selector: 'al-become-author-list-item',
  standalone: true,
  imports: [IconComponent, NgClass],
  templateUrl: './become-author-list-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BecomeAuthorListItemComponent {
  index = input<number>();
  content = input.required<string>();
  layout = input.required<Layout>();
}
