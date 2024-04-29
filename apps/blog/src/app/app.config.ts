import { blogShellRoutes } from '@angular-love/blog/shell/feature';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import {
  provideRouter,
  withComponentInputBinding,
  withEnabledBlockingInitialNavigation,
} from '@angular/router';
import { environment } from '../environments/environment';

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
