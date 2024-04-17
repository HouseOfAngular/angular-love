import {
  ChangeDetectionStrategy,
  Component,
  computed,
  Input,
  signal,
} from '@angular/core';
import { NgOptimizedImage, NgStyle } from '@angular/common';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroUsers } from '@ng-icons/heroicons/outline';

type AvatarSize = 'sm' | 'mds' | 'md' | 'lg';

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
  @Input() imageSrc?: string;

  @Input()
  set size(val: AvatarSize) {
    this._size.set(val);
  }

  private _size = signal<AvatarSize>('sm');

  sideLength = computed(() => {
    switch (this._size()) {
      case 'sm':
        return '30';
      case 'mds':
        return '32';
      case 'md':
        return '45';
      case 'lg':
        return '60';
      default:
        return '30';
    }
  });
}
