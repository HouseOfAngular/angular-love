import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';

export type Theme = 'dark' | 'light';

interface AppThemeStore {
  theme: Theme;
}

function getSafeStoredTheme(): Theme | null {
  try {
    const stored = localStorage.getItem('theme');
    if (stored === 'dark' || stored === 'light') {
      return stored;
    }
  } catch {
    void 0;
  }
  return null;
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
          const stored = getSafeStoredTheme();

          const current: Theme = stored ?? 'dark';

          patchState(store, { theme: current });
          ccConsumer.setThemeAttribute(current);
        }
      },
      toggleTheme: () => {
        if (isPlatformBrowser(platformId)) {
          const newTheme = store.theme() === 'dark' ? 'light' : 'dark';

          ccConsumer.setThemeAttribute(newTheme);
          patchState(store, { theme: newTheme });

          try {
            localStorage.setItem('theme', newTheme);
          } catch {
            void 0;
          }
        }
      },
    }),
  ),
  withHooks({
    onInit: (store, platformId = inject(PLATFORM_ID)) => {
      if (isPlatformBrowser(platformId)) {
        const stored = getSafeStoredTheme();
        if (stored) {
          patchState(store, { theme: stored });
        }
      }
    },
  }),
);

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
