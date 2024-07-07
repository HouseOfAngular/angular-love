import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  ApplicationConfig,
  Injectable,
  mergeApplicationConfig,
} from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { Observable, of } from 'rxjs';

import { provideFastSVG, SvgLoadStrategy } from '@push-based/ngx-fast-svg';

import { appConfig } from './app.config';

@Injectable()
export class SvgLoadStrategySsr implements SvgLoadStrategy {
  load(url: string): Observable<string> {
    const iconPath = join(process.cwd(), 'apps', 'blog', 'src', url);
    const iconSVG = readFileSync(iconPath, 'utf8');
    return of(iconSVG);
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
