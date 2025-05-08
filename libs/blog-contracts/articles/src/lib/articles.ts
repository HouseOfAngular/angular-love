import { AuthorTitle } from '@angular-love/blog/contracts/authors';

export const articleCategories = [
  'news',
  'guides',
  'recommended',
  'authors',
  'latest',
  'angular-in-depth',
] as const;

export type ArticleCategory = (typeof articleCategories)[number];

export const anchorTypes = ['h2', 'h3'] as const;
export type AnchorType = (typeof anchorTypes)[number];

export type Anchor = {
  title: string;
  type: AnchorType;
};

export interface ArticlePreview {
  slug: string;
  title: string;
  excerpt: string;
  featuredImageUrl: string | null;
  publishDate: string;
  readingTime: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  author: {
    name: string;
    slug: string;
    avatarUrl: string;
  };
}

export interface SeoRobotsData {
  index: string;
  follow: string;
  'max-snippet': string;
  'max-image-preview': string;
  'max-video-preview': string;
}

export interface SeoData {
  title?: string;
  description?: string;
  robots?: SeoRobotsData;
  og_locale?: string;
  og_type?: string;
  og_title?: string;
  og_description?: string;
  og_url?: string;
  og_site_name?: string;
  article_publisher?: string;
  article_published_time?: string;
  article_modified_time?: string;
  og_image?: {
    width: number;
    height: number;
    url: string;
    type: string;
  }[];
  twitter_card?: string;
  twitter_misc?: Record<string, string>;
}

export type SeoMetaData = Pick<
  SeoData,
  | 'robots'
  | 'og_type'
  | 'og_url'
  | 'og_image'
  | 'article_publisher'
  | 'article_published_time'
  | 'article_modified_time'
  | 'twitter_card'
  | 'twitter_misc'
>;

export interface ArticleTranslation {
  locale: string;
  slug: string;
}

export const enum ArticleStatus {
  Publish = 1,
  Future = 2,
  Draft = 3,
  Private = 4,
  Pending = 5,
}

export const statusMap = {
  publish: ArticleStatus.Publish,
  future: ArticleStatus.Future,
  draft: ArticleStatus.Draft,
  pending: ArticleStatus.Pending,
  private: ArticleStatus.Private,
} as const;

export interface Article {
  id: number;
  title: string;
  slug: string;
  content: string;
  publishDate: string;
  readingTime: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  author: {
    name: string;
    description: string;
    avatarUrl: string;
    position: string;
    titles: AuthorTitle[];
    slug: string;
    github: string | null;
    twitter: string | null;
    linkedin: string | null;
  };
  anchors: Anchor[];
  otherTranslations: {
    locale: string;
    slug: string;
  }[];
  lang: string;
  seo: SeoData;
}
