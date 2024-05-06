import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { IconService, IconType } from '../icon-service';

export type Size = 16;

@Component({
  selector: 'al-icon',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconComponent {
  size = input<Size>(16);
  name = input.required<IconType>();

  private _iconService = inject(IconService);
  private _sanitizer = inject(DomSanitizer);

  protected get svgIcon(): SafeHtml {
    const svgContent = this._iconService.getSvgByName(this.name());
    return this._sanitizer.bypassSecurityTrustHtml(svgContent);
  }
}
