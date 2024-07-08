import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { FastSvgComponent } from '@push-based/ngx-fast-svg';

export type Layout = 'curved' | 'normal';

@Component({
  selector: 'al-become-author-list-item',
  standalone: true,
  imports: [NgClass, FastSvgComponent],
  templateUrl: './become-author-list-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BecomeAuthorListItemComponent {
  index = input<number>();
  content = input.required<string>();
  layout = input.required<Layout>();
}
