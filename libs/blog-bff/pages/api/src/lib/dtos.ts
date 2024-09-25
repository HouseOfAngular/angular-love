export interface WPPageDto {
  slug: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  other_translations: {
    locale: string;
    slug: string;
  }[];
  lang: string;
}
