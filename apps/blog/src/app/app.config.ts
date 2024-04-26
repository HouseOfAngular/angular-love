import { ApplicationConfig } from '@angular/core';
import {
  provideRouter,
  withComponentInputBinding,
  withEnabledBlockingInitialNavigation,
} from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { environment } from '../environments/environment';
import { provideClientHydration } from '@angular/platform-browser';
import { blogShellRoutes } from '@angular-love/blog/shell/feature';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      blogShellRoutes,
      withEnabledBlockingInitialNavigation(),
      withComponentInputBinding(),
    ),
    provideHttpClient(withFetch()),
    provideClientHydration(),
    environment.providers,
  ],
};
