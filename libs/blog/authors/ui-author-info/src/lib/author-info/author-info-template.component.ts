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
        <div
          class="@3xl:flex-row @5xl:border-none flex  w-full flex-col items-center  rounded-lg border"
        >
          <div
            class="@5xl:border @5xl:bg-al-gradient @5xl:min-w-[360px] min-w-fit rounded-lg pb-4 pt-6"
          >
            <div
              class="@3xl:max-w-[360px] flex w-full  flex-col items-center gap-4"
            >
              <ng-content select="[author-info-card]"></ng-content>
            </div>
          </div>

          <div class=" @3xl:pt-6 w-full flex-1 p-6 pt-0">
            <ng-content select="[author-info-description]"></ng-content>
          </div>
        </div>
      </div>
    </al-card>
  `,
})
export class AuthorInfoTemplateComponent {}
