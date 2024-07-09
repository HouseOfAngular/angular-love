import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export type SeoConfig = {
  locale: string;
  description: string;
  title: string;
  siteName: string;
  baseUrl: string;
};

export const SEO_CONFIG = new InjectionToken<Observable<SeoConfig>>(
  'Seo Config',
);
