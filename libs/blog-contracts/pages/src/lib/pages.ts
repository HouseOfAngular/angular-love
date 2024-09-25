export interface Page {
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  otherTranslations: {
    locale: string;
    slug: string;
  }[];
  lang: string;
}
