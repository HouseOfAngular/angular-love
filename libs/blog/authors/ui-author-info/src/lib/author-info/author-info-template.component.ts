import { Component } from '@angular/core';

import {
  CardComponent,
  CardContentDirective,
  GradientCardDirective,
} from '@angular-love/blog/shared/ui-card';

@Component({
  selector: 'al-author-info-template',
  standalone: true,
  imports: [CardComponent, CardContentDirective, GradientCardDirective],
  host: {
    class: 'block @container',
  },
  template: `
    <al-card alGradientCard>
      <div alCardContent>
        <div class="@3xl:flex-row flex w-full flex-col  items-center gap-4">
          <div
            class="border-al-gray-200 @5xl:border @5xl:bg-al-gradient @5xl:min-w-[360px] min-w-fit rounded-lg p-6"
          >
            <div
              class="@3xl:max-w-[360px] flex w-full  flex-col items-center gap-4"
            >
              <ng-content select="[author-info-card]"></ng-content>
            </div>
          </div>

          <div class="mt-4 w-full flex-1">
            <ng-content select="[author-info-description]"></ng-content>
          </div>
        </div>
      </div>
    </al-card>
  `,
})
export class AuthorInfoTemplateComponent {}
