import { A11yModule } from '@angular/cdk/a11y';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';

import { CardComponent } from '@angular-love/blog/shared/ui-card';

import { NewsletterComponent } from '../feature-newsletter/newsletter.component';

import { NewsletterExamplesComponent } from './newsletter-examples/newsletter-examples.component';
import { NewsletterSuccesComponent } from './newsletter-succes/newsletter-succes.component';

@Component({
  selector: 'al-newsletter-page',
  imports: [
    TranslocoDirective,
    A11yModule,
    CardComponent,
    NewsletterComponent,
    NewsletterSuccesComponent,
    NewsletterExamplesComponent,
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
}
