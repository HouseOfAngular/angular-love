import { Component, input } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';

@Component({
  selector: 'al-roadmap-dialog-subtitle',
  imports: [TranslocoDirective],
  template: `
    <h4
      *transloco="let t; read: 'roadmapPage.bottomsheet'"
      class="font-semibold"
    >
      {{ t(title()) }}
    </h4>
    <div class="h-px flex-grow bg-white"></div>
  `,
  host: {
    class: 'flex items-center gap-4',
  },
})
export class RoadmapDialogSubtitleComponent {
  readonly title = input.required<string>();
}
