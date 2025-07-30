import { A11yModule } from '@angular/cdk/a11y';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';

import { CardComponent } from '@angular-love/blog/shared/ui-card';

import { NewsletterComponent } from '../feature-newsletter/newsletter.component';

import { newsletter1 } from './newsletter-example-1';
import { newsletter2 } from './newsletter-example-2';
import { NewsletterSuccesComponent } from './newsletter-succes/newsletter-succes.component';

@Component({
  selector: 'al-newsletter-page',
  imports: [
    TranslocoDirective,
    A11yModule,
    CardComponent,
    NewsletterComponent,
    NewsletterSuccesComponent,
  ],
  templateUrl: './newsletter-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsletterPageComponent {
  private route = inject(ActivatedRoute);
  private params = toSignal(this.route.queryParams);

  protected readonly isConfirmationPage = computed(
    () => this.params()?.['nm'] === 'confirmed',
  );

  newsletter1: SafeHtml;
  newsletter2: SafeHtml;

  constructor(private sanitizer: DomSanitizer) {
    this.newsletter1 = this.sanitizer.bypassSecurityTrustHtml(newsletter1);
    this.newsletter2 = this.sanitizer.bypassSecurityTrustHtml(newsletter2);
  }
}
