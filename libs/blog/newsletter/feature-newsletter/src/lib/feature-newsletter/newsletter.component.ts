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
import { TranslocoDirective } from '@ngneat/transloco';
import { LocalizeRouterService } from '@penleychan/ngx-transloco-router';

import {
  CardComponent,
  GradientCardDirective,
} from '@angular-love/blog/shared/ui-card';
import { IconComponent } from '@angular-love/blog/shared/ui-icon';
import { NewsletterStore } from '@angular-love/data-access';

@Component({
  selector: 'al-newsletter',
  standalone: true,
  imports: [
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
      validators: [Validators.requiredTrue],
    }),
  });

  private readonly _newsletterStore = inject(NewsletterStore);
  private readonly _router = inject(Router);
  private readonly _localizeRouter = inject(LocalizeRouterService);
  private readonly _onSuccess = effect(() => {
    if (this._newsletterStore.loading() === 'success') {
      this._router.navigate(
        this._localizeRouter.translateRoute(['/newsletter']) as string[],
        {
          queryParams: {
            nm: 'confirmed',
          },
        },
      );
    }
  });

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
