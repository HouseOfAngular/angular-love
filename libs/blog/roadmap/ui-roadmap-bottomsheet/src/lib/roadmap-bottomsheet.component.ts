import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import {
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { Router } from '@angular/router';

import {
  AngularLoveNode,
  RoadmapRegularNode,
  RoadmapStandardNode,
} from '@angular-love/blog/roadmap/ui-roadmap-node';
import { ButtonComponent } from '@angular-love/blog/shared/ui-button';

import { RoadmapBottomsheetAdditionalDescriptionComponent } from './roadmap-bottomsheet-additional-description/roadmap-bottomsheet-additional-description.component';
import { RoadmapBottomsheetCreatorsComponent } from './roadmap-bottomsheet-creators/roadmap-bottomsheet-creators.component';
import { RoadmapBottomsheetDescriptionComponent } from './roadmap-bottomsheet-description/roadmap-bottomsheet-description.component';
import { RoadmapBottomsheetFooterComponent } from './roadmap-bottomsheet-footer/roadmap-bottomsheet-footer.component';
import { RoadmapBottomsheetHeaderComponent } from './roadmap-bottomsheet-header/roadmap-bottomsheet-header.component';
import { RoadmapBottomsheetRegularContentComponent } from './roadmap-bottomsheet-regular-content/roadmap-bottomsheet-regular-content.component';

function isAngularNode(node: RoadmapStandardNode): node is AngularLoveNode {
  return node.nodeType === 'angular-love';
}

function isRegularNode(node: RoadmapStandardNode): node is RoadmapRegularNode {
  return node.nodeType !== 'angular-love';
}

@Component({
  imports: [
    RoadmapBottomsheetHeaderComponent,
    RoadmapBottomsheetDescriptionComponent,
    RoadmapBottomsheetRegularContentComponent,
    RoadmapBottomsheetCreatorsComponent,
    ButtonComponent,
    RoadmapBottomsheetFooterComponent,
    RoadmapBottomsheetAdditionalDescriptionComponent,
  ],
  selector: 'al-roadmap-bottomsheet',
  templateUrl: './roadmap-bottomsheet.component.html',
  styles: `
    .bottomsheet {
      animation: fadeInBottom 0.4s ease-out forwards;
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
})
export class RoadmapBottomsheetComponent {
  readonly language = signal<string>('');

  private readonly _router = inject(Router);
  private readonly _dialogRef = inject(DialogRef<RoadmapBottomsheetComponent>);
  private readonly bottomsheetBody = viewChild('bottomsheetBody', {
    read: ElementRef,
  });

  protected readonly nodeDetails = inject<RoadmapStandardNode>(DIALOG_DATA);
  protected readonly angularLoveNodeDetails = computed<
    AngularLoveNode | undefined
  >(() => {
    return isAngularNode(this.nodeDetails) ? this.nodeDetails : undefined;
  });
  protected readonly regularNodeDetails = computed<
    RoadmapRegularNode | undefined
  >(() => {
    return isRegularNode(this.nodeDetails) ? this.nodeDetails : undefined;
  });
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

  protected navigateToAuthor() {
    this._router.navigate(['/become-author']);
    this._dialogRef.close();
  }

  protected onClose() {
    this._dialogRef.close();
  }

  constructor() {
    effect(() => {
      queueMicrotask(() =>
        this.bottomsheetBody()?.nativeElement.scrollTo({ top: 0 }),
      );
    });
  }
}
