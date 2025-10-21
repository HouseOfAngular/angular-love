import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { PresentationPreview } from '@angular-love/blog-contracts/presentations';

@Component({
  selector: 'al-presentation-card',
  templateUrl: './presentation-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PresentationCardComponent {
  readonly presentation = input.required<PresentationPreview>();
}
