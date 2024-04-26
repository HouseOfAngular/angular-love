import {
  EnvironmentProviders,
  inject,
  Injectable,
  InjectionToken,
  makeEnvironmentProviders,
} from '@angular/core';

export type ConfigOptions = Record<string, unknown>;

export const CONFIG_OPTIONS = new InjectionToken<ConfigOptions>(
  'ConfigOptions',
  {
    factory: () => ({}),
  },
);

@Injectable()
export class ConfigService {
  private readonly _options = inject(CONFIG_OPTIONS);

  get<T>(key: string): T {
    // TODO: handle missing keys
    return this._options[key] as T;
  }
}

export function provideConfig(
  configOptions: ConfigOptions = {},
): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: CONFIG_OPTIONS,
      useValue: configOptions,
    },
    ConfigService,
  ]);
}
