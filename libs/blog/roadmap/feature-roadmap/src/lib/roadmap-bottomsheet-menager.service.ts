import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { inject, Injectable } from '@angular/core';

import { RoadmapStandardNode } from '@angular-love/blog/roadmap/ui-roadmap-node';
import { RoadmapBottomsheetComponent } from '@angular-love/ui-roadmap-bottomsheet';

@Injectable({ providedIn: 'root' })
export class RoadmapBottomsheetManagerService {
  private dialog = inject(Dialog);
  private dialogRef?:
    | DialogRef<unknown, RoadmapBottomsheetComponent>
    | undefined;

  open(node: RoadmapStandardNode) {
    if (this.dialogRef) return;

    this.dialogRef = this.dialog.open(RoadmapBottomsheetComponent, {
      data: node,
      disableClose: false,
    });

    this.dialogRef?.closed.subscribe(() => {
      this.dialogRef = undefined;
    });
  }
}
