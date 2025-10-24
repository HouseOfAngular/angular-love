import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FastSvgComponent } from '@push-based/ngx-fast-svg';

import { PresentationPreview } from '@angular-love/blog-contracts/presentations';
import { AlLocalizePipe } from '@angular-love/blog/i18n/util';
import { AvatarComponent } from '@angular-love/blog/shared/ui-avatar';

@Component({
  selector: 'al-presentation-card',
  templateUrl: './presentation-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AvatarComponent,
    RouterLink,
    NgOptimizedImage,
    FastSvgComponent,
    AlLocalizePipe,
  ],
})
export class PresentationCardComponent {
  readonly presentation = input.required<PresentationPreview>();
}
