import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { NGX_SKELETON_LOADER_CONFIG } from 'ngx-skeleton-loader';

export function provideSkeletonConfig(): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: NGX_SKELETON_LOADER_CONFIG,
      useFactory: () => {
        //todo adjust animation once light mode will be done
        return {
          animation: 'progress-dark',
          theme: {
            extendsFromRoot: true,
            backgroundColor: 'rgba(var(--card))',
          },
        };
      },
    },
  ]);
}
