import { Injectable } from '@angular/core';

import icons from '../icons/icons';

export type IconType = keyof typeof icons;

@Injectable({
  providedIn: 'root',
})
export class IconService {
  public getSvgByName(name: IconType): string {
    return icons[name];
  }
}
