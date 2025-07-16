import { Component, input } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';

@Component({
  selector: 'al-roadmap-bottomsheet-subtitle',
  imports: [TranslocoDirective],
  template: `
    <ng-container *transloco="let t; read: 'roadmapPage.bottomsheet'">
      <h4 class="font-semibold">{{ t(title()) }}</h4>
      <div class="h-px flex-grow bg-white"></div>
    </ng-container>
  `,
  host: {
    class: 'flex items-center gap-4',
  },
})
export class RoadmapBottomsheetSubtitleComponent {
  readonly title = input.required<string>();
}
