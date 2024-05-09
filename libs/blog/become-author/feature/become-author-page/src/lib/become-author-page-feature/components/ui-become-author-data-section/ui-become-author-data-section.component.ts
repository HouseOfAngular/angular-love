import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { UiBecomeAuthorDataCardComponent } from '../ui-become-author-data-card/ui-become-author-data-card.component';

export type BecomeAuthorData = {
  title: string;
  description?: string;
  depictions: Array<string>;
};

@Component({
  selector: 'al-ui-become-author-data-section',
  standalone: true,
  imports: [NgClass, UiBecomeAuthorDataCardComponent],
  templateUrl: './ui-become-author-data-section.component.html',
  styleUrl: './ui-become-author-data-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiBecomeAuthorDataSectionComponent {
  becomeAuthorData = input.required<BecomeAuthorData[]>();
}
