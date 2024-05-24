import { inject, Provider } from '@angular/core';

import { ConfigService } from '@angular-love/shared/config';

import { GISCUS_CONFIG, GiscusConfig } from '../tokens';

export function provideComments(): Provider[] {
  return [
    {
      provide: GISCUS_CONFIG,
      useFactory: (): GiscusConfig => {
        const defaultGiscusConfig: Partial<GiscusConfig> = {
          mapping: 'url',
          theme: `${window.location.origin}/assets/comments-theme.css`,
          lang: 'en',
          strict: false,
          reactionsEnabled: false,
          emitMetadata: false,
          inputPosition: 'bottom',
        };

        const config = inject(ConfigService);

        return {
          ...defaultGiscusConfig,
          repo: config.get<string>('giscusRepo'),
          repoId: config.get<string>('giscusRepoId'),
          category: config.get<string>('giscusCategory'),
          categoryId: config.get<string>('giscusCategoryId'),
        };
      },
    },
  ];
}
