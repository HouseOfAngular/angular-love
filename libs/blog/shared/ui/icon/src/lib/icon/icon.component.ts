import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { getIcon, IconType } from '../icons';

export type Size = 16;

@Component({
  selector: 'al-icon',
  standalone: true,
  templateUrl: './icon.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconComponent {
  size = input<Size>(16);
  name = input.required<IconType>();
  color = input<string>('#fff');

  private _sanitizer = inject(DomSanitizer);

  protected svgIcon = computed<SafeHtml>(() => {
    const icon = getIcon(this.name());
    return this._sanitizer.bypassSecurityTrustHtml(icon);
  });
}
