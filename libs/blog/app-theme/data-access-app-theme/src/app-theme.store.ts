import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { signalStore, withMethods, withState } from '@ngrx/signals';

type Theme = 'dark' | 'light';

interface AppThemeStore {
  theme: Theme;
}

export const AppThemeStore = signalStore(
  { providedIn: 'root' },
  withState<AppThemeStore>({ theme: 'light' }),
  withMethods(
    (
      store,
      platformId = inject(PLATFORM_ID),
      ccConsumer = inject(CCAppThemeConsumer),
    ) => ({
      syncWithSystemTheme: () => {
        if (isPlatformBrowser(platformId)) {
          ccConsumer.setThemeClass(getSystemTheme());
        }
      },
    }),
  ),
);

function getSystemTheme(): Theme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

/* todo: create consumer interface and decouple AppThemeStore from CCAppThemeConsumer*/
@Injectable({ providedIn: 'root' })
export class CCAppThemeConsumer {
  setThemeClass(theme: Theme): void {
    const htmlElement = document.documentElement;
    switch (theme) {
      case 'dark':
        htmlElement.classList.add('cc--darkmode');
        break;
      case 'light':
        htmlElement.classList.remove('cc--darkmode');
        break;
    }
  }
}
