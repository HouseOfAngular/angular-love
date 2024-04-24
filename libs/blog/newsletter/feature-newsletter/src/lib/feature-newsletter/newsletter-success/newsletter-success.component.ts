import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { tablerCircleCheck } from '@ng-icons/tabler-icons';

@Component({
  selector: 'al-newsletter-success',
  standalone: true,
  imports: [NgIconComponent],
  templateUrl: './newsletter-success.component.html',
  styleUrl: './newsletter-success.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideIcons({ tablerCircleCheck })],
})
export class NewsletterSuccessComponent {
  returnClicked = output<void>();

  onReturnClick(): void {
    this.returnClicked.emit();
  }
}
