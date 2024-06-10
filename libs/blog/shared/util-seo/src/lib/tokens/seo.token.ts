import { InjectionToken } from '@angular/core';

export type SeoConfig = {
  locale: string;
  description: string;
  title: string;
  siteName: string;
};

export const SEO_CONFIG = new InjectionToken<SeoConfig>('Seo Config');
