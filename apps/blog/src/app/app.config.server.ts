import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { cwd } from 'node:process';
import {
  ApplicationConfig,
  inject,
  Injectable,
  mergeApplicationConfig,
  PendingTasks,
} from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { provideFastSVG, SvgLoadStrategy } from '@push-based/ngx-fast-svg';
import { finalize, from, Observable, of, switchMap } from 'rxjs';

import { appConfig } from './app.config';

@Injectable()
export class SvgLoadStrategySsr implements SvgLoadStrategy {
  private readonly _pendingTasks = inject(PendingTasks);

  config(url: string) {
    return of(join(cwd(), 'apps', 'blog', 'src', url));
  }

  load(iconPath$: Observable<string>) {
    return iconPath$.pipe(
      switchMap((iconPath) => {
        const removeTask = this._pendingTasks.add();
        return from(readFile(iconPath, { encoding: 'utf8' })).pipe(
          finalize(removeTask),
        );
      }),
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
