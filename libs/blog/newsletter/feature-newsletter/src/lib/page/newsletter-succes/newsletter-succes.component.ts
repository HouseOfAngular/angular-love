import { A11yModule } from '@angular/cdk/a11y';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { FastSvgComponent } from '@push-based/ngx-fast-svg';

import { AlLocalizePipe } from '@angular-love/blog/i18n/util';
import { ButtonComponent } from '@angular-love/blog/shared/ui-button';

@Component({
  selector: 'al-newsletter-success',
  imports: [
    TranslocoDirective,
    A11yModule,
    FastSvgComponent,
    RouterLink,
    AlLocalizePipe,
    ButtonComponent,
  ],
  templateUrl: './newsletter-succes.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsletterSuccesComponent {}
