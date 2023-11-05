import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgIf, NgOptimizedImage } from '@angular/common';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroUsers } from '@ng-icons/heroicons/outline';

@Component({
  standalone: true,
  selector: 'al-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgOptimizedImage, NgIf, NgIconComponent],
  providers: [provideIcons({ heroUsers })],
})
export class AvatarComponent {
  @Input() imageSrc?: string;
}
