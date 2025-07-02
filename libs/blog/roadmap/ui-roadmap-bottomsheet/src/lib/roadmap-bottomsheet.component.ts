import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { NgClass } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';

import { RoadmapNodeDTO } from '@angular-love/blog/contracts/roadmap';
import { ButtonComponent } from '@angular-love/blog/shared/ui-button';

// eslint-disable-next-line @nx/enforce-module-boundaries
import { AngularLoveNodeDTO } from '../../../../../blog-contracts/roadmap/src/lib/angular-love-node.interface';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { RegularNodeDTO } from '../../../../../blog-contracts/roadmap/src/lib/regular-node.type';

import { RoadmapBottomsheetCreatorsComponent } from './roadmap-bottomsheet-creators/roadmap-bottomsheet-creators.component';
import { RoadmapBottomsheetDescriptionComponent } from './roadmap-bottomsheet-description/roadmap-bottomsheet-description.component';
import { RoadmapBottomsheetFooterComponent } from './roadmap-bottomsheet-footer/roadmap-bottomsheet-footer.component';
import { RoadmapBottomsheetHeaderComponent } from './roadmap-bottomsheet-header/roadmap-bottomsheet-header.component';
import { RoadmapBottomsheetRegularContentComponent } from './roadmap-bottomsheet-regular-content/roadmap-bottomsheet-regular-content.component';

function isAngularNode(node: RoadmapNodeDTO): node is AngularLoveNodeDTO {
  return node.nodeType === 'angular-love';
}

function isRegularNode(node: RoadmapNodeDTO): node is RegularNodeDTO {
  return node.nodeType !== 'angular-love';
}

@Component({
  imports: [
    NgClass,
    RoadmapBottomsheetHeaderComponent,
    RoadmapBottomsheetDescriptionComponent,
    RoadmapBottomsheetRegularContentComponent,
    RoadmapBottomsheetCreatorsComponent,
    ButtonComponent,
    RoadmapBottomsheetFooterComponent,
  ],
  selector: 'al-roadmap-bottomsheet',
  templateUrl: './roadmap-bottomsheet.component.html',
  styles: `
    .bottomsheet {
      &.visible {
        animation: fadeInBottom 1s forwards;
      }
    }

    @keyframes fadeInBottom {
      from {
        opacity: 0;
        transform: translateY(100%);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `,
  host: {
    '[style.display]': 'nodeDetails() ? "block" : "none"',
    '[class.visible]': 'nodeDetails() !== undefined',
  },
  standalone: true,
})
export class RoadmapBottomsheetComponent {
  private matDialogData = inject<RoadmapNodeDTO>(DIALOG_DATA);
  private dialogRef = inject(DialogRef<RoadmapBottomsheetComponent>);
  nodeDetails = signal<RoadmapNodeDTO>(this.matDialogData);
  language = signal<string>('');

  protected readonly angularLoveNodeDetails = computed<
    AngularLoveNodeDTO | undefined
  >(() => {
    const details = this.nodeDetails();
    return details && isAngularNode(details) ? details : undefined;
  });

  protected readonly regularNodeDetails = computed<RegularNodeDTO | undefined>(
    () => {
      const details = this.nodeDetails();
      return details && isRegularNode(details) ? details : undefined;
    },
  );

  protected readonly regularNodeArticles = computed(() => {
    const regularNodeDetails = this.regularNodeDetails();
    return (
      regularNodeDetails?.resources.filter(
        (resource) => resource.type === 'article',
      ) ?? []
    );
  });

  protected readonly regularNodeVideos = computed(() => {
    const regularNodeDetails = this.regularNodeDetails();
    return (
      regularNodeDetails?.resources.filter(
        (resource) => resource.type === 'video',
      ) ?? []
    );
  });

  onClose() {
    this.dialogRef.close();
  }
}
