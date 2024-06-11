import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
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
import { NewsletterStore } from '@angular-love/data-access';

import { NewsletterSuccessComponent } from '../newsletter-success/newsletter-success.component';

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
  providers: [NewsletterStore],
})
export class NewsletterComponent {
  protected readonly form = new FormGroup({
    email: new FormControl<string>('', {
      validators: [Validators.required, Validators.email],
    }),
    checkbox: new FormControl<boolean>(false, {
      validators: [Validators.required],
    }),
  });

  private readonly _newsletterStore = inject(NewsletterStore);

  readonly componentState = this._newsletterStore.loading;

  onSuccessReturnClicked(): void {
    this._newsletterStore.resetToInit();
  }

  postEmailAddress(): void {
    // TODO: find good approach to handle with invalid form - alert in not acceptable - in parallel with error state handling
    if (!this.form.valid || this._newsletterStore.loading() === 'loading') {
      return;
    }
    this._newsletterStore.postEmailAddress(
      this.form.controls['email'].getRawValue() as string,
    );
  }
}
