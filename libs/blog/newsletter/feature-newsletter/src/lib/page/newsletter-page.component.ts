import { A11yModule } from '@angular/cdk/a11y';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';

import { CardComponent } from '@angular-love/blog/shared/ui-card';

import { NewsletterComponent } from '../feature-newsletter/newsletter.component';

@Component({
  selector: 'al-newsletter-page',
  imports: [TranslocoDirective, A11yModule, CardComponent, NewsletterComponent],
  templateUrl: './newsletter-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsletterPageComponent {}
