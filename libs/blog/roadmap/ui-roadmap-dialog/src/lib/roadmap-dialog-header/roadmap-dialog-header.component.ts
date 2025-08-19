import { TitleCasePipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';

import { RoadmapStandardNode } from '@angular-love/blog/roadmap/ui-roadmap-node';

@Component({
  selector: 'al-roadmap-dialog-header',
  template: `
    <section class="border-b border-current py-4 text-center" [class]="class()">
      <h3 class="text-2xl font-bold">{{ headerTitle() | titlecase }}</h3>
    </section>
  `,
  imports: [TitleCasePipe],
})
export class RoadmapDialogHeaderComponent {
  readonly nodeType = input.required<RoadmapStandardNode['nodeType']>();
  readonly headerTitle = input.required<string>();

  protected readonly class = computed(() => {
    switch (this.nodeType()) {
      case 'angular-love':
        return 'from-al-roadmap-secondary to-al-roadmap-accent bg-gradient-to-r';
      case 'primary':
        return 'bg-al-roadmap-primary light:bg-al-roadmap-primary/55 text-al-primary-foreground';
      case 'secondary':
        return 'bg-al-roadmap-secondary light:bg-al-roadmap-secondary/35 text-al-primary-foreground';
    }
  });
}
