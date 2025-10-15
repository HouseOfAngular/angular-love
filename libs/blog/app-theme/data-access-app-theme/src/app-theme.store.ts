import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

export type Theme = 'dark' | 'light';

interface AppThemeStore {
  theme: Theme;
}

// Cookie helper functions
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}

function setCookie(name: string, value: string, days: number): void {
  if (typeof document === 'undefined') return;
  // days to milliseconds: days * 24 * 60 * 60 * 1000 = days * 864e5
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  const isSecure =
    typeof window !== 'undefined' && window.location.protocol === 'https:';
  document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax${isSecure ? '; Secure' : ''}`;
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
          // Read from cookie only (for SSR compatibility)
          const cookieTheme = getCookie('theme') as Theme | null;
          const theme = cookieTheme || getSystemTheme();
          patchState(store, { theme: theme });
        }
      },
      toggleTheme: () => {
        if (isPlatformBrowser(platformId)) {
          const newTheme = store.theme() === 'dark' ? 'light' : 'dark';
          ccConsumer.setThemeAttribute(newTheme);
          setCookie('theme', newTheme, 365);

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
