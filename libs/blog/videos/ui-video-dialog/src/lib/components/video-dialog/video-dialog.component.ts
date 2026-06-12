import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { FastSvgComponent } from '@push-based/ngx-fast-svg';

import { YoutubeVideoPlayerComponent } from '@angular-love/blog/videos/ui-youtube-video-player';

import { VideoDialogData } from '../../types/video-dialog-data';

@Component({
  selector: 'al-video-dialog',
  templateUrl: './video-dialog.component.html',
  styleUrl: './video-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [YoutubeVideoPlayerComponent, TranslocoDirective, FastSvgComponent],
})
export class VideoDialogComponent {
  protected readonly videoData = inject<VideoDialogData>(DIALOG_DATA);

  private readonly _dialogRef = inject(DialogRef);

  protected close(): void {
    this._dialogRef.close();
  }
}
