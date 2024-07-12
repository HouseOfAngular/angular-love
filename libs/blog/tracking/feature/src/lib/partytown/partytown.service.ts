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
import tagAssistantMain, { tagAssistantWorker } from "./gtm-tag-assistant";

/**
 * Credits https://github.com/find-ida/angular-ssr-partytown
 */
export type PartyTownConfig = {
  partyTown?: {
    enabled: boolean;
    debug?: boolean;
    basePath?: string;
    forward?: string[];
    reverseProxy?: string;
    proxiedHosts?: string[];
    mainWindowAccessors?: string[];
  };
  scripts?: PartyTownScriptFactory[];
  pixels?: PartyTownPixelFactory[];
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
        partyTown: {
          ...config.partyTown,
          enabled: config.partyTown?.enabled ?? false,
          debug: config.partyTown?.debug ?? false,
          basePath: config.partyTown?.basePath ?? '/~partytown',
          forward: config.partyTown?.forward ?? ['dataLayer.push', 'fbq'],
          reverseProxy: config.partyTown?.reverseProxy ?? '',
          proxiedHosts: config.partyTown?.proxiedHosts ?? [],
          mainWindowAccessors: config.partyTown?.mainWindowAccessors ?? [],
        },
        scripts: config?.scripts ?? [],
        pixels: config?.pixels ?? [],
      } satisfies PartyTownConfig,
    },
    PartyTownService,
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: () => {
        const platformId = inject(PLATFORM_ID);
        const partyTownService = inject(PartyTownService);

        return () => {
          if (config.partyTown?.enabled && isPlatformBrowser(platformId)) {
            partyTownService.init();
          }
        };
      },
    },
  ]);

export type PartyTownScriptFactory = (
  scriptElement: HTMLScriptElement,
) => HTMLScriptElement;

export type PartyTownPixelFactory = (img: HTMLImageElement) => HTMLImageElement;

@Injectable()
export class PartyTownService {
  private readonly _config = inject(PARTY_TOWN_CONFIG, { optional: true });
  private readonly _document = inject(DOCUMENT);

  init(): void {
    if (this._config?.partyTown?.enabled) {
      this.initPartyTownScript();
      // const disablePartyTown = window.location.search.includes('gtm_debug=');

      const workerScript = document.createElement('script');
      workerScript.type = 'text/javascript';
      workerScript.textContent = `(${tagAssistantMain})()`;
      document.head.append(workerScript);

      const tagAssistantScript = document.createElement('script');
      tagAssistantScript.type = 'text/partytown';
      tagAssistantScript.textContent = `(${tagAssistantWorker})()`;
      document.head.append(tagAssistantScript);


      this.initScripts(false, ...(this._config?.scripts ?? []));
      this.initPixels(...(this._config?.pixels ?? []));
    }
  }

  private initScripts(
    disablePartyTown = false,
    ...scripts: PartyTownScriptFactory[]
  ): void {
    scripts.forEach((script) => {
      const scriptElement = this._document.createElement('script');
      const _script = script(scriptElement);
      if (disablePartyTown) {
        _script.removeAttribute('data-type');
      }

      this._document.head.appendChild(_script);
    });
  }

  private initPixels(...scripts: PartyTownPixelFactory[]): void {
    scripts.forEach((pixel) => {
      const noScriptElement = this._document.createElement('noscript');
      const pixelElement = this._document.createElement('img');
      const _pixel = pixel(pixelElement);
      noScriptElement.append(_pixel);
      this._document.head.appendChild(noScriptElement);
    });
  }

  private initPartyTownScript(): void {
    if (!this._config?.partyTown) return;
    const config = this._config.partyTown;

    // Config Script
    const partyTownConfigurationScript = this._document.createElement('script');
    partyTownConfigurationScript.textContent = `partytown = {
      debug: ${config.debug ?? false},
      forward: ${JSON.stringify(config.forward ?? [])},
      mainWindowAccessors: ${JSON.stringify(config.mainWindowAccessors ?? [])},
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