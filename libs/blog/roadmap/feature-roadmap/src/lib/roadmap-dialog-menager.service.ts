import { Dialog } from '@angular/cdk/dialog';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { RoadmapStandardNode } from '@angular-love/blog/roadmap/ui-roadmap-node';
import { RoadmapDialogComponent } from '@angular-love/roadmap/ui-roadmap-dialog';

@Injectable({ providedIn: 'root' })
export class RoadmapDialogManagerService {
  private readonly _dialog = inject(Dialog);

  open(node: RoadmapStandardNode): Observable<unknown> {
    return this._dialog.open(RoadmapDialogComponent, {
      data: node,
      disableClose: false,
    }).closed;
  }
}
