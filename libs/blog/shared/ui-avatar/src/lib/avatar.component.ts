import { NgOptimizedImage } from '@angular/common';
import { Component, input } from '@angular/core';

type AvatarSize = '32' | '96';

@Component({
  selector: 'al-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
  imports: [NgOptimizedImage],
})
export class AvatarComponent {
  readonly imageSrc = input.required<string>();
  readonly size = input<AvatarSize>('32');
  readonly priority = input<number | null>(null);
}
