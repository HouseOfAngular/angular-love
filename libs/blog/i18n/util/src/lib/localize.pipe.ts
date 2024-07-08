import { inject, Pipe, type PipeTransform } from '@angular/core';
import { UrlTree } from '@angular/router';

import { AlLocalizeService } from './localize.service';

@Pipe({
  name: 'alLocalize',
  standalone: true,
})
export class AlLocalizePipe implements PipeTransform {
  private readonly _service = inject(AlLocalizeService);

  transform(commandsOrUrlTree: string | UrlTree | any[]): any[] | string {
    return this._service.localizePath(commandsOrUrlTree);
  }
}
