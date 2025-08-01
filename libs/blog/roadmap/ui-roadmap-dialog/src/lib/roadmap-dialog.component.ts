import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';

import {
  AngularLoveNode,
  RoadmapRegularNode,
  RoadmapStandardNode,
} from '@angular-love/blog/roadmap/ui-roadmap-node';
import { ButtonComponent } from '@angular-love/blog/shared/ui-button';

import { RoadmapDialogAdditionalDescriptionComponent } from './roadmap-dialog-additional-description/roadmap-dialog-additional-description.component';
import { RoadmapDialogCreatorsComponent } from './roadmap-dialog-creators/roadmap-dialog-creators.component';
import { RoadmapDialogDescriptionComponent } from './roadmap-dialog-description/roadmap-dialog-description.component';
import { RoadmapDialogFooterComponent } from './roadmap-dialog-footer/roadmap-dialog-footer.component';
import { RoadmapDialogHeaderComponent } from './roadmap-dialog-header/roadmap-dialog-header.component';
import { RoadmapDialogRegularContentComponent } from './roadmap-dialog-regular-content/roadmap-dialog-regular-content.component';

function isAngularNode(node: RoadmapStandardNode): node is AngularLoveNode {
  return node.nodeType === 'angular-love';
}

function isRegularNode(node: RoadmapStandardNode): node is RoadmapRegularNode {
  return node.nodeType !== 'angular-love';
}

@Component({
  selector: 'al-roadmap-dialog',
  templateUrl: './roadmap-dialog.component.html',
  styleUrl: './roadmap-dialog.component.scss',
  imports: [
    RoadmapDialogHeaderComponent,
    RoadmapDialogDescriptionComponent,
    RoadmapDialogRegularContentComponent,
    RoadmapDialogCreatorsComponent,
    TranslocoDirective,
    ButtonComponent,
    RoadmapDialogFooterComponent,
    RoadmapDialogAdditionalDescriptionComponent,
  ],
})
export class RoadmapDialogComponent {
  readonly language = signal<string>('');

  private readonly _router = inject(Router);
  private readonly _dialogRef = inject(DialogRef<RoadmapDialogComponent>);

  protected readonly nodeDetails = inject<RoadmapStandardNode>(DIALOG_DATA);
  protected readonly angularLoveNodeDetails: AngularLoveNode | undefined =
    isAngularNode(this.nodeDetails) ? this.nodeDetails : undefined;
  protected readonly regularNodeDetails: RoadmapRegularNode | undefined =
    isRegularNode(this.nodeDetails) ? this.nodeDetails : undefined;
  protected readonly regularNodeArticles =
    this.regularNodeDetails?.resources.filter(
      (resource) => resource.type === 'article',
    ) ?? [];
  protected readonly regularNodeVideos =
    this.regularNodeDetails?.resources.filter(
      (resource) => resource.type === 'video',
    ) ?? [];

  protected navigateToAuthor() {
    this._router.navigate(['/become-author']);
    this._dialogRef.close();
  }
}
