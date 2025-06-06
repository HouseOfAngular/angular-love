import { Component, input } from '@angular/core';

import {
  CardComponent,
  CardContentDirective,
  GradientCardDirective,
} from '@angular-love/blog/shared/ui-card';

@Component({
  selector: 'al-author-card-template',
  imports: [CardComponent, CardContentDirective, GradientCardDirective],
  host: {
    class: 'block @container',
  },
  template: `
    <al-card alGradientCard [hideGradient]="hideGradient()">
      <div alCardContent>
        <div
          class="flex w-full flex-col items-center rounded-lg border md:flex-row md:border-none"
        >
          <div
            class="dark:!bg-al-radial-gradient dark:bg-al-background md:light:bg-[#f2f2f2] min-w-fit rounded-lg pb-4 pt-6 md:min-w-[260px] md:border"
          >
            <div
              class="flex w-full flex-col items-center gap-4 md:max-w-[360px]"
              Expand
              Down
            >
              <ng-content select="[author-info-card]"></ng-content>
            </div>
          </div>
          <div class="w-full flex-1 hyphens-auto break-words p-6 pt-0 md:pt-6">
            <ng-content select="[author-info-description]"></ng-content>
          </div>
        </div>
      </div>
    </al-card>
  `,
})
export class AuthorCardTemplateComponent {
  hideGradient = input<boolean>(true);
}
