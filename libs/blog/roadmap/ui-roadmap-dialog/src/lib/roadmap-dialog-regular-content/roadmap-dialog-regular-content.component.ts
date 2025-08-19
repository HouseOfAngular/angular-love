import { Component, input } from '@angular/core';

import { Resource } from '@angular-love/blog/contracts/roadmap';

import { RoadmapDialogSubtitleComponent } from '../roadmap-dialog-subtitle/roadmap-dialog-subtitle.component';

@Component({
  selector: 'al-roadmap-dialog-regular-content',
  template: `
    <section class="px-6 pt-6">
      <al-roadmap-dialog-subtitle [subtitle]="subtitle()" />
      <ul class="text-al-primary-foreground list-disc px-6 pt-4">
        @for (resource of resources(); track resource.name) {
          <li class="py-1 underline">
            <a [href]="resource.url" target="_blank">
              {{ resource.name }}
            </a>
          </li>
        }
      </ul>
    </section>
  `,
  imports: [RoadmapDialogSubtitleComponent],
})
export class RoadmapDialogRegularContentComponent {
  readonly subtitle = input.required<string>();
  readonly resources = input.required<Resource[]>();
}
