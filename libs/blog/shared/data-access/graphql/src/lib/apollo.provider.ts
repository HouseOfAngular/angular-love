import {
  EnvironmentProviders,
  inject,
  InjectionToken,
  makeEnvironmentProviders,
  makeStateKey,
  TransferState,
} from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Apollo, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';
import { ConfigService } from '@angular-love/shared/config';

const APOLLO_CACHE = new InjectionToken<InMemoryCache>('apollo-cache');
const STATE_KEY = makeStateKey<any>('apollo.state');

export function provideApollo(): EnvironmentProviders {
  return makeEnvironmentProviders([
    Apollo,
    {
      provide: APOLLO_CACHE,
      useValue: new InMemoryCache({
        addTypename: false,
      }),
    },
    {
      provide: APOLLO_OPTIONS,
      useFactory: () => {
        const httpLink = inject(HttpLink);
        const cache = inject(APOLLO_CACHE);
        const transferState = inject(TransferState);
        const configService = inject(ConfigService);
        const isBrowser = transferState.hasKey<any>(STATE_KEY);

        if (isBrowser) {
          const state = transferState.get<any>(STATE_KEY, null);
          cache.restore(state);
        } else {
          transferState.onSerialize(STATE_KEY, () => {
            return cache.extract();
          });
          // Reset cache after extraction to avoid sharing between requests
          cache.reset();
        }

        return {
          cache,
          link: httpLink.create({
            uri: configService.get('graphqlUri'),
            headers: new HttpHeaders({
              authorization: configService.get('graphqlToken'),
            }),
          }),
        };
      },
    },
  ]);
}
