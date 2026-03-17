import {
  ApplicationConfig,
  Injectable,
  mergeApplicationConfig,
} from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { provideFastSVG, SvgLoadStrategy } from '@push-based/ngx-fast-svg';
import { map, Observable, of } from 'rxjs';

import { appConfig } from './app.config';

const svgCache = import.meta.glob('/public/assets/icons/*.svg', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

@Injectable()
export class SvgLoadStrategySsr implements SvgLoadStrategy {
  config(url: string) {
    return of(url);
  }

  load(iconPath$: Observable<string>) {
    return iconPath$.pipe(
      map((iconPath) => svgCache[`/public${iconPath}`] ?? ''),
    );
  }
}

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),

    provideFastSVG({
      svgLoadStrategy: SvgLoadStrategySsr,
      url: (name: string) => `/assets/icons/${name}.svg`,
    }),
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
