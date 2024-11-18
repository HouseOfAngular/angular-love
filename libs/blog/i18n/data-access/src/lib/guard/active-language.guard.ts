import { inject } from '@angular/core';
import { CanMatchFn } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';

export const activeLanguageGuard: (lang: string) => CanMatchFn = (lang) => {
  return () => {
    const translocoService = inject(TranslocoService);
    if (translocoService.getActiveLang() !== lang) {
      translocoService.setActiveLang(lang);
    }
    return true;
  };
};
