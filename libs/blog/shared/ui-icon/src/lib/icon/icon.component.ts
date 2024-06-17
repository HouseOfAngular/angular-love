import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

export type IconType =
  | 'circle-check'
  | 'clock'
  | 'cross'
  | 'facebook'
  | 'linkedIn'
  | 'magnifier-glass'
  | 'send'
  | 'tick'
  | 'twitter-x'
  | 'github-mark'
  | 'translate'
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
