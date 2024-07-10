import { NgOptimizedImage, NgStyle } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroUsers } from '@ng-icons/heroicons/outline';

type AvatarSize = 'sm' | 'md';

@Component({
  standalone: true,
  selector: 'al-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgOptimizedImage, NgIconComponent, NgStyle],
  providers: [provideIcons({ heroUsers })],
})
export class AvatarComponent {
  readonly imageSrc = input.required<string>();
  readonly size = input<AvatarSize>('sm');
  readonly priority = input<number | null>(null);

  protected sideLength = computed(() => {
    switch (this.size()) {
      case 'sm':
        return '32';
      case 'md':
        return '96';
      default:
        return '32';
    }
  });
}
