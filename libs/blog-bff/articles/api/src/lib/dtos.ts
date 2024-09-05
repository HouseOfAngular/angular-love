export interface WPPostDto {
  date: string;
  slug: string;
  featured_image_url: string;
  title: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  author_details: {
    name: string;
    slug: string;
    avatar_url: string;
  };
  acf: {
    reading_time: string | number;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
  };
}

interface WPPostDetailsDtoYoastData {
  title: string;
  description: string;
  robots: {
    index: string;
    follow: string;
    'max-snippet': string;
    'max-image-preview': string;
    'max-video-preview': string;
  };
  og_locale: string;
  og_type: string;
  og_title: string;
  og_description: string;
  og_url: string;
  og_site_name: string;
  article_publisher: string;
  article_published_time: string;
  article_modified_time: string;
  og_image: {
    width: number;
    height: number;
    url: string;
    type: string;
  }[];
  twitter_card: string;
  twitter_misc: {
    'Napisane przez': string;
    'Szacowany czas czytania': string;
  };
}

export interface WPPostDetailsDto {
  id: number;
  date: string;
  slug: string;
  title: {
    rendered: string;
  };
  content: {
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
  };
  acf: {
    reading_time: string | number;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
  };
  other_translations: {
    locale: string;
    slug: string;
  }[];
  lang: string;
  yoast_head_json: WPPostDetailsDtoYoastData;
}
