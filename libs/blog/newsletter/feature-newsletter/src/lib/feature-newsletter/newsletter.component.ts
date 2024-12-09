import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { FastSvgComponent } from '@push-based/ngx-fast-svg';

import { AlLocalizeService } from '@angular-love/blog/i18n/util';
import { ButtonComponent } from '@angular-love/blog/shared/ui-button';
import {
  CardComponent,
  GradientCardDirective,
} from '@angular-love/blog/shared/ui-card';
import { NewsletterStore } from '@angular-love/data-access';

@Component({
  selector: 'al-newsletter',
  imports: [
    GradientCardDirective,
    CardComponent,
    ReactiveFormsModule,
    TranslocoDirective,
    ButtonComponent,
    FastSvgComponent,
  ],
  templateUrl: './newsletter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NewsletterStore],
})
export class NewsletterComponent {
  protected readonly form = new FormGroup({
    email: new FormControl<string>('', {
      validators: [
        Validators.required,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
      ],
    }),
    checkbox: new FormControl<boolean>(false, {
      validators: [Validators.requiredTrue],
    }),
  });

  private readonly _newsletterStore = inject(NewsletterStore);
  private readonly _router = inject(Router);
  private readonly _localizeService = inject(AlLocalizeService);
  private readonly _onSuccess = effect(() => {
    if (this.newsletterStoreLoading() !== 'success') return;
    this._router.navigate(this._localizeService.localizePath(['/newsletter']), {
      queryParams: {
        nm: 'confirmed',
      },
    });
  });

  protected readonly newsletterStoreLoading = this._newsletterStore.loading;

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
