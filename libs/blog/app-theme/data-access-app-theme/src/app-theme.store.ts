import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

export type Theme = 'dark' | 'light';

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
          const theme = getSystemTheme();
          ccConsumer.setThemeAttribute(theme);
          patchState(store, { theme: theme });
        }
      },
      toggleTheme: () => {
        const theme = store.theme() === 'dark' ? 'light' : 'dark';
        ccConsumer.setThemeAttribute(theme);
        patchState(store, { theme: theme });
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
  setThemeAttribute(theme: Theme): void {
    document.documentElement.setAttribute('data-theme', theme);
  }
}
