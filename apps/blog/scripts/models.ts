export type Language = 'pl' | 'en';

export interface RouteData {
  url: string;
  publishDate: string;
  title?: string;
  description?: string;
  lang?: Language;
}
