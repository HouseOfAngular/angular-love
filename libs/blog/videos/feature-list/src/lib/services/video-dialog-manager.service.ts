import { Dialog } from '@angular/cdk/dialog';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  VideoDialogComponent,
  VideoDialogData,
} from '@angular-love/blog/videos/ui-video-dialog';

@Injectable({ providedIn: 'root' })
export class VideoDialogManagerService {
  private readonly _dialog = inject(Dialog);

  open(data: VideoDialogData): Observable<unknown> {
    return this._dialog.open(VideoDialogComponent, { data }).closed;
  }
}
