import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';

export const resolveActiveLanguage: (lang: string) => ResolveFn<void> = (
  lang,
) => {
  return () => {
    const translocoService = inject(TranslocoService);
    if (translocoService.getActiveLang() !== lang) {
      translocoService.setActiveLang(lang);
    }
  };
};
