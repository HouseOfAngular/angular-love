import { Dialog } from '@angular/cdk/dialog';
import { inject, Injectable } from '@angular/core';

import { RoadmapStandardNode } from '@angular-love/blog/roadmap/ui-roadmap-node';
import { RoadmapBottomsheetComponent } from '@angular-love/ui-roadmap-bottomsheet';

@Injectable({ providedIn: 'root' })
export class RoadmapBottomsheetManagerService {
  private readonly _dialog = inject(Dialog);

  open(node: RoadmapStandardNode) {
    return this._dialog.open(RoadmapBottomsheetComponent, {
      data: node,
      disableClose: false,
    }).closed;
  }
}
