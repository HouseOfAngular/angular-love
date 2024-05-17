import { ChangeDetectionStrategy, Component, output } from '@angular/core';

import { IconComponent } from '@angular-love/blog/shared/ui-icon';

@Component({
  selector: 'al-newsletter-success',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './newsletter-success.component.html',
  styleUrl: './newsletter-success.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsletterSuccessComponent {
  returnClicked = output<void>();

  onReturnClick(): void {
    this.returnClicked.emit();
  }
}
