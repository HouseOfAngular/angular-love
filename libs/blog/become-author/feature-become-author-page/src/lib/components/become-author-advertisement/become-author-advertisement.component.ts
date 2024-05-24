import { ChangeDetectionStrategy, Component } from '@angular/core';

import {
  CardComponent,
  GradientCardDirective,
} from '@angular-love/blog/shared/ui-card';

@Component({
  selector: 'al-become-author-advertisement',
  standalone: true,
  templateUrl: './become-author-advertisement.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GradientCardDirective, CardComponent],
})
export class BecomeAuthorAdvertisementComponent {}
