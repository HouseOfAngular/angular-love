import { GradientCardComponent } from '@angular-love/gradient-card';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  signal,
  viewChild,
} from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { tablerSend } from '@ng-icons/tabler-icons';
import { NewsletterSuccessComponent } from './newsletter-success/newsletter-success.component';

export type NewsletterFormState = 'INITIAL' | 'SUCCESS';

@Component({
  selector: 'al-newsletter',
  standalone: true,
  imports: [GradientCardComponent, NgIconComponent, NewsletterSuccessComponent],
  templateUrl: './newsletter.component.html',
  styleUrl: './newsletter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideIcons({ tablerSend })],
})
export class NewsletterComponent {
  formState = signal<NewsletterFormState>('INITIAL');
  newsletterCheckboxRef =
    viewChild<ElementRef<HTMLInputElement>>('newsletterCheckbox');
  emailInputRef = viewChild<ElementRef<HTMLInputElement>>('emailInput');

  onSuccessReturnClicked(): void {
    this.formState.set('INITIAL');
  }

  mockEventDispatch(): void {
    const el = this.emailInputRef()?.nativeElement;
    const isValid = el?.checkValidity() && el?.value !== '';
    if (!isValid) {
      return;
    }
    this.formState.set('SUCCESS');
  }
}
