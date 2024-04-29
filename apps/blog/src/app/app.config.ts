import { provideHttpClient, withFetch } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import {
  provideRouter,
  withComponentInputBinding,
  withEnabledBlockingInitialNavigation,
} from '@angular/router';
import { environment } from '../environments/environment';
import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      appRoutes,
      withEnabledBlockingInitialNavigation(),
      withComponentInputBinding(),
    ),
    provideHttpClient(withFetch()),
    provideClientHydration(),
    environment.providers,
  ],
};
