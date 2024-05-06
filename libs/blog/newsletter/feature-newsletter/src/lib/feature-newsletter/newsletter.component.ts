import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { tablerSend } from '@ng-icons/tabler-icons';

import {
  CardComponent,
  GradientCardDirective,
} from '@angular-love/blog/shared/ui/card';

import { NewsletterSuccessComponent } from './newsletter-success/newsletter-success.component';

export type NewsletterFormState = 'INITIAL' | 'SUCCESS';

@Component({
  selector: 'al-newsletter',
  standalone: true,
  imports: [
    NgIconComponent,
    NewsletterSuccessComponent,
    GradientCardDirective,
    CardComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './newsletter.component.html',
  styleUrl: './newsletter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideIcons({ tablerSend })],
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
