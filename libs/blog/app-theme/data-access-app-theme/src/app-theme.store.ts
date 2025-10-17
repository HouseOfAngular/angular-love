import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

export type Theme = 'dark' | 'light';

interface AppThemeStore {
  theme: Theme;
}

export const AppThemeStore = signalStore(
  { providedIn: 'root' },
  withState<AppThemeStore>({ theme: 'dark' }),
  withMethods(
    (
      store,
      platformId = inject(PLATFORM_ID),
      ccConsumer = inject(CCAppThemeConsumer),
    ) => ({
      syncWithSystemTheme: () => {
        if (isPlatformBrowser(platformId)) {
          const theme =
            (localStorage.getItem('theme') as Theme) ?? getSystemTheme();
          patchState(store, { theme: theme });
          ccConsumer.setThemeAttribute(theme);
        }
      },
      toggleTheme: () => {
        if (isPlatformBrowser(platformId)) {
          const newTheme = store.theme() === 'dark' ? 'light' : 'dark';
          ccConsumer.setThemeAttribute(newTheme);
          localStorage.setItem('theme', newTheme);
          patchState(store, { theme: newTheme });
        }
      },
    }),
  ),
);

function getSystemTheme(): Theme {
  // Hardcoded to 'dark' for now, as per decision.
  return 'dark';
}

/* todo: create consumer interface and decouple AppThemeStore from CCAppThemeConsumer*/
@Injectable({ providedIn: 'root' })
export class CCAppThemeConsumer {
  setThemeAttribute(theme: Theme): void {
    document.documentElement.setAttribute('data-theme', theme);

    const classList = document.documentElement.classList;

    if (theme === 'dark') {
      classList.add('cc--darkmode');
    } else {
      classList.remove('cc--darkmode');
    }
  }
}
