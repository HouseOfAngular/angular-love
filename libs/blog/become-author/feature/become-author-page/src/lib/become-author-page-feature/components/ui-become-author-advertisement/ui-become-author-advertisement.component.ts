import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import {
  CardComponent,
  GradientCardDirective,
} from '@angular-love/blog/shared/ui/card';

export type Language = 'EN' | 'PL';

@Component({
  selector: 'al-ui-become-author-advertisement',
  standalone: true,
  imports: [CardComponent, GradientCardDirective],
  templateUrl: './ui-become-author-advertisement.component.html',
  styleUrl: './ui-become-author-advertisement.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiBecomeAuthorAdvertisementComponent {
  language = input.required<Language>();
}
