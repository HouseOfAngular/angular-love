import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

export type IconType =
  | 'calendar'
  | 'circle-check'
  | 'clock'
  | 'cross'
  | 'facebook'
  | 'github-mark'
  | 'linkedIn'
  | 'location-pin'
  | 'magnifier-glass'
  | 'send'
  | 'tick'
  | 'twitter-x'
  | 'youtube';

@Component({
  selector: 'al-icon',
  standalone: true,
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['icon.component.scss'],
  host: { '[style.-webkit-mask-image]': 'path()' },
})
export class IconComponent {
  readonly name = input.required<IconType>();
  readonly path = computed(() => `url("assets/icons/${this.name()}.svg")`);
}
