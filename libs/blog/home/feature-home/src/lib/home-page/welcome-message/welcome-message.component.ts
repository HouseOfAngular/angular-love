import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';

@Component({
  standalone: true,
  selector: 'al-welcome-message',
  template: `
    <section
      class="flex flex-col items-center justify-center gap-3 py-3 text-center"
    >
      <ng-container *transloco="let t; read: 'homePage.welcomeMessage'">
        <h2 class="text-4xl font-bold">Angular.love Blog</h2>
        <p class="px-8">
          {{ t('description') }}
        </p>
        <p class="px-8">
          Powered by
          <a
            class="text-al-primary font-bold hover:underline"
            [attr.aria-label]="t('descriptionAriaLabel')"
            target="_blank"
            href="https://houseofangular.io/"
          >
            House of Angular
          </a>
        </p>
      </ng-container>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoDirective],
})
export class WelcomeMessageComponent {}
