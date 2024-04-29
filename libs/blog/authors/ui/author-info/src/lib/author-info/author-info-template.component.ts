import { Component } from '@angular/core';
import {
  CardComponent,
  CardContentDirective,
  GradientCardDirective,
} from '@angular-love/blog/shared/ui/card';

@Component({
  selector: 'al-author-info-template',
  standalone: true,
  imports: [CardComponent, CardContentDirective, GradientCardDirective],
  template: `
    <al-card alGradientCard>
      <div alCardContent>
        <div class="flex w-full items-start gap-14">
          <al-card
            alGradientCard
            class="flex max-w-[360px] flex-1 justify-center"
          >
            <div
              alCardContent
              class="flex w-full min-w-0 flex-shrink flex-col items-center gap-4"
            >
              <ng-content select="[author-info-card]"></ng-content>
            </div>
          </al-card>
          <div class="flex-1">
            <ng-content select="[author-info-description]"></ng-content>
          </div>
        </div>
      </div>
    </al-card>
  `,
})
export class AuthorInfoTemplateComponent {}
