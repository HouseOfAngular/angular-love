import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslocoDirective } from '@ngneat/transloco';

import {
  CardComponent,
  GradientCardDirective,
} from '@angular-love/blog/shared/ui-card';
import { IconComponent } from '@angular-love/blog/shared/ui-icon';

import { NewsletterSuccessComponent } from '../newsletter-success/newsletter-success.component';

export type NewsletterFormState = 'INITIAL' | 'SUCCESS';

@Component({
  selector: 'al-newsletter',
  standalone: true,
  imports: [
    NewsletterSuccessComponent,
    GradientCardDirective,
    CardComponent,
    ReactiveFormsModule,
    IconComponent,
    TranslocoDirective,
  ],
  templateUrl: './newsletter.component.html',
  styleUrl: './newsletter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsletterComponent {
  componentState = signal<NewsletterFormState>('INITIAL');

  form = new FormGroup({
    email: new FormControl<string>('', {
      validators: [Validators.required, Validators.email],
    }),
    checkbox: new FormControl<boolean>(false, {
      validators: [Validators.required],
    }),
  });

  onSuccessReturnClicked(): void {
    this.componentState.set('INITIAL');
  }

  mockEventDispatch(): void {
    // TODO: dispatch actual event
    if (!this.form.valid) {
      alert('form invalid');
      return;
    }
    this.componentState.set('SUCCESS');
  }
}
