import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  APP_INITIALIZER,
  EnvironmentProviders,
  inject,
  Injectable,
  InjectionToken,
  makeEnvironmentProviders,
  PLATFORM_ID,
} from '@angular/core';

import { ScriptFactory, ScriptsLoader } from '../scripts-loader';

/**
 * Credits https://github.com/find-ida/angular-ssr-partytown
 */
export type PartyTownConfig = {
  enabled: boolean;
  debug?: boolean;
  basePath?: string;
  forward?: (string | [string, { preserveBehavior: boolean }])[];
  reverseProxy?: string;
  proxiedHosts?: string[];
};

export const PARTY_TOWN_CONFIG = new InjectionToken<PartyTownConfig>(
  'partyTownConfig',
);

export const providePartyTown = (
  config: PartyTownConfig,
): EnvironmentProviders =>
  makeEnvironmentProviders([
    {
      provide: PARTY_TOWN_CONFIG,
      useValue: {
        ...config,
        enabled: config?.enabled ?? false,
        debug: config?.debug ?? false,
        basePath: config?.basePath ?? '/~partytown',
        forward: config?.forward ?? [],
        reverseProxy: config?.reverseProxy ?? '',
        proxiedHosts: config?.proxiedHosts ?? [],
      } satisfies PartyTownConfig,
    },
    PartyTownService,
  ]);

@Injectable()
export class PartyTownService implements ScriptsLoader {
  private readonly _config = inject(PARTY_TOWN_CONFIG, { optional: true });
  private readonly _document = inject(DOCUMENT);

  init(scripts: ScriptFactory[]): void {
    if (this._config?.enabled) {
      this.initPartyTownScript();
      const disablePartyTown = window.location.search.includes('gtm_debug=');

      this.initScripts(disablePartyTown, ...(scripts ?? []));
    }
  }

  private initScripts(
    disablePartyTown = false,
    ...scripts: ScriptFactory[]
  ): void {
    scripts.forEach((script) => {
      const scriptElement = this._document.createElement('script');
      const _script = script(scriptElement);
      if (!disablePartyTown) {
        if (_script.type) {
          _script.setAttribute('data-type', 'text/partytown');
        } else {
          _script.setAttribute('type', 'text/partytown');
        }
      }

      this._document.head.appendChild(_script);
      window.dispatchEvent(new CustomEvent('ptupdate'));
    });
  }

  private initPartyTownScript(): void {
    if (!this._config) return;
    const config = this._config;

    // Config Script
    const partyTownConfigurationScript = this._document.createElement('script');
    partyTownConfigurationScript.textContent = `partytown = {
      debug: ${config.debug ?? false},
      forward: ${JSON.stringify(config.forward ?? [])},
      resolveUrl: function (url, location, type) {
        const proxiedHosts = ${JSON.stringify(config.proxiedHosts ?? [])};
        if (proxiedHosts.includes(url.hostname)) {
          var proxyUrl = new URL('${config.reverseProxy}');
          proxyUrl.searchParams.append('url', url.href);
          return proxyUrl;
        }
        return url;
      }
    };`;
    this._document.head.appendChild(partyTownConfigurationScript);

    // Lib Script
    const partyTownLibScript = this._document.createElement('script');
    partyTownLibScript.src = `${config.basePath}/partytown.js`;
    // Attach partyTown script
    this._document.head.appendChild(partyTownLibScript);
  }
}
