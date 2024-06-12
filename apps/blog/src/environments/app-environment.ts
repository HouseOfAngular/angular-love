import { EnvironmentProviders } from '@angular/core';

export interface AppEnvironment {
  baseUrl: string;
  providers: EnvironmentProviders[];
}
