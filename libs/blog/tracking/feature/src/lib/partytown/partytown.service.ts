import {
  DOCUMENT,
  EnvironmentProviders,
  inject,
  Injectable,
  InjectionToken,
  makeEnvironmentProviders,
} from '@angular/core';

import { PixelFactory, ScriptFactory, ScriptsLoader } from '../scripts-loader';

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

  init(scripts: ScriptFactory[], pixels: PixelFactory[]): void {
    if (this._config?.enabled) {
      this.initPartyTownScript();
      const disablePartyTown = window.location.search.includes('gtm_debug=');

      this.initScripts(disablePartyTown, ...(scripts ?? []));
      this.initPixels(pixels);
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

  private initPixels(pixels: PixelFactory[]): void {
    pixels.forEach((pixel) => {
      const noScriptElement = this._document.createElement('noscript');
      const pixelElement = this._document.createElement('img');
      const _pixel = pixel(pixelElement);
      noScriptElement.append(_pixel);
      this._document.head.appendChild(noScriptElement);
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
