import { NgOptimizedImage, NgStyle } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgIconComponent } from '@ng-icons/core';

type AvatarSize = '32' | '96';

@Component({
  selector: 'al-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgOptimizedImage, NgIconComponent, NgStyle],
})
export class AvatarComponent {
  readonly imageSrc = input.required<string>();
  readonly size = input<AvatarSize>('32');
  readonly priority = input<number | null>(null);
}
