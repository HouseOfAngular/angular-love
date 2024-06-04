import { Component } from '@angular/core';

import {
  CardComponent,
  CardContentDirective,
  GradientCardDirective,
} from '@angular-love/blog/shared/ui-card';

@Component({
  selector: 'al-author-card-template',
  standalone: true,
  imports: [CardComponent, CardContentDirective, GradientCardDirective],
  host: {
    class: 'block @container',
  },
  template: `
    <al-card alGradientCard>
      <div alCardContent>
        <div
          class="@3xl:flex-row @3xl:border-none flex  w-full flex-col items-center  rounded-lg border"
        >
          <div
            class="@3xl:border @3xl:!bg-al-radial-gradient @3xl:bg-al-background @3xl:min-w-[260px] min-w-fit rounded-lg pb-4 pt-6"
          >
            <div
              class="@3xl:max-w-[360px] flex w-full  flex-col items-center gap-4"
            >
              <ng-content select="[author-info-card]"></ng-content>
            </div>
          </div>

          <div class="@3xl:pt-6 w-full flex-1 p-6 pt-0">
            <ng-content select="[author-info-description]"></ng-content>
          </div>
        </div>
      </div>
    </al-card>
  `,
})
export class AuthorCardTemplateComponent {}
