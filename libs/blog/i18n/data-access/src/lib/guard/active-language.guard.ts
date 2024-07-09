import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';

export const activeLanguageGuard: (lang: string) => CanActivateFn = (lang) => {
  return () => {
    const translocoService = inject(TranslocoService);
    if (translocoService.getActiveLang() !== lang) {
      translocoService.setActiveLang(lang);
    }
    return true;
  };
};
