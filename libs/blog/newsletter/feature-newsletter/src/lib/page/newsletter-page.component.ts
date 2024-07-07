import { A11yModule } from '@angular/cdk/a11y';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoDirective } from '@ngneat/transloco';

import { ButtonComponent } from '@angular-love/blog/shared/ui-button';
import { LocalizeRouterModule } from '@penleychan/ngx-transloco-router';
import { FastSvgComponent } from '@push-based/ngx-fast-svg';

@Component({
  selector: 'al-newsletter-page',
  standalone: true,
  imports: [
    RouterLink,
    LocalizeRouterModule,
    ButtonComponent,
    TranslocoDirective,
    A11yModule,
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
      <a [routerLink]="['/'] | localize">
        <button al-button type="button" cdkFocusInitial>
          {{ t('button') }}
        </button>
      </a>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsletterPageComponent {}
