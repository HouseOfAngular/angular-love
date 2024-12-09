import { A11yModule } from '@angular/cdk/a11y';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { FastSvgComponent } from '@push-based/ngx-fast-svg';

import { AlLocalizePipe } from '@angular-love/blog/i18n/util';
import { ButtonComponent } from '@angular-love/blog/shared/ui-button';

@Component({
  selector: 'al-newsletter-page',
  imports: [
    RouterLink,
    ButtonComponent,
    TranslocoDirective,
    A11yModule,
    AlLocalizePipe,
    FastSvgComponent,
  ],
  template: `
    <div
      *transloco="let t; read: 'newsletterPage'"
      class="flex flex-col items-center justify-center py-5 text-center"
      [cdkTrapFocusAutoCapture]="true"
      cdkTrapFocus
    >
      <fast-svg name="circle-check" size="80" />
      <h2 class="my-2 text-2xl font-bold">
        {{ t('title') }}
      </h2>
      <p class="my-3">
        {{ t('description') }}
      </p>
      <a [routerLink]="['/'] | alLocalize">
        <button al-button type="button" cdkFocusInitial>
          {{ t('button') }}
        </button>
      </a>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsletterPageComponent {}
