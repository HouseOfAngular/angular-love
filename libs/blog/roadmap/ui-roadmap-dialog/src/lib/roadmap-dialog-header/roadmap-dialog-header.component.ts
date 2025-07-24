import { TitleCasePipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';

import { RoadmapStandardNode } from '@angular-love/blog/roadmap/ui-roadmap-node';

@Component({
  selector: 'al-roadmap-dialog-header',
  imports: [TitleCasePipe],
  template: `
    <section
      class="border-b border-current py-4 text-center"
      [class]="backgroundClass()"
    >
      <h3 class="text-2xl font-bold">{{ title() | titlecase }}</h3>
    </section>
  `,
})
export class RoadmapDialogHeaderComponent {
  readonly nodeType = input.required<RoadmapStandardNode['nodeType']>();
  readonly title = input.required<string>();

  protected readonly backgroundClass = computed(() => {
    switch (this.nodeType()) {
      case 'angular-love':
        return 'from-al-roadmap-secondary to-al-roadmap-accent bg-gradient-to-r';
      case 'primary':
        return 'bg-al-roadmap-primary';
      case 'secondary':
        return 'bg-al-roadmap-secondary';
    }
  });
}
