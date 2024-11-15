import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { cwd } from 'node:process';
import {
  ApplicationConfig,
  Injectable,
  mergeApplicationConfig,
} from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { provideFastSVG, SvgLoadStrategy } from '@push-based/ngx-fast-svg';
import { from, Observable, of, switchMap } from 'rxjs';

import { appConfig } from './app.config';

@Injectable()
export class SvgLoadStrategySsr implements SvgLoadStrategy {
  config(url: string) {
    return of(join(cwd(), 'apps', 'blog', 'src', url));
  }
  load(iconPath$: Observable<string>) {
    return iconPath$.pipe(
      switchMap((iconPath) => from(readFile(iconPath, { encoding: 'utf8' }))),
    );
  }
}

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    provideFastSVG({
      svgLoadStrategy: SvgLoadStrategySsr,
      url: (name: string) => `assets/icons/${name}.svg`,
    }),
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
