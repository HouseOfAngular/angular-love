import { SeoData } from '@angular-love/contracts/articles';

export interface WPPostDetailsDto {
  id: number;
  /**
   * todo new author id
   */
  author: number;
  /**
   * todo new status
   */
  status: 'publish' | 'future' | 'draft' | 'pending' | 'private';
  /**
   * todo new categories
   */
  categories: number[];
  /**
   * todo featured_image_url
   */
  featured_image_url: string | null;
  date: string;
  modified: string;
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
  author_details: {
    name: string;
    slug: string;
    avatar_url: string;
    description: string;
    position: string;
    github: string;
    twitter: string;
    linkedin: string;
    titles: ('gde' | 'hoa' | 'contributor' | 'key_contributor' | 'blogger')[];
  };
  acf: {
    hidden: boolean;
    reading_time: string | number;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
  };
  other_translations: {
    locale: string;
    slug: string;
  }[];
  lang: 'en_GB' | 'pl_PL';
  yoast_head_json: SeoData;
}
